import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AuthContext } from "@/hooks/useAuth";
import type { Role, User } from "@/types";
import Gastos from "@/pages/Gastos";
import * as gastosApi from "@/services/gastosApi";
import type { BackendGastoComun } from "@/services/gastosApi";

function gasto(parcial: Partial<BackendGastoComun>): BackendGastoComun {
  return {
    id: 1,
    unidadId: "U-101",
    concepto: "Gasto común",
    monto: 100000,
    saldoPendiente: 0,
    estado: "PAGADO",
    origen: "ORDINARIO",
    fechaVencimiento: "2026-09-15",
    fechaCreacion: "2026-08-01",
    ...parcial,
  };
}

function renderGastos(role: Role) {
  const user: User = { nombre: "Persona de prueba", unidad: "U-101", role };
  return render(
    <AuthContext.Provider value={{ user, role, setRole: () => {}, setUser: () => {} }}>
      <MemoryRouter>
        <Gastos />
      </MemoryRouter>
    </AuthContext.Provider>,
  );
}

function resumenCon(gastos: BackendGastoComun[]): gastosApi.GastosResumen {
  const pendiente = gastos.reduce((acc, g) => acc + g.saldoPendiente, 0);
  return { totalPendiente: pendiente, alDia: pendiente === 0, proximoVencimiento: null, gastos };
}

describe("Gastos con datos reales", () => {
  afterEach(() => vi.restoreAllMocks());

  it("calcula historial y desglose con los gastos del servidor y no ofrece pago simulado", async () => {
    vi.spyOn(gastosApi, "obtenerResumenGastos").mockResolvedValue(
      resumenCon([
        gasto({ concepto: "Portería", monto: 75000 }),
        gasto({ concepto: "Jardín", monto: 25000, saldoPendiente: 25000, estado: "PENDIENTE" }),
      ]),
    );
    renderGastos("residente");

    expect(await screen.findByText("Portería")).toBeInTheDocument();
    expect(screen.getByText("Jardín")).toBeInTheDocument();
    expect(screen.getByText("75% del total")).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Agosto 2026" })).toBeInTheDocument();
    expect(screen.getByText("Pendiente")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Pagar ahora/i })).not.toBeInTheDocument();
    expect(screen.queryByText("$600.000 CLP")).not.toBeInTheDocument();
  });

  it("muestra estados vacíos y el error, sin cifras inventadas, si no se pueden cargar", async () => {
    vi.spyOn(gastosApi, "obtenerResumenGastos").mockRejectedValue(new Error("HTTP 502"));
    renderGastos("residente");

    expect(await screen.findByText(/No pudimos cargar tu situación de pago/i)).toBeInTheDocument();
    expect(screen.getByText("Sin gastos registrados.")).toBeInTheDocument();
    expect(screen.getByText("Sin pagos registrados.")).toBeInTheDocument();
    expect(screen.queryByText(/Apto 301/i)).not.toBeInTheDocument();
    expect(screen.queryByText("$1.800.000")).not.toBeInTheDocument();
  });

  it("el admin ve la deuda por unidad calculada del servidor", async () => {
    vi.spyOn(gastosApi, "obtenerResumenGastos").mockResolvedValue(
      resumenCon([
        gasto({ unidadId: "U-101" }),
        gasto({ unidadId: "U-202", monto: 60000, saldoPendiente: 60000, estado: "MOROSO" }),
      ]),
    );
    renderGastos("admin");

    expect(await screen.findByText("U-202")).toBeInTheDocument();
    expect(screen.getByText("Deuda: $60.000")).toBeInTheDocument();
    expect(screen.getByText("Con deuda")).toBeInTheDocument();
    expect(screen.getByText("Sin deuda")).toBeInTheDocument();
  });
});
