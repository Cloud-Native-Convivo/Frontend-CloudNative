import { describe, it, expect, vi, beforeEach } from "vitest";
import { obtenerResumenGastos } from "@/services/gastosApi";

describe("gastosApi", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("calcula totalPendiente y estado alDia correctamente cuando hay deudas", async () => {
    const mockGastos = [
      {
        id: 1,
        unidadId: "101",
        concepto: "Gasto Comun Agosto",
        monto: 50000,
        saldoPendiente: 50000,
        estado: "PENDIENTE",
        origen: "ORDINARIO",
        fechaVencimiento: "2026-09-20",
        fechaCreacion: "2026-09-01T00:00:00Z",
      },
      {
        id: 2,
        unidadId: "101",
        concepto: "Multa Ruidos Molestos",
        monto: 25000,
        saldoPendiente: 25000,
        estado: "PENDIENTE",
        origen: "MULTA",
        fechaVencimiento: "2026-09-15",
        fechaCreacion: "2026-09-02T00:00:00Z",
      },
      {
        id: 3,
        unidadId: "101",
        concepto: "Gasto Comun Julio",
        monto: 45000,
        saldoPendiente: 0,
        estado: "PAGADO",
        origen: "ORDINARIO",
        fechaVencimiento: "2026-08-20",
        fechaCreacion: "2026-08-01T00:00:00Z",
      },
    ];

    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        reservas: [],
        gastos: mockGastos,
        errores: [],
      }),
    } as Response);

    const resumen = await obtenerResumenGastos();
    expect(resumen.totalPendiente).toBe(75000);
    expect(resumen.alDia).toBe(false);
    expect(resumen.proximoVencimiento).toBe("2026-09-15");
    expect(resumen.gastos).toHaveLength(3);
  });

  it("marca alDia en true cuando no hay saldos pendientes o la lista esta vacia", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        reservas: [],
        gastos: [],
        errores: [],
      }),
    } as Response);

    const resumen = await obtenerResumenGastos();
    expect(resumen.totalPendiente).toBe(0);
    expect(resumen.alDia).toBe(true);
    expect(resumen.proximoVencimiento).toBeNull();
  });

  it("propaga el error si no se pudo consultar (nunca informa 'al dia' por default)", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("network down"));

    await expect(obtenerResumenGastos()).rejects.toThrow();
  });
});
