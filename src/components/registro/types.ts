export type Step = 1 | 2 | 3;

export interface StepUnitForm {
  condominioId: string;
  condominioNombre?: string;
  condominioTipo?: string;
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

const SOLO_TEXTO_UNIDAD = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s\-°]+$/;

/** Ley 21.442: un condominio tipo B es de casas o sitios, sin torre ni piso. */
export function esDeCasas(tipo?: string): boolean {
  return tipo === "B";
}

/** La torre es opcional: un edificio de una sola torre no la necesita. */
export function validateUnit(form: StepUnitForm): StepErrors {
  const errs: StepErrors = {};
  if (!form.condominioId) errs.condominioId = "Selecciona un condominio.";
  if (!esDeCasas(form.condominioTipo)) {
    if (form.torre.trim() && !SOLO_TEXTO_UNIDAD.test(form.torre.trim()))
      errs.torre = "La torre contiene caracteres no permitidos.";
    if (!form.piso.trim()) errs.piso = "Ingresa el piso.";
    else if (!SOLO_TEXTO_UNIDAD.test(form.piso.trim()))
      errs.piso = "El piso contiene caracteres no permitidos.";
  }
  if (!form.numero.trim()) {
    errs.numero = esDeCasas(form.condominioTipo)
      ? "Ingresa el número de casa o sitio."
      : "Ingresa el número de unidad.";
  } else if (!SOLO_TEXTO_UNIDAD.test(form.numero.trim())) {
    errs.numero = "El número contiene caracteres no permitidos.";
  }
  return errs;
}

/** Campos de unidad que espera ms-condominios: en casas solo el número. */
export function datosSolicitud(form: StepUnitForm): {
  numero: string;
  piso?: string;
  torre?: string;
} {
  const numero = form.numero.trim();
  if (esDeCasas(form.condominioTipo)) return { numero };
  const torre = form.torre.trim();
  return { numero, piso: form.piso.trim(), ...(torre ? { torre } : {}) };
}

/** Texto de unidad para la sesión cuando el servidor no lo devuelve (409 ya aprobada). */
export function componerUnidad(form: StepUnitForm): string {
  const numero = form.numero.trim();
  if (esDeCasas(form.condominioTipo)) return `Casa ${numero}`;
  const torre = form.torre.trim();
  return `${torre ? `${torre} · ` : ""}Piso ${form.piso.trim()} · Unidad ${numero}`;
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
  return `w-full px-4 py-3 rounded-md border text-sm text-text placeholder:text-muted/60 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 ${
    err ? "border-alert-red bg-red-50" : "border-border bg-white"
  }`;
}
