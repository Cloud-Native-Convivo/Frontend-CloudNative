import { useContext } from "react";
import { Link } from "react-router";
import { AuthContext } from "../context/authContext";
import { IconHome, IconChevronRight, IconShield } from "../components/icons/Icons";

export default function NotFound() {
  const auth = useContext(AuthContext);
  const user = auth?.user ?? null;
  const gifSrc = `${import.meta.env.BASE_URL}This Is Fine GIF.gif`;

  return (
    <div className="relative min-h-screen bg-[#001714] text-white flex flex-col justify-between overflow-hidden selection:bg-teal-900 selection:text-teal-200">
      {/* Ambient background glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full bg-amber-500/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-80 h-80 rounded-full bg-primary/15 blur-3xl pointer-events-none" />

      {/* Grid texture overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Main Container */}
      <div className="relative z-10 max-w-page mx-auto px-6 py-12 md:py-20 w-full flex-1 flex flex-col justify-center">
        {/* Top bar status */}
        <div className="flex items-center justify-between pb-6 mb-12 border-b border-white/10">
          <Link to="/" className="inline-flex items-center gap-3 no-underline text-white group">
            <div className="w-9 h-9 rounded-md bg-primary flex items-center justify-center shadow-[0_4px_14px_rgba(13,148,136,0.35)] transition-transform group-hover:scale-105">
              <IconHome className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-display text-lg tracking-tight block leading-none">
                Convivo
              </span>
              <span className="text-xs uppercase font-semibold text-primary-on-dark tracking-wider">
                Gestión Residencial
              </span>
            </div>
          </Link>

          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
            </span>
            <span>Novedad en Conserjería</span>
          </div>
        </div>

        {/* 2-Column Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_460px] gap-12 lg:gap-16 items-center">
          {/* Left Column: Narrative & Actions */}
          <div className="flex flex-col items-start">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-300 mb-4">
              <span>◆</span>
              <span>Error 404 · Registro Extraviado</span>
            </div>

            <h1 className="font-display text-[clamp(34px,4.5vw,56px)] leading-[1.08] text-white tracking-[-0.02em] m-0 mb-5 font-normal">
              Todo está bajo control...{" "}
              <span className="font-display italic text-amber-300 block sm:inline drop-shadow-[0_0_20px_rgba(245,158,11,0.35)]">
                excepto que esta página no existe.
              </span>
            </h1>

            <p className="text-base sm:text-lg leading-[1.7] text-white/75 font-light max-w-content m-0 mb-8">
              Revisamos la torre de departamentos, consultamos el libro de novedades en conserjería
              y verificamos los planos del condominio. Concluimos que esta dirección se quemó o
              nunca fue construida.
            </p>

            {/* Incident Specifications Card */}
            <div className="w-full rounded-lg bg-white/5 border border-white/10 backdrop-blur-xl p-5 mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col">
                <span className="text-xs font-bold uppercase tracking-wider text-white/50 mb-1">
                  Código
                </span>
                <span className="font-mono text-xs font-semibold text-white">
                  ERR-404-COPROPIEDAD
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold uppercase tracking-wider text-white/50 mb-1">
                  Estado del Sector
                </span>
                <span className="text-xs font-semibold text-amber-300">
                  En llamas (pero serenos)
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold uppercase tracking-wider text-white/50 mb-1">
                  Protocolo
                </span>
                <span className="text-xs font-semibold text-white/90">Evacuar a zona segura</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 items-center mb-8 w-full sm:w-auto">
              <Link to="/" viewTransition className="btn btn-primary btn-lg">
                <span>Volver al inicio seguro</span>
                <IconChevronRight className="w-4 h-4 text-white" />
              </Link>
              <Link
                to="/login"
                viewTransition
                className="btn btn-secondary bg-transparent text-white border-white/30 hover:bg-white/10 hover:border-white/60 btn-lg"
              >
                <span>Iniciar sesión</span>
              </Link>
            </div>

            {/* Quick Links Recovery Dock */}
            <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-white/10 w-full text-xs text-white/60">
              <span className="font-medium mr-1">Rutas disponibles:</span>
              {user ? (
                <>
                  <Link
                    to="/mi-dashboard"
                    viewTransition
                    className="px-3 py-1 rounded-sm bg-white/5 border border-white/10 text-primary-on-dark no-underline transition-colors hover:bg-white/10 hover:text-white"
                  >
                    Mi panel
                  </Link>
                  <Link
                    to="/gastos"
                    viewTransition
                    className="px-3 py-1 rounded-sm bg-white/5 border border-white/10 text-primary-on-dark no-underline transition-colors hover:bg-white/10 hover:text-white"
                  >
                    Gastos comunes
                  </Link>
                  <Link
                    to="/espacios"
                    viewTransition
                    className="px-3 py-1 rounded-sm bg-white/5 border border-white/10 text-primary-on-dark no-underline transition-colors hover:bg-white/10 hover:text-white"
                  >
                    Espacios comunes
                  </Link>
                  <Link
                    to="/tablon"
                    viewTransition
                    className="px-3 py-1 rounded-sm bg-white/5 border border-white/10 text-primary-on-dark no-underline transition-colors hover:bg-white/10 hover:text-white"
                  >
                    Tablón de avisos
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/"
                    viewTransition
                    className="px-3 py-1 rounded-sm bg-white/5 border border-white/10 text-primary-on-dark no-underline transition-colors hover:bg-white/10 hover:text-white"
                  >
                    Inicio
                  </Link>
                  <Link
                    to="/precios"
                    viewTransition
                    className="px-3 py-1 rounded-sm bg-white/5 border border-white/10 text-primary-on-dark no-underline transition-colors hover:bg-white/10 hover:text-white"
                  >
                    Planes
                  </Link>
                  <Link
                    to="/privacidad"
                    viewTransition
                    className="px-3 py-1 rounded-sm bg-white/5 border border-white/10 text-primary-on-dark no-underline transition-colors hover:bg-white/10 hover:text-white"
                  >
                    Privacidad
                  </Link>
                  <Link
                    to="/terminos"
                    viewTransition
                    className="px-3 py-1 rounded-sm bg-white/5 border border-white/10 text-primary-on-dark no-underline transition-colors hover:bg-white/10 hover:text-white"
                  >
                    Términos
                  </Link>
                  <Link
                    to="/crear-cuenta"
                    viewTransition
                    className="px-3 py-1 rounded-sm bg-white/5 border border-white/10 text-primary-on-dark no-underline transition-colors hover:bg-white/10 hover:text-white"
                  >
                    Crear cuenta
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Right Column: Architectural Frame with This Is Fine GIF */}
          <div className="relative">
            {/* Ambient flame glow behind the card */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-amber-500/25 to-primary/20 blur-2xl rounded-lg pointer-events-none" />

            <div className="relative rounded-lg bg-[#121e1b]/90 border border-amber-500/35 p-5 sm:p-6 shadow-[0_24px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl text-white">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10 text-xs">
                <span className="font-mono font-bold tracking-wider text-amber-300 uppercase">
                  FIG. 404 · ESTADO ACTUAL
                </span>
                <span className="text-xs text-white/60 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                  CÁMARA CONSERJERÍA 24/7
                </span>
              </div>

              {/* GIF Container */}
              <div className="relative rounded-md overflow-hidden border border-white/15 bg-black/40 aspect-[16/10] shadow-inner group">
                <img
                  src={gifSrc}
                  alt="Conserjería confirmando que todo está bajo control frente al fuego"
                  loading="eager"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Caption */}
              <p className="mt-4 mb-0 text-xs leading-relaxed text-white/70 italic text-center">
                <strong className="text-amber-300 font-semibold not-italic">«This is fine.»</strong>{" "}
                — Bitácora fotográfica de conserjería mientras el comité revisa el plano del
                edificio.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 max-w-page mx-auto px-6 py-6 w-full border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/50">
        <div className="flex items-center gap-2">
          <IconShield className="w-3.5 h-3.5 text-primary-on-dark" />
          <span>Cumplimiento Ley 21.442 de Copropiedad Inmobiliaria</span>
        </div>
        <div>Convivo · Santiago de Chile</div>
      </footer>
    </div>
  );
}
