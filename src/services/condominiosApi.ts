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

export interface DatosSolicitud {
  condominio_id: number;
  numero: string;
  piso?: string;
  torre?: string;
}

/** 422 de ms-condominios: la unidad no existe o no corresponde al tipo del condominio. */
export class UnidadRechazadaError extends Error {}

const MENSAJE_UNIDAD_GENERICO = "Revisa los datos de tu unidad.";

// Los 422 de negocio traen `message`; los de validación de Pydantic traen `detail`
// (un arreglo en inglés que no se muestra tal cual).
async function mensajeDe422(respuesta: Response): Promise<string> {
  try {
    const cuerpo = (await respuesta.json()) as { message?: unknown; detail?: unknown };
    if (typeof cuerpo.message === "string") return cuerpo.message;
    if (typeof cuerpo.detail === "string") return cuerpo.detail;
  } catch {
    // Cuerpo vacío o no JSON: se usa el mensaje genérico.
  }
  return MENSAJE_UNIDAD_GENERICO;
}

export async function solicitarAsignacion(
  datos: DatosSolicitud,
): Promise<{ estado: string; unidad?: string }> {
  const respuesta = await fetchConAuth(`${API_BASE_URL}/condominios/solicitudes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });
  // 409 = solicitud ya aprobada — no es un error, redirigir al dashboard.
  if (respuesta.status === 409) return { estado: "aprobada" };
  if (respuesta.status === 422) throw new UnidadRechazadaError(await mensajeDe422(respuesta));
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
