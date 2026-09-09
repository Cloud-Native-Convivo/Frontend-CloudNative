export type EstadoVisita =
  | "pendiente_qr"
  | "confirmada"
  | "en_progreso"
  | "rechazada"
  | "completada";

export interface Visita {
  id: string;
  nombre: string;
  documento: string;
  fecha: string;
  fechaDisplay: string;
  hora: string;
  motivo: string;
  estado: EstadoVisita;
  codigo: string;
  unidad: string;
}

export interface RegistroForm {
  nombre: string;
  documento: string;
  fecha: string;
  hora: string;
  motivo: string;
  observaciones: string;
}

export interface LogEntry {
  hora: string;
  visitante: string;
  unidad: string;
  accion: string;
  estado: EstadoVisita;
}
