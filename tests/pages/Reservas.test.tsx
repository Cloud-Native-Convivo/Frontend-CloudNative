import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AuthContext } from "@/hooks/useAuth";
import type { User } from "@/types";
import Reservas from "@/pages/Reservas";
import * as espaciosApi from "@/services/espaciosApi";
import type { BackendReserva } from "@/services/espaciosApi";

function reservaEnDias(dias: number, estado = "confirmada"): BackendReserva {
  const inicio = new Date(Date.now() + dias * 24 * 60 * 60 * 1000);
  inicio.setMinutes(0, 0, 0);
  const fin = new Date(inicio.getTime() + 60 * 60 * 1000);
  return {
    id: 7,
    espacio_id: 1,
    usuario_sub: "sub-1",
    fecha_inicio: inicio.toISOString(),
    fecha_fin: fin.toISOString(),
    estado,
    monto_total: 10000,
    creado_en: "2026-11-01T10:00:00",
  };
}

function renderReservas() {
  const user: User = {
    nombre: "Persona de prueba",
    unidad: "101",
    role: "residente",
    condominioNombre: "Condominio Real",
  };
  return render(
    <AuthContext.Provider value={{ user, role: "residente", setRole: () => {}, setUser: () => {} }}>
      <MemoryRouter>
        <Reservas />
      </MemoryRouter>
    </AuthContext.Provider>,
  );
}

describe("Reservas con datos reales", () => {
  afterEach(() => vi.restoreAllMocks());

  it("cancela en el servidor y recarga el estado real", async () => {
    vi.spyOn(espaciosApi, "listarEspacios").mockResolvedValue([
      { id: 1, nombre: "Quincho Norte", capacidad: 10, tarifa_hora: 10000, estado: "activo" },
    ]);
    const listar = vi
      .spyOn(espaciosApi, "listarMisReservas")
      .mockResolvedValueOnce([reservaEnDias(3)])
      .mockResolvedValueOnce([reservaEnDias(3, "cancelada")]);
    const cancelar = vi.spyOn(espaciosApi, "cancelarReserva").mockResolvedValue();

    renderReservas();

    expect(await screen.findByText("Quincho Norte")).toBeInTheDocument();
    expect(screen.getByText("Condominio Real")).toBeInTheDocument();
    expect(screen.queryByText(/Torres del Parque/)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));
    const dialogo = screen.getByRole("dialog", { name: "¿Cancelar esta reserva?" });
    expect(dialogo).toHaveAttribute("open");
    expect(screen.getByRole("button", { name: "Volver" })).toHaveFocus();
    fireEvent.click(screen.getByRole("button", { name: "Sí, cancelar" }));

    await waitFor(() => expect(cancelar).toHaveBeenCalledWith(7));
    await waitFor(() => expect(listar).toHaveBeenCalledTimes(2));
    expect(await screen.findByText(/Cancelada/, { selector: "span" })).toBeInTheDocument();
  });

  it("no marca cancelada si el servidor rechaza", async () => {
    vi.spyOn(espaciosApi, "listarEspacios").mockResolvedValue([]);
    vi.spyOn(espaciosApi, "listarMisReservas").mockResolvedValue([reservaEnDias(3)]);
    vi.spyOn(espaciosApi, "cancelarReserva").mockRejectedValue(new Error("HTTP 403"));

    renderReservas();

    fireEvent.click(await screen.findByRole("button", { name: "Cancelar" }));
    fireEvent.click(screen.getByRole("button", { name: "Sí, cancelar" }));

    await waitFor(() =>
      expect(screen.queryByRole("button", { name: "Sí, cancelar" })).not.toBeInTheDocument(),
    );
    expect(screen.getByText(/Confirmada/, { selector: "span" })).toBeInTheDocument();
  });

  it("Volver cierra el diálogo nativo sin llamar al servidor", async () => {
    vi.spyOn(espaciosApi, "listarEspacios").mockResolvedValue([]);
    vi.spyOn(espaciosApi, "listarMisReservas").mockResolvedValue([reservaEnDias(3)]);
    const cancelar = vi.spyOn(espaciosApi, "cancelarReserva");

    renderReservas();

    fireEvent.click(await screen.findByRole("button", { name: "Cancelar" }));
    fireEvent.click(screen.getByRole("button", { name: "Volver" }));

    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(cancelar).not.toHaveBeenCalled();
  });

  it("mientras el servidor procesa la cancelación, el botón queda deshabilitado", async () => {
    vi.spyOn(espaciosApi, "listarEspacios").mockResolvedValue([]);
    vi.spyOn(espaciosApi, "listarMisReservas").mockResolvedValue([reservaEnDias(3)]);
    let terminar: () => void = () => {};
    const cancelar = vi
      .spyOn(espaciosApi, "cancelarReserva")
      .mockReturnValue(new Promise<void>((r) => (terminar = r)));

    renderReservas();

    fireEvent.click(await screen.findByRole("button", { name: "Cancelar" }));
    fireEvent.click(screen.getByRole("button", { name: "Sí, cancelar" }));

    const boton = await screen.findByRole("button", { name: "Cancelando…" });
    expect(boton).toBeDisabled();
    fireEvent.click(boton);
    expect(cancelar).toHaveBeenCalledTimes(1);

    terminar();
    await waitFor(() =>
      expect(screen.queryByRole("button", { name: "Cancelando…" })).not.toBeInTheDocument(),
    );
  });
});
