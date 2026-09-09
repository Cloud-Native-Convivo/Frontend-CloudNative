import { useState } from "react";
import { Link } from "react-router";
import { registroFotos } from "../lib/data";
import { FlipCard } from "../components/FlipCard";
import {
  IconCamera,
  IconEye,
  IconDownload,
  IconCheck,
  IconDollar,
  IconCalendar,
  IconUsers,
  IconChevronRight,
} from "../components/icons/Icons";

const categorias = [
  "Todos",
  "Jardinería",
  "Pintura",
  "Mantención eléctrica",
  "Limpieza de fachada",
];

interface RegistroItem {
  id: string;
  titulo: string;
  categoria: string;
  fecha: string;
  responsable: string;
  monto: string;
  estado: string;
  boleta: string;
  antes: string;
  despues: string;
}

interface RegistroCardProps {
  registro: RegistroItem;
  onOpen: () => void;
}

interface FlipCardData {
  title: string;
  desc: string;
  icon: React.ReactNode;
}

interface AltSection {
  title: string;
  body: string;
  imgUrl: string;
  imgLeft: boolean;
}

const flipCards: FlipCardData[] = [
  {
    title: "Antes y después",
    desc: "Cada intervención documentada con foto de inicio y resultado.",
    icon: <IconCamera className="w-[28px] h-[28px] text-[#0D9488]" />,
  },
  {
    title: "Vinculado al gasto",
    desc: "El registro está enlazado al gasto del dashboard. Todo conectado.",
    icon: <IconDollar className="w-[28px] h-[28px] text-[#0D9488]" />,
  },
  {
    title: "Historial completo",
    desc: "Accede a toda la bitácora histórica, ordenada por fecha y tipo.",
    icon: <IconCalendar className="w-[28px] h-[28px] text-[#0D9488]" />,
  },
  {
    title: "Con responsable",
    desc: "Cada trabajo muestra el proveedor, monto y boleta adjunta.",
    icon: <IconUsers className="w-[28px] h-[28px] text-[#0D9488]" />,
  },
];

const altSections: AltSection[] = [
  {
    title: "Transparencia visual",
    body: "El registro fotográfico permite que cualquier residente pueda verificar el estado real del trabajo realizado. Antes y después, con fecha exacta y responsable identificado. La rendición de cuentas nunca fue tan clara.",
    imgUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=700&h=500&fit=crop",
    imgLeft: true,
  },
  {
    title: "Para el comité",
    body: "El comité cuenta con una bitácora completa de todas las intervenciones del condominio. Cada gasto respaldado con fotografía y boleta adjunta, accesible desde el dashboard en cualquier momento.",
    imgUrl: "https://images.unsplash.com/photo-1609921141835-710b7fa6e438?w=700&h=500&fit=crop",
    imgLeft: false,
  },
];

