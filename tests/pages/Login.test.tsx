import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { describe, expect, it, vi } from "vitest";
import { AuthContext } from "@/context/authContext";
import Login from "@/pages/Login";

function renderLogin() {
  return render(
    <AuthContext.Provider
      value={{
        user: null,
        role: null,
        setRole: vi.fn(),
        setUser: vi.fn(),
      }}
    >
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<p>Página de inicio</p>} />
          <Route path="/terminos" element={<p>Términos</p>} />
          <Route path="/privacidad" element={<p>Privacidad</p>} />
          <Route path="/crear-cuenta" element={<p>Crear cuenta</p>} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  );
}

describe("Login Page (Editorial Concierge)", () => {
  it("renderiza el titular de bienvenida y el panel institucional", () => {
    renderLogin();

    expect(screen.getByRole("heading", { name: "Bienvenido" })).toBeInTheDocument();
    expect(
      screen.getByText(/Ingresa con tu cuenta de residente para administrar tu departamento/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Conserjería en línea/i)).toBeInTheDocument();
    expect(screen.getByText(/Ley 21\.442 Chile/i)).toBeInTheDocument();
  });

  it("ofrece el botón principal de autenticación federada con Google SSO", () => {
    renderLogin();

    const googleBtn = screen.getByRole("button", { name: /Continuar con Google/i });
    expect(googleBtn).toBeInTheDocument();
    expect(googleBtn).not.toBeDisabled();
    expect(
      screen.getByText(/Acceso seguro y verificado con tu cuenta de Google/i),
    ).toBeInTheDocument();
  });

  it("valida campos de correo y contraseña al enviar el formulario vacío", () => {
    renderLogin();

    const submitBtn = screen.getByRole("button", { name: /^Ingresar$/i });
    fireEvent.click(submitBtn);

    expect(screen.getByText(/El correo es obligatorio\./i)).toBeInTheDocument();
    expect(screen.getByText(/La contraseña es obligatoria\./i)).toBeInTheDocument();
  });

  it("valida formato de correo inválido", () => {
    renderLogin();

    const emailInput = screen.getByLabelText(/Correo electrónico/i);
    fireEvent.change(emailInput, { target: { value: "correo-invalido" } });

    const submitBtn = screen.getByRole("button", { name: /^Ingresar$/i });
    fireEvent.click(submitBtn);

    expect(screen.getByText(/Ingresa un correo válido\./i)).toBeInTheDocument();
  });

  it("permite alternar la visibilidad de la contraseña con el botón de ojo", () => {
    renderLogin();

    const passwordInput = screen.getByLabelText(/^Contraseña$/i);
    expect(passwordInput).toHaveAttribute("type", "password");

    const toggleBtn = screen.getByRole("button", { name: /Ver contraseña/i });
    fireEvent.click(toggleBtn);

    expect(passwordInput).toHaveAttribute("type", "text");
    expect(screen.getByRole("button", { name: /Ocultar contraseña/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Ocultar contraseña/i }));
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("incluye enlaces legales hacia términos, privacidad y registro", () => {
    renderLogin();

    expect(screen.getByRole("link", { name: /Términos de uso/i })).toHaveAttribute("href", "/terminos");
    expect(screen.getByRole("link", { name: /Política de privacidad/i })).toHaveAttribute("href", "/privacidad");
    expect(screen.getByRole("link", { name: /Crear cuenta/i })).toHaveAttribute("href", "/crear-cuenta");
  });
});
