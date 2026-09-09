import { useState } from "react";
import { Link } from "react-router";
import {
  type Step,
  type StepUnitForm,
  type StepAccountForm,
  type StepErrors,
  validateUnit,
  validateAccount,
} from "../components/registro/types";
import { StepIndicator } from "../components/registro/FormFields";
import { StepUnit, StepAccount, StepReglamento } from "../components/registro/StepComponents";

export default function RegistroCuenta() {
  const [step, setStep] = useState<Step>(1);
  const [unitForm, setUnitForm] = useState<StepUnitForm>({
    torre: "",
    piso: "",
    numero: "",
  });
  const [accountForm, setAccountForm] = useState<StepAccountForm>({
    nombre: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [accepted, setAccepted] = useState(false);
  const [errors, setErrors] = useState<StepErrors>({});
  const [reglamentoError, setReglamentoError] = useState("");
  const [done, setDone] = useState(false);

  function handleUnit(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setUnitForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  function handleAccount(e: React.ChangeEvent<HTMLInputElement>) {
    setAccountForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  function goNext() {
    if (step === 1) {
      const e = validateUnit(unitForm);
      setErrors(e);
      if (!Object.keys(e).length) {
        setErrors({});
        setStep(2);
      }
    } else if (step === 2) {
      const e = validateAccount(accountForm);
      setErrors(e);
      if (!Object.keys(e).length) {
        setErrors({});
        setStep(3);
      }
    } else {
      if (!accepted) {
        setReglamentoError("Debes aceptar el Reglamento Interno para continuar.");
        return;
      }
      setDone(true);
    }
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-6">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5 text-2xl text-primary">
            ✓
          </div>
          <h2 className="font-display text-text text-2xl mb-2">¡Cuenta creada!</h2>
          <p className="text-muted text-sm leading-relaxed mb-6">
            Tu solicitud está en revisión. El comité la aprobará en las próximas 24 horas hábiles.
          </p>
          <Link
            to="/login"
            className="inline-flex bg-primary hover:bg-accent text-white font-bold text-sm px-6 py-3 rounded-lg transition-colors"
          >
            Ir al inicio de sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Brand panel */}
      <div className="hidden lg:flex flex-col justify-between w-105 shrink-0 bg-text p-12">
        <span className="text-primary font-display text-2xl">Convivo</span>
        <div>
          <h1 className="font-display text-white text-4xl leading-tight mb-4">
            Únete a tu
            <br />
            comunidad.
          </h1>
          <p className="text-white/60 text-base leading-relaxed">
            En 3 pasos tu cuenta queda lista. El comité la aprueba en 24 horas.
          </p>
        </div>
        <ul className="space-y-3">
          {[
            "Valida tu unidad en el edificio",
            "Crea tu cuenta con correo y contraseña",
            "Acepta el Reglamento Interno digitalmente",
          ].map((t, i) => (
            <li key={t} className="flex gap-3 items-start">
              <div className="w-5 h-5 rounded-full bg-primary/25 text-primary text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </div>
              <span className="text-white/65 text-sm leading-snug">{t}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-6 text-center">
            <span className="text-primary font-display text-2xl">Convivo</span>
          </div>

          <h2 className="font-display text-text text-3xl mb-1">Crear cuenta</h2>
          <p className="text-muted text-sm mb-6">Registro de residente — Torres del Parque</p>

          <StepIndicator current={step} labels={["Unidad", "Cuenta", "Reglamento"]} />

          {step === 1 && <StepUnit form={unitForm} errors={errors} onChange={handleUnit} />}

          {step === 2 && (
            <StepAccount form={accountForm} errors={errors} onChange={handleAccount} />
          )}

          {step === 3 && (
            <StepReglamento
              accepted={accepted}
              reglamentoError={reglamentoError}
              onAcceptChange={(val) => {
                setAccepted(val);
                if (val) setReglamentoError("");
              }}
            />
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-6">
            {step > 1 && (
              <button
                onClick={() => setStep((s) => (s - 1) as Step)}
                className="flex-1 border border-border text-text font-semibold text-sm py-3 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                Atrás
              </button>
            )}
            <button
              onClick={goNext}
              className="flex-1 bg-primary hover:bg-accent text-white font-bold text-sm py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              {step === 3 ? "Crear cuenta" : "Continuar"}
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-muted">
            ¿Ya tienes cuenta?{" "}
            <Link
              to="/login"
              className="text-primary font-semibold hover:text-accent transition-colors"
            >
              Ingresar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
