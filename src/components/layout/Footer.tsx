import { Link } from "react-router";
import { IconHome } from "../icons/Icons";

const linkClass =
  "block text-[13px] text-white/45 mb-[10px] no-underline transition-colors duration-150 hover:text-white";

const PLATAFORMA = [
  { label: "Reservas", to: "/reservas" },
  { label: "Gastos comunes", to: "/gastos" },
  { label: "Tablón de avisos", to: "/tablon" },
  { label: "Dashboard", to: "/dashboard" },
  { label: "Registro fotográfico", to: "/registro" },
  { label: "Precios", to: "/precios" },
];

const EMERGENCIAS = [
  { label: "Carabineros 133", tel: "133" },
  { label: "Bomberos 132", tel: "132" },
  { label: "SAMU 131", tel: "131" },
];

export function Footer() {
  return (
    <footer className="bg-text text-white/55 pt-[52px] pb-[28px] px-[24px]">
      <div className="max-w-[1280px] mx-auto">
        <div className="footer-grid grid grid-cols-[2fr_1fr_1fr] gap-[40px] mb-[40px]">
          <div>
            <div className="flex items-center gap-[10px] mb-[16px]">
              <div className="w-[32px] h-[32px] rounded-[8px] bg-primary flex items-center justify-center">
                <IconHome className="text-white w-[16px] h-[16px]" />
              </div>
              <span className="font-display text-[18px] text-white">Convivo</span>
            </div>
            <p className="text-[13px] leading-[1.7] max-w-[260px] m-0 text-white/50">
              Plataforma digital para la gestión de condominios en Chile. Tranquilidad, comunidad y
              confianza.
            </p>
          </div>
          <nav aria-label="Plataforma">
            <div className="text-[11px] font-bold text-primary-on-dark tracking-wide mb-[16px]">
              Plataforma
            </div>
            {PLATAFORMA.map((l) => (
              <Link key={l.to} to={l.to} className={linkClass}>
                {l.label}
              </Link>
            ))}
          </nav>
          <div>
            <div className="text-[11px] font-bold text-primary-on-dark tracking-wide mb-[16px]">
              Emergencias
            </div>
            {EMERGENCIAS.map((e) => (
              <a key={e.tel} href={`tel:${e.tel}`} className={linkClass}>
                {e.label}
              </a>
            ))}
            <p className="text-[13px] text-white/45 m-0">Conserjería: interno 100</p>
          </div>
        </div>
        <div className="border-t border-white/5 pt-[20px] flex justify-between flex-wrap gap-[8px]">
          <p className="text-[12px] m-0">© 2026 Convivo SpA. Todos los derechos reservados.</p>
          <nav aria-label="Legal" className="flex gap-[16px] text-[12px]">
            <Link to="/privacidad" className="text-white/55 no-underline hover:text-white">
              Privacidad
            </Link>
            <Link to="/terminos" className="text-white/55 no-underline hover:text-white">
              Términos
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
