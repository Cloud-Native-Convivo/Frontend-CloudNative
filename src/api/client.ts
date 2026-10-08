import { getStoredAccessToken } from "../utils/authStorage";

export const rawBffUrl =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_BFF_URL) ||
  "https://11bwhgfogd.execute-api.us-east-1.amazonaws.com/api/v1";

export const API_BASE_URL = rawBffUrl.replace(/\/espacios-comunes\/?$/, "").replace(/\/+$/, "");

/**
 * Headers con el access token guardado (el ID token no se envía al backend).
 * No renueva el token: para llamadas al BFF preferir `fetchConAuth` (auth/tokenManager).
 */
export function getAuthHeaders(accessToken?: string): Record<string, string> {
  const token = accessToken ?? getStoredAccessToken();
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}
