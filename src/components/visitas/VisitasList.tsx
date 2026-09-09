import type { Visita } from "./types";
import { VisitaCard } from "./VisitaCard";

interface VisitasListProps {
  visitas: Visita[];
  onVerQR: (v: Visita) => void;
}

export function VisitasList({ visitas, onVerQR }: VisitasListProps) {
  if (visitas.length === 0) {
    return (
      <div className="text-center py-16 text-muted">
        <p className="text-lg font-semibold">Sin visitas registradas</p>
        <p className="text-sm mt-1">Registra tu primera visita con el botón de arriba.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {visitas.map((v) => (
        <VisitaCard key={v.id} visita={v} onVerQR={onVerQR} />
      ))}
    </div>
  );
}
