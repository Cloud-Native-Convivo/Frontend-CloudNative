// Manejo de los tres tokens de Cognito en el front de residentes:
//
// - ID token: identidad del usuario (nombre, unidad, términos). Solo lo lee el front
//   (AuthCallback); NUNCA se envía al backend.
// - Access token: autoriza las llamadas al BFF. Es el único que va en
//   `Authorization: Bearer`. Dura poco (access_token_validity en terraform/cognito.tf).
// - Refresh token: dura más y sirve para pedirle a Cognito un ID/access token nuevos
//   cuando el access token está por vencer, sin que el residente vuelva a hacer login.
//   Se revoca al cerrar sesión.

import {
  clearStoredAuth,
  getStoredAccessToken,
  getStoredRefreshToken,
  setStoredAccessToken,
  setStoredIdToken,
  setStoredRefreshToken,
} from "../utils/authStorage";
import { decodeIdToken, isCognitoConfigured } from "./cognitoAuth";

/** Renueva el access token si le queda menos de este margen, para no mandarlo vencido. */
const MARGEN_RENOVACION_MS = 60_000;

/** Evento global que avisa al AuthProvider que la sesión no se pudo renovar. */
export const EVENTO_SESION_EXPIRADA = "convivo:sesion-expirada";

export interface TokensCognito {
  id_token?: string;
  access_token?: string;
  refresh_token?: string;
}

/** Guarda los tokens recibidos. Cognito no devuelve refresh_token al renovar: se conserva el actual. */
export function guardarTokens(tokens: TokensCognito): void {
  if (tokens.id_token) setStoredIdToken(tokens.id_token);
  if (tokens.access_token) setStoredAccessToken(tokens.access_token);
  if (tokens.refresh_token) setStoredRefreshToken(tokens.refresh_token);
}

/** Momento (ms epoch) en que vence el token según su claim `exp`, o 0 si no se puede leer. */
function venceEn(token: string): number {
  try {
    const exp = decodeIdToken(token).exp;
    return typeof exp === "number" ? exp * 1000 : 0;
  } catch {
    return 0;
  }
}

async function pedirTokensNuevos(): Promise<void> {
  const refreshToken = getStoredRefreshToken();
  if (!refreshToken || !isCognitoConfigured()) {
    throw new Error("No hay refresh token para renovar la sesión.");
  }

  const response = await fetch(`https://${import.meta.env.VITE_COGNITO_DOMAIN}/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: import.meta.env.VITE_COGNITO_CLIENT_ID,
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    throw new Error(`Cognito rechazó el refresh token (HTTP ${response.status}).`);
  }
  guardarTokens((await response.json()) as TokensCognito);
}

// Si varias llamadas detectan a la vez que el token venció, comparten un solo refresh
// en vez de pedirle a Cognito N renovaciones en paralelo.
let renovacionEnCurso: Promise<void> | null = null;

export function renovarTokens(): Promise<void> {
  renovacionEnCurso ??= pedirTokensNuevos().finally(() => {
    renovacionEnCurso = null;
  });
  return renovacionEnCurso;
}

function marcarSesionExpirada(): void {
  clearStoredAuth();
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(EVENTO_SESION_EXPIRADA));
  }
}

/**
 * Devuelve un access token vigente, renovándolo con el refresh token si está por vencer.
 * Devuelve null si no hay sesión (llamadas anónimas, p. ej. catálogo público de espacios)
 * o si la renovación falla (en ese caso además cierra la sesión).
 */
export async function obtenerAccessToken(): Promise<string | null> {
  const accessToken = getStoredAccessToken();
  if (!accessToken) return null;
  if (venceEn(accessToken) - MARGEN_RENOVACION_MS > Date.now()) return accessToken;

  try {
    await renovarTokens();
    return getStoredAccessToken();
  } catch {
    marcarSesionExpirada();
    return null;
  }
}

/**
 * `fetch` hacia el BFF con el access token en `Authorization`. Si el BFF responde 401
 * (token revocado, reloj desfasado, etc.) renueva una vez y reintenta.
 */
export async function fetchConAuth(input: string, init: RequestInit = {}): Promise<Response> {
  const enviar = (token: string | null): Promise<Response> => {
    const headers = new Headers(init.headers);
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return fetch(input, { ...init, headers });
  };

  const token = await obtenerAccessToken();
  const response = await enviar(token);
  if (response.status !== 401 || !token || !getStoredRefreshToken()) return response;

  try {
    await renovarTokens();
  } catch {
    marcarSesionExpirada();
    return response;
  }
  return enviar(getStoredAccessToken());
}

/**
 * Cierra la sesión: borra los tokens locales y revoca el refresh token en Cognito
 * (requiere enable_token_revocation en terraform/cognito.tf). Si la revocación falla
 * por red, la sesión local igual queda cerrada.
 */
export async function cerrarSesionCognito(): Promise<void> {
  const refreshToken = getStoredRefreshToken();
  clearStoredAuth();
  if (!refreshToken || !isCognitoConfigured()) return;

  try {
    await fetch(`https://${import.meta.env.VITE_COGNITO_DOMAIN}/oauth2/revoke`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        token: refreshToken,
        client_id: import.meta.env.VITE_COGNITO_CLIENT_ID,
      }),
    });
  } catch {
    // Sin red: el refresh token vence solo (refresh_token_validity).
  }
}
