export interface PollOptions {
  maxAttempts?: number;
  intervalMs?: number;
  headers?: Record<string, string>;
}

export interface JobResponse<T = unknown> {
  ticket_id: string;
  modulo?: string;
  accion?: string;
  estado: 'EN_COLA' | 'PROCESANDO' | 'COMPLETADO' | 'FALLIDO';
  resultado?: T;
  error?:
    | {
        codigo?: string;
        mensaje?: string;
        status_code?: number;
        [key: string]: unknown;
      }
    | string;
  creado_en?: string;
  actualizado_en?: string;
}

export async function pollJobStatus<T = unknown>(
  statusUrl: string,
  options: PollOptions = {},
): Promise<T> {
  const { maxAttempts = 30, intervalMs = 1000, headers = {} } = options;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const res = await fetch(statusUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        ...headers,
      },
    });

    if (!res.ok && res.status !== 404) {
      throw new Error(
        `Error consultando estado del job: ${res.statusText} (${res.status})`,
      );
    }

    if (res.ok) {
      const data: JobResponse<T> = await res.json();

      if (data.estado === 'COMPLETADO') {
        return data.resultado as T;
      }

      if (data.estado === 'FALLIDO') {
        const errorMsg =
          typeof data.error === 'string'
            ? data.error
            : data.error?.mensaje ||
              data.error?.codigo ||
              'Operación asíncrona fallida';
        throw new Error(errorMsg);
      }
    }

    if (attempt < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }
  }

  throw new Error(
    `Tiempo de espera agotado al consultar el job (${maxAttempts} intentos)`,
  );
}
