import { getStoredIdToken } from "../lib/authStorage";
import { obtenerPanel } from "./panelApi";

export interface BackendGastoComun {
  id: number;
  unidadId: string;
  concepto: string;
  monto: number;
  saldoPendiente: number;
  estado: "PENDIENTE" | "PAGADO" | "PARCIAL" | "MOROSO";
  origen: "ORDINARIO" | "EXTRAORDINARIO" | "MULTA" | "RESERVA";
  referenciaExterna?: string | null;
  fechaVencimiento: string;
  fechaCreacion: string;
}

export interface GastosResumen {
  totalPendiente: number;
  alDia: boolean;
  proximoVencimiento?: string | null;
  gastos: BackendGastoComun[];
}

const rawBffUrl =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_BFF_URL) ||
  "https://11bwhgfogd.execute-api.us-east-1.amazonaws.com/api/v1";
const API_ROOT = rawBffUrl.replace(/\/api\/v1\/?$/, "").replace(/\/+$/, "");
const GASTOS_URL = `${API_ROOT}/api/gastos/api/v1/gastos-comunes`;

export async function listarGastos(idToken?: string): Promise<BackendGastoComun[]> {
  const token = idToken ?? getStoredIdToken();
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Intento 1: vía panel agregado (agregador seguro para residente)
  try {
    const panel = await obtenerPanel(token ?? undefined);
    if (panel && panel.gastos) {
      if (Array.isArray(panel.gastos)) {
        return panel.gastos as BackendGastoComun[];
      }
      if (
        typeof panel.gastos === "object" &&
        panel.gastos !== null &&
        "content" in panel.gastos &&
        Array.isArray((panel.gastos as { content: unknown[] }).content)
      ) {
        return (panel.gastos as { content: BackendGastoComun[] }).content;
      }
    }
  } catch {
    // Si panel falla o no incluye gastos, intentamos llamada directa
  }

  // Intento 2: llamada directa a endpoint de gastos del BFF. A diferencia del
  // intento 1 (agregador opcional), si esto también falla hay que propagar el
  // error: devolver [] acá sería indistinguible de "el residente no tiene
  // gastos", y el llamador (obtenerResumenGastos) lo leería como "al día".
  const response = await fetch(GASTOS_URL, { headers });
  if (!response.ok) {
    throw new Error(`No se pudo obtener gastos comunes: HTTP ${response.status}`);
  }
  const data = await response.json();
  if (Array.isArray(data)) {
    return data;
  }
  if (data && typeof data === "object" && "content" in data && Array.isArray(data.content)) {
    return data.content;
  }
  return [];
}

export async function obtenerResumenGastos(idToken?: string): Promise<GastosResumen> {
  const gastos = await listarGastos(idToken);
  const pendientes = gastos.filter(
    (g) => g.estado === "PENDIENTE" || g.estado === "PARCIAL" || g.estado === "MOROSO",
  );
  const totalPendiente = pendientes.reduce(
    (acc, curr) => acc + (Number(curr.saldoPendiente) || Number(curr.monto) || 0),
    0,
  );

  let proximoVencimiento: string | null = null;
  if (pendientes.length > 0) {
    const fechas = pendientes
      .map((g) => g.fechaVencimiento)
      .filter(Boolean)
      .sort();
    if (fechas.length > 0) proximoVencimiento = fechas[0];
  }

  return {
    totalPendiente,
    alDia: totalPendiente === 0,
    proximoVencimiento,
    gastos,
  };
}
