import { Field } from "./FormFields";
import { inputClass, type StepUnitForm, type StepAccountForm, type StepErrors } from "./types";

export function StepUnit({
  form,
  errors,
  onChange,
}: {
  form: StepUnitForm;
  errors: StepErrors;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}) {
  return (
    <div className="space-y-4">
      <Field label="Torre" id="torre" error={errors.torre}>
        <select
          id="torre"
          name="torre"
          value={form.torre}
          onChange={onChange}
          aria-invalid={!!errors.torre}
          aria-describedby={errors.torre ? "torre-error" : undefined}
          className={inputClass(errors.torre)}
        >
          <option value="">Selecciona torre</option>
          <option value="Torre A">Torre A</option>
          <option value="Torre B">Torre B</option>
          <option value="Torre C">Torre C</option>
        </select>
      </Field>
      <Field label="Piso" id="piso" error={errors.piso}>
        <select
          id="piso"
          name="piso"
          value={form.piso}
          onChange={onChange}
          aria-invalid={!!errors.piso}
          aria-describedby={errors.piso ? "piso-error" : undefined}
          className={inputClass(errors.piso)}
        >
          <option value="">Selecciona piso</option>
          {Array.from({ length: 12 }, (_, i) => i + 1).map((p) => (
            <option key={p} value={String(p)}>
              {p}°
            </option>
          ))}
        </select>
      </Field>
      <Field label="Número de unidad" id="numero" error={errors.numero}>
        <input
          id="numero"
          name="numero"
          type="text"
          value={form.numero}
          onChange={onChange}
          placeholder="Ej: 1204"
          aria-label="Número de unidad"
          aria-invalid={!!errors.numero}
          aria-describedby={errors.numero ? "numero-error" : undefined}
          className={inputClass(errors.numero)}
        />
      </Field>
    </div>
  );
}

export function StepAccount({
  form,
  errors,
  onChange,
}: {
  form: StepAccountForm;
  errors: StepErrors;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="space-y-4">
      <Field label="Nombre completo" id="nombre" error={errors.nombre}>
        <input
          id="nombre"
          name="nombre"
          type="text"
          value={form.nombre}
          onChange={onChange}
          placeholder="María González"
          aria-label="Nombre completo"
          autoComplete="name"
          aria-invalid={!!errors.nombre}
          aria-describedby={errors.nombre ? "nombre-error" : undefined}
          className={inputClass(errors.nombre)}
        />
      </Field>
      <Field label="Correo electrónico" id="email" error={errors.email}>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={onChange}
          placeholder="nombre@correo.cl"
          aria-label="Correo electrónico"
          autoComplete="email"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={inputClass(errors.email)}
        />
      </Field>
      <Field label="Contraseña" id="password" error={errors.password}>
        <input
          id="password"
          name="password"
          type="password"
          value={form.password}
          onChange={onChange}
          placeholder="Mínimo 8 caracteres"
          aria-label="Contraseña"
          autoComplete="new-password"
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? "password-error" : undefined}
          className={inputClass(errors.password)}
        />
      </Field>
      <Field label="Confirmar contraseña" id="confirmPassword" error={errors.confirmPassword}>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={onChange}
          placeholder="Repite la contraseña"
          aria-label="Confirmar contraseña"
          autoComplete="new-password"
          aria-invalid={!!errors.confirmPassword}
          aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
          className={inputClass(errors.confirmPassword)}
        />
      </Field>
    </div>
  );
}

export function StepReglamento({
  accepted,
  reglamentoError,
  onAcceptChange,
}: {
  accepted: boolean;
  reglamentoError: string;
  onAcceptChange: (val: boolean) => void;
}) {
  return (
    <div>
      <div
        className="border border-border rounded-xl p-4 h-52 overflow-y-auto text-sm text-muted leading-relaxed mb-4 bg-gray-50/60"
        tabIndex={0}
        aria-label="Reglamento interno"
      >
        <p className="font-semibold text-text mb-2">Reglamento Interno — Torres del Parque</p>
        {[
          ["1. Horarios de silencio.", "Entre 22:00 y 08:00 hrs no se permitirán ruidos molestos."],
          ["2. Espacios comunes.", "Deben reservarse con anticipación en la plataforma."],
          ["3. Mascotas.", "Deben transitar con correa en áreas comunes."],
          ["4. Estacionamientos.", "Cada unidad tiene asignado su estacionamiento."],
          ["5. Basura.", "Solo en contenedores designados y en los horarios establecidos."],
          ["6. Visitas.", "Deben pre-registrarse con al menos 30 minutos de anticipación."],
          ["7. Sanciones.", "El incumplimiento puede resultar en amonestaciones y multas."],
        ].map(([title, body]) => (
          <p key={title} className="mb-2">
            <strong>{title}</strong> {body}
          </p>
        ))}
      </div>

      <label
        className={`flex gap-3 items-start cursor-pointer p-3 rounded-lg border transition-colors ${
          accepted
            ? "border-[#16A34A] bg-green-50"
            : reglamentoError
              ? "border-alert-red bg-red-50"
              : "border-border"
        }`}
      >
        <input
          type="checkbox"
          checked={accepted}
          onChange={(e) => onAcceptChange(e.target.checked)}
          className="mt-0.5 w-4 h-4 accent-primary"
          aria-describedby={reglamentoError ? "reg-error" : undefined}
        />
        <span className="text-sm text-text leading-snug">
          He leído y acepto el <strong>Reglamento Interno</strong> del condominio Torres del Parque.
        </span>
      </label>
      {reglamentoError && (
        <p
          id="reg-error"
          role="alert"
          className="mt-1.5 text-xs text-alert-red flex items-center gap-1"
        >
          <span aria-hidden="true">⚠</span> {reglamentoError}
        </p>
      )}
    </div>
  );
}
