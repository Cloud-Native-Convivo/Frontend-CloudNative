import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { describe, expect, it } from "vitest";
import { AuthContext } from "@/hooks/useAuth";
import ProtectedRoute from "@/routes/ProtectedRoute";
import type { User, Role } from "@/types";

function renderRutaProtegida(user: User | null, allowedRoles: Role[]) {
  return render(
    <AuthContext.Provider
      value={{
        user,
        role: user?.role ?? null,
        setRole: () => {},
        setUser: () => {},
      }}
    >
      <MemoryRouter initialEntries={["/dashboard-protegido"]}>
        <Routes>
          <Route path="/" element={<p>inicio</p>} />
          <Route path="/completar-registro" element={<p>pantalla onboarding</p>} />
          <Route element={<ProtectedRoute allowedRoles={allowedRoles} />}>
            <Route path="/dashboard-protegido" element={<p>contenido privado</p>} />
          </Route>
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  );
}

describe("ProtectedRoute — Control Anti-Bypass de Onboarding", () => {
  it("permite acceso a residente con onboarding completo (condominioId y unidad asignada)", () => {
    const usuarioValido: User = {
      nombre: "Carlos Residente",
      unidad: "Torre A · Piso 2 · Unidad 201",
      role: "residente",
      condominioId: "5",
      condominioNombre: "Condominio Central",
    };

    renderRutaProtegida(usuarioValido, ["residente"]);
    expect(screen.getByText("contenido privado")).toBeInTheDocument();
  });

  it("bloquea y redirige a /completar-registro a residente sin condominioId", () => {
    const usuarioSinCondominio: User = {
      nombre: "Carlos Incompleto",
      unidad: "Torre A · Piso 2 · Unidad 201",
      role: "residente",
      condominioId: undefined,
    };

    renderRutaProtegida(usuarioSinCondominio, ["residente"]);
    expect(screen.queryByText("contenido privado")).not.toBeInTheDocument();
    expect(screen.getByText("pantalla onboarding")).toBeInTheDocument();
  });

  it("bloquea y redirige a /completar-registro a residente con 'Sin unidad asignada'", () => {
    const usuarioSinUnidad: User = {
      nombre: "Carlos Sin Unidad",
      unidad: "Sin unidad asignada",
      role: "residente",
      condominioId: "5",
    };

    renderRutaProtegida(usuarioSinUnidad, ["residente"]);
    expect(screen.queryByText("contenido privado")).not.toBeInTheDocument();
    expect(screen.getByText("pantalla onboarding")).toBeInTheDocument();
  });
});
