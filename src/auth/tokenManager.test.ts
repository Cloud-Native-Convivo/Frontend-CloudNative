import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  cerrarSesionCognito,
  EVENTO_SESION_EXPIRADA,
  fetchConAuth,
  guardarTokens,
  obtenerAccessToken,
} from "./tokenManager";
import {
  getStoredAccessToken,
  getStoredIdToken,
  getStoredRefreshToken,
} from "../utils/authStorage";

/** JWT sin firma válida (el front no verifica firma, solo lee `exp`). */
function jwt(expEnSegundos: number, extra: Record<string, unknown> = {}): string {
  const b64 = (o: unknown) =>
    btoa(JSON.stringify(o)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  return `${b64({ alg: "RS256" })}.${b64({ exp: expEnSegundos, ...extra })}.firma`;
}

const ahoraSeg = () => Math.floor(Date.now() / 1000);
const vigente = () => jwt(ahoraSeg() + 3600, { v: "vigente" });
const vencido = () => jwt(ahoraSeg() - 10, { v: "vencido" });

function respuesta(status: number, body: unknown = {}): Response {
  return new Response(JSON.stringify(body), { status });
}

describe("tokenManager", () => {
  const fetchMock = vi.fn<typeof fetch>();

  beforeEach(() => {
    sessionStorage.clear();
    vi.stubEnv("VITE_COGNITO_CLIENT_ID", "client-test");
    vi.stubEnv("VITE_COGNITO_DOMAIN", "convivo.auth.us-east-1.amazoncognito.com");
    vi.stubEnv("VITE_COGNITO_REDIRECT_URI", "http://localhost:5173/auth/callback");
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("guarda los tres tokens al iniciar sesión", () => {
    guardarTokens({ id_token: "id", access_token: "access", refresh_token: "refresh" });
    expect(getStoredIdToken()).toBe("id");
    expect(getStoredAccessToken()).toBe("access");
    expect(getStoredRefreshToken()).toBe("refresh");
  });

  it("devuelve el access token sin renovar mientras está vigente", async () => {
    const token = vigente();
    guardarTokens({ access_token: token, refresh_token: "refresh" });
    await expect(obtenerAccessToken()).resolves.toBe(token);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("renueva con el refresh token cuando el access token venció y conserva el refresh", async () => {
    guardarTokens({ access_token: vencido(), refresh_token: "refresh" });
    const nuevo = vigente();
    fetchMock.mockResolvedValueOnce(respuesta(200, { id_token: "id-nuevo", access_token: nuevo }));

    await expect(obtenerAccessToken()).resolves.toBe(nuevo);

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://convivo.auth.us-east-1.amazoncognito.com/oauth2/token");
    const body = new URLSearchParams(String(init?.body));
    expect(body.get("grant_type")).toBe("refresh_token");
    expect(body.get("refresh_token")).toBe("refresh");
    expect(getStoredIdToken()).toBe("id-nuevo");
    expect(getStoredRefreshToken()).toBe("refresh");
  });

  it("varias llamadas simultáneas comparten una sola renovación", async () => {
    guardarTokens({ access_token: vencido(), refresh_token: "refresh" });
    fetchMock.mockResolvedValue(respuesta(200, { access_token: vigente() }));

    await Promise.all([obtenerAccessToken(), obtenerAccessToken(), obtenerAccessToken()]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("si el refresh falla, borra la sesión y avisa con el evento de sesión expirada", async () => {
    guardarTokens({ id_token: "id", access_token: vencido(), refresh_token: "revocado" });
    fetchMock.mockResolvedValueOnce(respuesta(400, { error: "invalid_grant" }));
    const alExpirar = vi.fn();
    window.addEventListener(EVENTO_SESION_EXPIRADA, alExpirar);

    await expect(obtenerAccessToken()).resolves.toBeNull();

    expect(alExpirar).toHaveBeenCalledTimes(1);
    expect(getStoredAccessToken()).toBeNull();
    expect(getStoredRefreshToken()).toBeNull();
    window.removeEventListener(EVENTO_SESION_EXPIRADA, alExpirar);
  });

  it("fetchConAuth manda el access token (no el ID token) al BFF", async () => {
    const access = vigente();
    guardarTokens({ id_token: "id-token", access_token: access, refresh_token: "refresh" });
    fetchMock.mockResolvedValueOnce(respuesta(200));

    await fetchConAuth("https://api.test/panel");

    const headers = new Headers(fetchMock.mock.calls[0][1]?.headers);
    expect(headers.get("Authorization")).toBe(`Bearer ${access}`);
  });

  it("fetchConAuth renueva y reintenta una vez si el BFF responde 401", async () => {
    guardarTokens({ access_token: vigente(), refresh_token: "refresh" });
    const nuevo = vigente() + "x";
    fetchMock
      .mockResolvedValueOnce(respuesta(401))
      .mockResolvedValueOnce(respuesta(200, { access_token: nuevo }))
      .mockResolvedValueOnce(respuesta(200, { ok: true }));

    const response = await fetchConAuth("https://api.test/panel");

    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(new Headers(fetchMock.mock.calls[2][1]?.headers).get("Authorization")).toBe(
      `Bearer ${nuevo}`,
    );
  });

  it("fetchConAuth sin sesión llama sin Authorization (rutas públicas)", async () => {
    fetchMock.mockResolvedValueOnce(respuesta(200));
    await fetchConAuth("https://api.test/espacios");
    expect(new Headers(fetchMock.mock.calls[0][1]?.headers).has("Authorization")).toBe(false);
  });

  it("al cerrar sesión borra los tokens y revoca el refresh token en Cognito", async () => {
    guardarTokens({ id_token: "id", access_token: vigente(), refresh_token: "refresh" });
    fetchMock.mockResolvedValueOnce(respuesta(200));

    await cerrarSesionCognito();

    expect(getStoredRefreshToken()).toBeNull();
    expect(getStoredAccessToken()).toBeNull();
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://convivo.auth.us-east-1.amazoncognito.com/oauth2/revoke");
    expect(new URLSearchParams(String(init?.body)).get("token")).toBe("refresh");
  });
});
