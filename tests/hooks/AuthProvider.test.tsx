import { render, screen, act } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vitest";
import { AuthProvider } from "@/hooks/AuthProvider";
import { useAuth } from "@/hooks/useAuth";

function TestConsumer() {
  const { user, setUser } = useAuth();
  return (
    <div>
      <span data-testid="user-name">{user.nombre}</span>
      <span data-testid="user-role">{user.role}</span>
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
    </div>
  );
}

describe("AuthProvider con localStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("inicializa con mock por defecto si localStorage está vacío", () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    expect(screen.getByTestId("user-name")).toHaveTextContent("María González");
    expect(screen.getByTestId("user-role")).toHaveTextContent("residente");
  });

  it("inicializa con datos de localStorage si convivo_user existe", () => {
    localStorage.setItem(
      "convivo_user",
      JSON.stringify({
        nombre: "Carlos Residente Real",
        unidad: "Torre C · 101",
        role: "residente",
      }),
    );

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    expect(screen.getByTestId("user-name")).toHaveTextContent("Carlos Residente Real");
  });

  it("persiste en localStorage al llamar setUser", () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    act(() => {
      screen.getByText("Actualizar").click();
    });

    expect(screen.getByTestId("user-name")).toHaveTextContent("Usuario Actualizado");
    const stored = JSON.parse(localStorage.getItem("convivo_user")!);
    expect(stored.nombre).toBe("Usuario Actualizado");
  });
});
