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

  it("solicitarPdfGastos envia POST al BFF y retorna ticketId", async () => {
    const { solicitarPdfGastos } = await import("@/services/gastosApi");
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      status: 202,
      json: async () => ({
        ticketId: "ticket-12345",
        status: "PENDIENTE",
      }),
    } as Response);

    const res = await solicitarPdfGastos({ unidadId: "101", mes: "Agosto" });
    expect(res.ticketId).toBe("ticket-12345");
    expect(res.status).toBe("PENDIENTE");
  });

  it("descargarPdfGastosPorTicket lanza PROCESANDO cuando recibe 404", async () => {
    const { descargarPdfGastosPorTicket } = await import("@/services/gastosApi");
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: false,
      status: 404,
    } as Response);

    await expect(descargarPdfGastosPorTicket("ticket-pending")).rejects.toThrow("PROCESANDO");
  });

  it("descargarPdfGastosPorTicket devuelve blob cuando recibe 200", async () => {
    const { descargarPdfGastosPorTicket } = await import("@/services/gastosApi");
    const mockBlob = new Blob(["%PDF-1.4"], { type: "application/pdf" });
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      status: 200,
      blob: async () => mockBlob,
    } as Response);

    const result = await descargarPdfGastosPorTicket("ticket-ready");
    expect(result).toBe(mockBlob);
  });

  it("esperarYDescargarPdf reintenta en 404 hasta que el PDF este disponible", async () => {
    const { esperarYDescargarPdf } = await import("@/services/gastosApi");
    const mockBlob = new Blob(["%PDF-1.4"], { type: "application/pdf" });

    // Intento 1: 404 PROCESANDO
    // Intento 2: 200 OK con blob
    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce({
        ok: false,
        status: 404,
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        blob: async () => mockBlob,
      } as Response);

    const res = await esperarYDescargarPdf("ticket-retry", 3, 10);
    expect(res.ticketId).toBe("ticket-retry");
    expect(res.blob).toBe(mockBlob);
  });

  it("solicitarYDescargarPdfGastos orquesta la solicitud y descarga completa", async () => {
    const { solicitarYDescargarPdfGastos } = await import("@/services/gastosApi");
    const mockBlob = new Blob(["%PDF-1.4"], { type: "application/pdf" });

    // Mock solicitud POST
    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce({
        ok: true,
        status: 202,
        json: async () => ({ ticketId: "uuid-abc-123", status: "PENDIENTE" }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        blob: async () => mockBlob,
      } as Response);

    const createObjectURLSpy = vi.fn().mockReturnValue("blob:mock-url");
    const revokeObjectURLSpy = vi.fn();
    globalThis.URL.createObjectURL = createObjectURLSpy;
    globalThis.URL.revokeObjectURL = revokeObjectURLSpy;

    const res = await solicitarYDescargarPdfGastos({ unidadId: "201", mes: "Agosto 2026" });
    expect(res.ticketId).toBe("uuid-abc-123");
    expect(createObjectURLSpy).toHaveBeenCalledWith(mockBlob);
    expect(revokeObjectURLSpy).toHaveBeenCalledWith("blob:mock-url");
  });
});

