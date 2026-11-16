import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import Privacidad from "@/pages/Privacidad";
import Terminos from "@/pages/Terminos";

describe.each([
  ["Privacidad", Privacidad, "Política de privacidad"],
  ["Terminos", Terminos, "Términos de uso"],
])("%s", (_, Page, titulo) => {
  it("cada entrada del índice apunta a una sección existente", () => {
    const { container } = render(
      <MemoryRouter>
        <Page />
      </MemoryRouter>,
    );
    expect(screen.getByRole("heading", { level: 1, name: titulo })).toBeInTheDocument();

    const links = within(screen.getByRole("navigation", { name: "Contenido" })).getAllByRole(
      "link",
    );
    expect(links.length).toBeGreaterThan(0);
    for (const link of links) {
      const id = link.getAttribute("href")!.slice(1);
      expect(container.querySelector(`section#${id}`)).not.toBeNull();
    }
  });

  it("muestra el aviso de borrador", () => {
    render(
      <MemoryRouter>
        <Page />
      </MemoryRouter>,
    );
    expect(screen.getByRole("note")).toHaveTextContent("Borrador pendiente de revisión legal");
  });
});

describe.each([
  ["Privacidad", Privacidad],
  ["Terminos", Terminos],
])("%s, lo esencial", (_, Page) => {
  it("cada afirmación clave enlaza a la sección que la respalda y dice su número", () => {
    const { container } = render(
      <MemoryRouter>
        <Page />
      </MemoryRouter>,
    );
    const esencial = screen.getByRole("region", { name: "Lo esencial" });
    const links = within(esencial).getAllByRole("link");
    expect(links.length).toBeGreaterThan(0);
    for (const link of links) {
      const id = link.getAttribute("href")!.slice(1);
      const seccion = container.querySelector(`section#${id}`);
      expect(seccion).not.toBeNull();
      // El número que muestra el enlace es el del título real de la sección.
      const numero = seccion!.querySelector("h2")!.firstElementChild!.textContent;
      expect(link).toHaveTextContent(`Sección ${numero}`);
    }
  });
});
