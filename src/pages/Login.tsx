import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import {
  IconGoogle,
  IconEye,
  IconEyeOff,
  IconLock,
  IconMail,
  IconShield,
  IconChevronRight,
} from "../components/icons/Icons";
import { useAuth } from "../hooks/useAuth";
import { rutaPrincipalPorRol } from "../auth/sesion";
import { iniciarSesionResidenteMock } from "../auth/mockAuth";
import {
  buildGoogleAuthorizeUrl,
  checkCognitoReachability,
  isCognitoConfigured,
} from "../auth/cognitoAuth";

interface FormState {
  email: string;
  password: string;
}

interface FieldError {
  email?: string;
  password?: string;
}

function validate(form: FormState): FieldError {
  const errors: FieldError = {};
  if (!form.email.trim()) {
    errors.email = "El correo es obligatorio.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Ingresa un correo válido.";
  }
  if (!form.password) {
    errors.password = "La contraseña es obligatoria.";
  } else if (form.password.length < 6) {
    errors.password = "Mínimo 6 caracteres.";
  }
  return errors;
}

export default function Login() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [form, setForm] = useState<FormState>({ email: "", password: "" });
  const [errors, setErrors] = useState<FieldError>({});
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isConnectingGoogle, setIsConnectingGoogle] = useState(false);
  const [isConnectingMock, setIsConnectingMock] = useState(false);
  const submitted = useRef(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!user) return;
    navigate(rutaPrincipalPorRol(user.role), { replace: true });
  }, [user, navigate]);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 15);
    return () => clearTimeout(t);
  }, []);

  async function handleMockLogin() {
    setIsConnectingMock(true);
    try {
      const mockUser = await iniciarSesionResidenteMock();
      setUser(mockUser);
      navigate(rutaPrincipalPorRol(mockUser.role), { replace: true });
    } catch (err) {
      console.error("Error al iniciar sesión mock:", err);
      setIsConnectingMock(false);
    }
  }

  async function handleGoogleLogin() {
    setIsConnectingGoogle(true);
    try {
      if (!isCognitoConfigured()) {
        navigate("/auth/error?reason=config_missing");
        return;
      }
      const isReachable = await checkCognitoReachability(2500);
      if (!isReachable) {
        navigate("/auth/error?reason=connection_failed");
        return;
      }
      const authorizeUrl = await buildGoogleAuthorizeUrl();
      window.location.assign(authorizeUrl);
    } catch {
      setIsConnectingGoogle(false);
      navigate("/auth/error?reason=connection_failed");
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (submitted.current) setErrors(validate({ ...form, [name]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    submitted.current = true;
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      // In a production environment with direct username/password SRP
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#FAFAF7]">
      {/* ── Left Hero Architectural Showcase ─────────────────────────────── */}
      <aside
        aria-label="Panel institucional de Convivo"
        className={`relative hidden lg:flex flex-col justify-between w-full lg:w-[460px] xl:w-[540px] shrink-0 bg-[#001714] text-white p-10 xl:p-14 overflow-hidden transition-all duration-500 ease-out ${
          mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"
        }`}
      >
        {/* Ambient atmospheric layers */}
        <div
          className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-emerald-500/20 blur-[90px] pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute top-1/2 -right-20 w-96 h-96 rounded-full bg-teal-600/15 blur-[110px] pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-24 left-1/4 w-72 h-72 rounded-full bg-amber-500/10 blur-[80px] pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"
          aria-hidden="true"
        />

        {/* Top: Logo & System status beacon */}
        <div className="relative z-10 flex items-center justify-between">
          <Link
            to="/"
            viewTransition
            className="group inline-flex items-center gap-3 no-underline text-white rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#001714]"
            aria-label="Volver a la portada de Convivo"
          >
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center font-display font-bold text-white text-lg shadow-[0_4px_16px_rgba(13,148,136,0.35)] transition-transform group-hover:scale-105">
              C
            </div>
            <div className="flex flex-col">
              <span className="font-display text-2xl text-white tracking-tight leading-none">
                Convivo
              </span>
              <span className="text-[10px] uppercase tracking-widest text-emerald-300 font-semibold mt-1">
                Portal Residencial
              </span>
            </div>
          </Link>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-[11px] font-medium text-emerald-300 backdrop-blur-sm">
            <span
              className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"
              aria-hidden="true"
            />
            <span>Conserjería en línea</span>
          </div>
        </div>

        {/* Center: Editorial headline */}
        <div className="relative z-10 my-10 space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-2">
            <span className="w-4 h-px bg-emerald-400" aria-hidden="true" />
            <span>Copropiedad Inteligente</span>
          </div>
          <h1 className="font-display text-4xl xl:text-5xl text-white leading-[1.12] tracking-tight">
            Tu condominio,
            <br />
            <span className="text-primary-on-dark italic font-normal">en sintonía digital.</span>
          </h1>
          <p className="text-white/80 text-sm xl:text-base leading-relaxed max-w-md">
            Gestiona gastos comunes con trazabilidad bancaria, reserva quinchos y autoriza visitas
            desde un acceso seguro y unificado.
          </p>
        </div>

        {/* Bottom: Security standards assurance */}
        <div className="relative z-10 pt-6 border-t border-white/10 space-y-2.5">
          <div className="flex items-center gap-2 text-xs text-white font-medium">
            <IconShield className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
            <span>Ley 21.442 Chile</span>
          </div>
          <p className="text-xs text-white/70 leading-relaxed">
            Cifrado de extremo a extremo conforme al marco normativo de copropiedad inmobiliaria.
          </p>
        </div>
      </aside>

      {/* ── Right Access Concierge Form ──────────────────────────────────── */}
      <main
        className={`flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-14 transition-all duration-500 delay-100 ease-out ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        {/* Top utility bar */}
        <div className="flex items-center justify-between w-full max-w-md mx-auto">
          {/* Mobile Logo */}
          <Link
            to="/"
            viewTransition
            className="lg:hidden inline-flex items-center gap-2.5 no-underline text-text rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700"
            aria-label="Volver a la portada de Convivo"
          >
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-display font-bold text-white text-base shadow-xs">
              C
            </div>
            <span className="font-display text-xl text-text font-bold">Convivo</span>
          </Link>

          <Link
            to="/"
            viewTransition
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-950 transition-colors group rounded-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700"
          >
            <span className="transition-transform group-hover:-translate-x-1" aria-hidden="true">
              ←
            </span>
            <span>Volver al sitio</span>
          </Link>

          <span className="text-xs text-slate-600">
            ¿Necesitas ayuda?{" "}
            <a
              href="mailto:soporte@convivo.cl"
              className="text-teal-800 hover:text-teal-950 font-semibold underline underline-offset-2 rounded-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700"
            >
              Mesa de ayuda
            </a>
          </span>
        </div>

        {/* Center Form Section */}
        <div className="w-full max-w-md mx-auto my-auto py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-900 text-[11px] font-bold uppercase tracking-wider mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" aria-hidden="true" />
              <span>Acceso de Residentes</span>
            </div>
            <h2 className="font-display text-text text-3xl sm:text-4xl tracking-tight mb-2">
              Bienvenido
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Ingresa con tu cuenta de residente para administrar tu departamento y espacios
              comunes.
            </p>
          </div>

          {/* Primary Action: Google SSO button */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isConnectingGoogle}
              aria-busy={isConnectingGoogle}
              className="w-full relative group flex items-center justify-center gap-3 bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 text-slate-900 font-semibold text-sm py-3.5 px-4 rounded-xl shadow-xs hover:shadow-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {isConnectingGoogle ? (
                <div
                  className="w-5 h-5 border-2 border-teal-700 border-t-transparent rounded-full animate-spin"
                  aria-hidden="true"
                />
              ) : (
                <IconGoogle className="w-5 h-5 shrink-0" aria-hidden="true" />
              )}
              <span className="text-sm font-semibold text-slate-900">
                {isConnectingGoogle ? "Conectando con Google…" : "Continuar con Google"}
              </span>
            </button>
            <p className="text-center text-xs text-slate-600 flex items-center justify-center gap-1.5">
              <IconShield className="w-3.5 h-3.5 text-emerald-700 shrink-0" aria-hidden="true" />
              <span>Acceso seguro y verificado con tu cuenta de Google</span>
            </p>
          </div>

          {/* Editorial divider */}
          <div className="my-7 flex items-center gap-3" aria-hidden="true">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-600">
              o con credenciales
            </span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5"
              >
                Correo electrónico
              </label>
              <div className="relative">
                <div
                  className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500"
                  aria-hidden="true"
                >
                  <IconMail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  aria-invalid={!!errors.email}
                  className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-base sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-teal-700 focus:ring-2 focus:ring-teal-700/25 bg-white ${
                    errors.email
                      ? "border-rose-600 bg-rose-50/40 focus:border-rose-700 focus:ring-rose-700/20"
                      : "border-slate-300 hover:border-slate-400"
                  }`}
                  placeholder="ejemplo@micondominio.cl"
                />
              </div>
              {errors.email && (
                <p
                  id="email-error"
                  role="alert"
                  className="mt-1.5 text-xs text-rose-700 flex items-center gap-1 font-semibold"
                >
                  <span aria-hidden="true">⚠</span> {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-bold text-slate-900 uppercase tracking-wider"
                >
                  Contraseña
                </label>
                <Link
                  to="/auth/recuperar-clave"
                  className="text-xs text-teal-800 font-semibold hover:text-teal-950 hover:underline rounded-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700"
                >
                  ¿Olvidaste tu clave?
                </Link>
              </div>
              <div className="relative">
                <div
                  className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500"
                  aria-hidden="true"
                >
                  <IconLock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={handleChange}
                  aria-describedby={errors.password ? "password-error" : undefined}
                  aria-invalid={!!errors.password}
                  className={`w-full pl-10 pr-11 py-2.5 rounded-xl border text-base sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-teal-700 focus:ring-2 focus:ring-teal-700/25 bg-white ${
                    errors.password
                      ? "border-rose-600 bg-rose-50/40 focus:border-rose-700 focus:ring-rose-700/20"
                      : "border-slate-300 hover:border-slate-400"
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 rounded-md transition-colors cursor-pointer"
                  aria-label={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
                  aria-controls="password"
                >
                  {showPassword ? (
                    <IconEyeOff className="w-4 h-4" aria-hidden="true" />
                  ) : (
                    <IconEye className="w-4 h-4" aria-hidden="true" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p
                  id="password-error"
                  role="alert"
                  className="mt-1.5 text-xs text-rose-700 flex items-center gap-1 font-semibold"
                >
                  <span aria-hidden="true">⚠</span> {errors.password}
                </p>
              )}
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded-sm border-slate-400 text-teal-700 focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 accent-teal-700 cursor-pointer"
                />
                <span className="text-xs text-slate-700 font-medium">Recordar mi dispositivo</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-primary hover:bg-accent text-white font-bold text-sm py-3.5 rounded-xl shadow-[0_4px_16px_rgba(13,148,136,0.25)] hover:shadow-[0_6px_20px_rgba(13,148,136,0.35)] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2"
            >
              Ingresar
            </button>
          </form>

          {/* Dev Mode Local Mock Login */}
          {import.meta.env.DEV && (
            <div className="mt-6 p-4 rounded-xl bg-slate-900 border border-slate-800 text-left">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400" aria-hidden="true" />
                  Entorno Local de Pruebas
                </span>
                <span className="text-[10px] text-slate-400 font-mono">DEV MODE</span>
              </div>
              <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                Inicia sesión al instante con un perfil simulado de residente activo para pruebas
                locales.
              </p>
              <button
                type="button"
                onClick={handleMockLogin}
                disabled={isConnectingMock}
                className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs py-2.5 px-3 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
              >
                <span aria-hidden="true">⚡</span>
                <span>
                  {isConnectingMock
                    ? "Iniciando sesión demo…"
                    : "Ingresar como Residente Demo (Local)"}
                </span>
              </button>
            </div>
          )}

          {/* Legal disclaimer */}
          <p className="mt-6 text-center text-xs leading-relaxed text-slate-600">
            Al continuar te pediremos aceptar los{" "}
            <Link
              to="/terminos"
              viewTransition
              className="text-teal-800 hover:text-teal-950 font-semibold underline underline-offset-2 rounded-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700"
            >
              Términos de uso
            </Link>{" "}
            y la{" "}
            <Link
              to="/privacidad"
              viewTransition
              className="text-teal-800 hover:text-teal-950 font-semibold underline underline-offset-2 rounded-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700"
            >
              Política de privacidad
            </Link>
            .
          </p>

          {/* Registration link */}
          <div className="mt-6 pt-5 border-t border-slate-200 flex items-center justify-between text-xs">
            <span className="text-slate-600">¿Eres nuevo en tu edificio?</span>
            <Link
              to="/crear-cuenta"
              viewTransition
              className="inline-flex items-center gap-1 text-teal-800 font-bold hover:text-teal-950 hover:underline transition-colors rounded-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700"
            >
              <span>Crear cuenta</span>
              <IconChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* Bottom micro-footer */}
        <div className="w-full max-w-md mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600">
          <span>Convivo © 2026 · Chile</span>
          <div className="flex items-center gap-3">
            <Link
              to="/privacidad"
              viewTransition
              className="hover:text-slate-900 rounded-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700"
            >
              Privacidad
            </Link>
            <span aria-hidden="true">·</span>
            <Link
              to="/terminos"
              viewTransition
              className="hover:text-slate-900 rounded-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700"
            >
              Términos
            </Link>
            <span aria-hidden="true">·</span>
            <Link
              to="/precios"
              viewTransition
              className="hover:text-slate-900 rounded-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700"
            >
              Planes
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
