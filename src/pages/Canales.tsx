import React from "react";
import { Link } from "react-router";
import { channels } from "../lib/data";
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
  IconChevronRight,
} from "../components/icons/Icons";

const urgenciaBadge: Record<
  string,
  {
    label: string;
    className: string;
  }
> = {
  alta: { label: "Prioridad alta", className: "text-[#EAB308] bg-[#FEFCE8]" },
  media: { label: "Prioridad media", className: "text-[#0D9488] bg-[#F0FDFA]" },
  critica: { label: "Emergencia", className: "text-[#E11D48] bg-[#FFF1F2]" },
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
    icon: <IconBell className="w-[28px] h-[28px] text-[#0D9488]" />,
  },
  {
    title: "Comité",
    desc: "Contacta al presidente o cualquier miembro del comité.",
    icon: <IconUsers className="w-[28px] h-[28px] text-[#0D9488]" />,
  },
  {
    title: "Plan Cuadrante",
    desc: "Solicita patrulla directamente al Plan Cuadrante de tu sector.",
    icon: <IconShield className="w-[28px] h-[28px] text-[#0D9488]" />,
  },
  {
    title: "Bomberos y SAMU",
    desc: "Botones de acceso rápido: 133, 132 y 131.",
    icon: <IconAlertTriangle className="w-[28px] h-[28px] text-[#0D9488]" />,
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
    <div className="min-h-screen bg-[#F8FAFB]">
      {/* Dark hero header */}
      <div className="bg-[#00201B] p-[72px_24px_64px]">
        <div className="max-w-[1280px] mx-auto">
          <p className="text-[11px] font-bold text-white/45 tracking-[0.14em] uppercase mb-4">
            Contacto directo
          </p>
          <h1 className="font-display text-[clamp(36px,5vw,64px)] text-white leading-[1.08] m-0 mb-[18px] font-normal">
            Canales de seguridad
          </h1>
          <p className="text-[19px] text-white/65 m-0 max-w-[540px] leading-[1.65]">
            Todo el condominio, un clic para cada emergencia
          </p>
        </div>
      </div>

      {/* Existing header strip */}
      <div className="bg-gradient-to-br from-[#0D9488] to-[#005047] p-[40px_24px_36px]">
        <div className="max-w-[1280px] mx-auto">
          <p className="text-[11px] font-bold text-white/60 tracking-[0.12em] uppercase mb-[10px]">
            Contacto directo
          </p>
          <h2 className="font-display text-[clamp(24px,3vw,36px)] text-white leading-[1.1] m-0 mb-[10px] font-normal">
            Canales de Seguridad
          </h2>
          <p className="text-[15px] text-white/72 m-0 max-w-[520px] leading-[1.65]">
            Toda la información de contacto del condominio en un solo lugar, siempre actualizada. Un
            clic para emergencias.
          </p>
        </div>
      </div>

      {/* Main channel content */}
      <div className="max-w-[1280px] mx-auto p-[40px_24px_80px]">
        {/* Emergency banner */}
        <div className="bg-[#FFF1F2] border border-[#FECDD3] rounded-[14px] p-[20px_24px] mb-8 flex items-center gap-4 flex-wrap">
          <div className="text-[#E11D48] shrink-0">
            <IconAlertTriangle className="w-[28px] h-[28px]" />
          </div>
          <div className="flex-1">
            <div className="text-[15px] font-bold text-[#E11D48] mb-[2px]">¿Es una emergencia?</div>
            <div className="text-[13px] text-[#9F1239]">
              Llama directamente a Carabineros (133), Bomberos (132) o Ambulancia SAMU (131)
            </div>
          </div>
          <div className="flex gap-[10px] flex-wrap">
            {[
              { num: "133", label: "Carabineros" },
              { num: "132", label: "Bomberos" },
              { num: "131", label: "SAMU" },
            ].map((e) => (
              <a
                key={e.num}
                href={`tel:${e.num}`}
                className="flex flex-col items-center bg-[#E11D48] hover:bg-[#9F1239] text-white rounded-[10px] py-[10px] px-[18px] no-underline transition-colors duration-200"
              >
                <span className="font-display text-[20px] leading-none">{e.num}</span>
                <span className="text-[11px] opacity-85 mt-[2px]">{e.label}</span>
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
                className="bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-[16px] py-[24px] px-[28px] grid grid-cols-[56px_1fr_auto] gap-5 items-center transition-[border-color,box-shadow] duration-200 hover:shadow-[0_6px_24px_rgba(0,0,0,0.07)]"
              >
                <div
                  className={`w-[52px] h-[52px] rounded-[14px] flex items-center justify-center shrink-0 ${
                    c.urgencia === "critica"
                      ? "bg-[#FFF1F2] text-[#E11D48]"
                      : "bg-gradient-to-br from-[#CCFBF1] to-[#99F6E4] text-[#005047]"
                  }`}
                >
                  {iconMap[c.area]}
                </div>
                <div>
                  <div className="flex items-center gap-[10px] mb-1 flex-wrap">
                    <h3 className="font-display text-[18px] text-[#00201B] m-0 font-normal">
                      {c.area}
                    </h3>
                    <span
                      className={`text-[11px] font-bold py-[3px] px-[10px] rounded-full ${badge.className}`}
                    >
                      {badge.label}
                    </span>
                  </div>
                  <div className="text-[13px] text-[#64748B] mb-[10px]">{c.resp}</div>
                  <div className="flex gap-5 flex-wrap">
                    <div className="flex items-center gap-[6px] text-[14px] text-[#00201B] font-semibold">
                      <IconPhone className="w-[14px] h-[14px] text-[#0D9488]" /> {c.contacto}
                    </div>
                    {c.email && (
                      <div className="flex items-center gap-[6px] text-[13px] text-[#0D9488]">
                        <IconMail className="w-[14px] h-[14px]" />
                        <a href={`mailto:${c.email}`} className="text-[#0D9488] no-underline">
                          {c.email}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[12px] text-[#94A3B8] mb-[10px]">{c.horario}</div>
                  {c.contacto.match(/\d{3}/) && (
                    <a
                      href={`tel:${c.contacto.split("/")[0].trim().replace(/\s/g, "")}`}
                      className={`inline-flex items-center gap-[6px] text-white rounded-lg py-[9px] px-[16px] no-underline text-[13px] font-semibold transition-opacity duration-200 hover:opacity-85 ${
                        c.urgencia === "critica" ? "bg-[#E11D48]" : "bg-[#0D9488]"
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
          <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-[28px]">
            <div className="flex items-center gap-3 mb-5">
              <div className="text-[#0D9488]">
                <IconShield className="w-[24px] h-[24px]" />
              </div>
              <h3 className="font-display text-[20px] text-[#00201B] m-0 font-normal">
                Plan Cuadrante
              </h3>
            </div>
            <p className="text-[14px] text-[#64748B] leading-[1.7] m-0 mb-4">
              Ficha del sector con el cuadrante de seguridad vigente y el contacto del funcionario a
              cargo, mantenida por el comité.
            </p>
            <div className="text-[14px] text-[#00201B] font-medium">Comisaría 12a — Las Condes</div>
            <div className="mt-2 text-[14px] text-[#00201B] font-medium">
              Cuadrante N° 4 — Sector Norte
            </div>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-[28px]">
            <div className="flex items-center gap-3 mb-5">
              <div className="text-[#0D9488]">
                <IconBell className="w-[24px] h-[24px]" />
              </div>
              <h3 className="font-display text-[20px] text-[#00201B] m-0 font-normal">
                Notificaciones push
              </h3>
            </div>
            <p className="text-[14px] text-[#64748B] leading-[1.7] m-0 mb-5">
              Activa las notificaciones para recibir alertas de seguridad, mantenimientos
              programados y avisos urgentes directamente en tu dispositivo.
            </p>
            <button className="bg-[#0D9488] hover:bg-[#005047] text-white border-none rounded-lg py-[10px] px-[20px] text-[14px] font-semibold cursor-pointer transition-colors duration-200">
              Activar notificaciones
            </button>
          </div>
        </div>
      </div>

      {/* Sub-features flip cards */}
      <div className="bg-[#fff] p-[80px_24px]">
        <div className="max-w-[1280px] mx-auto">
          <p className="text-[11px] font-bold text-[#0D9488] tracking-[0.14em] uppercase mb-3">
            Funcionalidades
          </p>
          <h2 className="font-display text-[clamp(28px,3.5vw,44px)] text-[#00201B] m-0 mb-12 font-normal">
            Cada canal, a un clic de distancia
          </h2>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-5">
            {flipCards.map((card) => (
              <FlipCard
                key={card.title}
                height={200}
                front={
                  <div className="h-full bg-[#F8FAFB] rounded-[16px] border border-[#E2E8F0] flex flex-col items-center justify-center p-6 text-center gap-[14px]">
                    {card.icon}
                    <span className="text-[15px] font-bold text-[#00201B] leading-[1.3]">
                      {card.title}
                    </span>
                  </div>
                }
                back={
                  <div className="h-full bg-[#0D9488] rounded-[16px] flex items-center justify-center p-6 text-center">
                    <span className="text-[14px] text-[#fff] leading-[1.6]">{card.desc}</span>
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
          className={`py-[80px] px-[24px] ${section.imgLeft ? "bg-[#F8FAFB]" : "bg-white"}`}
        >
          <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            {section.imgLeft ? (
              <>
                <img
                  src={section.imgUrl}
                  alt={section.title}
                  className="w-full h-[380px] object-cover rounded-[20px] shadow-[0_20px_60px_rgba(0,0,0,0.12)]"
                />
                <div>
                  <h2 className="font-display text-[clamp(26px,3vw,40px)] text-[#00201B] m-0 mb-5 font-normal leading-[1.2]">
                    {section.title}
                  </h2>
                  <p className="text-[16px] text-[#64748B] leading-[1.75] m-0">{section.body}</p>
                </div>
              </>
            ) : (
              <>
                <div>
                  <h2 className="font-display text-[clamp(26px,3vw,40px)] text-[#00201B] m-0 mb-5 font-normal leading-[1.2]">
                    {section.title}
                  </h2>
                  <p className="text-[16px] text-[#64748B] leading-[1.75] m-0">{section.body}</p>
                </div>
                <img
                  src={section.imgUrl}
                  alt={section.title}
                  className="w-full h-[380px] object-cover rounded-[20px] shadow-[0_20px_60px_rgba(0,0,0,0.12)]"
                />
              </>
            )}
          </div>
        </div>
      ))}

      {/* CTA strip */}
      <div className="bg-[#00201B] p-[64px_24px]">
        <div className="max-w-[1280px] mx-auto flex items-center justify-center gap-6 flex-wrap">
          <Link
            to="/canales"
            className="inline-flex items-center gap-2 bg-[#0D9488] hover:bg-[#005047] text-white rounded-xl py-4 px-8 text-[15px] font-bold no-underline transition-colors duration-200"
          >
            Ver canales <IconChevronRight className="w-[16px] h-[16px]" />
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 bg-transparent hover:bg-white/5 text-white rounded-xl border border-white/30 hover:border-white py-4 px-8 text-[15px] font-bold no-underline transition-[border-color,background-color] duration-200"
          >
            Dashboard <IconChevronRight className="w-[16px] h-[16px]" />
          </Link>
        </div>
      </div>
    </div>
  );
}
