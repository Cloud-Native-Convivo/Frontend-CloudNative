import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import Canales from "@/pages/Canales";
import Registro from "@/pages/Registro";

function renderPagina(pagina: React.ReactElement) {
  return render(<MemoryRouter>{pagina}</MemoryRouter>);
}

describe("Canales sin datos ficticios", () => {
  it("conserva los números de emergencia reales y no inventa un directorio", () => {
    renderPagina(<Canales />);

    expect(screen.getByRole("link", { name: /133/ })).toHaveAttribute("href", "tel:133");
    expect(screen.getByRole("link", { name: /132/ })).toHaveAttribute("href", "tel:132");
    expect(screen.getByRole("link", { name: /131/ })).toHaveAttribute("href", "tel:131");
    expect(screen.getByText("Sin contactos registrados")).toBeInTheDocument();
    expect(screen.queryByText(/\+56 9 1234 5678/)).not.toBeInTheDocument();
    expect(screen.queryByText(/conserjeria@convivo\.cl/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Comisaría 12a/)).not.toBeInTheDocument();
  });
});

describe("Registro sin datos ficticios", () => {
  it("muestra el estado vacío y ningún trabajo, proveedor ni boleta inventados", () => {
    renderPagina(<Registro />);

    expect(screen.getByText("Sin trabajos registrados")).toBeInTheDocument();
    expect(screen.queryByText(/Verde Total SpA/)).not.toBeInTheDocument();
    expect(screen.queryByText(/BOL-2026/)).not.toBeInTheDocument();
    expect(screen.queryByText(/100%/)).not.toBeInTheDocument();
  });
});
