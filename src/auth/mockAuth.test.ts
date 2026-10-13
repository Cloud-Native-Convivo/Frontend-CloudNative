import { describe, it, expect, vi, beforeEach } from "vitest";
import { iniciarSesionResidenteMock } from "./mockAuth";
import * as authStorage from "../utils/authStorage";

describe("mockAuth", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    sessionStorage.clear();
  });

  it("obtiene token del mock y almacena usuario residente y token en storage", async () => {
    const mockToken = "mock.jwt.token";
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ access_token: mockToken }),
    } as Response);

    const user = await iniciarSesionResidenteMock();

    expect(user).toEqual({
      nombre: "Carlos Valenzuela",
      unidad: "301-A",
      role: "residente",
    });
    expect(authStorage.getStoredAccessToken()).toBe(mockToken);
    expect(authStorage.getStoredUser()).toEqual(user);
  });

  it("lanza error si el servicio jwks mock falla", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    } as Response);

    await expect(iniciarSesionResidenteMock()).rejects.toThrow("Error al obtener token mock");
  });
});
