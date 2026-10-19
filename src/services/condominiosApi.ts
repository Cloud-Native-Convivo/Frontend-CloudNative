import { API_BASE_URL } from "../api/client";
import { fetchConAuth } from "../auth/tokenManager";
import type { CondominioItem } from "../types";

export async function obtenerCondominios(): Promise<CondominioItem[]> {
  const respuesta = await fetchConAuth(`${API_BASE_URL}/condominios`, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!respuesta.ok) {
    throw new Error(`Error al cargar condominios (HTTP ${respuesta.status})`);
  }

  const datos = (await respuesta.json()) as CondominioItem[] | { items?: CondominioItem[] };
  if (Array.isArray(datos)) {
    return datos;
  }
  return datos.items ?? [];
}

export async function solicitarAsignacion(datos: {
  condominio_id: number;
  unidad: string;
}): Promise<{ estado: string }> {
  const respuesta = await fetchConAuth(`${API_BASE_URL}/condominios/solicitudes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });
  // 409 = solicitud ya aprobada — no es un error, redirigir al dashboard.
  if (respuesta.status === 409) return { estado: "aprobada" };
  if (!respuesta.ok) throw new Error(`No pudimos enviar tu solicitud (HTTP ${respuesta.status}).`);
  return respuesta.json();
}

export interface SolicitudAsignacion {
  condominio_id: number;
  unidad: string;
  estado: "pendiente" | "aprobada";
}

export async function obtenerSolicitudPropia(): Promise<SolicitudAsignacion | null> {
  const respuesta = await fetchConAuth(`${API_BASE_URL}/condominios/solicitudes/me`);
  if (respuesta.status === 404) return null;
  if (!respuesta.ok) throw new Error(`Error al consultar asignación (HTTP ${respuesta.status})`);
  return respuesta.json();
}
