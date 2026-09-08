const API_BASE_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_BFF_URL) ||
  "http://localhost:3000/api/v1/espacios-comunes";

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

export async function listarEspacios(idToken?: string): Promise<BackendEspacio[]> {
  const token =
    idToken ?? (typeof window !== "undefined" ? localStorage.getItem("id_token") : null);
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/espacios/`, { headers });
  if (!response.ok) {
    throw new Error(`Error al listar espacios: HTTP ${response.status}`);
  }
  return response.json();
}

export async function listarMisReservas(idToken?: string): Promise<BackendReserva[]> {
  const token =
    idToken ?? (typeof window !== "undefined" ? localStorage.getItem("id_token") : null);
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/reservas/`, { headers });
  if (!response.ok) {
    throw new Error(`Error al listar reservas: HTTP ${response.status}`);
  }
  return response.json();
}

export async function crearReserva(
  idToken: string | null | undefined,
  datos: CrearReservaPayload,
): Promise<BackendReserva> {
  const token =
    idToken ?? (typeof window !== "undefined" ? localStorage.getItem("id_token") : null);
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/reservas/`, {
    method: "POST",
    headers,
    body: JSON.stringify(datos),
  });

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`Error al crear reserva (HTTP ${response.status}): ${errBody}`);
  }
  return response.json();
}
