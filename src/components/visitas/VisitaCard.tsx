import type { Visita } from "./types";
import { StatusBadge } from "./StatusBadge";

interface VisitaCardProps {
  visita: Visita;
  onVerQR: (v: Visita) => void;
}

export function VisitaCard({ visita, onVerQR }: VisitaCardProps) {
  return (
    <div className="bg-white rounded-xl border border-border p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-text">{visita.nombre}</p>
          {visita.documento && <p className="text-muted text-sm">{visita.documento}</p>}
        </div>
        <StatusBadge estado={visita.estado} />
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
        <span>📅 {visita.fechaDisplay}</span>
        <span>🕐 {visita.hora}</span>
        <span>📋 {visita.motivo}</span>
      </div>
      {(visita.estado === "pendiente_qr" || visita.estado === "confirmada") && (
        <button
          onClick={() => onVerQR(visita)}
          className="self-start text-sm font-semibold text-primary border border-primary/30 rounded-lg px-3 py-1.5 hover:bg-primary/5 transition-colors"
        >
          Ver QR
        </button>
      )}
    </div>
  );
}
