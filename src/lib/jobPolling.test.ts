import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { pollJobStatus } from './jobPolling';

describe('pollJobStatus', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('debe consultar status_url hasta recibir COMPLETADO y retornar resultado', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ estado: 'PROCESANDO' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            estado: 'COMPLETADO',
            resultado: { id: 101, estado: 'confirmada' },
          }),
      });
    global.fetch = fetchMock;

    const res = await pollJobStatus('/api/v1/espacios-comunes/jobs/ticket-123', {
      intervalMs: 10,
    });

    expect(res).toEqual({ id: 101, estado: 'confirmada' });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('debe arrojar error cuando el job pasa a estado FALLIDO', async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          estado: 'FALLIDO',
          error: {
            codigo: 'CONFLICTO_SOLAPAMIENTO',
            mensaje: 'Horario ocupado',
          },
        }),
    });
    global.fetch = fetchMock;

    await expect(
      pollJobStatus('/api/v1/espacios-comunes/jobs/ticket-456', {
        intervalMs: 10,
      }),
    ).rejects.toThrow('Horario ocupado');
  });

  it('debe arrojar error por maxAttempts alcanzado', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ estado: 'PROCESANDO' }),
    });
    global.fetch = fetchMock;

    await expect(
      pollJobStatus('/api/v1/espacios-comunes/jobs/ticket-999', {
        intervalMs: 5,
        maxAttempts: 3,
      }),
    ).rejects.toThrow('Tiempo de espera agotado');
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });
});
