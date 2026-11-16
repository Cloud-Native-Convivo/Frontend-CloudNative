import { IconCheck } from "../icons/Icons";

interface SituacionResidenteCardProps {
  estado: "cargando" | "error" | "listo";
  monto?: number;
  vencimiento?: string | null;
}

// El backend entrega fechas ISO (AAAA-MM-DD); en pantalla se leen como DD/MM/AAAA.
function fechaLegible(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : iso;
}

/**
 * Bloque derecho de la portada: el saldo es lo único que el residente vino a ver,
 * por eso es la pieza más grande de la página (Gloock a escala de portada).
 */
export function SituacionResidenteCard({
  estado,
  monto = 0,
  vencimiento = null,
}: SituacionResidenteCardProps) {
  const isAlDia = monto === 0;

  return (
    <section
      aria-labelledby="situacion-titulo"
      className="border-t-2 border-dashed border-white/30 pt-8 lg:border-l-2 lg:border-t-0 lg:pl-12 lg:pt-0"
    >
      <h2 id="situacion-titulo" className="m-0 text-sm font-normal text-white/70">
        Saldo pendiente
      </h2>

      {estado === "cargando" && (
        <p className="m-0 mt-3 text-lg text-white/70">Cargando tu situación de pago…</p>
      )}

      {estado === "error" && (
        <p role="alert" className="m-0 mt-3 text-lg font-semibold text-white">
          No pudimos cargar tu situación de pago. Intenta más tarde.
        </p>
      )}

      {estado === "listo" && (
        <>
          <p className="m-0 mt-3 font-display text-[clamp(56px,8vw,112px)] leading-none tabular-nums text-white">
            <span className="text-primary-on-dark">$</span>
            {monto.toLocaleString("es-CL")}
          </p>
          <p className="m-0 mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-lg">
            {isAlDia ? (
              <span className="inline-flex items-center gap-2 font-semibold text-primary-on-dark">
                <IconCheck className="h-5 w-5" /> Al día
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 font-semibold text-alert-yellow">
                <span aria-hidden="true" className="h-3 w-3 rounded-full bg-alert-yellow" />
                Pago pendiente
              </span>
            )}
            <span className="text-white/70">
              CLP{vencimiento ? ` · Vence ${fechaLegible(vencimiento)}` : ""}
            </span>
          </p>
        </>
      )}
    </section>
  );
}
