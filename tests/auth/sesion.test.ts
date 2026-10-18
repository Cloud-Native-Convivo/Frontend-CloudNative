import { describe, expect, it, vi, beforeEach } from "vitest";
import { completarSesion, rutaPrincipalPorRol } from "@/auth/sesion";
import type { User } from "@/types";
import type { CognitoTokens } from "@/auth/cognitoAuth";

vi.mock("@/utils/notify", () => ({
  notify: {
    success: vi.fn(),
  },
}));

vi.mock("@/utils/authStorage", () => ({
  setStoredUser: vi.fn(),
}));

vi.mock("@/auth/tokenManager", () => ({
  guardarTokens: vi.fn(),
}));

describe("rutaPrincipalPorRol", () => {
  it("retorna /mi-dashboard para residente", () => {
    expect(rutaPrincipalPorRol("residente")).toBe("/mi-dashboard");
  });

  it("retorna /espacios para conserje", () => {
    expect(rutaPrincipalPorRol("conserje")).toBe("/espacios");
  });

  it("retorna /espacios para comite", () => {
    expect(rutaPrincipalPorRol("comite")).toBe("/espacios");
  });

  it("retorna /dashboard para admin", () => {
    expect(rutaPrincipalPorRol("admin")).toBe("/dashboard");
  });
});

describe("completarSesion", () => {
  const dummyTokens: CognitoTokens = {
    access_token: "access-123",
    id_token: "id-123",
    refresh_token: "refresh-123",
    expires_in: 3600,
    token_type: "Bearer",
  };

  it("navega a /mi-dashboard para usuario residente", () => {
    const navigate = vi.fn();
    const setUser = vi.fn();
    const usuario: User = {
      nombre: "Juan Perez",
      unidad: "Torre 1 · 101",
      role: "residente",
      condominioId: "condo-1",
    };

    completarSesion(dummyTokens, usuario, setUser, navigate);

    expect(navigate).toHaveBeenCalledWith("/mi-dashboard", { replace: true });
    expect(setUser).toHaveBeenCalledWith(usuario);
  });

  it("navega a /dashboard para usuario admin", () => {
    const navigate = vi.fn();
    const setUser = vi.fn();
    const usuario: User = {
      nombre: "Admin User",
      unidad: "Admin Unit",
      role: "admin",
    };

    completarSesion(dummyTokens, usuario, setUser, navigate);

    expect(navigate).toHaveBeenCalledWith("/dashboard", { replace: true });
  });

  it("navega a /espacios para conserje", () => {
    const navigate = vi.fn();
    const setUser = vi.fn();
    const usuario: User = {
      nombre: "Conserje User",
      unidad: "Conserjeria",
      role: "conserje",
    };

    completarSesion(dummyTokens, usuario, setUser, navigate);

    expect(navigate).toHaveBeenCalledWith("/espacios", { replace: true });
  });
});
