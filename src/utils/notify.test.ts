import { describe, it, expect, vi, beforeEach } from "vitest";
import { notify } from "./notify";
import { sileo } from "sileo";
import { play } from "cuelume";

vi.mock("sileo", () => ({
  sileo: {
    success: vi.fn().mockReturnValue("id-success"),
    error: vi.fn().mockReturnValue("id-error"),
    warning: vi.fn().mockReturnValue("id-warning"),
    info: vi.fn().mockReturnValue("id-info"),
    dismiss: vi.fn(),
    clear: vi.fn(),
  },
}));

vi.mock("cuelume", () => ({
  play: vi.fn(),
}));

describe("notify", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("llama a sileo.success y reproduce el sonido success por defecto", () => {
    // Act
    const result = notify.success({ title: "Exito" });

    // Assert
    expect(result).toBe("id-success");
    expect(play).toHaveBeenCalledWith("success");
    expect(sileo.success).toHaveBeenCalledWith({ title: "Exito" });
  });

  it("llama a sileo.error y reproduce el sonido error por defecto", () => {
    // Act
    const result = notify.error({ title: "Error" });

    // Assert
    expect(result).toBe("id-error");
    expect(play).toHaveBeenCalledWith("error");
    expect(sileo.error).toHaveBeenCalledWith({ title: "Error" });
  });

  it("llama a sileo.warning y reproduce el sonido droplet por defecto", () => {
    // Act
    const result = notify.warning({ title: "Alerta" });

    // Assert
    expect(result).toBe("id-warning");
    expect(play).toHaveBeenCalledWith("droplet");
    expect(sileo.warning).toHaveBeenCalledWith({ title: "Alerta" });
  });

  it("llama a sileo.info y reproduce el sonido chime por defecto", () => {
    // Act
    const result = notify.info({ title: "Info" });

    // Assert
    expect(result).toBe("id-info");
    expect(play).toHaveBeenCalledWith("chime");
    expect(sileo.info).toHaveBeenCalledWith({ title: "Info" });
  });

  it("permite sobreescribir el sonido por defecto", () => {
    // Act
    notify.success({ title: "Exito" }, "chime");

    // Assert
    expect(play).toHaveBeenCalledWith("chime");
  });

  it("silencia errores al reproducir sonido (safePlay)", () => {
    // Arrange
    vi.mocked(play).mockImplementationOnce(() => {
      throw new Error("AudioContext blocked");
    });

    // Act
    // No debe arrojar excepción
    expect(() => notify.success({ title: "Exito" })).not.toThrow();
  });

  it("envía llamadas a dismiss y clear directamente a sileo", () => {
    // Act
    notify.dismiss("id-123");
    notify.clear();

    // Assert
    expect(sileo.dismiss).toHaveBeenCalledWith("id-123");
    expect(sileo.clear).toHaveBeenCalledOnce();
  });
});
