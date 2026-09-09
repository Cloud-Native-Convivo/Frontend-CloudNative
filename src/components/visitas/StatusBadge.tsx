import type { EstadoVisita } from "./types";

const STATUS_BADGE_MAP: Record<
  EstadoVisita,
  {
    label: string;
    icon: string;
    className: string;
  }
> = {
  pendiente_qr: {
    label: "Pendiente QR",
    icon: "⏳",
    className: "bg-alert-yellow text-text",
  },
  confirmada: {
    label: "Confirmada",
    icon: "✓",
    className: "bg-green-100 text-green-800",
  },
  en_progreso: {
    label: "En condominio",
    icon: "📍",
    className: "bg-blue-100 text-blue-800",
  },
  rechazada: {
    label: "Rechazada",
    icon: "✗",
    className: "bg-alert-red text-white",
  },
  completada: {
    label: "Completada",
    icon: "",
    className: "bg-gray-100 text-muted",
  },
};

export function StatusBadge({ estado }: { estado: EstadoVisita }) {
  const { label, icon, className } = STATUS_BADGE_MAP[estado];
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${className}`}
    >
      {icon && <span>{icon}</span>}
      {label}
    </span>
  );
}
