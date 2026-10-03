import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { PayModal } from "./PayModal";

describe("PayModal", () => {
  it("renderiza el contenido principal y el total a pagar", () => {
    // Arrange
    const handleClose = vi.fn();
    const handleConfirm = vi.fn();

    // Act
    render(<PayModal onClose={handleClose} onConfirm={handleConfirm} />);

    // Assert
    expect(screen.getByText("Pagar gasto común")).toBeInTheDocument();
    expect(screen.getByText("$600.000 CLP")).toBeInTheDocument();
    expect(screen.getByText("WebPay")).toBeInTheDocument();
  });

  it("cierra el modal al hacer clic en el backdrop (overlay)", () => {
    // Arrange
    const handleClose = vi.fn();
    const handleConfirm = vi.fn();
    render(<PayModal onClose={handleClose} onConfirm={handleConfirm} />);

    // Act
    const backdrop = screen.getByLabelText("Cerrar");
    fireEvent.click(backdrop);

    // Assert
    expect(handleClose).toHaveBeenCalledOnce();
    expect(handleConfirm).not.toHaveBeenCalled();
  });

  it("llama a onConfirm al hacer clic en el botón de confirmación", () => {
    // Arrange
    const handleClose = vi.fn();
    const handleConfirm = vi.fn();
    render(<PayModal onClose={handleClose} onConfirm={handleConfirm} />);

    // Act
    const confirmButton = screen.getByRole("button", { name: "Confirmar pago" });
    fireEvent.click(confirmButton);

    // Assert
    expect(handleConfirm).toHaveBeenCalledOnce();
    expect(handleClose).not.toHaveBeenCalled();
  });
});
