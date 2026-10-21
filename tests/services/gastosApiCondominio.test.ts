import { describe, it, expect, vi, beforeEach } from "vitest";
import { listarGastos } from "@/services/gastosApi";
import { USER_STORAGE_KEY } from "@/utils/authStorage";

describe("gastosApi con condominioId dinámico y sanitizado", () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("inyecta el condominioId del usuario autenticado en la URL", async () => {
    sessionStorage.setItem(
      USER_STORAGE_KEY,
      JSON.stringify({
        nombre: "Test User",
        unidad: "101",
        role: "residente",
        condominioId: "42",
      }),
    );

    const fetchSpy = vi.spyOn(globalThis, "fetch").mockImplementation(async (url) => {
      const urlStr = String(url);
      if (urlStr.includes("/panel")) {
        // Fallar panel para forzar llamada directa a gastos
        return { ok: false, status: 500 } as Response;
      }
      return {
        ok: true,
        json: async () => [],
      } as Response;
    });

    await listarGastos();

    expect(fetchSpy).toHaveBeenCalledWith(
      expect.stringContaining("condominioId=42"),
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
        condominioId: "condo #1 / fase 2",
      }),
    );

    const fetchSpy = vi.spyOn(globalThis, "fetch").mockImplementation(async (url) => {
      const urlStr = String(url);
      if (urlStr.includes("/panel")) {
        return { ok: false, status: 500 } as Response;
      }
      return {
        ok: true,
        json: async () => [],
      } as Response;
    });

    await listarGastos();

    expect(fetchSpy).toHaveBeenCalledWith(
      expect.stringContaining("condominioId=condo%20%231%20%2F%20fase%202"),
      expect.any(Object),
    );
  });
});
