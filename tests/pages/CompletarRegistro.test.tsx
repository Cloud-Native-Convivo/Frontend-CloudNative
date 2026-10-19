import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { AuthProvider } from "@/context/AuthProvider";
import CompletarRegistro from "@/pages/CompletarRegistro";
import * as condominiosApi from "@/services/condominiosApi";
import * as sesionModule from "@/auth/sesion";

describe("CompletarRegistro Onboarding Page", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const mockPendingState = {
    tokens: {
      access_token: "mock-access-token",
      id_token: "mock-id-token",
      token_type: "Bearer",
      expires_in: 3600,
    },
    usuario: {
      nombre: "Google User",
      unidad: "Sin unidad asignada",
      role: "residente" as const,
    },
  };

  function renderPagina(state: unknown = mockPendingState) {
    return render(
      <AuthProvider>
        <MemoryRouter initialEntries={[{ pathname: "/completar-registro", state }]}>
          <Routes>
            <Route path="/completar-registro" element={<CompletarRegistro />} />
            <Route path="/login" element={<p>pantalla login</p>} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>,
    );
  }

  it("muestra campos de condominio y unidad cuando se accede con tokens pendientes", async () => {
    vi.spyOn(condominiosApi, "obtenerCondominios").mockResolvedValueOnce([
      { id: "1", nombre: "Condominio Los Andes" },
    ]);

    renderPagina();

    await waitFor(() => {
      expect(screen.getByText("Condominio Los Andes")).toBeInTheDocument();
    });

    expect(screen.getByLabelText(/condominio/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/torre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/piso/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/número de unidad/i)).toBeInTheDocument();
  });

  it("muestra error bloqueante con reintento si falla la carga de condominios", async () => {
    vi.spyOn(condominiosApi, "obtenerCondominios")
      .mockRejectedValueOnce(new Error("Timeout BFF"))
      .mockResolvedValueOnce([{ id: "1", nombre: "Condominio Recuperado" }]);

    renderPagina();

    await waitFor(() => {
      expect(screen.getByText(/no pudimos cargar los condominios/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /reintentar/i }));

    await waitFor(() => {
      expect(screen.getByText("Condominio Recuperado")).toBeInTheDocument();
    });
  });

  it("permite iniciar sesión sin asignación cuando falla el catálogo", async () => {
    vi.spyOn(condominiosApi, "obtenerCondominios").mockRejectedValue(new Error("Sin catálogo"));
    const completar = vi.spyOn(sesionModule, "completarSesion").mockImplementation(() => {});

    renderPagina();
    fireEvent.click(await screen.findByRole("button", { name: /continuar sin asignación/i }));

    expect(completar).toHaveBeenCalledWith(
      mockPendingState.tokens,
      expect.objectContaining({ nombre: "Google User", unidad: "Sin unidad asignada" }),
      expect.any(Function),
      expect.any(Function),
    );
    expect(completar.mock.calls[0][1].condominioId).toBeUndefined();
  });

  it("al elegir condominio solicita asignación sin habilitar acceso comunitario", async () => {
    vi.spyOn(condominiosApi, "obtenerCondominios").mockResolvedValueOnce([
      { id: "42", nombre: "Condominio Valparaíso" },
    ]);
    const spyCompletarSesion = vi.spyOn(sesionModule, "completarSesion").mockImplementation(() => {});
    const solicitar = vi.spyOn(condominiosApi, "solicitarAsignacion").mockResolvedValue({ estado: "pendiente" });

    renderPagina();

    await waitFor(() => {
      expect(screen.getByText("Condominio Valparaíso")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/condominio/i), { target: { value: "42" } });
    fireEvent.change(screen.getByLabelText(/torre/i), { target: { value: "Torre B" } });
    fireEvent.change(screen.getByLabelText(/piso/i), { target: { value: "5" } });
    fireEvent.change(screen.getByLabelText(/número de unidad/i), { target: { value: "504" } });

    fireEvent.click(screen.getByRole("button", { name: /guardar y continuar/i }));

    await waitFor(() => expect(solicitar).toHaveBeenCalledWith({ condominio_id: 42, unidad: "Torre B · Piso 5 · Unidad 504" }));
    expect(spyCompletarSesion).not.toHaveBeenCalled();
    expect(await screen.findByText(/solicitud pendiente/i)).toBeInTheDocument();
  });
});
