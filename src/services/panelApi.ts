import { getStoredIdToken } from "../lib/authStorage";
import type { BackendReserva } from "./espaciosApi";

const rawBffUrl =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_BFF_URL) ||
  "https://11bwhgfogd.execute-api.us-east-1.amazonaws.com/api/v1";
const API_BASE_URL = rawBffUrl.replace(/\/espacios-comunes\/?$/, "").replace(/\/+$/, "");

// Contrato real de GET /api/v1/panel (TD-26, bff PR #3): agrega reservas
// (ms-espacios-comunes) y gastos (ms-gastos-comunes). ms-gastos-comunes no
// existe todavia -- `gastos` viene null y el motivo queda en `errores`, sin
// que el endpoint completo falle.
export interface BackendPanelResponse {
  reservas: BackendReserva[] | null;
  gastos: unknown;
  errores: string[];
}

export async function obtenerPanel(idToken?: string): Promise<BackendPanelResponse> {
  const token = idToken ?? getStoredIdToken();
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/panel`, { headers });
  if (!response.ok) {
    throw new Error(`Error al obtener panel: HTTP ${response.status}`);
  }
  return response.json();
}
