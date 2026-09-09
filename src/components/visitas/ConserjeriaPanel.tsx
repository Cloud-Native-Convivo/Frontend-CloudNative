import { useState } from "react";
import type { Visita, EstadoVisita, LogEntry } from "./types";
import { StatusBadge } from "./StatusBadge";

interface ConserjeriaPanelProps {
  visitas: Visita[];
  onUpdateEstado: (id: string, estado: EstadoVisita) => void;
}

const LOG_ENTRIES: LogEntry[] = [
  {
    hora: "08:32",
    visitante: "María González",
    unidad: "Torre B · 304",
    accion: "Entrada",
    estado: "en_progreso",
  },
  {
    hora: "09:15",
    visitante: "Delivery Cornershop",
    unidad: "Torre A · 802",
    accion: "Entrada",
    estado: "completada",
  },
  {
    hora: "09:47",
    visitante: "Delivery Cornershop",
    unidad: "Torre A · 802",
    accion: "Salida",
    estado: "completada",
  },
  {
    hora: "10:03",
    visitante: "Pedro Soto",
    unidad: "Torre C · 101",
    accion: "Entrada",
    estado: "en_progreso",
  },
  {
    hora: "11:22",
    visitante: "Técnico VTR",
    unidad: "Torre A · 1204",
    accion: "Entrada",
    estado: "en_progreso",
  },
];

function RechazoModal({
  onConfirm,
  onCancel,
}: {
  onConfirm: (motivo: string) => void;
  onCancel: () => void;
}) {
  const [motivo, setMotivo] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 flex flex-col gap-4">
        <h3 className="font-display text-xl text-text">Motivo de rechazo</h3>
        <textarea
          aria-label="Motivo de rechazo"
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          rows={3}
          required
          className="w-full rounded-lg border border-border px-3 py-2 text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-alert-red/40 resize-none"
          placeholder="Describe el motivo del rechazo..."
        />
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 border border-border rounded-lg py-2 text-text font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => motivo.trim() && onConfirm(motivo)}
            disabled={!motivo.trim()}
            className="flex-1 bg-alert-red text-white rounded-lg py-2 font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            Confirmar rechazo
          </button>
        </div>
      </div>
    </div>
  );
}

export function ConserjeriaPanel({ visitas, onUpdateEstado }: ConserjeriaPanelProps) {
  const [searchCode, setSearchCode] = useState("");
  const [foundVisita, setFoundVisita] = useState<Visita | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [showRechazo, setShowRechazo] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const code = searchCode.trim().toUpperCase();
    const match = visitas.find((v) => v.codigo === code);
    if (match) {
      setFoundVisita(match);
      setNotFound(false);
    } else {
      setFoundVisita(null);
      setNotFound(true);
    }
  };

  const currentFound = foundVisita ? (visitas.find((v) => v.id === foundVisita.id) ?? null) : null;

  const handleEntrada = () => {
    if (currentFound) {
      onUpdateEstado(currentFound.id, "en_progreso");
      setFoundVisita({ ...currentFound, estado: "en_progreso" });
    }
  };

  const handleSalida = () => {
    if (currentFound) {
      onUpdateEstado(currentFound.id, "completada");
      setFoundVisita({ ...currentFound, estado: "completada" });
    }
  };

  const handleRechazo = (_motivo: string) => {
    if (currentFound) {
      onUpdateEstado(currentFound.id, "rechazada");
      setFoundVisita({ ...currentFound, estado: "rechazada" });
    }
    setShowRechazo(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="max-w-md mx-auto w-full bg-white rounded-2xl border border-border p-6 flex flex-col gap-4">
        <h2 className="font-display text-2xl text-text">Validar acceso</h2>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            aria-label="Código de acceso"
            value={searchCode}
            onChange={(e) => {
              setSearchCode(e.target.value);
              setNotFound(false);
            }}
            placeholder="CONV-VIS-..."
            className="flex-1 rounded-lg border border-border px-3 py-2 text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 font-mono text-sm"
          />
          <button
            type="submit"
            className="bg-primary text-white rounded-lg px-4 py-2 font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            Buscar
          </button>
        </form>

        {notFound && (
          <div className="rounded-lg bg-red-50 border border-alert-red/20 px-4 py-3 text-alert-red text-sm font-medium">
            Código no encontrado. Verifica con el residente.
          </div>
        )}

        {currentFound && (
          <div className="flex flex-col gap-4 pt-2 border-t border-border">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-text text-lg">{currentFound.nombre}</p>
                {currentFound.documento && (
                  <p className="text-muted text-sm">{currentFound.documento}</p>
                )}
              </div>
              <StatusBadge estado={currentFound.estado} />
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-muted text-xs uppercase tracking-wide">Unidad</p>
                <p className="text-text font-medium">{currentFound.unidad}</p>
              </div>
              <div>
                <p className="text-muted text-xs uppercase tracking-wide">Fecha</p>
                <p className="text-text font-medium">{currentFound.fechaDisplay}</p>
              </div>
              <div>
                <p className="text-muted text-xs uppercase tracking-wide">Hora</p>
                <p className="text-text font-medium">{currentFound.hora}</p>
              </div>
              <div>
                <p className="text-muted text-xs uppercase tracking-wide">Motivo</p>
                <p className="text-text font-medium">{currentFound.motivo}</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {currentFound.estado !== "en_progreso" &&
                currentFound.estado !== "rechazada" &&
                currentFound.estado !== "completada" && (
                  <button
                    onClick={handleEntrada}
                    className="w-full bg-primary text-white rounded-lg py-2.5 font-semibold hover:opacity-90 transition-opacity"
                  >
                    Registrar entrada
                  </button>
                )}
              {currentFound.estado === "en_progreso" && (
                <button
                  onClick={handleSalida}
                  className="w-full bg-accent text-white rounded-lg py-2.5 font-semibold hover:opacity-90 transition-opacity"
                >
                  Registrar salida
                </button>
              )}
              {currentFound.estado !== "rechazada" && currentFound.estado !== "completada" && (
                <button
                  onClick={() => setShowRechazo(true)}
                  className="w-full bg-alert-red text-white rounded-lg py-2.5 font-semibold hover:opacity-90 transition-opacity"
                >
                  Rechazar
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="font-display text-lg text-text">Últimos registros de hoy</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-border">
              <tr>
                {["Hora", "Visitante", "Unidad", "Acción", "Estado"].map((col) => (
                  <th
                    key={col}
                    className="text-left px-4 py-3 text-muted font-semibold text-xs uppercase tracking-wide"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {LOG_ENTRIES.map((entry) => (
                <tr
                  key={`${entry.hora}-${entry.visitante}-${entry.accion}`}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 font-mono text-text">{entry.hora}</td>
                  <td className="px-4 py-3 text-text font-medium">{entry.visitante}</td>
                  <td className="px-4 py-3 text-muted">{entry.unidad}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`font-semibold ${
                        entry.accion === "Entrada" ? "text-primary" : "text-muted"
                      }`}
                    >
                      {entry.accion === "Entrada" ? "↓ Entrada" : "↑ Salida"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge estado={entry.estado} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showRechazo && (
        <RechazoModal onConfirm={handleRechazo} onCancel={() => setShowRechazo(false)} />
      )}
    </div>
  );
}
