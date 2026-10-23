import { IconDollar, IconCheck } from "../icons/Icons";

interface SituacionResidenteCardProps {
  estado: "cargando" | "error" | "listo";
  paid: boolean;
  onPay: () => void;
  unidad?: string;
  monto?: number;
  vencimiento?: string | null;
}

export function SituacionResidenteCard({
  estado,
  paid,
  onPay,
  unidad = "Mi unidad",
  monto = 0,
  vencimiento = null,
}: SituacionResidenteCardProps) {
  const isAlDia = paid || monto === 0;

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-7 mb-7">
      <div className="flex justify-between items-start flex-wrap gap-5">
        <div>
          <p className="text-xs text-slate-400 font-semibold tracking-wide mb-1">{unidad}</p>
          <h2 className="font-serif text-[28px] text-text mb-2 font-normal">Mi situación</h2>
          {estado === "cargando" && (
            <p className="text-sm text-slate-400">Cargando tu situación de pago…</p>
          )}
          {estado === "error" && (
            <p className="text-sm text-red-600 font-semibold">
              No pudimos cargar tu situación de pago. Intenta más tarde.
            </p>
          )}
          {estado === "listo" && (
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${isAlDia ? "bg-teal-600" : "bg-yellow-500"}`}
              />
              <span
                className={`text-sm font-semibold ${isAlDia ? "text-teal-600" : "text-yellow-500"}`}
              >
                {isAlDia ? "Al día" : "Pago pendiente"}
              </span>
            </div>
          )}
        </div>
        {estado === "listo" && (
          <div className="flex gap-4 flex-wrap items-center">
            <div className="text-right">
              <div className="text-xs text-slate-400 mb-1">Saldo pendiente</div>
              <div className="font-serif text-[32px] text-text">
                ${monto.toLocaleString("es-CL")}
              </div>
              <div className="text-xs text-slate-400">
                CLP {vencimiento ? `· Vence ${vencimiento}` : ""}
              </div>
            </div>
            {!isAlDia && (
              <button onClick={onPay} className="btn btn-primary">
                <IconDollar className="w-[16px] h-[16px]" /> Pagar ahora
              </button>
            )}
            {isAlDia && (
              <div className="flex items-center gap-2 text-teal-600 font-semibold text-sm">
                <IconCheck className="w-[18px] h-[18px]" /> Al día
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
