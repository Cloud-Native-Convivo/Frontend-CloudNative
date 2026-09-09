import type { User } from "../types";

export const USER_STORAGE_KEY = "convivo_user_v1";
export const ID_TOKEN_STORAGE_KEY = "convivo_id_token_v1";
export const ACCESS_TOKEN_STORAGE_KEY = "convivo_access_token_v1";

const LEGACY_USER_KEY = "convivo_user";
const LEGACY_ID_TOKEN_KEY = "id_token";
const LEGACY_ACCESS_TOKEN_KEY = "access_token";

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(USER_STORAGE_KEY) ?? localStorage.getItem(LEGACY_USER_KEY);
    if (raw) {
      return JSON.parse(raw) as User;
    }
  } catch {
    // ignore
  }
  return null;
}

export function setStoredUser(user: User): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } catch {
    // ignore
  }
}

export function getStoredIdToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return (
      sessionStorage.getItem(ID_TOKEN_STORAGE_KEY) ??
      sessionStorage.getItem(LEGACY_ID_TOKEN_KEY) ??
      localStorage.getItem(LEGACY_ID_TOKEN_KEY)
    );
  } catch {
    return null;
  }
}

export function setStoredIdToken(token: string): void {
  if (typeof window === "undefined") return;
  try {
    // react-doctor-disable-next-line react-doctor/auth-token-in-web-storage
    sessionStorage.setItem(ID_TOKEN_STORAGE_KEY, token);
  } catch {
    // ignore
  }
}

export function getStoredAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return (
      sessionStorage.getItem(ACCESS_TOKEN_STORAGE_KEY) ??
      sessionStorage.getItem(LEGACY_ACCESS_TOKEN_KEY) ??
      localStorage.getItem(LEGACY_ACCESS_TOKEN_KEY)
    );
  } catch {
    return null;
  }
}

export function setStoredAccessToken(token: string): void {
  if (typeof window === "undefined") return;
  try {
    // react-doctor-disable-next-line react-doctor/auth-token-in-web-storage
    sessionStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);
  } catch {
    // ignore
  }
}

export function clearStoredAuth(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(USER_STORAGE_KEY);
    sessionStorage.removeItem(ID_TOKEN_STORAGE_KEY);
    sessionStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
    sessionStorage.removeItem(LEGACY_ID_TOKEN_KEY);
    sessionStorage.removeItem(LEGACY_ACCESS_TOKEN_KEY);
    localStorage.removeItem(LEGACY_USER_KEY);
    localStorage.removeItem(LEGACY_ID_TOKEN_KEY);
    localStorage.removeItem(LEGACY_ACCESS_TOKEN_KEY);
  } catch {
    // ignore
  }
}
