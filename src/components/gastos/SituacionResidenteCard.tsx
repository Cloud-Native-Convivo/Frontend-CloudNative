import { IconCheck } from "../icons/Icons";

interface SituacionResidenteCardProps {
  estado: "cargando" | "error" | "listo";
  unidad?: string;
  monto?: number;
  vencimiento?: string | null;
}

// El backend entrega fechas ISO (AAAA-MM-DD); en pantalla se leen como DD/MM/AAAA.
function fechaLegible(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : iso;
}

/**
 * Cabecera del estado de cuenta: el saldo es lo único que el residente vino a ver,
 * por eso es la pieza más grande de la página (Gloock a escala de portada).
 */
export function SituacionResidenteCard({
  estado,
  unidad = "Mi unidad",
  monto = 0,
  vencimiento = null,
}: SituacionResidenteCardProps) {
  const isAlDia = monto === 0;

  return (
    <section aria-labelledby="situacion-titulo" className="mt-10">
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <h2 id="situacion-titulo" className="m-0 text-base font-semibold text-white/80">
          Mi situación
        </h2>
        <span className="text-sm text-primary-on-dark">{unidad}</span>
      </div>

      {estado === "cargando" && (
        <p className="mt-6 text-lg text-white/70">Cargando tu situación de pago…</p>
      )}

      {estado === "error" && (
        <p role="alert" className="mt-6 text-lg font-semibold text-white">
          No pudimos cargar tu situación de pago. Intenta más tarde.
        </p>
      )}

      {estado === "listo" && (
        <>
          <p className="mt-8 mb-0 text-sm text-white/70">Saldo pendiente</p>
          <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-4">
            <p className="m-0 font-display text-[clamp(72px,14vw,176px)] leading-none tabular-nums text-white">
              <span className="text-primary-on-dark">$</span>
              {monto.toLocaleString("es-CL")}
            </p>
            <div className="flex flex-col gap-2 pb-2 text-base md:items-end">
              {isAlDia ? (
                <span className="inline-flex items-center gap-2 text-xl font-semibold text-primary-on-dark">
                  <IconCheck className="h-6 w-6" /> Al día
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 text-xl font-semibold text-alert-yellow">
                  <span aria-hidden="true" className="h-3 w-3 rounded-full bg-alert-yellow" />
                  Pago pendiente
                </span>
              )}
              <span className="text-white/70">
                CLP{vencimiento ? ` · Vence ${fechaLegible(vencimiento)}` : ""}
              </span>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
