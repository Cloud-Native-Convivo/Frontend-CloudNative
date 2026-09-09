import type { Visita } from "./types";
import { QRCode } from "./QRCode";

interface QRModalProps {
  visita: Visita;
  onClose: () => void;
}

export function QRModal({ visita, onClose }: QRModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 flex flex-col items-center gap-4">
        <h2 className="font-display text-2xl text-text">Código de acceso</h2>
        <p className="text-muted text-sm text-center">
          {visita.nombre} · {visita.fechaDisplay} · {visita.hora}
        </p>
        <div className="border-4 border-text rounded-xl p-2">
          <QRCode code={visita.codigo} size={200} />
        </div>
        <p className="font-mono text-lg font-bold text-text tracking-widest">{visita.codigo}</p>
        <p className="text-muted text-xs text-center">
          Comparte este código con tu visita. La conserjería lo validará en el acceso.
        </p>
        <div className="flex gap-3 w-full mt-2">
          <button
            onClick={onClose}
            className="flex-1 border border-border rounded-lg py-2 text-text font-semibold hover:bg-gray-50 transition-colors"
          >
            Descargar
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-primary text-white rounded-lg py-2 font-semibold hover:opacity-90 transition-opacity"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
