import { IconDownload } from "../icons/Icons";

export interface HistorialEntry {
  mes: string;
  total: string;
  estado: string;
  /** Clase del indicador de estado (un `bg-*`): el estado siempre va además como texto. */
  colorClass: string;
}

interface HistorialPagosTableProps {
  historial: HistorialEntry[];
  onDescargarPdf?: (mes?: string) => void;
}

export function HistorialPagosTable({ historial, onDescargarPdf }: HistorialPagosTableProps) {
  return (
    <section aria-labelledby="historial-titulo">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h3
          id="historial-titulo"
          className="m-0 font-display text-[clamp(28px,3.5vw,40px)] font-normal text-text"
        >
          Historial de pagos
        </h3>
        {historial.length > 0 && (
          <button
            type="button"
            onClick={() => onDescargarPdf?.()}
            className="btn btn-secondary btn-sm"
          >
            <IconDownload className="h-4 w-4" /> Exportar PDF
          </button>
        )}
      </div>
      {historial.length === 0 ? (
        <p className="m-0 mt-6 text-base text-muted">Sin pagos registrados.</p>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-max border-collapse">
            <thead>
              <tr className="border-b-2 border-text">
                {["Período", "Total", "Estado", "Acciones"].map((h) => (
                  <th
                    key={h}
                    className={`${h === "Total" ? "text-right" : "text-left"} ${h === "Estado" ? "pl-8" : ""} pb-3 text-sm font-semibold text-muted`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {historial.map((row) => (
                <tr key={row.mes} className="border-b border-border">
                  <td className="py-5 pr-6 font-display text-xl text-text">{row.mes}</td>
                  <td className="py-5 text-right text-lg font-semibold tabular-nums text-text">
                    {row.total}
                  </td>
                  <td className="py-5 pl-8">
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-text">
                      <span
                        aria-hidden="true"
                        className={`h-2 w-2 rounded-full ${row.colorClass}`}
                      />
                      {row.estado}
                    </span>
                  </td>
                  <td className="py-5">
                    <button
                      type="button"
                      onClick={() => onDescargarPdf?.(row.mes)}
                      className="min-h-11 cursor-pointer border-none bg-transparent p-0 text-sm font-semibold text-accent underline underline-offset-4 hover:text-text"
                    >
                      Ver comprobante<span className="sr-only"> de {row.mes}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
