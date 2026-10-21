import { API_BASE_URL } from "../api/client";
import { fetchConAuth } from "../auth/tokenManager";
import { getCondominioIdActual } from "../utils/authStorage";
import type { BackendReserva } from "./espaciosApi";

// Contrato real de GET /api/v1/panel (TD-26, bff PR #3): agrega reservas
// (ms-espacios-comunes) y gastos (ms-gastos-comunes). ms-gastos-comunes no
// existe todavia -- `gastos` viene null y el motivo queda en `errores`, sin
// que el endpoint completo falle.
export interface BackendPanelResponse {
  reservas: BackendReserva[] | null;
  gastos: unknown;
  errores: string[];
}

export async function obtenerPanel(): Promise<BackendPanelResponse> {
  const response = await fetchConAuth(
    `${API_BASE_URL}/panel?condominioId=${getCondominioIdActual()}`,
  );
  if (!response.ok) {
    throw new Error(`Error al obtener panel: HTTP ${response.status}`);
  }
  return response.json();
}
