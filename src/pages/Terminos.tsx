import { Link } from "react-router";
import { LegalLayout, Pendiente, type LegalSection } from "../components/legal/LegalLayout";

// Cada afirmación debe seguir siendo cierta según la sección a la que enlaza.
const ESENCIAL = [
  {
    texto: "Convivo está en desarrollo: solo parte de las pantallas usa datos reales.",
    id: "estado",
  },
  { texto: "Convivo no procesa pagos en esta versión.", id: "estado" },
  { texto: "Ingresas con Google y Convivo no guarda tu contraseña.", id: "cuenta" },
  { texto: "Las reglas de reservas y gastos las fija tu comunidad.", id: "copropiedad" },
  { texto: "Puedes pedir el cierre de tu cuenta cuando quieras.", id: "termino" },
];

const CONECTADO = ["Inicio de sesión", "Espacios comunes", "Reservas", "Gastos comunes"];

const CUENTA = [
  [
    "Ingreso",
    "Los residentes ingresan con su cuenta de Google. Convivo no conoce ni guarda tu contraseña de Google.",
  ],
  [
    "Tu rol",
    "Tu rol (residente, conserjería, administración o comité) lo asigna la administración de tu condominio.",
  ],
  [
    "Tu responsabilidad",
    "Eres responsable de lo que se haga desde tu cuenta. Si sospechas un acceso no autorizado, avísanos de inmediato.",
  ],
];

const PROHIBIDO = [
  "Acceder o intentar acceder a cuentas, datos o sistemas sin autorización.",
  "Interferir con el funcionamiento de la plataforma o sobrecargarla a propósito.",
  "Hacerte pasar por otra persona, residente o miembro de la administración.",
  "Publicar contenido ilícito, injurioso, discriminatorio o que exponga datos de otras personas.",
];

