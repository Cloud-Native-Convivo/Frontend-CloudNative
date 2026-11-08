import type { Role } from "../../types";

interface VisitasHeaderProps {
  role: Role | null;
}

export function VisitasHeader({ role }: VisitasHeaderProps) {
  const subtitle =
    role === "residente"
      ? "Visitas a tu unidad"
      : role === "conserje"
        ? "Accesos y visitas del condominio"
        : "Visitas del condominio";

  return (
    <header className="bg-text px-4 pt-8 pb-6">
      <div className="max-w-content mx-auto">
        <h1 className="font-display text-4xl text-white">Visitas</h1>
        <p className="text-white/60 mt-1 text-sm">{subtitle}</p>
      </div>
    </header>
  );
}
