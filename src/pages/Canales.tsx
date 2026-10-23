import React from "react";
import { Link } from "react-router";
import { channels } from "../data";
import { FlipCard } from "../components/FlipCard";
import {
  IconPhone,
  IconMail,
  IconShield,
  IconAlertTriangle,
  IconBell,
  IconHome,
  IconDollar,
  IconUsers,
} from "../components/icons/Icons";

const urgenciaBadge: Record<
  string,
  {
    label: string;
    className: string;
  }
> = {
  alta: { label: "Prioridad alta", className: "text-alert-yellow bg-yellow-50" },
  media: { label: "Prioridad media", className: "text-primary bg-teal-50" },
  critica: { label: "Emergencia", className: "text-alert-red bg-rose-50" },
};

const iconMap: Record<string, React.ReactNode> = {
  Conserjería: <IconBell className="w-[22px] h-[22px]" />,
  "Comité de administración": <IconHome className="w-[22px] h-[22px]" />,
  Administración: <IconDollar className="w-[22px] h-[22px]" />,
  "Seguridad del sector": <IconShield className="w-[22px] h-[22px]" />,
  Emergencias: <IconAlertTriangle className="w-[22px] h-[22px]" />,
};

interface FlipCardData {
  title: string;
  desc: string;
  icon: React.ReactNode;
}

const flipCards: FlipCardData[] = [
  {
    title: "Conserjería 24/7",
    desc: "Llama directamente desde la plataforma — interno 100.",
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

        {/* Channel cards */}
        <div className="flex flex-col gap-4 mb-10">
          {channels.map((c) => {
            const badge = urgenciaBadge[c.urgencia];
            return (
              <div
                key={c.area}
                className="bg-white border border-border hover:border-slate-300 rounded-lg py-6 px-7 grid grid-cols-[56px_1fr_auto] gap-5 items-center transition-[border-color,box-shadow] duration-200 hover:shadow-[0_6px_24px_rgba(0,0,0,0.07)]"
              >
                <div
                  className={`w-[52px] h-[52px] rounded-lg flex items-center justify-center shrink-0 ${
                    c.urgencia === "critica"
                      ? "bg-rose-50 text-alert-red"
                      : "bg-teal-100 text-accent"
                  }`}
                >
                  {iconMap[c.area]}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <h3 className="font-display text-lg text-text m-0 font-normal">{c.area}</h3>
                    <span className={`text-xs font-bold py-1 px-3 rounded-full ${badge.className}`}>
                      {badge.label}
                    </span>
                  </div>
                  <div className="text-sm text-muted mb-3">{c.resp}</div>
                  <div className="flex gap-5 flex-wrap">
                    <div className="flex items-center gap-2 text-sm text-text font-semibold">
                      <IconPhone className="w-[14px] h-[14px] text-primary" /> {c.contacto}
                    </div>
                    {c.email && (
                      <div className="flex items-center gap-2 text-sm text-primary">
                        <IconMail className="w-[14px] h-[14px]" />
                        <a href={`mailto:${c.email}`} className="text-primary no-underline">
                          {c.email}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs text-slate-400 mb-3">{c.horario}</div>
                  {c.contacto.match(/\d{3}/) && (
                    <a
                      href={`tel:${c.contacto.split("/")[0].trim().replace(/\s/g, "")}`}
                      className={`btn btn-primary btn-sm ${
                        c.urgencia === "critica"
                          ? "bg-alert-red text-white hover:bg-alert-red/90"
                          : ""
                      }`}
                    >
                      <IconPhone className="w-[13px] h-[13px]" /> Llamar
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Security info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white border border-border rounded-lg p-7">
            <div className="flex items-center gap-3 mb-5">
              <div className="text-primary">
                <IconShield className="w-[24px] h-[24px]" />
              </div>
              <h3 className="font-display text-xl text-text m-0 font-normal">Plan Cuadrante</h3>
            </div>
            <p className="text-sm text-muted leading-[1.7] m-0 mb-4">
              Ficha del sector con el cuadrante de seguridad vigente y el contacto del funcionario a
              cargo, mantenida por el comité.
            </p>
            <div className="text-sm text-text font-medium">Comisaría 12a — Las Condes</div>
            <div className="mt-2 text-sm text-text font-medium">Cuadrante N° 4 — Sector Norte</div>
          </div>

          <div className="bg-white border border-border rounded-lg p-7">
            <div className="flex items-center gap-3 mb-5">
              <div className="text-primary">
                <IconBell className="w-[24px] h-[24px]" />
              </div>
              <h3 className="font-display text-xl text-text m-0 font-normal">
                Notificaciones push
              </h3>
            </div>
            <p className="text-sm text-muted leading-[1.7] m-0 mb-5">
              Activa las notificaciones para recibir alertas de seguridad, mantenimientos
              programados y avisos urgentes directamente en tu dispositivo.
            </p>
            <button className="btn btn-primary">Activar notificaciones</button>
          </div>
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
