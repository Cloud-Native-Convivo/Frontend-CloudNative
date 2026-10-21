import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { describe, expect, it } from "vitest";
import { AuthContext } from "@/context/authContext";
import type { User } from "@/types";
import NotFound from "@/pages/NotFound";

function renderNotFound(user: User | null = null) {
  return render(
    <AuthContext.Provider
      value={{
        user,
        role: user ? user.role : null,
        setRole: () => {},
        setUser: () => {},
      }}
    >
      <MemoryRouter initialEntries={["/ruta-que-no-existe"]}>
        <Routes>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  );
}

describe("NotFound Page (Editorial This Is Fine)", () => {
  it("renderiza el titular editorial de error 404 y badge de novedad", () => {
    renderNotFound();

    expect(screen.getByText(/Error 404 · Registro Extraviado/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      /Todo está bajo control\.\.\. excepto que esta página no existe/i,
    );
    expect(screen.getByText(/Novedad en Conserjería/i)).toBeInTheDocument();
  });

  it("renderiza la ficha de especificaciones de la incidencia técnica", () => {
    renderNotFound();

    expect(screen.getByText(/ERR-404-COPROPIEDAD/i)).toBeInTheDocument();
    expect(screen.getByText(/En llamas \(pero serenos\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Evacuar a zona segura/i)).toBeInTheDocument();
  });

  it("renderiza la imagen GIF 'This Is Fine' con su pie de evidencia", () => {
    renderNotFound();

    const gifImage = screen.getByRole("img", {
      name: /Conserjería confirmando que todo está bajo control frente al fuego/i,
    });
    expect(gifImage).toBeInTheDocument();
    expect(gifImage.getAttribute("src")).toContain("This Is Fine GIF.gif");
    expect(screen.getByText(/«This is fine\.»/i)).toBeInTheDocument();
  });

  it("ofrece enlaces de recuperación públicos hacia el inicio, planes y términos a visitantes anónimos", () => {
    renderNotFound();

    const homeLink = screen.getByRole("link", { name: /Volver al inicio seguro/i });
    expect(homeLink).toHaveAttribute("href", "/");

    const loginLink = screen.getByRole("link", { name: /Iniciar sesión/i });
    expect(loginLink).toHaveAttribute("href", "/login");

    expect(screen.getByRole("link", { name: /^Inicio$/i })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: /^Planes$/i })).toHaveAttribute("href", "/precios");
    expect(screen.getByRole("link", { name: /^Privacidad$/i })).toHaveAttribute("href", "/privacidad");
    expect(screen.getByRole("link", { name: /^Términos$/i })).toHaveAttribute("href", "/terminos");
    expect(screen.getByRole("link", { name: /^Crear cuenta$/i })).toHaveAttribute("href", "/crear-cuenta");

    // No debe exponer enlaces a módulos privados a visitantes anónimos
    expect(screen.queryByRole("link", { name: /Gastos comunes/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Espacios comunes/i })).not.toBeInTheDocument();
  });

  it("ofrece enlaces de recuperación a módulos del residente si el usuario está autenticado", () => {
    renderNotFound({ nombre: "Residente Test", unidad: "101", role: "residente" });

    expect(screen.getByRole("link", { name: /^Mi panel$/i })).toHaveAttribute("href", "/mi-dashboard");
    expect(screen.getByRole("link", { name: /^Gastos comunes$/i })).toHaveAttribute("href", "/gastos");
    expect(screen.getByRole("link", { name: /^Espacios comunes$/i })).toHaveAttribute("href", "/espacios");
    expect(screen.getByRole("link", { name: /^Tablón de avisos$/i })).toHaveAttribute("href", "/tablon");
  });
});
