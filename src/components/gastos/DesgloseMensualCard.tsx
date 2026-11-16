/* eslint-disable react/forbid-dom-props */
import type { PeriodoGastos } from "../../utils/gastosResumen";

export interface GastoItem {
  item: string;
  monto: string;
  pct: number;
  color: string;
}

interface DesgloseMensualCardProps {
  periodos: PeriodoGastos[];
  selectedClave: string;
  onSelectPeriodo: (clave: string) => void;
  gastos: GastoItem[];
  total: string;
}

/**
 * La boleta del mes: una tira proporcional donde cada tramo es un concepto, el detalle
 * en filas y el total al pie, separado por una línea de corte como en un comprobante impreso.
 */
export function DesgloseMensualCard({
  periodos,
  selectedClave,
  onSelectPeriodo,
  gastos,
  total,
}: DesgloseMensualCardProps) {
  return (
    <section
      aria-labelledby="desglose-titulo"
      className="relative rounded-md bg-white p-8 shadow-md"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h3 id="desglose-titulo" className="m-0 font-display text-2xl font-normal text-text">
          Desglose mensual
        </h3>
        {periodos.length > 0 && (
          <select
            aria-label="Filtrar por mes"
            value={selectedClave}
            onChange={(e) => onSelectPeriodo(e.target.value)}
            className="min-h-11 cursor-pointer rounded-sm border border-muted bg-white px-3 text-sm text-text"
          >
            {periodos.map((p) => (
              <option key={p.clave} value={p.clave}>
                {p.etiqueta}
              </option>
            ))}
          </select>
        )}
      </div>

      {periodos.length === 0 ? (
        <p className="m-0 mt-6 text-base text-muted">Sin gastos registrados.</p>
      ) : (
        <>
          <div aria-hidden="true" className="mt-8 flex h-16 gap-1">
            {gastos.map((g) => (
              <div
                key={g.item}
                className={`rounded-sm ${g.color}`}
                style={{ flexGrow: g.pct, flexBasis: 0 }}
              />
            ))}
          </div>

          <ul className="m-0 mt-6 list-none p-0">
            {gastos.map((g) => (
              <li
                key={g.item}
                className="grid grid-cols-[12px_1fr_auto] items-start gap-x-4 border-b border-dotted border-muted py-3 last:border-b-0"
              >
                <span aria-hidden="true" className={`mt-2 h-3 w-3 rounded-sm ${g.color}`} />
                <div>
                  <span className="block text-base font-medium text-text">{g.item}</span>
                  <span className="block text-sm text-muted">{g.pct}% del total</span>
                </div>
                <span className="text-lg font-semibold tabular-nums text-text">{g.monto}</span>
              </li>
            ))}
          </ul>

          <div aria-hidden="true" className="relative -mx-8 my-6">
            <div className="border-t-2 border-dashed border-muted" />
            <span className="absolute -left-3 -top-3 h-6 w-6 rounded-full bg-slate-50" />
            <span className="absolute -right-3 -top-3 h-6 w-6 rounded-full bg-slate-50" />
          </div>

          <div className="flex flex-wrap items-end justify-between gap-2">
            <span className="text-base font-medium text-muted">Total mensual</span>
            <span className="font-display text-4xl tabular-nums text-text">
              {total} <span className="font-body text-sm text-muted">CLP</span>
            </span>
          </div>
        </>
      )}
    </section>
  );
}
