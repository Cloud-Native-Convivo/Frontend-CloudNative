import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router";
import AuthCallback from "@/pages/AuthCallback";
import { AuthProvider } from "@/context/AuthProvider";
import * as cognitoAuth from "@/auth/cognitoAuth";

const mockNavigate = vi.fn();

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

function renderCallback(initialEntry = "/auth/callback") {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={[initialEntry]}>
        <AuthCallback />
      </MemoryRouter>
    </AuthProvider>,
  );
}

describe("AuthCallback component", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockNavigate.mockReset();
    sessionStorage.clear();
  });

  it("renderiza mensaje de carga al montar", () => {
    renderCallback("/auth/callback");

    expect(screen.getByText(/Iniciando sesión con Google/i)).toBeInTheDocument();
  });

  it("redirige a /auth/error?reason=oauth_error si hay error en la URL", async () => {
    renderCallback("/auth/callback?error=access_denied");

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/auth/error?reason=oauth_error", {
        replace: true,
      });
    });
  });

  it("redirige a /auth/error?reason=exchange_failed si falta el código", async () => {
    renderCallback("/auth/callback");

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/auth/error?reason=exchange_failed", {
        replace: true,
      });
    });
  });

  it("redirige a /auth/error?reason=csrf_detected si el state es invalido o falta", async () => {
    sessionStorage.setItem(cognitoAuth.LOGIN_NONCE_KEY, "expected-state-999");
    const exchangeSpy = vi.spyOn(cognitoAuth, "exchangeCodeForTokens");

    renderCallback("/auth/callback?code=valid-code&state=wrong-state");

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/auth/error?reason=csrf_detected", {
        replace: true,
      });
    });

    expect(exchangeSpy).not.toHaveBeenCalled();
    expect(sessionStorage.getItem(cognitoAuth.LOGIN_NONCE_KEY)).toBeNull();
  });

  it("procede al intercambio de tokens si code y state son validos", async () => {
    sessionStorage.setItem(cognitoAuth.LOGIN_NONCE_KEY, "valid-state-123");
    vi.spyOn(cognitoAuth, "exchangeCodeForTokens").mockResolvedValue({
      id_token: "fake.id.token",
      access_token: "fake.access.token",
      expires_in: 3600,
      token_type: "Bearer",
    });
    vi.spyOn(cognitoAuth, "decodeIdToken").mockReturnValue({
      sub: "user-123",
      name: "Juan Perez",
      "custom:condominio_id": "condo-1",
      "custom:unidad": "Torre A 101",
      "custom:terminos_version": "2026-09-30",
    });

    renderCallback("/auth/callback?code=good-code&state=valid-state-123");

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/mi-dashboard", { replace: true });
    });
  });
});
