import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { IconGoogle } from "../components/icons/Icons";
import {
  buildGoogleAuthorizeUrl,
  checkCognitoReachability,
  isCognitoConfigured,
} from "../lib/cognitoAuth";

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
  if (!form.email.trim()) errors.email = "El correo es obligatorio.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = "Ingresa un correo válido.";
  if (!form.password) errors.password = "La contraseña es obligatoria.";
  else if (form.password.length < 6) errors.password = "Mínimo 6 caracteres.";
  return errors;
}

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>({ email: "", password: "" });
  const [errors, setErrors] = useState<FieldError>({});
  const [isConnectingGoogle, setIsConnectingGoogle] = useState(false);
  const submitted = useRef(false);

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
      // auth logic goes here
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Brand panel */}
      <div className="hidden lg:flex flex-col justify-between w-105 shrink-0 bg-text p-12">
        <div>
          <span className="text-primary font-display text-2xl">Convivo</span>
        </div>
        <div>
          <h1 className="font-display text-white text-4xl leading-tight mb-4">
            Tu condominio,
            <br />
            conectado.
          </h1>
          <p className="text-white/60 text-base leading-relaxed">
            Plataforma digital de gestión para comunidades residenciales en Chile.
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          {["150+ comunidades", "98% satisfacción", "Soporte en español"].map((b) => (
            <span
              key={b}
              className="text-xs text-white/50 border border-white/15 rounded-full px-3 py-1"
            >
              {b}
            </span>
          ))}
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 text-center">
            <span className="text-primary font-display text-2xl">Convivo</span>
          </div>

          <h2 className="font-display text-text text-3xl mb-1">Bienvenido</h2>
          <p className="text-muted text-sm mb-8">Ingresa a tu cuenta de residente</p>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-text mb-1.5">
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                aria-describedby={errors.email ? "email-error" : undefined}
                aria-invalid={!!errors.email}
                className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-text placeholder:text-muted/60 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 ${
                  errors.email ? "border-alert-red bg-red-50" : "border-border bg-white"
                }`}
                placeholder="nombre@correo.cl"
              />
              {errors.email && (
                <p
                  id="email-error"
                  role="alert"
                  className="mt-1.5 text-xs text-alert-red flex items-center gap-1"
                >
                  <span aria-hidden="true">⚠</span> {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="password" className="block text-sm font-semibold text-text">
                  Contraseña
                </label>
                <a href="#" className="text-xs text-primary hover:text-accent transition-colors">
                  ¿Olvidaste la contraseña?
                </a>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange}
                aria-describedby={errors.password ? "password-error" : undefined}
                aria-invalid={!!errors.password}
                className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-text placeholder:text-muted/60 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 ${
                  errors.password ? "border-alert-red bg-red-50" : "border-border bg-white"
                }`}
                placeholder="••••••••"
              />
              {errors.password && (
                <p
                  id="password-error"
                  role="alert"
                  className="mt-1.5 text-xs text-alert-red flex items-center gap-1"
                >
                  <span aria-hidden="true">⚠</span> {errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-accent text-white font-bold text-sm py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Ingresar
            </button>
          </form>

          <div className="mt-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted">o continúa con</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isConnectingGoogle}
            aria-busy={isConnectingGoogle}
            className="mt-5 w-full flex items-center justify-center gap-2 bg-white border border-border text-text font-semibold text-sm py-3 rounded-lg transition-colors hover:bg-primary/5 hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <IconGoogle className="w-4 h-4" />
            {isConnectingGoogle ? "Conectando con Google…" : "Continuar con Google"}
          </button>

          <p className="mt-6 text-center text-sm text-muted">
            ¿Eres nuevo?{" "}
            <Link
              to="/crear-cuenta"
              className="text-primary font-semibold hover:text-accent transition-colors"
            >
              Crear cuenta
            </Link>
          </p>

          <div className="mt-8 pt-6 border-t border-border">
            <Link
              to="/"
              className="text-xs text-muted hover:text-text transition-colors flex items-center justify-center gap-1"
            >
              <span aria-hidden="true">←</span> Volver al sitio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
