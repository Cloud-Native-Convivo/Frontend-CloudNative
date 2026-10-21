import { API_BASE_URL as BFF_BASE_URL } from "../api/client";
import { fetchConAuth } from "../auth/tokenManager";
import { getCondominioIdActual } from "../utils/authStorage";

const API_BASE_URL = `${BFF_BASE_URL}/espacios-comunes`;

export interface BackendEspacio {
  id: number;
  nombre: string;
  descripcion?: string | null;
  capacidad: number;
  tarifa_hora: number;
  ubicacion?: string | null;
  estado: string;
  creado_en?: string;
  actualizado_en?: string;
}

export interface BackendReserva {
  id: number;
  espacio_id: number;
  usuario_sub: string;
  fecha_inicio: string;
  fecha_fin: string;
  estado: string;
  monto_total: number;
  expira_en?: string | null;
  creado_en: string;
}

export interface CrearReservaPayload {
  espacio_id: number;
  fecha_inicio: string;
  fecha_fin: string;
}

export async function listarEspacios(): Promise<BackendEspacio[]> {
  // Sin slash final: API Gateway matchea route keys de forma literal y la
  // ruta pública ("GET /api/v1/espacios-comunes/espacios") no acepta un
  // segmento final vacío (AWS rechaza esa route key al crearla). El BFF
  // igual normaliza a "/espacios/" antes de reenviar al microservicio.
  const condominioId = getCondominioIdActual();
  if (!condominioId) return [];
  const response = await fetchConAuth(`${API_BASE_URL}/espacios?condominio_id=${condominioId}`);
  if (!response.ok) {
    throw new Error(`Error al listar espacios: HTTP ${response.status}`);
  }
  return response.json();
}

export async function listarMisReservas(): Promise<BackendReserva[]> {
  const response = await fetchConAuth(`${API_BASE_URL}/reservas/`);
  if (!response.ok) {
    throw new Error(`Error al listar reservas: HTTP ${response.status}`);
  }
  return response.json();
}

export async function crearReserva(datos: CrearReservaPayload): Promise<BackendReserva> {
  const response = await fetchConAuth(`${API_BASE_URL}/reservas/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`Error al crear reserva (HTTP ${response.status}): ${errBody}`);
  }
  return response.json();
}
