export type Step = 1 | 2 | 3;

export interface StepUnitForm {
  torre: string;
  piso: string;
  numero: string;
}

export interface StepAccountForm {
  nombre: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export type StepErrors = Record<string, string>;

export function validateUnit(form: StepUnitForm): StepErrors {
  const errs: StepErrors = {};
  if (!form.torre) errs.torre = "Selecciona una torre.";
  if (!form.piso) errs.piso = "Selecciona un piso.";
  if (!form.numero.trim()) errs.numero = "Ingresa el número de unidad.";
  return errs;
}

export function validateAccount(form: StepAccountForm): StepErrors {
  const errs: StepErrors = {};
  if (!form.nombre.trim()) errs.nombre = "El nombre es obligatorio.";
  if (!form.email.trim() || !form.email.includes("@"))
    errs.email = "Ingresa un correo electrónico válido.";
  if (form.password.length < 8) errs.password = "La contraseña debe tener al menos 8 caracteres.";
  if (form.password !== form.confirmPassword)
    errs.confirmPassword = "Las contraseñas no coinciden.";
  return errs;
}

export function inputClass(err?: string) {
  return `w-full px-3.5 py-2.5 rounded-lg border text-sm text-text placeholder:text-muted/60 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 ${
    err ? "border-alert-red bg-red-50" : "border-border bg-white"
  }`;
}
