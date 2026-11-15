import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { StepUnit } from "@/components/registro/StepComponents";
import { componerUnidad, validateUnit } from "@/components/registro/types";
import * as condominiosApi from "@/services/condominiosApi";

describe("StepUnit con selección obligatoria de condominio", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("valida que condominioId sea obligatorio y rechaza caracteres no permitidos", () => {
    const errorVacio = validateUnit({
      condominioId: "",
      torre: "Torre A",
      piso: "3",
      numero: "302",
    });
    expect(errorVacio.condominioId).toBe("Selecciona un condominio.");

    const errorInyeccion = validateUnit({
      condominioId: "1",
      torre: "Torre A",
      piso: "3",
      numero: '<script>alert("xss")</script>',
    });
    expect(errorInyeccion.numero).toBe("El número contiene caracteres no permitidos.");

    const valido = validateUnit({
      condominioId: "1",
      torre: "Torre A",
      piso: "3",
      numero: "302-B",
    });
    expect(Object.keys(valido)).toHaveLength(0);
  });

  it("según el tipo de condominio exige o no torre y piso (partición de equivalencia)", () => {
    const base = { condominioId: "1", torre: "", piso: "", numero: "24" };

    // Tipo B (casas): sin torre ni piso es válido y se compone como casa.
    const casa = { ...base, condominioTipo: "B" };
    expect(validateUnit(casa)).toEqual({});
    expect(componerUnidad(casa)).toBe("Casa 24");

    // Tipo A (edificio): el piso es obligatorio, la torre no.
    const edificio = { ...base, condominioTipo: "A" };
    expect(validateUnit(edificio)).toEqual({ piso: "Ingresa el piso." });
    expect(componerUnidad({ ...edificio, piso: "3" })).toBe("Piso 3 · Unidad 24");
    expect(componerUnidad({ ...edificio, torre: "Torre B", piso: "3" })).toBe(
      "Torre B · Piso 3 · Unidad 24",
    );
  });

  it("renderiza el selector de condominios al cargar exitosamente", async () => {
    const mockCondos = [
      { id: "10", nombre: "Condominio Bellavista" },
      { id: "20", nombre: "Condominio Mirador" },
    ];
    vi.spyOn(condominiosApi, "obtenerCondominios").mockResolvedValueOnce(mockCondos);

    const form = {
      condominioId: "",
      torre: "",
      piso: "",
      numero: "",
    };
    const onChange = vi.fn();

    render(<StepUnit form={form} errors={{}} onChange={onChange} />);

    await waitFor(() => {
      expect(screen.getByLabelText(/condominio/i)).toBeInTheDocument();
    });

    expect(screen.getByRole("option", { name: "Condominio Bellavista" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Condominio Mirador" })).toBeInTheDocument();
  });

  it("muestra error bloqueante con botón Reintentar si falla la carga de condominios", async () => {
    vi.spyOn(condominiosApi, "obtenerCondominios")
      .mockRejectedValueOnce(new Error("Conexión rechazada"))
      .mockResolvedValueOnce([{ id: "1", nombre: "Condominio Recuperado" }]);

    const form = {
      condominioId: "",
      torre: "",
      piso: "",
      numero: "",
    };
    const onChange = vi.fn();

    render(<StepUnit form={form} errors={{}} onChange={onChange} />);

    await waitFor(() => {
      expect(screen.getByText(/no pudimos cargar los condominios/i)).toBeInTheDocument();
    });

    const botonReintentar = screen.getByRole("button", { name: /reintentar/i });
    fireEvent.click(botonReintentar);

    await waitFor(() => {
      expect(screen.getByRole("option", { name: "Condominio Recuperado" })).toBeInTheDocument();
    });
  });
});