function RegistroCard({ registro, onOpen }: RegistroCardProps) {
  const [showBefore, setShowBefore] = useState(true);

  return (
    <div className="group rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.09)] hover:-translate-y-[3px] transition-[shadow,transform] duration-250 ease-out">
      <div className="relative h-[200px] bg-slate-200 overflow-hidden">
        <img
          src={showBefore ? registro.antes : registro.despues}
          alt={showBefore ? "Antes" : "Después"}
          className="w-full h-full object-cover transition-opacity duration-300"
        />
        <div className="absolute top-3 left-3 flex gap-1">
          {["Antes", "Después"].map((label, i) => {
            const isActive = (showBefore && i === 0) || (!showBefore && i === 1);
            return (
              <button
                key={label}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowBefore(i === 0);
                }}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold cursor-pointer border-none transition-colors duration-150 text-[#00201B] ${
                  isActive ? "bg-white" : "bg-white/50"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
        <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-[4px] text-white text-[11px] font-medium px-2.5 py-1 rounded-full">
          {registro.categoria}
        </div>
      </div>

      <div className="pt-[18px] px-[18px] pb-[20px]">
        <div className="flex justify-between mb-1.5">
          <span className="text-[11px] text-slate-400">{registro.fecha}</span>
          <span className="text-[11px] text-slate-400">{registro.id}</span>
        </div>
        <h3 className="font-display text-base text-[#00201B] m-0 mb-1.5 font-normal leading-snug">
          {registro.titulo}
        </h3>
        <div className="text-[13px] text-slate-500 mb-1">{registro.responsable}</div>
        <div className="text-[14px] font-bold text-[#00201B] mb-3.5">{registro.monto}</div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5 text-[12px] text-teal-600 font-medium">
            <IconCheck className="w-[12px] h-[12px]" /> {registro.boleta}
          </div>
          <button
            onClick={onOpen}
            className="flex items-center gap-1.5 bg-teal-50 border border-teal-100 text-[#005047] rounded-lg px-3.5 py-2 text-[13px] font-semibold cursor-pointer transition-colors duration-200 hover:bg-teal-100"
          >
            <IconEye className="w-[14px] h-[14px]" /> Ver detalle
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Registro() {
  const [activeCat, setActiveCat] = useState("Todos");
  const [selected, setSelected] = useState<RegistroItem | null>(null);
  const [showBefore, setShowBefore] = useState(true);

  const filtered = registroFotos.filter((r) => activeCat === "Todos" || r.categoria === activeCat);

  return (
    <div className="min-h-screen bg-[#F8FAFB]">
      {/* Dark hero header */}
      <div className="bg-[#00201B] p-[72px_24px_64px]">
        <div className="max-w-[1280px] mx-auto">
          <p className="text-[11px] font-bold text-white/45 tracking-[0.14em] uppercase mb-4">
            Bitácora fotográfica
          </p>
          <h1 className="font-display text-[clamp(36px,5vw,64px)] text-white leading-[1.08] m-0 mb-[18px] font-normal">
            Registro fotográfico
          </h1>
          <p className="text-[19px] text-white/65 m-0 max-w-[540px] leading-[1.65]">
            Control de calidad verificable
          </p>
        </div>
      </div>

      {/* Existing gradient header strip */}
      <div className="bg-gradient-to-br from-[#0D9488] to-[#005047] p-[40px_24px_36px]">
        <div className="max-w-[1280px] mx-auto">
          <p className="text-[11px] font-bold text-white/60 tracking-[0.12em] uppercase mb-2.5">
            Bitácora fotográfica
          </p>
          <h2 className="font-display text-[clamp(24px,3vw,36px)] text-white leading-[1.1] m-0 mb-2.5 font-normal">
            Registro Fotográfico
          </h2>
          <p className="text-[15px] text-white/70 m-0 max-w-[560px] leading-[1.65]">
            Control de calidad verificable por todos los residentes. Cada intervención documentada
            con fotos de antes y después, fecha, responsable y boleta adjunta.
          </p>
        </div>
      </div>

      {/* Main registro content */}
      <div className="max-w-[1280px] mx-auto p-[40px_24px_80px]">
        {/* Stats */}
        <div className="flex flex-wrap gap-4 mb-7">
          {[
            {
              val: registroFotos.length,
              label: "Trabajos registrados",
              colorClass: "text-[#0D9488]",
            },
            {
              val: registroFotos.filter((r) => r.estado === "Completado").length,
              label: "Completados",
              colorClass: "text-[#005047]",
            },
            { val: "100%", label: "Con boleta adjunta", colorClass: "text-[#14B8A6]" },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white border border-slate-200 rounded-xl px-5 py-4 flex items-center gap-3"
            >
              <span className={`font-display text-[28px] ${s.colorClass}`}>{s.val}</span>
              <span className="text-[13px] text-slate-500 max-w-[100px] leading-snug">
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="flex flex-wrap gap-2 mb-7">
          {categorias.map((c) => {
            const isActive = activeCat === c;
            return (
              <button
                key={c}
                onClick={() => setActiveCat(c)}
                className={`px-4 py-2 rounded-full text-[13px] font-medium cursor-pointer border transition-colors duration-150 ${
                  isActive
                    ? "border-teal-600 bg-teal-600 text-white"
                    : "border-slate-200 bg-white text-slate-500"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>

        {/* Cards */}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-[22px]">
          {filtered.map((r) => (
            <RegistroCard
              key={r.id}
              registro={r}
              onOpen={() => {
                setSelected(r);
                setShowBefore(true);
              }}
            />
          ))}
        </div>
      </div>

      {/* Sub-features flip cards */}
      <div className="bg-[#fff] p-[80px_24px]">
        <div className="max-w-[1280px] mx-auto">
          <p className="text-[11px] font-bold text-teal-600 tracking-[0.14em] uppercase mb-3">
            Funcionalidades
          </p>
          <h2 className="font-display text-[clamp(28px,3.5vw,44px)] text-[#00201B] m-0 mb-12 font-normal">
            Cada trabajo, completamente documentado
          </h2>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-5">
            {flipCards.map((card) => (
              <FlipCard
                key={card.title}
                height={200}
                front={
                  <div className="h-full bg-slate-50 rounded-2xl border border-slate-200 flex flex-col items-center justify-center p-6 text-center gap-3.5">
                    {card.icon}
                    <span className="text-[15px] font-bold text-[#00201B] leading-snug">
                      {card.title}
                    </span>
                  </div>
                }
                back={
                  <div className="h-full bg-teal-600 rounded-2xl flex items-center justify-center p-6 text-center">
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
          className={`py-20 px-6 ${section.imgLeft ? "bg-slate-50" : "bg-white"}`}
        >
          <div className="max-w-[1280px] mx-auto grid grid-cols-2 gap-16 items-center">
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
                  <p className="text-base text-slate-500 leading-relaxed m-0">{section.body}</p>
                </div>
              </>
            ) : (
              <>
                <div>
                  <h2 className="font-display text-[clamp(26px,3vw,40px)] text-[#00201B] m-0 mb-5 font-normal leading-[1.2]">
                    {section.title}
                  </h2>
                  <p className="text-base text-slate-500 leading-relaxed m-0">{section.body}</p>
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
            to="/registro"
            className="inline-flex items-center gap-2 bg-teal-600 text-white rounded-xl px-8 py-4 text-[15px] font-bold no-underline transition-colors duration-200 hover:bg-[#005047]"
          >
            Ver registros <IconChevronRight className="w-[16px] h-[16px]" />
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 bg-transparent text-white rounded-xl border border-white/30 px-8 py-4 text-[15px] font-bold no-underline transition-[border-color,background-color] duration-200 hover:border-white hover:bg-white/5"
          >
            Dashboard <IconChevronRight className="w-[16px] h-[16px]" />
          </Link>
        </div>
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-5">
          <button
            type="button"
            aria-label="Cerrar"
            onClick={() => setSelected(null)}
            className="absolute inset-0 bg-[#00201B]/65 backdrop-blur-md border-none p-0 cursor-default"
          />
          <div className="relative bg-white rounded-[20px] w-full max-w-[680px] max-h-[90vh] overflow-y-auto shadow-[0_32px_80px_rgba(0,0,0,0.25)]">
            <div className="relative h-[320px] bg-slate-200 overflow-hidden rounded-[20px_20px_0_0]">
              <img
                src={showBefore ? selected.antes : selected.despues}
                alt={showBefore ? "Antes" : "Después"}
                className="w-full h-full object-cover transition-opacity duration-300"
              />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {["Antes", "Después"].map((label, i) => {
                  const isActive = (showBefore && i === 0) || (!showBefore && i === 1);
                  return (
                    <button
                      key={label}
                      onClick={() => setShowBefore(i === 0)}
                      className={`px-5 py-2 rounded-full text-[13px] font-semibold cursor-pointer border-none transition-colors duration-200 ${
                        isActive ? "bg-white text-[#00201B]" : "bg-white/40 text-white"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setSelected(null)}
                aria-label="Cerrar"
                className="absolute top-4 right-4 bg-black/50 border-none rounded-full w-9 h-9 flex items-center justify-center cursor-pointer text-white"
              >
                ✕
              </button>
            </div>

            <div className="px-7 pt-7 pb-8">
              <div className="flex justify-between items-start gap-3 mb-4">
                <div>
                  <span className="text-[11px] font-bold text-[#005047] bg-teal-100 px-2.5 py-1 rounded-md inline-block mb-2">
                    {selected.categoria}
                  </span>
                  <h2 className="font-display text-[22px] text-[#00201B] m-0 font-normal leading-tight">
                    {selected.titulo}
                  </h2>
                </div>
                <span className="text-[11px] text-slate-400 whitespace-nowrap mt-1">
                  {selected.id}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-5">
                {[
                  { label: "Fecha", val: selected.fecha },
                  { label: "Responsable", val: selected.responsable },
                  { label: "Monto", val: selected.monto },
                  { label: "Estado", val: selected.estado },
                ].map((f) => (
                  <div key={f.label}>
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.08em] mb-1">
                      {f.label}
                    </div>
                    <div className="text-[14px] font-semibold text-[#00201B]">{f.val}</div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between bg-teal-50 rounded-lg px-4 py-3.5">
                <div className="flex items-center gap-2 text-[13px] text-[#005047] font-semibold">
                  <IconCheck className="w-[16px] h-[16px]" /> Boleta adjunta: {selected.boleta}
                </div>
                <button className="flex items-center gap-1.5 bg-transparent border-none text-teal-600 text-[13px] font-semibold cursor-pointer">
                  <IconDownload className="w-[14px] h-[14px]" /> Descargar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
