import type { Role } from "../../types";

interface VisitasHeaderProps {
  role: Role;
  showingResidente: boolean;
  onOpenPreRegistro: () => void;
}

export function VisitasHeader({ role, showingResidente, onOpenPreRegistro }: VisitasHeaderProps) {
  const subtitle =
    role === "residente"
      ? "Pre-registra y gestiona las visitas a tu unidad"
      : role === "conserje"
        ? "Valida accesos y registra entradas y salidas"
        : "Gestión completa de visitas del condominio";

  return (
    <header className="bg-text px-4 pt-8 pb-6">
      <div className="max-w-2xl mx-auto flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl text-white">Visitas</h1>
          <p className="text-white/60 mt-1 text-sm">{subtitle}</p>
        </div>
        {showingResidente && role !== "conserje" && (
          <button
            onClick={onOpenPreRegistro}
            className="bg-primary text-white rounded-xl px-4 py-2.5 font-semibold text-sm hover:opacity-90 transition-opacity whitespace-nowrap mt-1"
            data-cuelume-press="tick"
          >
            + Registrar visita
          </button>
        )}
      </div>
    </header>
  );
}
