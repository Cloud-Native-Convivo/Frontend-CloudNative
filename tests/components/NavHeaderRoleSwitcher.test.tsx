import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";
import { NavHeader } from "@/components/layout/NavHeader";
import type { User } from "@/types";

describe("NavHeader role switcher removal", () => {
  const dummyUser: User = {
    nombre: "Ana Vidal",
    unidad: "Depto 302",
    role: "residente",
    condominioId: "condo-1",
  };

  it("no muestra el selector manual de roles ni en desktop ni en mobile", () => {
    render(
      <MemoryRouter>
        <NavHeader
          ribbonH={0}
          navH={64}
          navLinks={[{ label: "Espacios", path: "/espacios", icon: <span>icon</span> }]}
          // eslint-disable-next-line jsx-a11y/aria-role -- prop del componente NavHeader, no atributo ARIA del DOM
          role="residente"
          user={dummyUser}
          onLogout={vi.fn()}
        />
      </MemoryRouter>,
    );

    // No debe existir el botón con "ROL:" ni selector de demo
    expect(screen.queryByTitle(/Cambiar rol/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/ROL:/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Demo · Cambiar rol/i)).not.toBeInTheDocument();
  });
});
