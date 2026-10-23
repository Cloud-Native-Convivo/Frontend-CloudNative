import { IconDownload } from "../icons/Icons";

export interface HistorialEntry {
  mes: string;
  total: string;
  estado: string;
  colorClass: string;
}

interface HistorialPagosTableProps {
  historial: HistorialEntry[];
  onDescargarPdf?: (mes?: string) => void;
}

export function HistorialPagosTable({ historial, onDescargarPdf }: HistorialPagosTableProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-7">
      <div className="flex justify-between items-center mb-5">
        <h3 className="font-serif text-xl text-text m-0 font-normal">Historial de pagos</h3>
        <button
          type="button"
          onClick={() => onDescargarPdf?.()}
          className="btn btn-secondary btn-sm"
        >
          <IconDownload className="w-[14px] h-[14px]" /> Exportar PDF
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-max border-collapse">
          <thead>
            <tr className="border-b border-slate-200">
              {["Período", "Total", "Estado", "Acciones"].map((h) => (
                <th
                  key={h}
                  className={`${h === "Total" ? "text-right" : "text-left"} pb-3 text-xs font-bold text-slate-400 tracking-wide`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {historial.map((row) => (
              <tr key={row.mes} className="border-b border-slate-100 hover:bg-slate-50/60">
                <td className="py-4 text-sm font-semibold text-text">{row.mes}</td>
                <td className="py-4 text-sm text-slate-600 text-right tabular-nums">{row.total}</td>
                <td className="py-4">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${row.colorClass}`}>
                    {row.estado}
                  </span>
                </td>
                <td className="py-4">
                  <button
                    type="button"
                    onClick={() => onDescargarPdf?.(row.mes)}
                    className="text-teal-600 hover:underline bg-transparent border-none text-sm font-semibold cursor-pointer p-0"
                  >
                    Ver comprobante
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
