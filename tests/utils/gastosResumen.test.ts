import { describe, expect, it } from "vitest";
import type { BackendGastoComun } from "../../src/services/gastosApi";
import {
  agruparPorPeriodo,
  desglosePeriodo,
  deudaPorUnidad,
  etiquetaPeriodo,
} from "../../src/utils/gastosResumen";

function gasto(parcial: Partial<BackendGastoComun>): BackendGastoComun {
  return {
    id: 1,
    unidadId: "U-1",
    concepto: "Gasto común",
    monto: 100000,
    saldoPendiente: 0,
    estado: "PAGADO",
    origen: "ORDINARIO",
    fechaVencimiento: "2026-09-15",
    fechaCreacion: "2026-08-01",
    ...parcial,
  };
}

describe("gastosResumen", () => {
  it("etiqueta el período con nombre de mes en español", () => {
    expect(etiquetaPeriodo("2026-08")).toBe("Agosto 2026");
  });

  it("agrupa por mes de creación, ordena del más reciente y suma lo pendiente", () => {
    const periodos = agruparPorPeriodo([
      gasto({ id: 1, monto: 100000, estado: "PAGADO", fechaCreacion: "2026-07-01" }),
      gasto({ id: 2, monto: 80000, saldoPendiente: 30000, estado: "PARCIAL" }),
      gasto({ id: 3, monto: 20000, saldoPendiente: 20000, estado: "PENDIENTE" }),
    ]);

    expect(periodos.map((p) => p.clave)).toEqual(["2026-08", "2026-07"]);
    expect(periodos[0]).toMatchObject({ etiqueta: "Agosto 2026", total: 100000, pendiente: 50000 });
    expect(periodos[1]).toMatchObject({ total: 100000, pendiente: 0 });
  });

  it("ignora gastos con fecha de creación inválida o ausente", () => {
    const periodos = agruparPorPeriodo([
      gasto({ fechaCreacion: "" }),
      gasto({ fechaCreacion: "2026-13-01" }),
    ]);
    expect(periodos).toEqual([]);
  });

  it("calcula el desglose por concepto con porcentaje del total", () => {
    const items = desglosePeriodo(
      [
        gasto({ concepto: "Portería", monto: 75000 }),
        gasto({ concepto: "Jardín", monto: 25000 }),
        gasto({ concepto: "Portería", monto: 0 }),
        gasto({ concepto: "Otro mes", monto: 999, fechaCreacion: "2026-07-01" }),
      ],
      "2026-08",
    );

    expect(items).toEqual([
      { concepto: "Portería", monto: 75000, pct: 75 },
      { concepto: "Jardín", monto: 25000, pct: 25 },
    ]);
  });

  it("devuelve un desglose vacío si el mes no tiene gastos", () => {
    expect(desglosePeriodo([gasto({})], "2025-01")).toEqual([]);
  });

  it("suma la deuda por unidad y deja primero a quien más debe", () => {
    const deudas = deudaPorUnidad([
      gasto({ unidadId: "U-1", estado: "PAGADO" }),
      gasto({ unidadId: "U-2", monto: 60000, saldoPendiente: 60000, estado: "MOROSO" }),
      gasto({ unidadId: "U-2", monto: 40000, saldoPendiente: 0, estado: "PENDIENTE" }),
    ]);

    expect(deudas).toEqual([
      { unidad: "U-2", deuda: 100000 },
      { unidad: "U-1", deuda: 0 },
    ]);
  });
});
