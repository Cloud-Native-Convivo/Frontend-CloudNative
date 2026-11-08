import React from "react";
import { Link } from "react-router";
import { FlipCard } from "../components/FlipCard";
import { IconShield, IconAlertTriangle, IconBell, IconUsers } from "../components/icons/Icons";

interface FlipCardData {
  title: string;
  desc: string;
  icon: React.ReactNode;
}

const flipCards: FlipCardData[] = [
  {
    title: "Conserjería 24/7",
    desc: "Contacto directo con la conserjería desde la plataforma.",
    icon: <IconBell className="w-[28px] h-[28px] text-primary" />,
  },
  {
    title: "Comité",
    desc: "Contacta al presidente o cualquier miembro del comité.",
    icon: <IconUsers className="w-[28px] h-[28px] text-primary" />,
  },
  {
    title: "Plan Cuadrante",
    desc: "Solicita patrulla directamente al Plan Cuadrante de tu sector.",
    icon: <IconShield className="w-[28px] h-[28px] text-primary" />,
  },
  {
    title: "Bomberos y SAMU",
    desc: "Botones de acceso rápido: 133, 132 y 131.",
    icon: <IconAlertTriangle className="w-[28px] h-[28px] text-primary" />,
  },
];

interface AltSection {
  title: string;
  body: string;
  imgUrl: string;
  imgLeft: boolean;
}

const altSections: AltSection[] = [
  {
    title: "Respuesta rápida",
    body: "En situaciones de emergencia, cada segundo cuenta. Los canales integrados de la plataforma permiten contactar a conserjería, comité o servicios de emergencia con un solo clic, sin buscar números guardados.",
    imgUrl: "https://images.unsplash.com/photo-1651514645933-c26e0eb4ace3?w=700&h=500&fit=crop",
    imgLeft: true,
  },
  {
    title: "Red de contactos",
    body: "Toda la información de contacto del condominio centralizada y siempre actualizada: conserjería, comité, administración, Plan Cuadrante y servicios de emergencia. Sin papel, sin listas desactualizadas.",
    imgUrl: "https://images.unsplash.com/photo-1584467735867-4297ae2ebcee?w=700&h=500&fit=crop",
    imgLeft: false,
  },
];

