export type Role = "residente" | "conserje" | "admin" | "comite";

export interface User {
  nombre: string;
  unidad: string;
  role: Role;
  avatar?: string;
  condominioId?: string;
  condominioNombre?: string;
}

export interface CondominioItem {
  id: string | number;
  nombre: string;
  direccion?: string;
}
