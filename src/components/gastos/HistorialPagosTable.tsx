import { IconDownload } from "../icons/Icons";

export interface HistorialEntry {
  mes: string;
  total: string;
  estado: string;
  colorClass: string;
}

interface HistorialPagosTableProps {
  historial: HistorialEntry[];
}

export function HistorialPagosTable({ historial }: HistorialPagosTableProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-7">
      <div className="flex justify-between items-center mb-5">
        <h3 className="font-serif text-[20px] text-[#00201B] m-0 font-normal">
          Historial de pagos
        </h3>
        <button className="flex items-center gap-1.5 text-[13px] font-semibold text-teal-600 bg-transparent border border-teal-600 rounded-lg py-2 px-3.5 cursor-pointer hover:bg-teal-50 transition-colors">
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
                  className="text-left pb-3 text-[11px] font-bold text-slate-400 uppercase tracking-[0.08em]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {historial.map((row) => (
              <tr key={row.mes} className="border-b border-slate-100 hover:bg-slate-50/60">
                <td className="py-3.5 text-[14px] font-semibold text-[#00201B]">{row.mes}</td>
                <td className="py-3.5 text-[14px] text-slate-600">{row.total}</td>
                <td className="py-3.5">
                  <span
                    className={`text-[12px] font-bold px-2.5 py-1 rounded-full ${row.colorClass}`}
                  >
                    {row.estado}
                  </span>
                </td>
                <td className="py-3.5">
                  <button className="text-teal-600 hover:underline bg-transparent border-none text-[13px] font-semibold cursor-pointer p-0">
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
