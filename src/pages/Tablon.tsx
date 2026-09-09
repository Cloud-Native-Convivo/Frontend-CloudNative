import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../hooks/useAuth";
import {
  IconPlus,
  IconBell,
  IconCalendar,
  IconMessage,
  IconHome,
  IconChevronRight,
} from "../components/icons/Icons";
import { FlipCard } from "../components/FlipCard";
import { AvisosGrid, type AvisoItem } from "../components/tablon/AvisosGrid";
import { NuevoAvisoModal } from "../components/tablon/NuevoAvisoModal";

const tipos = ["Todos", "Aviso", "Urgente", "Asamblea", "Comunidad"];

const avisos: AvisoItem[] = [
  {
    tipo: "Urgente",
    badge: "critico",
    fecha: "Hoy · 08:30",
    titulo: "Corte de agua programado — Torres A y B",
    desc: "Por trabajos de mantenimiento en matriz principal, se suspenderá el suministro de agua entre las 09:00 y las 14:00 hrs. Agradecemos tomar precauciones.",
    autor: "Administración",
    confirmacion: false,
    confirmados: 0,
  },
  {
    tipo: "Asamblea",
    badge: "aviso",
    fecha: "22 ago 2026",
    titulo: "Asamblea Ordinaria de Copropietarios",
    desc: "Se convoca a todos los copropietarios a la asamblea anual para revisión de gastos comunes y elección del nuevo comité de administración. Sala de Eventos, 19:00 hrs.",
    autor: "Comité de Administración",
    confirmacion: true,
    confirmados: 47,
  },
  {
    tipo: "Comunidad",
    badge: "info",
    fecha: "15 ago 2026",
    titulo: "Campeonato de Padel — Inscripciones abiertas",
    desc: "Este sábado 29 de agosto realizaremos el primer torneo de padel del condominio. Inscripciones en conserjería hasta el jueves. ¡Premios para el 1er y 2do lugar!",
    autor: "Comité de Deportes",
    confirmacion: true,
    confirmados: 18,
  },
  {
    tipo: "Comunidad",
    badge: "actividad",
    fecha: "18 ago 2026",
    titulo: "Rifa Solidaria — Bazar Comunidad",
    desc: "Organizada por vecinos del piso 4 en beneficio del fondo de mejoras del parque infantil. Premios donados por residentes. Boletos disponibles en conserjería.",
    autor: "Vecinos Piso 4",
    confirmacion: false,
    confirmados: 0,
  },
  {
    tipo: "Aviso",
    badge: "residente",
    fecha: "15 ago 2026",
    titulo: "Renovación de jardines — Acceso principal",
    desc: "Se iniciaron los trabajos de paisajismo en el acceso peatonal norte. El paso estará habilitado por el acceso vehicular poniente durante 3 días.",
    autor: "Administración",
    confirmacion: false,
    confirmados: 0,
  },
  {
    tipo: "Aviso",
    badge: "residente",
    fecha: "08 ago 2026",
    titulo: "Mantenimiento preventivo de ascensores",
    desc: "Los ascensores de Torre C estarán en revisión técnica el próximo martes entre las 10:00 y las 13:00 hrs. Un ascensor permanecerá operativo en todo momento.",
    autor: "Otis Chile",
    confirmacion: false,
    confirmados: 0,
  },
];

const flipCards = [
  {
    title: "Avisos del comité",
    desc: "Comunicados oficiales, mantenciones y cambios de reglamento.",
    icon: <IconBell className="w-[28px] h-[28px] text-[#0D9488]" />,
  },
  {
    title: "Asambleas",
    desc: "Convocatorias con confirmación de asistencia directa desde la plataforma.",
    icon: <IconCalendar className="w-[28px] h-[28px] text-[#0D9488]" />,
  },
  {
    title: "Publicaciones de residentes",
    desc: "Pérdidas, arriendos y noticias de la comunidad.",
    icon: <IconMessage className="w-[28px] h-[28px] text-[#0D9488]" />,
  },
  {
    title: "Notificaciones push",
    desc: "Cada aviso nuevo llega a tu teléfono automáticamente.",
    icon: <IconHome className="w-[28px] h-[28px] text-[#0D9488]" />,
  },
];

const altSections = [
  {
    title: "Comunicación efectiva",
    body: "El tablón digital garantiza que cada aviso llegue a todos los residentes al mismo tiempo. Sin carteles deteriorados, sin información desactualizada. La comunidad siempre informada.",
    imgUrl: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=700&h=500&fit=crop",
    imgLeft: true,
  },
  {
    title: "Sin papel",
    body: "Adiós a las impresiones y las hojas pegadas en el ascensor. Cada publicación queda almacenada con fecha, autor y tipo, disponible para consultar en cualquier momento desde cualquier dispositivo.",
    imgUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=700&h=500&fit=crop",
    imgLeft: false,
  },
];

