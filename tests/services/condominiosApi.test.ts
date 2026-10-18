import { describe, it, expect, vi, beforeEach } from "vitest";
import { obtenerCondominios } from "@/services/condominiosApi";

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
    const mockData = [
      { id: "1", nombre: "Condominio Central" },
    ];

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
});
