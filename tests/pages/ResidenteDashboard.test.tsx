import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { describe, expect, it } from "vitest";
import { AuthContext } from "@/hooks/useAuth";
import type { User } from "@/types";
import ResidenteDashboard from "@/pages/ResidenteDashboard";

function renderResidenteDashboard(user?: User | null) {
  const defaultUser: User = user ?? {
    nombre: "Alejandra Silva",
    unidad: "Torre A · Depto 402B",
    role: "residente",
    condominioId: "condo-aromos-1",
  };

  return render(
    <AuthContext.Provider
      value={{
        user: defaultUser,
        role: "residente",
        setRole: () => {},
        setUser: () => {},
      }}
    >
      <MemoryRouter initialEntries={["/mi-dashboard"]}>
        <Routes>
          <Route path="/mi-dashboard" element={<ResidenteDashboard />} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  );
}

describe("ResidenteDashboard (Editorial Residencial)", () => {
  it("renderiza la cabecera editorial con el saludo y metadata de unidad", () => {
    renderResidenteDashboard();

    expect(screen.getByText(/FOLIO RESIDENCIAL ACTIVO/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: /Buenos días, Alejandra/i })).toBeInTheDocument();
    expect(screen.getByText(/Torre A · Depto 402B/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Reservar espacio/i })).toHaveAttribute("href", "/espacios");
    expect(screen.getByRole("link", { name: /Pagar gastos/i })).toHaveAttribute("href", "/gastos");
  });

  it("renderiza las tarjetas de KPIs con sus valores y enlaces de micro-acción", () => {
    renderResidenteDashboard();

    expect(screen.getByText(/Próxima Reserva/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Quincho Los Aromos/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole("link", { name: /Ver reserva/i })).toHaveAttribute("href", "/reservas");

    expect(screen.getAllByText(/Gastos Comunes/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/\$65\.000 CLP/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Pagar en línea/i })).toHaveAttribute("href", "/gastos");
  });

  it("permite abrir y cerrar el modal interactivo de código QR de visita", () => {
    renderResidenteDashboard();

    // Verify visit pass card exists via heading
    expect(screen.getByRole("heading", { level: 3, name: "Carlos Fuentes" })).toBeInTheDocument();

    // Click on "Ver QR" for Carlos Fuentes
    const verQrBtns = screen.getAllByRole("button", { name: /Ver QR/i });
    expect(verQrBtns.length).toBeGreaterThanOrEqual(1);
    fireEvent.click(verQrBtns[0]);

    // Modal should be open
    expect(screen.getByRole("heading", { level: 2, name: /Código de acceso/i })).toBeInTheDocument();
    expect(screen.getAllByText(/VIS-8492-CF/i).length).toBeGreaterThanOrEqual(2);

    // Close modal
    const closeBtn = screen.getByRole("button", { name: "Cerrar" });
    fireEvent.click(closeBtn);

    // Modal should be closed
    expect(screen.queryByRole("heading", { level: 2, name: /Código de acceso/i })).not.toBeInTheDocument();
  });

  it("renderiza el dock de accesos directos y gaceta de comunicados", () => {
    renderResidenteDashboard();

    expect(screen.getByRole("heading", { level: 2, name: /Gaceta & Comunicados/i })).toBeInTheDocument();
    expect(screen.getByText(/Corte de agua programado/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: /Accesos Directos/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: /Actividad Reciente/i })).toBeInTheDocument();
  });
});
