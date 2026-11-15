// ms-espacios-comunes no guarda categoría: se deduce del nombre real para agrupar y filtrar.
export function categoriaDeEspacio(nombre: string, ubicacion?: string | null): string {
  const n = `${nombre} ${ubicacion || ""}`.toLowerCase();
  if (n.includes("quincho") || n.includes("parrilla") || n.includes("asador")) return "Quincho";
  if (n.includes("piscina") || n.includes("alberca")) return "Piscina";
  if (n.includes("gimnasio") || n.includes("gym")) return "Gimnasio";
  if (n.includes("cancha") || n.includes("padel") || n.includes("tenis") || n.includes("futbol"))
    return "Cancha";
  return "Sala";
}
