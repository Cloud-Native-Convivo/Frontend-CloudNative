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
  /** Ley 21.442: "A" = edificio (torre y piso), "B" = casas o sitios. */
  tipo?: "A" | "B";
}