const SECTIONS: LegalSection[] = [
  {
    id: "servicio",
    title: "Quién presta el servicio",
    body: (
      <p>
        Convivo es una plataforma para la gestión de condominios en Chile, operada por Convivo SpA,
        RUT <Pendiente>RUT</Pendiente>, con domicilio en <Pendiente>domicilio</Pendiente>. Al usar
        Convivo aceptas estos términos. Si no estás de acuerdo, no uses la plataforma.
      </p>
    ),
  },
  {
    id: "estado",
    title: "Estado actual de la plataforma",
    body: (
      <>
        <p>
          Convivo está en desarrollo. Las pantallas con datos de ejemplo no deben usarse para tomar
          decisiones.
        </p>
        <div className="!mt-8 grid gap-x-10 gap-y-6 sm:grid-cols-2">
          <div className="border-t border-border pt-4">
            <h3 className="m-0 font-display text-xl font-normal text-text">
              Conectado a un servidor real
            </h3>
            <ul className="m-0 mt-3 space-y-1 p-0">
              {CONECTADO.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
          <div className="border-t border-border pt-4">
            <h3 className="m-0 font-display text-xl font-normal text-text">Datos de ejemplo</h3>
            <p className="m-0 mt-3">El resto de las pantallas.</p>
          </div>
        </div>
        <p>Convivo no procesa pagos en esta versión.</p>
      </>
    ),
  },
  {
    id: "cuenta",
    title: "Tu cuenta",
    body: (
      <dl className="m-0 grid gap-x-10 gap-y-6 md:grid-cols-3">
        {CUENTA.map(([etiqueta, texto]) => (
          <div key={etiqueta} className="border-t border-border pt-4">
            <dt className="font-display text-xl text-text">{etiqueta}</dt>
            <dd className="m-0 mt-1 text-base text-muted">{texto}</dd>
          </div>
        ))}
      </dl>
    ),
  },
  {
    id: "uso",
    title: "Uso permitido",
    body: (
      <>
        <p>Usa Convivo solo para la vida de tu comunidad. No está permitido:</p>
        <div className="!mt-6 border-t border-border">
          {PROHIBIDO.map((regla) => (
            <p key={regla} className="m-0 border-b border-border py-4">
              {regla}
            </p>
          ))}
        </div>
        <p>
          Algunas de estas conductas son delitos según la Ley 21.459 sobre delitos informáticos.
        </p>
      </>
    ),
  },
  {
    id: "contenido",
    title: "Lo que publicas",
    body: (
      <p>
        Lo que publicas en el tablón de avisos sigue siendo tuyo. Nos autorizas a mostrarlo a los
        miembros de tu comunidad mientras siga publicado. La administración o el comité pueden
        retirar publicaciones que infrinjan estos términos o el reglamento de copropiedad.
      </p>
    ),
  },
  {
    id: "copropiedad",
    title: "Reservas y gastos comunes",
    body: (
      <p>
        Las reglas sobre espacios comunes y gastos comunes las fija tu comunidad, conforme a su
        reglamento de copropiedad y a la Ley 21.442 de Copropiedad Inmobiliaria. Convivo es la
        herramienta que las aplica; no las define. Ante una diferencia entre lo que muestra Convivo
        y lo acordado por la comunidad, prevalece lo acordado por la comunidad.
      </p>
    ),
  },
  {
    id: "planes",
    title: "Planes y precios",
    body: (
      <p>
        Los planes para comunidades se describen en <Link to="/precios">Precios</Link>. Los montos
        se expresan en pesos chilenos, <Pendiente>IVA incluido o no</Pendiente>. Cuando contrates
        como consumidor por medios electrónicos, tienes los derechos que te otorga la Ley 19.496
        sobre protección de los derechos de los consumidores, incluido el derecho de retracto cuando
        corresponda.
      </p>
    ),
  },
  {
    id: "propiedad",
    title: "Propiedad intelectual",
    body: (
      <p>
        El software, la marca y el diseño de Convivo están protegidos por la Ley 17.336 de Propiedad
        Intelectual. Las fotografías de terceros se usan bajo la licencia de su fuente. Usar Convivo
        no te transfiere derechos sobre ellos.
      </p>
    ),
  },
  {
    id: "responsabilidad",
    title: "Responsabilidad",
    body: (
      <p>
        Hacemos lo razonable para que Convivo funcione de forma continua y segura, pero puede tener
        interrupciones por mantención o fallas de proveedores. Nada en estos términos limita la
        responsabilidad que, según la ley chilena, no puede limitarse, ni los derechos que te
        corresponden como consumidor.
      </p>
    ),
  },
  {
    id: "termino",
    title: "Suspensión y cierre de cuenta",
    body: (
      <p>
        Puedes dejar de usar Convivo y pedir el cierre de tu cuenta cuando quieras. Podemos
        suspender una cuenta que infrinja estos términos, informándote el motivo. Al cerrarse una
        cuenta, tus datos se tratan según la <Link to="/privacidad">Política de privacidad</Link>.
      </p>
    ),
  },
  {
    id: "cambios",
    title: "Cambios a estos términos",
    body: (
      <p>
        Si cambiamos estos términos, te avisaremos dentro de la plataforma con al menos{" "}
        <Pendiente>días</Pendiente> días de anticipación. Si sigues usando Convivo después de esa
        fecha, se aplican los nuevos términos.
      </p>
    ),
  },
  {
    id: "ley",
    title: "Ley aplicable y reclamos",
    body: (
      <p>
        Estos términos se rigen por las leyes de Chile. Si eres consumidor, puedes reclamar ante el
        SERNAC o ante el juzgado de policía local de tu domicilio, según la Ley 19.496. Para
        consultas o reclamos directos, escríbenos a <Pendiente>correo de contacto</Pendiente>.
      </p>
    ),
  },
];

export default function Terminos() {
  return (
    <LegalLayout
      title="Términos de uso"
      updated="30 de septiembre de 2026"
      intro={
        <p className="m-0">
          Estas son las reglas para usar Convivo. Cómo tratamos tus datos personales se explica en
          la <Link to="/privacidad">Política de privacidad</Link>.
        </p>
      }
      esencial={ESENCIAL}
      sections={SECTIONS}
    />
  );
}
