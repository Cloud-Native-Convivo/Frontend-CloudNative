import { useState } from "react";
import type { Visita, RegistroForm } from "./types";
import { QRCode } from "./QRCode";

interface PreRegistroModalProps {
  onClose: () => void;
  onCreated: (v: Visita) => void;
}

const HORAS = Array.from({ length: 15 }, (_, i) => {
  const h = i + 8;
  return `${String(h).padStart(2, "0")}:00`;
});

const MOTIVOS = [
  "Visita personal",
  "Delivery / Encomienda",
  "Técnico / Servicio",
  "Mudanza",
  "Otro",
];

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

function generateCode(fecha: string) {
  const compact = fecha.replace(/-/g, "");
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let seed = fecha.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0) + Date.now();
  const rand = (n: number) => {
    seed = (seed * 1664525 + 1013904223) & 0xffffffff;
    return Math.abs(seed) % n;
  };
  const suffix = Array.from({ length: 4 }, () => chars[rand(chars.length)]).join("");
  return `CONV-VIS-${compact}-${suffix}`;
}

function displayFecha(fecha: string) {
  const [y, m, d] = fecha.split("-");
  const meses = [
    "ene",
    "feb",
    "mar",
    "abr",
    "may",
    "jun",
    "jul",
    "ago",
    "sep",
    "oct",
    "nov",
    "dic",
  ];
  return `${d} ${meses[parseInt(m) - 1]} ${y}`;
}

export function PreRegistroModal({ onClose, onCreated }: PreRegistroModalProps) {
  const [step, setStep] = useState<"form" | "qr">("form");
  const [createdVisita, setCreatedVisita] = useState<Visita | null>(null);
  const [charCount, setCharCount] = useState(0);
  const [form, setForm] = useState<RegistroForm>({
    nombre: "",
    documento: "",
    fecha: todayStr(),
    hora: "12:00",
    motivo: "Visita personal",
    observaciones: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const codigo = generateCode(form.fecha);
    const visita: Visita = {
      id: Date.now().toString(),
      nombre: form.nombre,
      documento: form.documento,
      fecha: form.fecha,
      fechaDisplay: displayFecha(form.fecha),
      hora: form.hora,
      motivo: form.motivo,
      estado: "pendiente_qr",
      codigo,
      unidad: "Torre A · Piso 12 · Unidad 1204",
    };
    setCreatedVisita(visita);
    setStep("qr");
    onCreated(visita);
  };

  if (step === "qr" && createdVisita) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="font-display text-2xl text-text">¡Visita registrada!</h2>
          <p className="text-muted text-sm text-center">
            {createdVisita.nombre} · {createdVisita.fechaDisplay} · {createdVisita.hora}
          </p>
          <div className="border-4 border-text rounded-xl p-2">
            <QRCode code={createdVisita.codigo} size={200} />
          </div>
          <p className="font-mono text-base font-bold text-text tracking-widest">
            {createdVisita.codigo}
          </p>
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="font-display text-xl text-text">Registrar visita</h2>
          <button
            onClick={onClose}
            className="text-muted hover:text-text transition-colors"
            aria-label="Cerrar"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div>
            <p className="block text-sm font-semibold text-text mb-1">Unidad destino</p>
            <div className="rounded-lg border border-border bg-gray-50 px-3 py-2 text-muted text-sm">
              Torre A · Piso 12 · Unidad 1204
            </div>
          </div>

          <div>
            <label htmlFor="visita-nombre" className="block text-sm font-semibold text-text mb-1">
              Nombre del visitante <span className="text-alert-red">*</span>
            </label>
            <input
              id="visita-nombre"
              type="text"
              required
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className="w-full rounded-lg border border-border px-3 py-2 text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/40"
              placeholder="Nombre completo"
            />
          </div>

          <div>
            <label
              htmlFor="visita-documento"
              className="block text-sm font-semibold text-text mb-1"
            >
              RUT / Documento
            </label>
            <input
              id="visita-documento"
              type="text"
              value={form.documento}
              onChange={(e) => setForm({ ...form, documento: e.target.value })}
              className="w-full rounded-lg border border-border px-3 py-2 text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/40"
              placeholder="12.345.678-9"
            />
          </div>

          <div>
            <label htmlFor="visita-fecha" className="block text-sm font-semibold text-text mb-1">
              Fecha de visita <span className="text-alert-red">*</span>
            </label>
            <input
              id="visita-fecha"
              type="date"
              required
              min={todayStr()}
              value={form.fecha}
              onChange={(e) => setForm({ ...form, fecha: e.target.value })}
              className="w-full rounded-lg border border-border px-3 py-2 text-text focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          <div>
            <label htmlFor="visita-hora" className="block text-sm font-semibold text-text mb-1">
              Hora estimada de llegada
            </label>
            <select
              id="visita-hora"
              value={form.hora}
              onChange={(e) => setForm({ ...form, hora: e.target.value })}
              className="w-full rounded-lg border border-border px-3 py-2 text-text focus:outline-none focus:ring-2 focus:ring-primary/40 bg-white"
            >
              {HORAS.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="visita-motivo" className="block text-sm font-semibold text-text mb-1">
              Motivo
            </label>
            <select
              id="visita-motivo"
              value={form.motivo}
              onChange={(e) => setForm({ ...form, motivo: e.target.value })}
              className="w-full rounded-lg border border-border px-3 py-2 text-text focus:outline-none focus:ring-2 focus:ring-primary/40 bg-white"
            >
              {MOTIVOS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="visita-observaciones"
              className="block text-sm font-semibold text-text mb-1"
            >
              Observaciones
              <span className="text-muted font-normal ml-1">(opcional)</span>
            </label>
            <textarea
              id="visita-observaciones"
              value={form.observaciones}
              onChange={(e) => {
                if (e.target.value.length <= 200) {
                  setForm({ ...form, observaciones: e.target.value });
                  setCharCount(e.target.value.length);
                }
              }}
              rows={3}
              className="w-full rounded-lg border border-border px-3 py-2 text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
              placeholder="Información adicional para conserjería..."
            />
            <p className="text-muted text-xs text-right mt-0.5">{charCount}/200</p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-border rounded-lg py-2.5 text-text font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-primary text-white rounded-lg py-2.5 font-semibold hover:opacity-90 transition-opacity"
            >
              Registrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
