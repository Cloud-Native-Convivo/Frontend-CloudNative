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
    <div className="bg-white border border-slate-200 rounded-2xl p-7 mb-7">
      <div className="flex justify-between items-start flex-wrap gap-5">
        <div>
          <p className="text-[12px] text-slate-400 font-semibold uppercase tracking-[0.08em] mb-1">
            {unidad}
          </p>
          <h2 className="font-serif text-[28px] text-[#00201B] mb-2 font-normal">Mi situación</h2>
          {estado === "cargando" && (
            <p className="text-[14px] text-slate-400">Cargando tu situación de pago…</p>
          )}
          {estado === "error" && (
            <p className="text-[14px] text-red-600 font-semibold">
              No pudimos cargar tu situación de pago. Intenta más tarde.
            </p>
          )}
          {estado === "listo" && (
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${isAlDia ? "bg-teal-600" : "bg-yellow-500"}`}
              />
              <span
                className={`text-[14px] font-semibold ${isAlDia ? "text-teal-600" : "text-yellow-500"}`}
              >
                {isAlDia ? "Al día" : "Pago pendiente"}
              </span>
            </div>
          )}
        </div>
        {estado === "listo" && (
          <div className="flex gap-4 flex-wrap items-center">
            <div className="text-right">
              <div className="text-[12px] text-slate-400 mb-0.5">Saldo pendiente</div>
              <div className="font-serif text-[32px] text-[#00201B]">
                ${monto.toLocaleString("es-CL")}
              </div>
              <div className="text-[12px] text-[#94A3B8]">
                CLP {vencimiento ? `· Vence ${vencimiento}` : ""}
              </div>
            </div>
            {!isAlDia && (
              <button
                onClick={onPay}
                className="bg-teal-600 hover:bg-teal-800 text-white border-none rounded-xl px-6 py-[13px] text-[14px] font-bold cursor-pointer flex items-center gap-2 transition-colors duration-200"
              >
                <IconDollar className="w-[16px] h-[16px]" /> Pagar ahora
              </button>
            )}
            {isAlDia && (
              <div className="flex items-center gap-2 text-teal-600 font-semibold text-[14px]">
                <IconCheck className="w-[18px] h-[18px]" /> Al día
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
