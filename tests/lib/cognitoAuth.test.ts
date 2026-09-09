import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  generateCodeVerifier,
  generateCodeChallenge,
  buildGoogleAuthorizeUrl,
  decodeIdToken,
  exchangeCodeForTokens,
  roleFromClaims,
} from "@/lib/cognitoAuth";

beforeEach(() => {
  sessionStorage.clear();
  vi.stubEnv("VITE_COGNITO_DOMAIN", "convivo-residentes.auth.us-east-1.amazoncognito.com");
  vi.stubEnv("VITE_COGNITO_CLIENT_ID", "test-client-id");
  vi.stubEnv("VITE_COGNITO_REDIRECT_URI", "http://localhost:5173/auth/callback");
});

describe("generateCodeVerifier", () => {
  it("genera un string base64url de al menos 43 caracteres, sin +/=", () => {
    const verifier = generateCodeVerifier();
    expect(verifier.length).toBeGreaterThanOrEqual(43);
    expect(verifier).not.toMatch(/[+/=]/);
  });
});

describe("generateCodeChallenge", () => {
  it("coincide con el vector de referencia de RFC 7636 Apéndice B", async () => {
    const verifier = "dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk";
    const challenge = await generateCodeChallenge(verifier);
    expect(challenge).toBe("E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM");
  });
});

describe("buildGoogleAuthorizeUrl", () => {
  it("arma la URL de /oauth2/authorize con los parámetros esperados y guarda el verifier", async () => {
    const url = new URL(await buildGoogleAuthorizeUrl());
    expect(url.origin + url.pathname).toBe(
      "https://convivo-residentes.auth.us-east-1.amazoncognito.com/oauth2/authorize",
    );
    expect(url.searchParams.get("client_id")).toBe("test-client-id");
    expect(url.searchParams.get("response_type")).toBe("code");
    expect(url.searchParams.get("redirect_uri")).toBe("http://localhost:5173/auth/callback");
    expect(url.searchParams.get("identity_provider")).toBe("Google");
    expect(url.searchParams.get("code_challenge_method")).toBe("S256");
    expect(url.searchParams.get("code_challenge")).toBeTruthy();
    expect(sessionStorage.getItem("convivo.pkce_verifier")).toBeTruthy();
  });
});

describe("decodeIdToken", () => {
  it("decodifica el payload de un JWT, incluyendo tildes (UTF-8)", () => {
    const payload = { sub: "abc123", name: "María González", email: "maria@example.com" };
    const base64url = (s: string) =>
      btoa(unescape(encodeURIComponent(s)))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
    const fakeJwt = `${base64url(JSON.stringify({ alg: "RS256" }))}.${base64url(JSON.stringify(payload))}.signature`;

    expect(decodeIdToken(fakeJwt)).toEqual(payload);
  });
});

describe("roleFromClaims", () => {
  it("usa el primer grupo cognito:groups reconocido", () => {
    expect(roleFromClaims({ sub: "1", "cognito:groups": ["admin"] })).toBe("admin");
    expect(roleFromClaims({ sub: "1", "cognito:groups": ["Conserje"] })).toBe("conserje");
  });

  it("cae a residente si el grupo no es un rol válido", () => {
    expect(roleFromClaims({ sub: "1", "cognito:groups": ["otro-grupo"] })).toBe("residente");
  });

  it("cae a residente si no hay claim de grupos (Cognito sin grupos configurados)", () => {
    expect(roleFromClaims({ sub: "1" })).toBe("residente");
  });
});

describe("exchangeCodeForTokens", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  it("lanza error si no hay code_verifier en sessionStorage", async () => {
    await expect(exchangeCodeForTokens("any-code")).rejects.toThrow(/No hay code_verifier guardado/);
  });

  it("lanza error si Cognito rechaza el intercambio", async () => {
    sessionStorage.setItem("convivo.pkce_verifier", "fake-verifier");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 400 }));

    await expect(exchangeCodeForTokens("any-code")).rejects.toThrow(/Cognito rechaz/);
  });

  it("retorna tokens y limpia el verifier en caso de éxito", async () => {
    sessionStorage.setItem("convivo.pkce_verifier", "fake-verifier");
    const mockTokens = { id_token: "id", access_token: "access" };
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockTokens),
    }));

    const result = await exchangeCodeForTokens("real-code");
    expect(result).toEqual(mockTokens);
    expect(sessionStorage.getItem("convivo.pkce_verifier")).toBeNull();
  });
});
