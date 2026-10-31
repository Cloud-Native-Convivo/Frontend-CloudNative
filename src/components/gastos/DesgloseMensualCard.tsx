/* eslint-disable react/forbid-dom-props */
export interface GastoItem {
  item: string;
  mensual: string;
  anual: string;
  pct: number;
  color: string;
}

interface DesgloseMensualCardProps {
  selectedMes: string;
  onSelectMes: (mes: string) => void;
  meses: string[];
  gastos: GastoItem[];
}

export function DesgloseMensualCard({
  selectedMes,
  onSelectMes,
  meses,
  gastos,
}: DesgloseMensualCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-7">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-serif text-xl text-text m-0 font-normal">Desglose mensual</h3>
        <select
          aria-label="Filtrar por mes"
          value={selectedMes}
          onChange={(e) => onSelectMes(e.target.value)}
          className="text-sm border border-slate-200 rounded-md py-2 px-3 text-text bg-white outline-none"
        >
          {meses.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-5">
        {gastos.map((g) => (
          <div key={g.item}>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-text font-medium">{g.item}</span>
              <span className="text-sm font-bold text-text">{g.mensual}</span>
            </div>
            <div className="bg-slate-100 rounded-sm h-[7px]">
              <div className={`h-full rounded-sm ${g.color}`} style={{ width: `${g.pct}%` }} />
            </div>
            <div className="text-xs text-slate-400 mt-1">
              {g.pct}% del total · Anual: {g.anual}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-5 border-t border-slate-200 flex justify-between">
        <span className="text-sm text-slate-500 font-medium">Total mensual</span>
        <span className="font-serif text-xl text-text">$600.000 CLP</span>
      </div>
    </div>
  );
}
