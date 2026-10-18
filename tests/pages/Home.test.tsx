import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { describe, expect, it } from "vitest";
import { AuthContext } from "@/hooks/useAuth";
import Home from "@/pages/Home";

function renderHome() {
  return render(
    <AuthContext.Provider
      value={{
        user: null,
        role: null,
        setRole: () => {},
        setUser: () => {},
      }}
    >
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  );
}

describe("Home Page (Editorial Residencial)", () => {
  it("renderiza el titular principal, badge de estatus y llamadas a la acción", () => {
    renderHome();

    expect(screen.getByText(/CONVIVO · SISTEMA RESIDENCIAL INTEGRAL/i)).toBeInTheDocument();
    const ctaLinks = screen.getAllByRole("link", { name: /Comenzar como residente/i });
    expect(ctaLinks.length).toBeGreaterThanOrEqual(1);
    expect(ctaLinks[0]).toHaveAttribute("href", "/crear-cuenta");
    expect(screen.getByRole("link", { name: /Iniciar sesión/i })).toHaveAttribute("href", "/login");
  });

  it("permite alternar entre Vista Residente y Vista Comité en la tarjeta interactiva", () => {
    renderHome();

    // Default: Vista Residente
    expect(screen.getByText(/Quincho Los Aromos/i)).toBeInTheDocument();
    expect(screen.getByText(/\$65\.000 CLP/i)).toBeInTheDocument();

    // Switch to Vista Comité
    const comiteBtn = screen.getByRole("button", { name: /^Comité$/i });
    fireEvent.click(comiteBtn);

    expect(screen.getByText(/Recaudación del Mes/i)).toBeInTheDocument();
    expect(screen.getByText(/\$7\.240\.000 CLP/i)).toBeInTheDocument();

    // Switch back to Vista Residente
    const residenteBtn = screen.getByRole("button", { name: /^Residente$/i });
    fireEvent.click(residenteBtn);

    expect(screen.getByText(/Quincho Los Aromos/i)).toBeInTheDocument();
  });

  it("renderiza la sección de métricas de transparencia y Ley 21.442", () => {
    renderHome();

    expect(screen.getByText(/\$7\.2M\+/i)).toBeInTheDocument();
    expect(screen.getByText(/Gastos Conciliados/i)).toBeInTheDocument();
    expect(screen.getByText(/100%/i)).toBeInTheDocument();
    expect(screen.getByText(/Auditable por Ley/i)).toBeInTheDocument();
  });

  it("permite cambiar entre pestañas de módulos en el showcase", () => {
    renderHome();

    // Default tab is Espacios Comunes
    expect(screen.getByText(/Reserva espacios comunes en segundos/i)).toBeInTheDocument();

    // Click on Gastos & Finanzas tab
    const gastosTab = screen.getByRole("tab", { name: /Gastos & Finanzas/i });
    fireEvent.click(gastosTab);

    expect(screen.getByText(/Cuentas claras y pago en línea para cada copropietario/i)).toBeInTheDocument();
  });

  it("renderiza la sección de pasos y llamada final a la acción", () => {
    renderHome();

    expect(screen.getByText(/02 \/ EXPERIENCIA DE INGRESO/i)).toBeInTheDocument();
    expect(screen.getByText(/Valida tu unidad/i)).toBeInTheDocument();
    expect(screen.getByText(/Tu condominio, elevado al estándar que merece/i)).toBeInTheDocument();
  });
});
