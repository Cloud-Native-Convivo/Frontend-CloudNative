import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NuevoAvisoModal } from "./NuevoAvisoModal";
import { notify } from "../../utils/notify";

// Mock del módulo de notificaciones (I/O)
vi.mock("../../utils/notify", () => ({
  notify: {
    success: vi.fn(),
    info: vi.fn(),
  },
}));

describe("NuevoAvisoModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza en modo publicación directa", () => {
    // Arrange
    const handleClose = vi.fn();

    // Act
    render(<NuevoAvisoModal canPublishDirect={true} onClose={handleClose} />);

    // Assert
    expect(screen.getByText("Publicar aviso")).toBeInTheDocument();
    expect(
      screen.getByText("El aviso quedará publicado de inmediato en el tablón comunitario."),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Publicar" })).toBeInTheDocument();
  });

  it("renderiza en modo solicitud (sin publicación directa)", () => {
    // Arrange
    const handleClose = vi.fn();

    // Act
    render(<NuevoAvisoModal canPublishDirect={false} onClose={handleClose} />);

    // Assert
    expect(screen.getByText("Solicitar publicación")).toBeInTheDocument();
    expect(
      screen.getByText("Tu solicitud será revisada por el comité antes de publicarse."),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Enviar solicitud" })).toBeInTheDocument();
  });

  it("cierra el modal sin notificar al hacer clic en Cancelar", () => {
    // Arrange
    const handleClose = vi.fn();
    render(<NuevoAvisoModal canPublishDirect={true} onClose={handleClose} />);

    // Act
    const cancelButton = screen.getByRole("button", { name: "Cancelar" });
    fireEvent.click(cancelButton);

    // Assert
    expect(handleClose).toHaveBeenCalledOnce();
    expect(notify.success).not.toHaveBeenCalled();
    expect(notify.info).not.toHaveBeenCalled();
  });

  it("dispara notificación de éxito y cierra el modal al publicar directamente", () => {
    // Arrange
    const handleClose = vi.fn();
    render(<NuevoAvisoModal canPublishDirect={true} onClose={handleClose} />);

    // Act
    const publishButton = screen.getByRole("button", { name: "Publicar" });
    fireEvent.click(publishButton);

    // Assert
    expect(notify.success).toHaveBeenCalledWith({
      title: "Aviso publicado",
      description: "Tu comunicado ya es visible en el tablón.",
    });
    expect(handleClose).toHaveBeenCalledOnce();
  });

  it("dispara notificación informativa y cierra el modal al enviar solicitud", () => {
    // Arrange
    const handleClose = vi.fn();
    render(<NuevoAvisoModal canPublishDirect={false} onClose={handleClose} />);

    // Act
    const requestButton = screen.getByRole("button", { name: "Enviar solicitud" });
    fireEvent.click(requestButton);

    // Assert
    expect(notify.info).toHaveBeenCalledWith({
      title: "Solicitud enviada",
      description: "El comité revisará tu publicación a la brevedad.",
    });
    expect(handleClose).toHaveBeenCalledOnce();
  });
});
