import { getStoredIdToken } from "../utils/authStorage";

export const rawBffUrl =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_BFF_URL) ||
  "https://11bwhgfogd.execute-api.us-east-1.amazonaws.com/api/v1";

export const API_BASE_URL = rawBffUrl.replace(/\/espacios-comunes\/?$/, "").replace(/\/+$/, "");

export function getAuthHeaders(idToken?: string): Record<string, string> {
  const token = idToken ?? getStoredIdToken();
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}
