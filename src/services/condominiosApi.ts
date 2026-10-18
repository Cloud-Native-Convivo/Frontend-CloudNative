import { API_BASE_URL } from "../api/client";
import type { CondominioItem } from "../types";

export async function obtenerCondominios(): Promise<CondominioItem[]> {
  const respuesta = await fetch(`${API_BASE_URL}/condominios`, {
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
