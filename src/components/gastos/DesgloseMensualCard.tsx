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
    <div className="bg-white border border-slate-200 rounded-2xl p-7">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-serif text-[20px] text-[#00201B] m-0 font-normal">Desglose mensual</h3>
        <select
          aria-label="Filtrar por mes"
          value={selectedMes}
          onChange={(e) => onSelectMes(e.target.value)}
          className="text-[13px] border border-slate-200 rounded-lg py-[7px] px-3 text-[#00201B] bg-white outline-none"
        >
          {meses.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-[18px]">
        {gastos.map((g) => (
          <div key={g.item}>
            <div className="flex justify-between mb-1.5">
              <span className="text-[13px] text-[#00201B] font-medium">{g.item}</span>
              <span className="text-[13px] font-bold text-[#00201B]">{g.mensual}</span>
            </div>
            <div className="bg-slate-100 rounded-[4px] h-[7px]">
              <div
                className="h-full rounded-[4px]"
                style={{ width: `${g.pct}%`, backgroundColor: g.color }}
              />
            </div>
            <div className="text-[11px] text-slate-400 mt-[3px]">
              {g.pct}% del total · Anual: {g.anual}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-[18px] border-t border-slate-200 flex justify-between">
        <span className="text-[14px] text-slate-500 font-medium">Total mensual</span>
        <span className="font-serif text-[20px] text-[#00201B]">$600.000 CLP</span>
      </div>
    </div>
  );
}
