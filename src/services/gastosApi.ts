import { fetchConAuth } from "../auth/tokenManager";
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

export async function listarGastos(): Promise<BackendGastoComun[]> {
  // Intento 1: vía panel agregado (agregador seguro para residente)
  try {
    const panel = await obtenerPanel();
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
  const response = await fetchConAuth(GASTOS_URL);
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

export async function obtenerResumenGastos(): Promise<GastosResumen> {
  const gastos = await listarGastos();
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

export interface SolicitarPdfPayload {
  unidadId?: string;
  mes?: string;
}

export interface SolicitarPdfResponse {
  ticketId: string;
  status: string;
}

export async function solicitarPdfGastos(
  payload?: SolicitarPdfPayload,
): Promise<SolicitarPdfResponse> {
  const url = `${API_ROOT}/api/v1/gastos/solicitar-pdf`;
  const response = await fetchConAuth(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload ?? {}),
  });

  if (!response.ok && response.status !== 202) {
    throw new Error(`Error al solicitar PDF de gastos: HTTP ${response.status}`);
  }

  return (await response.json()) as SolicitarPdfResponse;
}

export async function descargarPdfGastosPorTicket(ticketId: string): Promise<Blob> {
  const url = `${API_ROOT}/api/v1/gastos/pdf/${ticketId}/descargar`;
  const response = await fetchConAuth(url);

  if (response.status === 404) {
    throw new Error("PROCESANDO");
  }

  if (!response.ok) {
    throw new Error(`Error al descargar PDF: HTTP ${response.status}`);
  }

  return response.blob();
}

export async function esperarYDescargarPdf(
  ticketId: string,
  maxIntentos = 15,
  intervaloMs = 1500,
): Promise<{ ticketId: string; blob: Blob }> {
  for (let i = 0; i < maxIntentos; i++) {
    try {
      const blob = await descargarPdfGastosPorTicket(ticketId);
      return { ticketId, blob };
    } catch (err: unknown) {
      if (err instanceof Error && err.message === "PROCESANDO") {
        await new Promise((resolve) => setTimeout(resolve, intervaloMs));
        continue;
      }
      throw err;
    }
  }
  throw new Error("Tiempo de espera agotado al generar el PDF de gastos");
}

export function dispararDescargaArchivo(blob: Blob, nombreArchivo: string): void {
  if (typeof window === "undefined" || !window.URL) return;
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nombreArchivo;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

export async function solicitarYDescargarPdfGastos(
  payload?: SolicitarPdfPayload,
): Promise<{ ticketId: string }> {
  const { ticketId } = await solicitarPdfGastos(payload);
  const { blob } = await esperarYDescargarPdf(ticketId);
  const mesLimpio = payload?.mes ? payload.mes.toLowerCase().replace(/\s+/g, "-") : "periodo";
  const filename = `comprobante-gastos-${mesLimpio}-${ticketId.substring(0, 8)}.pdf`;
  dispararDescargaArchivo(blob, filename);
  return { ticketId };
}

