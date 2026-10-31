import { Link } from "react-router";
import { IconHome } from "../icons/Icons";

const linkClass =
  "block text-sm text-white/45 mb-3 no-underline transition-colors duration-150 hover:text-white";

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
    <footer className="bg-text text-white/55 pt-13 pb-7 px-6">
      <div className="max-w-page mx-auto">
        <div className="footer-grid grid grid-cols-[2fr_1fr_1fr] gap-10 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-[32px] h-[32px] rounded-md bg-primary flex items-center justify-center">
                <IconHome className="text-white w-[16px] h-[16px]" />
              </div>
              <span className="font-display text-lg text-white">Convivo</span>
            </div>
            <p className="text-sm leading-[1.7] max-w-[260px] m-0 text-white/50">
              Plataforma digital para la gestión de condominios en Chile. Tranquilidad, comunidad y
              confianza.
            </p>
          </div>
          <nav aria-label="Plataforma">
            <div className="text-xs font-bold text-primary-on-dark tracking-wide mb-4">
              Plataforma
            </div>
            {PLATAFORMA.map((l) => (
              <Link key={l.to} to={l.to} className={linkClass}>
                {l.label}
              </Link>
            ))}
          </nav>
          <div>
            <div className="text-xs font-bold text-primary-on-dark tracking-wide mb-4">
              Emergencias
            </div>
            {EMERGENCIAS.map((e) => (
              <a key={e.tel} href={`tel:${e.tel}`} className={linkClass}>
                {e.label}
              </a>
            ))}
            <p className="text-sm text-white/45 m-0">Conserjería: interno 100</p>
          </div>
        </div>
        <div className="border-t border-white/5 pt-5 flex justify-between flex-wrap gap-2">
          <p className="text-xs m-0">© 2026 Convivo SpA. Todos los derechos reservados.</p>
          <nav aria-label="Legal" className="flex gap-4 text-xs">
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
