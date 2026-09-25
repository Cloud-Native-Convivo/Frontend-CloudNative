import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import AuthError from "@/pages/AuthError";
import * as cognitoAuth from "@/lib/cognitoAuth";

describe("AuthError page", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renderiza el título y descripción genéricos por defecto si no hay reason", () => {
    render(
      <MemoryRouter initialEntries={["/auth/error"]}>
        <AuthError />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", { name: "Servicio no disponible temporalmente" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/No fue posible establecer conexión con el servicio de autenticación/i)).toBeInTheDocument();
  });

  it("muestra mensaje genérico cuando reason=connection_failed o config_missing sin exponer infraestructura", () => {
    render(
      <MemoryRouter initialEntries={["/auth/error?reason=connection_failed"]}>
        <AuthError />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", { name: "Servicio no disponible temporalmente" }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/AWS Cognito/i)).not.toBeInTheDocument();
  });

  it("muestra mensaje adecuado cuando reason=oauth_error", () => {
    render(
      <MemoryRouter initialEntries={["/auth/error?reason=oauth_error"]}>
        <AuthError />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", { name: "No se pudo completar el inicio de sesión" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/solicitud de autorización fue cancelada o no pudo validarse/i)).toBeInTheDocument();
  });

  it("muestra enlace para volver al login y al sitio principal", () => {
    render(
      <MemoryRouter initialEntries={["/auth/error"]}>
        <AuthError />
      </MemoryRouter>,
    );

    const loginLink = screen.getByRole("link", { name: "Volver a iniciar sesión" });
    expect(loginLink).toHaveAttribute("href", "/login");

    const homeLink = screen.getByRole("link", { name: /Volver al sitio principal/i });
    expect(homeLink).toHaveAttribute("href", "/");
  });

  it("muestra mensaje genérico si el reintento falla", async () => {
    vi.spyOn(cognitoAuth, "isCognitoConfigured").mockReturnValue(false);

    render(
      <MemoryRouter initialEntries={["/auth/error"]}>
        <AuthError />
      </MemoryRouter>,
    );

    const retryBtn = screen.getByRole("button", { name: /Reintentar con Google/i });
    fireEvent.click(retryBtn);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "El servicio no se encuentra disponible momentáneamente. Por favor, intenta más tarde.",
      );
    });
  });

  it("muestra mensaje de error si el reintento falla porque el servidor no responde", async () => {
    vi.spyOn(cognitoAuth, "isCognitoConfigured").mockReturnValue(true);
    vi.spyOn(cognitoAuth, "checkCognitoReachability").mockResolvedValue(false);

    render(
      <MemoryRouter initialEntries={["/auth/error?reason=connection_failed"]}>
        <AuthError />
      </MemoryRouter>,
    );

    const retryBtn = screen.getByRole("button", { name: /Reintentar con Google/i });
    fireEvent.click(retryBtn);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "El servicio no se encuentra disponible momentáneamente. Por favor, intenta más tarde.",
      );
    });
  });

  it("inicia redirección a Google si la configuración es válida y el host responde al reintentar", async () => {
    vi.spyOn(cognitoAuth, "isCognitoConfigured").mockReturnValue(true);
    vi.spyOn(cognitoAuth, "checkCognitoReachability").mockResolvedValue(true);
    vi.spyOn(cognitoAuth, "buildGoogleAuthorizeUrl").mockResolvedValue("https://fake-cognito.com/oauth2/authorize");

    const assignMock = vi.fn();
    Object.defineProperty(window, "location", {
      value: { assign: assignMock },
      writable: true,
    });

    render(
      <MemoryRouter initialEntries={["/auth/error?reason=connection_failed"]}>
        <AuthError />
      </MemoryRouter>,
    );

    const retryBtn = screen.getByRole("button", { name: /Reintentar con Google/i });
    fireEvent.click(retryBtn);

    await waitFor(() => {
      expect(assignMock).toHaveBeenCalledWith("https://fake-cognito.com/oauth2/authorize");
    });
  });
});
