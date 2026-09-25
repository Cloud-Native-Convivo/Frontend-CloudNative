import type { User } from "../types";

export const USER_STORAGE_KEY = "convivo_user_v1";
export const ID_TOKEN_STORAGE_KEY = "convivo_id_token_v1";
export const ACCESS_TOKEN_STORAGE_KEY = "convivo_access_token_v1";

const LEGACY_USER_KEY = "convivo_user";

function getItem(storage: Storage, key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

function setItem(storage: Storage, key: string, value: string): void {
  if (typeof window === "undefined") return;
  try {
    storage.setItem(key, value);
  } catch {
    // ignore
  }
}

export function getStoredUser(): User | null {
  const raw = getItem(sessionStorage, USER_STORAGE_KEY) ?? getItem(localStorage, LEGACY_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function setStoredUser(user: User): void {
  setItem(sessionStorage, USER_STORAGE_KEY, JSON.stringify(user));
}

export function getStoredIdToken(): string | null {
  return getItem(sessionStorage, ID_TOKEN_STORAGE_KEY);
}

export function setStoredIdToken(token: string): void {
  setItem(sessionStorage, ID_TOKEN_STORAGE_KEY, token);
}

export function getStoredAccessToken(): string | null {
  return getItem(sessionStorage, ACCESS_TOKEN_STORAGE_KEY);
}

export function setStoredAccessToken(token: string): void {
  setItem(sessionStorage, ACCESS_TOKEN_STORAGE_KEY, token);
}

export function clearStoredAuth(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(USER_STORAGE_KEY);
    sessionStorage.removeItem(ID_TOKEN_STORAGE_KEY);
    sessionStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
    localStorage.removeItem(LEGACY_USER_KEY);
  } catch {
    // ignore
  }
}
