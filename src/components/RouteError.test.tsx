import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import RouteError from "./RouteError";

// Mock de react-router
const mockUseRouteError = vi.fn();
const mockIsRouteErrorResponse = vi.fn();

vi.mock("react-router", () => ({
  useRouteError: () => mockUseRouteError(),
  isRouteErrorResponse: (err: unknown) => mockIsRouteErrorResponse(err),
}));

describe("RouteError", () => {
  it("renderiza correctamente un error de tipo Error estandar", () => {
    // Arrange
    mockUseRouteError.mockReturnValue(new Error("Error de conexión"));
    mockIsRouteErrorResponse.mockReturnValue(false);

    // Act
    render(<RouteError />);

    // Assert
    expect(screen.getByText("Algo salió mal")).toBeInTheDocument();
    expect(screen.getByText("Error de conexión")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Volver al inicio" })).toHaveAttribute("href", "/");
  });

  it("renderiza correctamente un error tipo RouteErrorResponse", () => {
    // Arrange
    mockUseRouteError.mockReturnValue({ status: 404, statusText: "Not Found" });
    mockIsRouteErrorResponse.mockReturnValue(true);

    // Act
    render(<RouteError />);

    // Assert
    expect(screen.getByText("404 Not Found")).toBeInTheDocument();
  });

  it("renderiza un mensaje por defecto si el error es desconocido", () => {
    // Arrange
    mockUseRouteError.mockReturnValue(null);
    mockIsRouteErrorResponse.mockReturnValue(false);

    // Act
    render(<RouteError />);

    // Assert
    expect(screen.getByText("Ocurrió un error inesperado.")).toBeInTheDocument();
  });
});
