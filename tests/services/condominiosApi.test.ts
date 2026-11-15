import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  obtenerCondominios,
  obtenerSolicitudPropia,
  solicitarAsignacion,
  UnidadRechazadaError,
} from "@/services/condominiosApi";

describe("condominiosApi", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("retorna lista de condominios cuando fetch responde 200 con array directo", async () => {
    const mockData = [
      { id: 1, nombre: "Condominio Las Palmas", direccion: "Av. Las Palmas 123" },
      { id: 2, nombre: "Edificio Parque Real", direccion: "Calle Real 456" },
    ];

    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    } as Response);

    const resultado = await obtenerCondominios();
    expect(resultado).toEqual(mockData);
  });

  it("retorna lista de condominios cuando fetch responde formato { items: [] }", async () => {
    const mockData = [{ id: "1", nombre: "Condominio Central" }];

    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ({ items: mockData }),
    } as Response);

    const resultado = await obtenerCondominios();
    expect(resultado).toEqual(mockData);
  });

  it("lanza error bloqueante cuando fetch responde HTTP 500", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: false,
      status: 500,
    } as Response);

    await expect(obtenerCondominios()).rejects.toThrow("Error al cargar condominios (HTTP 500)");
  });

  it("propaga error cuando fetch sufre falla de red", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValueOnce(new Error("Network Error"));

    await expect(obtenerCondominios()).rejects.toThrow("Network Error");
  });

  it("consulta la asignación propia sin inventar un condominio por defecto", async () => {
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce({ ok: true, json: async () => null } as Response);
    expect(await obtenerSolicitudPropia()).toBeNull();
    expect(fetchSpy.mock.calls[0][0]).toMatch(/\/condominios\/solicitudes\/me$/);
  });

  it("retorna null cuando la consulta de asignación propia responde HTTP 404", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({ ok: false, status: 404 } as Response);
    expect(await obtenerSolicitudPropia()).toBeNull();
  });

  it("envía torre, piso y número por separado en la solicitud", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ estado: "pendiente", unidad: "Piso 5 · Unidad 504" }), {
        status: 201,
      }),
    );

    const r = await solicitarAsignacion({ condominio_id: 1, numero: "504", piso: "5" });

    expect(r).toEqual({ estado: "pendiente", unidad: "Piso 5 · Unidad 504" });
    expect(JSON.parse(String(fetchMock.mock.calls[0][1]?.body))).toEqual({
      condominio_id: 1,
      numero: "504",
      piso: "5",
    });
  });

  // Tabla de decisión sobre el cuerpo del 422: message de negocio, detail de Pydantic, sin cuerpo.
  it.each([
    [
      { message: "La unidad no existe en este condominio" },
      "La unidad no existe en este condominio",
    ],
    [
      { detail: [{ loc: ["body", "numero"], msg: "Field required" }] },
      "Revisa los datos de tu unidad.",
    ],
    [null, "Revisa los datos de tu unidad."],
  ])(
    "un 422 con cuerpo %j lanza UnidadRechazadaError con un mensaje legible",
    async (cuerpo, esperado) => {
      vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
        new Response(cuerpo === null ? "" : JSON.stringify(cuerpo), { status: 422 }),
      );

      const intento = solicitarAsignacion({ condominio_id: 1, numero: "99" });

      await expect(intento).rejects.toBeInstanceOf(UnidadRechazadaError);
      await expect(intento).rejects.toThrow(esperado);
    },
  );
});
