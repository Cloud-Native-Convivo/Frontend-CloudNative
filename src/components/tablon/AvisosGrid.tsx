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

const badgeClasses: Record<BadgeKey, { border: string; label: string }> = {
  critico: {
    border: "border-l-[#E11D48]",
    label: "bg-[#FFF1F2] text-[#E11D48]",
  },
  aviso: {
    border: "border-l-[#D97706]",
    label: "bg-[#FEF3C7] text-[#92400E]",
  },
  actividad: {
    border: "border-l-[#0D9488]",
    label: "bg-[#CCFBF1] text-[#005047]",
  },
  residente: {
    border: "border-l-[#2563EB]",
    label: "bg-[#EFF6FF] text-[#1E40AF]",
  },
  primary: {
    border: "border-l-[#0D9488]",
    label: "bg-[#CCFBF1] text-[#005047]",
  },
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
            className={`bg-surface border border-border border-l-4 ${bc.border} rounded-2xl overflow-hidden transition-[box-shadow,transform] duration-200 hover:shadow-lg hover:-translate-y-0.5`}
          >
            <div className="px-[22px] pt-[22px]">
              <div className="flex justify-between items-center mb-3">
                <span
                  className={`text-[11px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full ${bc.label}`}
                >
                  {a.tipo}
                </span>
                <span className="text-[12px] text-text-muted">{a.fecha}</span>
              </div>
              <h3 className="font-display text-[17px] text-[#00201B] m-0 mb-2.5 font-normal leading-[1.3]">
                {a.titulo}
              </h3>
              <p className="text-[13px] text-text-muted leading-[1.65] m-0 mb-4">{a.desc}</p>
              <div className="flex items-center gap-1.5 text-[12px] text-text-muted mb-4">
                <IconBell className="w-3 h-3" /> Publicado por:{" "}
                <strong className="text-text-muted font-bold">{a.autor}</strong>
              </div>
            </div>
            {a.confirmacion && (
              <div className="border-t border-[#F1F5F9] px-[22px] py-[14px] flex justify-between items-center">
                <div className="flex items-center gap-1.5 text-[12px] text-text-muted">
                  <IconUsers className="w-[13px] h-[13px]" />
                  {a.confirmados + (yaConfirmado ? 1 : 0)} confirmados
                </div>
                <button
                  onClick={() => onToggleConfirm(idx)}
                  className={`flex items-center gap-1.5 text-[12px] font-semibold px-3.5 py-[7px] rounded-lg border cursor-pointer transition-colors duration-150 ${
                    yaConfirmado
                      ? "border-[#0D9488] bg-[#F0FDFA] text-[#0D9488]"
                      : "border-border bg-white text-text-muted hover:border-[#0D9488]"
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
