import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { describe, expect, it } from "vitest";
import { AuthContext } from "@/hooks/useAuth";
import type { User } from "@/types";
import Login from "@/pages/Login";
import Home from "@/pages/Home";

function renderWithAuth(ui: React.ReactElement, user: User | null, initialRoute: string) {
  return render(
    <AuthContext.Provider
      value={{
        user,
        role: user?.role ?? null,
        setRole: () => {},
        setUser: () => {},
      }}
    >
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route path="/login" element={ui} />
          <Route path="/" element={ui} />
          <Route path="/mi-dashboard" element={<div data-testid="mi-dashboard-landing">Mi Dashboard</div>} />
          <Route path="/dashboard" element={<div data-testid="admin-dashboard-landing">Admin Dashboard</div>} />
          <Route path="/espacios" element={<div data-testid="espacios-landing">Espacios Comunes</div>} />
          <Route path="/completar-registro" element={<div data-testid="completar-landing">Completar Registro</div>} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  );
}

describe("Login and Home redirects for authenticated users", () => {
  it("Login redirige a /mi-dashboard si el usuario residente tiene perfil completo", async () => {
    const user: User = {
      nombre: "Residente Test",
      unidad: "Torre A 101",
      role: "residente",
      condominioId: "condo-123",
    };

    renderWithAuth(<Login />, user, "/login");

    expect(await screen.findByTestId("mi-dashboard-landing")).toBeInTheDocument();
  });

  it("Login redirige a /completar-registro si el usuario residente tiene perfil incompleto", async () => {
    const user: User = {
      nombre: "Residente Incompleto",
      unidad: "Sin unidad asignada",
      role: "residente",
    };

    renderWithAuth(<Login />, user, "/login");

    expect(await screen.findByTestId("completar-landing")).toBeInTheDocument();
  });

  it("Login redirige a /dashboard si el usuario es admin", async () => {
    const user: User = {
      nombre: "Admin Test",
      unidad: "Administracion",
      role: "admin",
    };

    renderWithAuth(<Login />, user, "/login");

    expect(await screen.findByTestId("admin-dashboard-landing")).toBeInTheDocument();
  });

  it("Login se muestra normalmente cuando no hay sesión activa", () => {
    renderWithAuth(<Login />, null, "/login");

    expect(screen.getByRole("heading", { name: "Bienvenido" })).toBeInTheDocument();
  });

  it("Home redirige a la ruta del rol si el usuario está autenticado", async () => {
    const user: User = {
      nombre: "Conserje Test",
      unidad: "Conserjeria",
      role: "conserje",
    };

    renderWithAuth(<Home />, user, "/");

    expect(await screen.findByTestId("espacios-landing")).toBeInTheDocument();
  });
});
