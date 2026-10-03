import { Link } from "react-router";
import { LegalLayout, Pendiente, type LegalSection } from "../components/legal/LegalLayout";

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
      <p>
        Convivo está en desarrollo. El inicio de sesión, los espacios comunes, las reservas y los
        gastos comunes se conectan a un servidor real. El resto de las pantallas muestra datos de
        ejemplo y no debe usarse para tomar decisiones. Convivo no procesa pagos en esta versión.
      </p>
    ),
  },
  {
    id: "cuenta",
    title: "Tu cuenta",
    body: (
      <ul>
        <li>
          Los residentes ingresan con su cuenta de Google. Convivo no conoce ni guarda tu contraseña
          de Google.
        </li>
        <li>
          Tu rol (residente, conserjería, administración o comité) lo asigna la administración de tu
          condominio.
        </li>
        <li>
          Eres responsable de lo que se haga desde tu cuenta. Si sospechas un acceso no autorizado,
          avísanos de inmediato.
        </li>
      </ul>
    ),
  },
  {
    id: "uso",
    title: "Uso permitido",
    body: (
      <>
        <p>Usa Convivo solo para la vida de tu comunidad. No está permitido:</p>
        <ul>
          <li>Acceder o intentar acceder a cuentas, datos o sistemas sin autorización.</li>
          <li>Interferir con el funcionamiento de la plataforma o sobrecargarla a propósito.</li>
          <li>Hacerte pasar por otra persona, residente o miembro de la administración.</li>
          <li>
            Publicar contenido ilícito, injurioso, discriminatorio o que exponga datos de otras
            personas.
          </li>
        </ul>
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
          la{" "}
          <Link to="/privacidad" className="text-primary">
            Política de privacidad
          </Link>
          .
        </p>
      }
      sections={SECTIONS}
    />
  );
}
