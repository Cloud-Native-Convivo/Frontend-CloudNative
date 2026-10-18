import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { describe, expect, it } from "vitest";
import NotFound from "@/pages/NotFound";

function renderNotFound() {
  return render(
    <MemoryRouter initialEntries={["/ruta-que-no-existe"]}>
      <Routes>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </MemoryRouter>,
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

  it("ofrece enlaces de recuperación hacia el inicio y rutas disponibles", () => {
    renderNotFound();

    const homeLink = screen.getByRole("link", { name: /Volver al inicio seguro/i });
    expect(homeLink).toHaveAttribute("href", "/");

    const loginLink = screen.getByRole("link", { name: /Iniciar sesión/i });
    expect(loginLink).toHaveAttribute("href", "/login");

    expect(screen.getByRole("link", { name: /Gastos comunes/i })).toHaveAttribute("href", "/gastos");
    expect(screen.getByRole("link", { name: /Espacios comunes/i })).toHaveAttribute("href", "/espacios");
  });
});
