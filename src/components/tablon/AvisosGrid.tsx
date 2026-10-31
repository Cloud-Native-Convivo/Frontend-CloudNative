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
            className={`bg-surface border border-border rounded-lg overflow-hidden transition-[box-shadow,transform] duration-200 hover:shadow-lg hover:-translate-y-0.5`}
          >
            <div className="px-6 pt-6">
              <div className="flex justify-between items-center mb-3">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${bc}`}>{a.tipo}</span>
                <span className="text-xs text-text-muted">{a.fecha}</span>
              </div>
              <h3 className="font-display text-lg text-text m-0 mb-3 font-normal leading-[1.3]">
                {a.titulo}
              </h3>
              <p className="text-sm text-text-muted leading-[1.65] m-0 mb-4">{a.desc}</p>
              <div className="flex items-center gap-2 text-xs text-text-muted mb-4">
                <IconBell className="w-3 h-3" /> Publicado por:{" "}
                <strong className="text-text-muted font-bold">{a.autor}</strong>
              </div>
            </div>
            {a.confirmacion && (
              <div className="border-t border-slate-100 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <IconUsers className="w-[13px] h-[13px]" />
                  {a.confirmados + (yaConfirmado ? 1 : 0)} confirmados
                </div>
                <button
                  onClick={() => onToggleConfirm(idx)}
                  className={`flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-md border cursor-pointer transition-colors duration-150 ${
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
