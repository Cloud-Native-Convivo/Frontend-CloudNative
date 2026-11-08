import { Link } from "react-router";
import { FlipCard } from "../components/FlipCard";
import { IconCamera, IconDollar, IconCalendar, IconUsers } from "../components/icons/Icons";

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
    icon: <IconCamera className="w-[28px] h-[28px] text-primary" />,
  },
  {
    title: "Vinculado al gasto",
    desc: "El registro está enlazado al gasto del dashboard. Todo conectado.",
    icon: <IconDollar className="w-[28px] h-[28px] text-primary" />,
  },
  {
    title: "Historial completo",
    desc: "Accede a toda la bitácora histórica, ordenada por fecha y tipo.",
    icon: <IconCalendar className="w-[28px] h-[28px] text-primary" />,
  },
  {
    title: "Con responsable",
    desc: "Cada trabajo muestra el proveedor, monto y boleta adjunta.",
    icon: <IconUsers className="w-[28px] h-[28px] text-primary" />,
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

export default function Registro() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Dark hero header */}
      <div className="bg-text p-[72px_24px_64px]">
        <div className="max-w-page mx-auto">
          <p className="text-xs font-bold text-white/45 tracking-wide mb-4">Bitácora fotográfica</p>
          <h1 className="font-display text-[clamp(36px,5vw,64px)] text-white leading-[1.08] m-0 mb-5 font-normal">
            Registro fotográfico
          </h1>
          <p className="text-lg text-white/65 m-0 max-w-content leading-[1.65]">
            Control de calidad verificable
          </p>
        </div>
      </div>

      {/* Existing gradient header strip */}
      <div className="bg-primary p-[40px_24px_36px]">
        <div className="max-w-page mx-auto">
          <p className="text-xs font-bold text-white/60 tracking-wide mb-3">Bitácora fotográfica</p>
          <h2 className="font-display text-[clamp(24px,3vw,36px)] text-white leading-[1.1] m-0 mb-3 font-normal">
            Registro Fotográfico
          </h2>
          <p className="text-base text-white/70 m-0 max-w-content leading-[1.65]">
            Control de calidad verificable por todos los residentes. Cada intervención documentada
            con fotos de antes y después, fecha, responsable y boleta adjunta.
          </p>
        </div>
      </div>

      {/* Main registro content */}
      <div className="max-w-page mx-auto p-[40px_24px_80px]">
        <div className="text-center py-16 text-slate-500">
          <p className="text-lg font-semibold">Sin trabajos registrados</p>
          <p className="text-sm mt-1">El registro fotográfico aún no está disponible.</p>
        </div>
      </div>

      {/* Sub-features flip cards */}
      <div className="bg-white p-[80px_24px]">
        <div className="max-w-page mx-auto">
          <p className="text-xs font-bold text-teal-600 tracking-wide mb-3">Funcionalidades</p>
          <h2 className="font-display text-[clamp(28px,3.5vw,44px)] text-text m-0 mb-12 font-normal">
            Cada trabajo, completamente documentado
          </h2>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-5">
            {flipCards.map((card) => (
              <FlipCard
                key={card.title}
                height={200}
                front={
                  <div className="h-full bg-slate-50 rounded-lg border border-slate-200 flex flex-col items-center justify-center p-6 text-center gap-4">
                    {card.icon}
                    <span className="text-base font-bold text-text leading-snug">{card.title}</span>
                  </div>
                }
                back={
                  <div className="h-full bg-teal-600 rounded-lg flex items-center justify-center p-6 text-center">
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
          <div className="max-w-page mx-auto grid grid-cols-2 gap-16 items-center">
            {section.imgLeft ? (
              <>
                <img
                  src={section.imgUrl}
                  alt={section.title}
                  className="w-full h-[380px] object-cover rounded-lg shadow-[0_20px_60px_rgba(0,0,0,0.12)]"
                  loading="lazy"
                  decoding="async"
                />
                <div>
                  <h2 className="font-display text-[clamp(26px,3vw,40px)] text-text m-0 mb-5 font-normal leading-[1.2]">
                    {section.title}
                  </h2>
                  <p className="text-base text-slate-500 leading-relaxed m-0">{section.body}</p>
                </div>
              </>
            ) : (
              <>
                <div>
                  <h2 className="font-display text-[clamp(26px,3vw,40px)] text-text m-0 mb-5 font-normal leading-[1.2]">
                    {section.title}
                  </h2>
                  <p className="text-base text-slate-500 leading-relaxed m-0">{section.body}</p>
                </div>
                <img
                  src={section.imgUrl}
                  alt={section.title}
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
          <Link to="/registro" className="btn btn-primary btn-lg">
            Ver registros
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
