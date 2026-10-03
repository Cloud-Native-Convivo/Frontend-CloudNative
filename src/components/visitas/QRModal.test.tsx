import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { QRModal } from "./QRModal";

describe("QRModal", () => {
  const mockVisita = {
    id: "1",
    nombre: "Juan Perez",
    rut: "12.345.678-9",
    fechaDisplay: "Mañana",
    fechaSort: "2026-09-02",
    hora: "14:00",
    tipo: "Servicio" as const,
    estado: "Pendiente" as const,
    codigo: "A1B2C3",
    documento: "",
    fecha: "",
    motivo: "",
    unidad: "",
  } as any;

  it("renderiza la información de la visita y el código QR", () => {
    // Arrange
    const handleClose = vi.fn();

    // Act
    render(<QRModal visita={mockVisita} onClose={handleClose} />);

    // Assert
    expect(screen.getByText("Código de acceso")).toBeInTheDocument();
    expect(screen.getByText("Juan Perez · Mañana · 14:00")).toBeInTheDocument();
    expect(screen.getByText("A1B2C3")).toBeInTheDocument();
  });

  it("cierra el modal al hacer clic en Cerrar", () => {
    // Arrange
    const handleClose = vi.fn();
    render(<QRModal visita={mockVisita} onClose={handleClose} />);

    // Act
    const closeButton = screen.getByRole("button", { name: "Cerrar" });
    fireEvent.click(closeButton);

    // Assert
    expect(handleClose).toHaveBeenCalledOnce();
  });

  it("cierra el modal al hacer clic en Descargar (comportamiento actual)", () => {
    // Arrange
    const handleClose = vi.fn();
    render(<QRModal visita={mockVisita} onClose={handleClose} />);

    // Act
    const downloadButton = screen.getByRole("button", { name: "Descargar" });
    fireEvent.click(downloadButton);

    // Assert
    expect(handleClose).toHaveBeenCalledOnce();
  });
});
