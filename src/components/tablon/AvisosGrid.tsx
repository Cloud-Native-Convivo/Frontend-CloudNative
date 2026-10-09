import { IconBell, IconUsers, IconCheck } from "../icons/Icons";

export interface AvisoItem {
  tipo: string;
  badge: string;
  fecha: string;
  titulo: string;
  desc: string;
  autor: string;
  confirmacion: boolean;
  confirmados: number;
}

export type BadgeKey = "critico" | "aviso" | "actividad" | "residente" | "primary";

const badgeClasses: Record<BadgeKey, string> = {
  critico: "bg-rose-50 text-alert-red",
  aviso: "bg-amber-100 text-amber-800",
  actividad: "bg-teal-100 text-accent",
  residente: "bg-blue-50 text-blue-800",
  primary: "bg-teal-100 text-accent",
};

interface AvisosGridProps {
  filteredAvisos: AvisoItem[];
  allAvisos: AvisoItem[];
  confirmados: Record<number, boolean>;
  onToggleConfirm: (index: number) => void;
}

export function AvisosGrid({
  filteredAvisos,
  allAvisos,
  confirmados,
  onToggleConfirm,
}: AvisosGridProps) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(340px,1fr))] gap-5">
      {filteredAvisos.map((a) => {
        const idx = allAvisos.indexOf(a);
        const yaConfirmado = confirmados[idx];
        const bc = badgeClasses[a.badge as BadgeKey] ?? badgeClasses.primary;
        return (
          <div
            key={a.titulo}
            className={`bg-surface border border-border rounded-2xl overflow-hidden transition-[box-shadow,transform] duration-200 hover:shadow-lg hover:-translate-y-0.5`}
          >
            <div className="px-[22px] pt-[22px]">
              <div className="flex justify-between items-center mb-3">
                <span className={`text-[12px] font-bold px-2.5 py-1 rounded-full ${bc}`}>
                  {a.tipo}
                </span>
                <span className="text-[12px] text-text-muted">{a.fecha}</span>
              </div>
              <h3 className="font-display text-[17px] text-text m-0 mb-2.5 font-normal leading-[1.3]">
                {a.titulo}
              </h3>
              <p className="text-[13px] text-text-muted leading-[1.65] m-0 mb-4">{a.desc}</p>
              <div className="flex items-center gap-1.5 text-[12px] text-text-muted mb-4">
                <IconBell className="w-3 h-3" /> Publicado por:{" "}
                <strong className="text-text-muted font-bold">{a.autor}</strong>
              </div>
            </div>
            {a.confirmacion && (
              <div className="border-t border-slate-100 px-[22px] py-[14px] flex justify-between items-center">
                <div className="flex items-center gap-1.5 text-[12px] text-text-muted">
                  <IconUsers className="w-[13px] h-[13px]" />
                  {a.confirmados + (yaConfirmado ? 1 : 0)} confirmados
                </div>
                <button
                  onClick={() => onToggleConfirm(idx)}
                  className={`flex items-center gap-1.5 text-[12px] font-semibold px-3.5 py-[7px] rounded-lg border cursor-pointer transition-colors duration-150 ${
                    yaConfirmado
                      ? "border-primary bg-teal-50 text-primary"
                      : "border-border bg-white text-text-muted hover:border-primary"
                  }`}
                >
                  <IconCheck className="w-3 h-3" />
                  {yaConfirmado ? "Confirmado" : "Confirmar asistencia"}
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
