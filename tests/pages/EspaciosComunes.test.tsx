import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AuthContext } from "@/hooks/useAuth";
import type { User } from "@/types";
import EspaciosComunes from "@/pages/EspaciosComunes";
import * as espaciosApi from "@/services/espaciosApi";

function renderEspacios() {
  const user: User = { nombre: "Ana", unidad: "Casa 24", role: "residente", condominioId: "1" };
  return render(
    <AuthContext.Provider value={{ user, role: "residente", setRole: () => {}, setUser: () => {} }}>
      <MemoryRouter>
        <EspaciosComunes />
      </MemoryRouter>
    </AuthContext.Provider>,
  );
}

describe("EspaciosComunes con datos reales", () => {
  afterEach(() => vi.restoreAllMocks());

  it("el detalle muestra solo lo que guarda el backend, sin fotos ni datos inventados", async () => {
    vi.spyOn(espaciosApi, "listarEspacios").mockResolvedValue([
      {
        id: 1,
        nombre: "Quincho Norte",
        capacidad: 10,
        tarifa_hora: 5000,
        ubicacion: "Patio central",
        descripcion: null,
        estado: "activo",
      },
    ]);

    renderEspacios();

    fireEvent.click(await screen.findByRole("button", { name: "Ver detalle" }));
    const detalle = screen.getByRole("dialog", { name: "Quincho Norte" });

    expect(detalle).toHaveTextContent("$5.000 / hora");
    expect(detalle).toHaveTextContent("Patio central");
    expect(detalle).toHaveTextContent("10 personas");
    expect(detalle).not.toHaveTextContent(/Depósito|Horario|Reglas de uso|Lunes a domingo/);
    expect(document.querySelector("img")).toBeNull();
  });
});
