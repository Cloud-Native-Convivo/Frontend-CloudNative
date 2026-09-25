export const gastos = [
  {
    item: "Mantención de áreas comunes",
    mensual: "$180.000",
    anual: "$2.160.000",
    pct: 30,
    color: "#0D9488",
  },
  {
    item: "Seguridad y conserjería",
    mensual: "$250.000",
    anual: "$3.000.000",
    pct: 42,
    color: "#005047",
  },
  {
    item: "Servicios básicos (luz/aguas)",
    mensual: "$90.000",
    anual: "$1.080.000",
    pct: 15,
    color: "#14B8A6",
  },
  {
    item: "Fondo de reserva",
    mensual: "$80.000",
    anual: "$960.000",
    pct: 13,
    color: "#99F6E4",
  },
];

// badge values: 'primary' | 'accent' | 'warning'
export const avisos = [
  {
    tipo: "Asamblea",
    fecha: "22 ago 2026",
    titulo: "Asamblea ordinaria de copropietarios",
    desc: "Sala de Juegos / Cowork, 19:00 hrs. Orden del día: presupuesto 2027 y elección de comité.",
    badge: "primary" as const,
    autor: "Comité de Administración",
    confirmacion: true,
    confirmados: 34,
  },
  {
    tipo: "Mantención",
    fecha: "25 ago 2026",
    titulo: "Corte de agua programado",
    desc: "Revisión de red de agua potable en Torres A y B. Duración estimada: 4 horas desde las 09:00.",
    badge: "warning" as const,
    autor: "Administración",
    confirmacion: false,
    confirmados: 0,
  },
  {
    tipo: "Aviso",
    fecha: "18 ago 2026",
    titulo: "Rifa solidaria — Bazar Comunidad",
    desc: "Organizada por residentes del piso 8. Boletos disponibles en conserjería. Sorteo: 30 de agosto.",
    badge: "accent" as const,
    autor: "Residentes Piso 8",
    confirmacion: true,
    confirmados: 12,
  },
  {
    tipo: "Aviso",
    fecha: "15 ago 2026",
    titulo: "Nueva cámara de seguridad instalada",
    desc: "Se instaló una nueva cámara en el acceso del estacionamiento subterráneo. Operativa desde el 15/08.",
    badge: "accent" as const,
    autor: "Administración",
    confirmacion: false,
    confirmados: 0,
  },
  {
    tipo: "Mantención",
    fecha: "10 ago 2026",
    titulo: "Fumigación de áreas comunes",
    desc: "Proceso de fumigación preventiva programada para pasillos y sala de máquinas. Acceso restringido 6 hrs.",
    badge: "warning" as const,
    autor: "Comité de Administración",
    confirmacion: false,
    confirmados: 0,
  },
  {
    tipo: "Asamblea",
    fecha: "5 ago 2026",
    titulo: "Reunión extraordinaria — renovación ascensores",
    desc: "Votación para aprobación de presupuesto de renovación de ascensores Torres C y D.",
    badge: "primary" as const,
    autor: "Comité de Administración",
    confirmacion: true,
    confirmados: 48,
  },
];

export const channels = [
  {
    area: "Conserjería",
    resp: "Conserje de turno",
    contacto: "Interno 100",
    email: "conserjeria@convivo.cl",
    horario: "24/7",
    urgencia: "alta",
  },
  {
    area: "Comité de administración",
    resp: "Presidente del comité",
    contacto: "+56 9 1234 5678",
    email: "comite@convivo.cl",
    horario: "Lun–Vie 09:00–18:00",
    urgencia: "media",
  },
  {
    area: "Administración",
    resp: "Administrador del condominio",
    contacto: "+56 9 8765 4321",
    email: "admin@convivo.cl",
    horario: "Lun–Vie 09:00–18:00",
    urgencia: "media",
  },
  {
    area: "Seguridad del sector",
    resp: "Patrulla / Plan Cuadrante",
    contacto: "Número específico del sector",
    email: null,
    horario: "24/7",
    urgencia: "alta",
  },
  {
    area: "Emergencias",
    resp: "Carabineros / Bomberos / Ambulancia",
    contacto: "133 / 132 / 131",
    email: null,
    horario: "24/7",
    urgencia: "critica",
  },
];

export const registroFotos = [
  {
    id: "RF-001",
    titulo: "Renovación sistema de riego — Jardín Central",
    categoria: "Jardinería",
    fecha: "12 ago 2026",
    responsable: "Verde Total SpA",
    monto: "$450.000 CLP",
    antes:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&auto=format",
    despues:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop&auto=format",
    estado: "Completado",
    boleta: "BOL-2026-0812",
  },
  {
    id: "RF-002",
    titulo: "Pintura de pasillos — Torre A (pisos 1–5)",
    categoria: "Pintura",
    fecha: "5 ago 2026",
    responsable: "Pinturas del Norte Ltda.",
    monto: "$280.000 CLP",
    antes:
      "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=600&h=400&fit=crop&auto=format",
    despues:
      "https://images.unsplash.com/photo-1631889993959-41b4e9c6e3c5?w=600&h=400&fit=crop&auto=format",
    estado: "Completado",
    boleta: "BOL-2026-0805",
  },
  {
    id: "RF-003",
    titulo: "Mantención eléctrica sala de máquinas",
    categoria: "Mantención eléctrica",
    fecha: "28 jul 2026",
    responsable: "ElectroPro Chile",
    monto: "$195.000 CLP",
    antes:
      "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=600&h=400&fit=crop&auto=format",
    despues:
      "https://images.unsplash.com/photo-1558618047-3a3c7aae98ad?w=600&h=400&fit=crop&auto=format",
    estado: "Completado",
    boleta: "BOL-2026-0728",
  },
  {
    id: "RF-004",
    titulo: "Limpieza fachada principal",
    categoria: "Limpieza de fachada",
    fecha: "20 jul 2026",
    responsable: "Clean Masters SpA",
    monto: "$320.000 CLP",
    antes:
      "https://images.unsplash.com/photo-1515263487990-61b07816b324?w=600&h=400&fit=crop&auto=format",
    despues:
      "https://images.unsplash.com/photo-1624204386084-dd8c05e32226?w=600&h=400&fit=crop&auto=format",
    estado: "Completado",
    boleta: "BOL-2026-0720",
  },
];
