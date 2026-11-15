import { afterEach, describe, expect, it, vi } from "vitest";
import * as tokenManager from "../auth/tokenManager";
import * as jobPolling from "../lib/jobPolling";
import { cancelarReserva } from "./espaciosApi";

describe("cancelarReserva", () => {
  afterEach(() => vi.restoreAllMocks());

  it("con 202 sondea el job del BFF hasta completar", async () => {
    vi.spyOn(tokenManager, "fetchConAuth").mockResolvedValue(
      new Response(JSON.stringify({ status_url: "/api/v1/espacios-comunes/jobs/t1" }), {
        status: 202,
      }),
    );
    const poll = vi.spyOn(jobPolling, "pollJobStatus").mockResolvedValue({});

    await cancelarReserva(7);

    expect(tokenManager.fetchConAuth).toHaveBeenCalledWith(
      expect.stringMatching(/\/espacios-comunes\/reservas\/7$/),
      { method: "DELETE" },
    );
    expect(poll).toHaveBeenCalledWith(
      expect.stringMatching(/\/api\/v1\/espacios-comunes\/jobs\/t1$/),
      expect.any(Object),
    );
  });

  it("propaga el fallo del job", async () => {
    vi.spyOn(tokenManager, "fetchConAuth").mockResolvedValue(
      new Response(JSON.stringify({ status_url: "/api/v1/espacios-comunes/jobs/t2" }), {
        status: 202,
      }),
    );
    vi.spyOn(jobPolling, "pollJobStatus").mockRejectedValue(new Error("Reserva no encontrada"));

    await expect(cancelarReserva(7)).rejects.toThrow("Reserva no encontrada");
  });
});
