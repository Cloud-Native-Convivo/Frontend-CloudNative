import type { BackendGastoComun } from "../services/gastosApi";

const MESES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const ESTADOS_PENDIENTES: BackendGastoComun["estado"][] = ["PENDIENTE", "PARCIAL", "MOROSO"];

export interface PeriodoGastos {
  clave: string; // "AAAA-MM"
  etiqueta: string; // "Agosto 2026"
  total: number;
  pendiente: number;
}

export interface ItemDesglose {
  concepto: string;
  monto: number;
  pct: number;
}

export interface DeudaUnidad {
  unidad: string;
  deuda: number;
}

export function formatPesos(monto: number): string {
  return `$${monto.toLocaleString("es-CL")}`;
}

// Lee "AAAA-MM" de las fechas ISO sin pasar por Date (evita desfases de zona horaria).
function claveMes(g: BackendGastoComun): string | null {
  const m = /^(\d{4})-(0[1-9]|1[0-2])/.exec(g.fechaCreacion ?? "");
  return m ? `${m[1]}-${m[2]}` : null;
}

function saldoPendiente(g: BackendGastoComun): number {
  if (!ESTADOS_PENDIENTES.includes(g.estado)) return 0;
  return Number(g.saldoPendiente) || Number(g.monto) || 0;
}

export function etiquetaPeriodo(clave: string): string {
  const [anio, mes] = clave.split("-");
  return `${MESES[Number(mes) - 1]} ${anio}`;
}

export function agruparPorPeriodo(gastos: BackendGastoComun[]): PeriodoGastos[] {
  const periodos = new Map<string, PeriodoGastos>();
  for (const g of gastos) {
    const clave = claveMes(g);
    if (!clave) continue;
    const periodo = periodos.get(clave) ?? {
      clave,
      etiqueta: etiquetaPeriodo(clave),
      total: 0,
      pendiente: 0,
    };
    periodo.total += Number(g.monto) || 0;
    periodo.pendiente += saldoPendiente(g);
    periodos.set(clave, periodo);
  }
  return [...periodos.values()].sort((a, b) => b.clave.localeCompare(a.clave));
}

export function desglosePeriodo(gastos: BackendGastoComun[], clave: string): ItemDesglose[] {
  const porConcepto = new Map<string, number>();
  let total = 0;
  for (const g of gastos) {
    if (claveMes(g) !== clave) continue;
    const monto = Number(g.monto) || 0;
    total += monto;
    porConcepto.set(g.concepto, (porConcepto.get(g.concepto) ?? 0) + monto);
  }
  return [...porConcepto.entries()]
    .map(([concepto, monto]) => ({
      concepto,
      monto,
      pct: total > 0 ? Math.round((monto * 100) / total) : 0,
    }))
    .sort((a, b) => b.monto - a.monto);
}

export function deudaPorUnidad(gastos: BackendGastoComun[]): DeudaUnidad[] {
  const deudas = new Map<string, number>();
  for (const g of gastos) {
    deudas.set(g.unidadId, (deudas.get(g.unidadId) ?? 0) + saldoPendiente(g));
  }
  return [...deudas.entries()]
    .map(([unidad, deuda]) => ({ unidad, deuda }))
    .sort((a, b) => b.deuda - a.deuda || a.unidad.localeCompare(b.unidad));
}
