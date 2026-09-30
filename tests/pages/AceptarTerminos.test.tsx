import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthProvider } from "@/hooks/AuthProvider";
import AceptarTerminos from "@/pages/AceptarTerminos";
import { registrarAceptacionTerminos } from "@/lib/cognitoAuth";

vi.mock("@/lib/cognitoAuth", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/cognitoAuth")>()),
  registrarAceptacionTerminos: vi.fn(),
}));
vi.mock("@/utils/notify", () => ({
  notify: { success: vi.fn(), info: vi.fn(), error: vi.fn(), warning: vi.fn() },
}));

const pending = {
  tokens: { id_token: "id", access_token: "acc", expires_in: 3600, token_type: "Bearer" },
  usuario: { nombre: "Residente Prueba", unidad: "Sin unidad asignada", role: "residente" },
};

function renderPagina(state: unknown = pending) {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={[{ pathname: "/aceptar-terminos", state }]}>
        <Routes>
          <Route path="/aceptar-terminos" element={<AceptarTerminos />} />
          <Route path="/login" element={<p>pantalla login</p>} />
          <Route path="/mi-dashboard" element={<p>pantalla dashboard</p>} />
          <Route path="/" element={<p>pantalla inicio</p>} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>,
  );
}

const boton = () => screen.getByRole("button", { name: "Aceptar y continuar" });

beforeEach(() => {
  sessionStorage.clear();
  vi.mocked(registrarAceptacionTerminos).mockReset();
});

describe("AceptarTerminos", () => {
  it("sin tokens pendientes redirige a /login", () => {
    renderPagina(null);
    expect(screen.getByText("pantalla login")).toBeInTheDocument();
  });

  // Tabla de decisión: el botón solo se habilita con ambas casillas.
  it.each([
    [[], true],
    [["Términos de uso"], true],
    [["Política de privacidad"], true],
    [["Términos de uso", "Política de privacidad"], false],
  ])("casillas %o -> deshabilitado=%s", (marcar, deshabilitado) => {
    renderPagina();
    for (const texto of marcar) {
      fireEvent.click(screen.getByRole("checkbox", { name: new RegExp(texto) }));
    }
    expect(boton().hasAttribute("disabled")).toBe(deshabilitado);
  });

  function marcarAmbas() {
    fireEvent.click(screen.getByRole("checkbox", { name: /Términos de uso/ }));
    fireEvent.click(screen.getByRole("checkbox", { name: /Política de privacidad/ }));
  }

  it("al aceptar registra en Cognito, guarda sesión y va al dashboard", async () => {
    vi.mocked(registrarAceptacionTerminos).mockResolvedValue();
    renderPagina();
    marcarAmbas();
    fireEvent.click(boton());

    expect(await screen.findByText("pantalla dashboard")).toBeInTheDocument();
    expect(registrarAceptacionTerminos).toHaveBeenCalledWith("acc");
    expect(sessionStorage.getItem("convivo_access_token_v1")).toBe("acc");
  });

  it("si Cognito falla muestra alerta y no guarda sesión", async () => {
    vi.mocked(registrarAceptacionTerminos).mockRejectedValue(new Error("HTTP 400"));
    renderPagina();
    marcarAmbas();
    fireEvent.click(boton());

    expect(await screen.findByRole("alert")).toHaveTextContent("No pudimos registrar");
    await waitFor(() => expect(boton().hasAttribute("disabled")).toBe(false));
    expect(sessionStorage.getItem("convivo_access_token_v1")).toBeNull();
  });

  it("'No acepto' vuelve al inicio sin sesión", () => {
    renderPagina();
    fireEvent.click(screen.getByRole("button", { name: "No acepto" }));
    expect(screen.getByText("pantalla inicio")).toBeInTheDocument();
    expect(sessionStorage.getItem("convivo_access_token_v1")).toBeNull();
  });
});
