import { render, screen, act } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vitest";
import { AuthProvider } from "@/hooks/AuthProvider";
import { useAuth } from "@/hooks/useAuth";

function TestConsumer() {
  const { user, setUser } = useAuth();
  return (
    <div>
      <span data-testid="user-name">{user?.nombre ?? "(sin sesión)"}</span>
      <span data-testid="user-role">{user?.role ?? "(sin sesión)"}</span>
      <button
        onClick={() =>
          setUser({
            nombre: "Usuario Actualizado",
            unidad: "Torre B · Depto 501",
            role: "residente",
          })
        }
      >
        Actualizar
      </button>
      <button onClick={() => setUser(null)}>Salir</button>
    </div>
  );
}

describe("AuthProvider con authStorage (sessionStorage + versioned keys)", () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
  });

  it("inicializa sin usuario si storage está vacío (sin fallback mock)", () => {
    // Regresión OWASP A01: antes caía a USERS.residente como default
    // silencioso, dejando entrar a cualquier visitante sin sesión real.
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    expect(screen.getByTestId("user-name")).toHaveTextContent("(sin sesión)");
    expect(screen.getByTestId("user-role")).toHaveTextContent("(sin sesión)");
  });

  it("inicializa con datos de sessionStorage si convivo_user_v1 existe", () => {
    sessionStorage.setItem(
      "convivo_user_v1",
      JSON.stringify({
        nombre: "Carlos Residente V1",
        unidad: "Torre C · 101",
        role: "residente",
      }),
    );

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    expect(screen.getByTestId("user-name")).toHaveTextContent("Carlos Residente V1");
  });

  it("inicializa con fallback de legacy localStorage convivo_user", () => {
    localStorage.setItem(
      "convivo_user",
      JSON.stringify({
        nombre: "Carlos Residente Legacy",
        unidad: "Torre C · 101",
        role: "residente",
      }),
    );

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    expect(screen.getByTestId("user-name")).toHaveTextContent("Carlos Residente Legacy");
  });

  it("persiste en sessionStorage al llamar setUser con convivo_user_v1", () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    act(() => {
      screen.getByText("Actualizar").click();
    });

    expect(screen.getByTestId("user-name")).toHaveTextContent("Usuario Actualizado");
    const stored = JSON.parse(sessionStorage.getItem("convivo_user_v1")!);
    expect(stored.nombre).toBe("Usuario Actualizado");
  });

  it("setUser(null) cierra sesión de verdad: limpia el estado y el storage", () => {
    sessionStorage.setItem(
      "convivo_user_v1",
      JSON.stringify({ nombre: "Con Sesión", unidad: "Torre A", role: "residente" }),
    );

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    expect(screen.getByTestId("user-name")).toHaveTextContent("Con Sesión");

    act(() => {
      screen.getByText("Salir").click();
    });

    expect(screen.getByTestId("user-name")).toHaveTextContent("(sin sesión)");
    expect(sessionStorage.getItem("convivo_user_v1")).toBeNull();
  });
});
