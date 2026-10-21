import type { User } from "../types";
import { guardarTokens } from "./tokenManager";
import { setStoredUser } from "../utils/authStorage";

export const DEFAULT_MOCK_USER: User = {
  nombre: "Carlos Valenzuela",
  unidad: "301-A",
  role: "residente",
};

export async function iniciarSesionResidenteMock(): Promise<User> {
  const mockUrl =
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_JWKS_MOCK_URL) ||
    "http://localhost:4000";

  const response = await fetch(`${mockUrl}/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sub: "residente-demo-1",
      roles: ["residente"],
      email: "residente@convivo.cl",
      unidad: DEFAULT_MOCK_USER.unidad,
      unidad_id: DEFAULT_MOCK_USER.unidad,
      "custom:unidad": DEFAULT_MOCK_USER.unidad,
      nombre: DEFAULT_MOCK_USER.nombre,
      token_use: "access",
      client_id: "mock-client",
    }),
  });

  if (!response.ok) {
    throw new Error(`Error al obtener token mock: HTTP ${response.status}`);
  }

  const data = (await response.json()) as { access_token: string };
  guardarTokens({ access_token: data.access_token });
  setStoredUser(DEFAULT_MOCK_USER);

  return DEFAULT_MOCK_USER;
}