export default function Tablon() {
  const { role } = useAuth();
  const canPublishDirect = role === "admin" || role === "comite";

  const [activeTipo, setActiveTipo] = useState("Todos");
  const [confirmados, setConfirmados] = useState<Record<number, boolean>>({});
  const [showNew, setShowNew] = useState(false);

  const filtered = avisos.filter((a) => activeTipo === "Todos" || a.tipo === activeTipo);

  return (
    <div className="min-h-screen bg-[#F8FAFB]">
      <div className="bg-[#00201B] px-6 pb-16 pt-[72px]">
        <div className="max-w-[1280px] mx-auto">
          <p className="text-[11px] font-bold text-white/45 tracking-[0.14em] uppercase mb-4">
            Cartelera digital
          </p>
          <h1 className="font-display text-[clamp(36px,5vw,64px)] text-white leading-[1.08] mb-[18px] font-normal">
            Tablón de avisos
          </h1>
          <p className="text-[19px] text-white/65 m-0 max-w-[540px] leading-[1.65]">
            Información del condominio, siempre al día
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-[#0D9488] to-[#005047] px-6 pb-9 pt-10">
        <div className="max-w-[1280px] mx-auto flex justify-between items-end flex-wrap gap-5">
          <div>
            <p className="text-[11px] font-bold text-white/60 tracking-[0.12em] uppercase mb-2.5">
              Cartelera digital
            </p>
            <h2 className="font-display text-[clamp(24px,3vw,36px)] text-white leading-[1.1] mb-2.5 font-normal">
              Tablón de Eventos y Avisos
            </h2>
            <p className="text-[15px] text-white/72 m-0 max-w-[520px] leading-[1.65]">
              Cartelera digital comunitaria con avisos, asambleas y comunicados del comité — en
              tiempo real.
            </p>
          </div>
          <button
            onClick={() => setShowNew(true)}
            className="flex items-center gap-2 bg-white text-[#005047] border-none rounded-[10px] px-5 py-3 text-[14px] font-bold cursor-pointer transition-opacity duration-200 whitespace-nowrap hover:opacity-90"
          >
            <IconPlus className="w-4 h-4" />
            {canPublishDirect ? "Publicar aviso" : "Solicitar publicación"}
          </button>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 pb-20 pt-10">
        <div className="flex justify-between items-center flex-wrap gap-4 mb-8">
          <div className="flex gap-2">
            {tipos.map((t) => (
              <button
                key={t}
                onClick={() => setActiveTipo(t)}
                className={`px-4 py-2 rounded-full text-[13px] font-medium cursor-pointer border transition-colors duration-150 ${
                  activeTipo === t
                    ? "border-[#0D9488] bg-[#0D9488] text-white"
                    : "border-border bg-white text-text-muted hover:border-[#0D9488]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="text-[13px] text-text-muted">{filtered.length} publicaciones</div>
        </div>

        <AvisosGrid
          filteredAvisos={filtered}
          allAvisos={avisos}
          confirmados={confirmados}
          onToggleConfirm={(idx) =>
            setConfirmados((prev) => ({
              ...prev,
              [idx]: !prev[idx],
            }))
          }
        />
      </div>

      <div className="bg-white px-6 py-20">
        <div className="max-w-[1280px] mx-auto">
          <p className="text-[11px] font-bold text-[#0D9488] tracking-[0.14em] uppercase mb-3">
            Funcionalidades
          </p>
          <h2 className="font-display text-[clamp(28px,3.5vw,44px)] text-[#00201B] m-0 mb-12 font-normal">
            Todo lo que necesitas en un tablón
          </h2>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-5">
            {flipCards.map((card) => (
              <FlipCard
                key={card.title}
                height={200}
                front={
                  <div className="h-full bg-[#F8FAFB] rounded-2xl border border-border flex flex-col items-center justify-center p-6 text-center gap-3.5">
                    {card.icon}
                    <span className="text-[15px] font-bold text-[#00201B] leading-[1.3]">
                      {card.title}
                    </span>
                  </div>
                }
                back={
                  <div className="h-full bg-gradient-to-br from-[#00201B] to-[#005047] rounded-2xl p-6 flex flex-col justify-center text-center">
                    <p className="text-white/85 text-[14px] leading-[1.65] m-0">{card.desc}</p>
                  </div>
                }
              />
            ))}
          </div>
        </div>
      </div>

      {altSections.map((sec) => (
        <div
          key={sec.title}
          className={`py-[72px] px-6 ${sec.imgLeft ? "bg-[#F8FAFB]" : "bg-white"}`}
        >
          <div
            className={`max-w-[1280px] mx-auto flex items-center gap-16 flex-wrap ${
              sec.imgLeft ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div className="flex-[1_1_400px]">
              <p className="text-[11px] font-bold text-[#0D9488] tracking-[0.14em] uppercase mb-3">
                Comunidad conectada
              </p>
              <h2 className="font-display text-[clamp(26px,3vw,40px)] text-[#00201B] m-0 mb-[18px] font-normal leading-[1.15]">
                {sec.title}
              </h2>
              <p className="text-[16px] text-text-muted leading-[1.75] m-0">{sec.body}</p>
            </div>
            <div className="flex-[1_1_360px]">
              <img
                src={sec.imgUrl}
                alt={sec.title}
                className="w-full rounded-[18px] block shadow-[0_16px_48px_rgba(0,0,0,0.1)]"
              />
            </div>
          </div>
        </div>
      ))}

      <div className="bg-[#00201B] px-6 py-16">
        <div className="max-w-[1280px] mx-auto flex items-center justify-center gap-6 flex-wrap">
          <Link
            to="/tablon"
            className="inline-flex items-center gap-2 bg-[#0D9488] hover:bg-[#005047] text-white rounded-xl px-8 py-4 text-[15px] font-bold no-underline transition-colors duration-200"
          >
            Ver los avisos <IconChevronRight className="w-4 h-4" />
          </Link>
          <button
            onClick={() => setShowNew(true)}
            className="inline-flex items-center gap-2 bg-transparent hover:bg-white/5 text-white rounded-xl border border-white/30 hover:border-white px-8 py-4 text-[15px] font-bold cursor-pointer transition-colors duration-200"
          >
            {canPublishDirect ? "Publicar aviso" : "Solicitar publicación"}{" "}
            <IconChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showNew && (
        <NuevoAvisoModal canPublishDirect={canPublishDirect} onClose={() => setShowNew(false)} />
      )}
    </div>
  );
}
