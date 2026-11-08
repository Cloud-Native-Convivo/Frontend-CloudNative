import { Link } from "react-router";
import { IconBell, IconCalendar, IconMessage, IconHome } from "../components/icons/Icons";
import { FlipCard } from "../components/FlipCard";

const flipCards = [
  {
    title: "Avisos del comité",
    desc: "Comunicados oficiales, mantenciones y cambios de reglamento.",
    icon: <IconBell className="w-[28px] h-[28px] text-primary" />,
  },
  {
    title: "Asambleas",
    desc: "Convocatorias con confirmación de asistencia directa desde la plataforma.",
    icon: <IconCalendar className="w-[28px] h-[28px] text-primary" />,
  },
  {
    title: "Publicaciones de residentes",
    desc: "Pérdidas, arriendos y noticias de la comunidad.",
    icon: <IconMessage className="w-[28px] h-[28px] text-primary" />,
  },
  {
    title: "Notificaciones push",
    desc: "Cada aviso nuevo llega a tu teléfono automáticamente.",
    icon: <IconHome className="w-[28px] h-[28px] text-primary" />,
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

// Sin servicio de avisos en el backend: la cartelera muestra estado vacío real.
export default function Tablon() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-text px-6 pb-16 pt-18">
        <div className="max-w-page mx-auto">
          <p className="text-xs font-bold text-white/45 tracking-wide mb-4">Cartelera digital</p>
          <h1 className="font-display text-[clamp(36px,5vw,64px)] text-white leading-[1.08] mb-5 font-normal">
            Tablón de avisos
          </h1>
          <p className="text-lg text-white/65 m-0 max-w-content leading-[1.65]">
            Información del condominio, siempre al día
          </p>
        </div>
      </div>

      <div className="bg-primary px-6 pb-9 pt-10">
        <div className="max-w-page mx-auto flex justify-between items-end flex-wrap gap-5">
          <div>
            <p className="text-xs font-bold text-white/60 tracking-wide mb-3">Cartelera digital</p>
            <h2 className="font-display text-[clamp(24px,3vw,36px)] text-white leading-[1.1] mb-3 font-normal">
              Tablón de Eventos y Avisos
            </h2>
            <p className="text-base text-white/72 m-0 max-w-content leading-[1.65]">
              Cartelera digital comunitaria con avisos, asambleas y comunicados del comité — en
              tiempo real.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-page mx-auto px-6 pb-20 pt-10">
        <div className="text-center py-16 text-text-muted">
          <p className="text-lg font-semibold">Sin avisos publicados</p>
          <p className="text-sm mt-1">La publicación de avisos aún no está disponible.</p>
        </div>
      </div>

      <div className="bg-white px-6 py-20">
        <div className="max-w-page mx-auto">
          <p className="text-xs font-bold text-primary tracking-wide mb-3">Funcionalidades</p>
          <h2 className="font-display text-[clamp(28px,3.5vw,44px)] text-text m-0 mb-12 font-normal">
            Todo lo que necesitas en un tablón
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
                  <div className="h-full bg-text rounded-lg p-6 flex flex-col justify-center text-center">
                    <p className="text-white/85 text-sm leading-[1.65] m-0">{card.desc}</p>
                  </div>
                }
              />
            ))}
          </div>
        </div>
      </div>

      {altSections.map((sec) => (
        <div key={sec.title} className={`py-18 px-6 ${sec.imgLeft ? "bg-slate-50" : "bg-white"}`}>
          <div
            className={`max-w-page mx-auto flex items-center gap-16 flex-wrap ${
              sec.imgLeft ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div className="flex-[1_1_400px]">
              <p className="text-xs font-bold text-primary tracking-wide mb-3">
                Comunidad conectada
              </p>
              <h2 className="font-display text-[clamp(26px,3vw,40px)] text-text m-0 mb-5 font-normal leading-[1.15]">
                {sec.title}
              </h2>
              <p className="text-base text-text-muted leading-[1.75] m-0">{sec.body}</p>
            </div>
            <div className="flex-[1_1_360px]">
              <img
                src={sec.imgUrl}
                alt={sec.title}
                width="700"
                height="500"
                className="w-full rounded-lg block shadow-[0_16px_48px_rgba(0,0,0,0.1)]"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      ))}

      <div className="bg-text px-6 py-16">
        <div className="max-w-page mx-auto flex items-center justify-center gap-6 flex-wrap">
          <Link to="/tablon" className="btn btn-primary btn-lg">
            Ver los avisos
          </Link>
        </div>
      </div>
    </div>
  );
}
