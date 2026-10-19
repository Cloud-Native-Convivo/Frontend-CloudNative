import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { describe, expect, it, vi } from "vitest";
import { AuthContext } from "@/hooks/useAuth";
import type { User } from "@/types";
import ResidenteDashboard from "@/pages/ResidenteDashboard";
import * as panelApi from "@/services/panelApi";
import * as condominiosApi from "@/services/condominiosApi";

function renderResidenteDashboard(user?: User | null) {
  const defaultUser: User = user ?? {
    nombre: "Alejandra Silva",
    unidad: "Torre A · Depto 402B",
    role: "residente",
    condominioId: "condo-aromos-1",
  };
  if (defaultUser.condominioId) {
    vi.spyOn(condominiosApi, "obtenerSolicitudPropia").mockResolvedValue({ estado: "aprobada", condominio_id: 1, unidad: defaultUser.unidad });
  }

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
  it("muestra estado pendiente sin pedir datos comunitarios cuando falta asignación", () => {
    vi.spyOn(condominiosApi, "obtenerSolicitudPropia").mockResolvedValue(null);
    const panel = vi.spyOn(panelApi, "obtenerPanel");
    renderResidenteDashboard({ nombre: "Ana", unidad: "Sin unidad asignada", role: "residente" });
    expect(screen.getByRole("heading", { name: /asignación pendiente/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /elegir condominio/i })).toHaveAttribute("href", "/completar-registro");
    expect(screen.queryByText(/Quincho Los Aromos/i)).not.toBeInTheDocument();
    expect(panel).not.toHaveBeenCalled();
    panel.mockRestore();
  });

  it("activa el panel tras confirmación de asignación del servidor", async () => {
    const actualizar = vi.fn();
    vi.spyOn(condominiosApi, "obtenerSolicitudPropia").mockResolvedValue({ estado: "aprobada", condominio_id: 42, unidad: "Torre A · Piso 2 · Unidad 201" });
    render(
      <AuthContext.Provider value={{ user: { nombre: "Ana", unidad: "Sin unidad asignada", role: "residente" }, role: "residente", setRole: () => {}, setUser: actualizar }}>
        <MemoryRouter><ResidenteDashboard /></MemoryRouter>
      </AuthContext.Provider>,
    );
    await screen.findByRole("heading", { name: /asignación pendiente/i });
    await waitFor(() => expect(actualizar).toHaveBeenCalledWith(expect.objectContaining({ condominioId: "42", unidad: "Torre A · Piso 2 · Unidad 201" })));
  });
  it("renderiza la cabecera editorial con el saludo y metadata de unidad", async () => {
    renderResidenteDashboard();

    await screen.findByRole("heading", { level: 1, name: /Buenos días, Alejandra/i });

    expect(screen.getByText(/FOLIO RESIDENCIAL ACTIVO/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: /Buenos días, Alejandra/i })).toBeInTheDocument();
    expect(screen.getByText(/Torre A · Depto 402B/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Reservar espacio/i })).toHaveAttribute("href", "/espacios");
    expect(screen.getByRole("link", { name: /Pagar gastos/i })).toHaveAttribute("href", "/gastos");
  });

  it("renderiza las tarjetas de KPIs con sus valores y enlaces de micro-acción", async () => {
    renderResidenteDashboard();
    await screen.findByText(/Próxima Reserva/i);

    expect(screen.getByText(/Próxima Reserva/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Quincho Los Aromos/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole("link", { name: /Ver reserva/i })).toHaveAttribute("href", "/reservas");

    expect(screen.getAllByText(/Gastos Comunes/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/\$65\.000 CLP/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Pagar en línea/i })).toHaveAttribute("href", "/gastos");
  });

  it("permite abrir y cerrar el modal interactivo de código QR de visita", async () => {
    renderResidenteDashboard();
    await screen.findByRole("heading", { level: 3, name: "Carlos Fuentes" });

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

  it("renderiza el dock de accesos directos y gaceta de comunicados", async () => {
    renderResidenteDashboard();
    await screen.findByRole("heading", { level: 2, name: /Gaceta & Comunicados/i });

    expect(screen.getByRole("heading", { level: 2, name: /Gaceta & Comunicados/i })).toBeInTheDocument();
    expect(screen.getByText(/Corte de agua programado/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: /Accesos Directos/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: /Actividad Reciente/i })).toBeInTheDocument();
  });
});
