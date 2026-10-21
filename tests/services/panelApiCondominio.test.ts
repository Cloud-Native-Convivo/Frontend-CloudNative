import { describe, it, expect, vi, beforeEach } from "vitest";
import { obtenerPanel } from "@/services/panelApi";
import { USER_STORAGE_KEY } from "@/utils/authStorage";

describe("panelApi con condominioId dinámico y sanitizado", () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("inyecta el condominioId del usuario autenticado en la URL del panel", async () => {
    sessionStorage.setItem(
      USER_STORAGE_KEY,
      JSON.stringify({
        nombre: "Test User",
        unidad: "101",
        role: "residente",
        condominioId: "99",
      }),
    );

    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ({ reservas: [], gastos: null, errores: [] }),
    } as Response);

    await obtenerPanel();

    expect(fetchSpy).toHaveBeenCalledWith(
      expect.stringContaining("condominioId=99"),
      expect.any(Object),
    );
  });

  it("sanitiza caracteres especiales con encodeURIComponent", async () => {
    sessionStorage.setItem(
      USER_STORAGE_KEY,
      JSON.stringify({
        nombre: "Test User",
        unidad: "101",
        role: "residente",
        condominioId: "parque & bosque",
      }),
    );

    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ({ reservas: [], gastos: null, errores: [] }),
    } as Response);

    await obtenerPanel();

    expect(fetchSpy).toHaveBeenCalledWith(
      expect.stringContaining("condominioId=parque%20%26%20bosque"),
      expect.any(Object),
    );
  });
});