export default function Canales() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Dark hero header */}
      <div className="bg-text p-[72px_24px_64px]">
        <div className="max-w-page mx-auto">
          <p className="text-xs font-bold text-white/45 tracking-wide mb-4">Contacto directo</p>
          <h1 className="font-display text-[clamp(36px,5vw,64px)] text-white leading-[1.08] m-0 mb-5 font-normal">
            Canales de seguridad
          </h1>
          <p className="text-lg text-white/65 m-0 max-w-content leading-[1.65]">
            Todo el condominio, un clic para cada emergencia
          </p>
        </div>
      </div>

      {/* Existing header strip */}
      <div className="bg-primary p-[40px_24px_36px]">
        <div className="max-w-page mx-auto">
          <p className="text-xs font-bold text-white/60 tracking-wide mb-3">Contacto directo</p>
          <h2 className="font-display text-[clamp(24px,3vw,36px)] text-white leading-[1.1] m-0 mb-3 font-normal">
            Canales de Seguridad
          </h2>
          <p className="text-base text-white/72 m-0 max-w-content leading-[1.65]">
            Toda la información de contacto del condominio en un solo lugar, siempre actualizada. Un
            clic para emergencias.
          </p>
        </div>
      </div>

      {/* Main channel content */}
      <div className="max-w-page mx-auto p-[40px_24px_80px]">
        {/* Emergency banner */}
        <div className="bg-rose-50 border border-rose-200 rounded-lg p-[20px_24px] mb-8 flex items-center gap-4 flex-wrap">
          <div className="text-alert-red shrink-0">
            <IconAlertTriangle className="w-[28px] h-[28px]" />
          </div>
          <div className="flex-1">
            <div className="text-base font-bold text-alert-red mb-1">¿Es una emergencia?</div>
            <div className="text-sm text-rose-800">
              Llama directamente a Carabineros (133), Bomberos (132) o Ambulancia SAMU (131)
            </div>
          </div>
          <div className="flex gap-3 flex-wrap">
            {[
              { num: "133", label: "Carabineros" },
              { num: "132", label: "Bomberos" },
              { num: "131", label: "SAMU" },
            ].map((e) => (
              <a
                key={e.num}
                href={`tel:${e.num}`}
                className="btn btn-primary flex-col py-3 bg-alert-red text-white hover:bg-rose-800"
              >
                <span className="font-display text-xl leading-none">{e.num}</span>
                <span className="text-xs opacity-85 mt-1">{e.label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Directorio del condominio: sin servicio de contactos en el backend */}
        <div className="text-center py-10 text-muted">
          <p className="text-lg font-semibold">Sin contactos registrados</p>
          <p className="text-sm mt-1">El directorio del condominio aún no está disponible.</p>
        </div>
      </div>

      {/* Sub-features flip cards */}
      <div className="bg-white p-[80px_24px]">
        <div className="max-w-page mx-auto">
          <p className="text-xs font-bold text-primary tracking-wide mb-3">Funcionalidades</p>
          <h2 className="font-display text-[clamp(28px,3.5vw,44px)] text-text m-0 mb-12 font-normal">
            Cada canal, a un clic de distancia
          </h2>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-5">
            {flipCards.map((card) => (
              <FlipCard
                key={card.title}
                height={200}
                front={
                  <div className="h-full bg-slate-50 rounded-lg border border-border flex flex-col items-center justify-center p-6 text-center gap-4">
                    {card.icon}
                    <span className="text-base font-bold text-text leading-[1.3]">
                      {card.title}
                    </span>
                  </div>
                }
                back={
                  <div className="h-full bg-primary rounded-lg flex items-center justify-center p-6 text-center">
                    <span className="text-sm text-white leading-[1.6]">{card.desc}</span>
                  </div>
                }
              />
            ))}
          </div>
        </div>
      </div>

      {/* Alternating image+text sections */}
      {altSections.map((section) => (
        <div
          key={section.title}
          className={`py-20 px-6 ${section.imgLeft ? "bg-slate-50" : "bg-white"}`}
        >
          <div className="max-w-page mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            {section.imgLeft ? (
              <>
                <img
                  src={section.imgUrl}
                  alt={section.title}
                  width="700"
                  height="500"
                  className="w-full h-[380px] object-cover rounded-lg shadow-[0_20px_60px_rgba(0,0,0,0.12)]"
                  loading="lazy"
                  decoding="async"
                />
                <div>
                  <h2 className="font-display text-[clamp(26px,3vw,40px)] text-text m-0 mb-5 font-normal leading-[1.2]">
                    {section.title}
                  </h2>
                  <p className="text-base text-muted leading-[1.75] m-0">{section.body}</p>
                </div>
              </>
            ) : (
              <>
                <div>
                  <h2 className="font-display text-[clamp(26px,3vw,40px)] text-text m-0 mb-5 font-normal leading-[1.2]">
                    {section.title}
                  </h2>
                  <p className="text-base text-muted leading-[1.75] m-0">{section.body}</p>
                </div>
                <img
                  src={section.imgUrl}
                  alt={section.title}
                  width="700"
                  height="500"
                  className="w-full h-[380px] object-cover rounded-lg shadow-[0_20px_60px_rgba(0,0,0,0.12)]"
                  loading="lazy"
                  decoding="async"
                />
              </>
            )}
          </div>
        </div>
      ))}

      {/* CTA strip */}
      <div className="bg-text p-[64px_24px]">
        <div className="max-w-page mx-auto flex items-center justify-center gap-6 flex-wrap">
          <Link to="/canales" className="btn btn-primary btn-lg">
            Ver canales
          </Link>
          <Link
            to="/dashboard"
            className="btn btn-secondary bg-transparent text-white border-white/30 hover:bg-white/10 hover:border-white/60 btn-lg"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
