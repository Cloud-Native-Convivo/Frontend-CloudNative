import { Link } from "react-router";
import { LegalLayout, Pendiente, type LegalSection } from "../components/legal/LegalLayout";

// Inventario de lo que la app trata hoy (RAT, Ley 21.719). Mantener alineado con
// src/auth/cognitoAuth.ts (scope openid email profile), src/services/* y authStorage.ts.
const TRATAMIENTOS = [
  {
    dato: "Nombre, correo, foto de perfil e identificador de tu cuenta Google",
    origen: "Google, a través de AWS Cognito, cuando inicias sesión",
    finalidad: "Identificarte y mantener tu sesión",
    base: "Consentimiento, al elegir iniciar sesión con Google",
  },
  {
    dato: "Torre, piso y número de tu unidad; rol en la comunidad",
    origen: "Tú, al registrarte, y la administración del condominio",
    finalidad: "Verificar que resides en el condominio y mostrarte lo que te corresponde",
    base: "Ejecución de tu relación con la comunidad de copropietarios",
  },
  {
    dato: "Reservas de espacios comunes (espacio, fecha, horario)",
    origen: "Tú, al reservar",
    finalidad: "Gestionar el uso de espacios según el reglamento de copropiedad",
    base: "Ejecución de tu relación con la comunidad de copropietarios",
  },
  {
    dato: "Gastos comunes y estado de pago de tu unidad",
    origen: "La administración del condominio",
    finalidad: "Informarte el cobro y el estado de tu cuenta",
    base: "Obligación legal (Ley 21.442 de Copropiedad Inmobiliaria)",
  },
];

const PROVEEDORES = [
  { nombre: "Amazon Web Services", rol: "Autenticación (Cognito) y servidor de la aplicación", lugar: "Estados Unidos (us-east-1)" },
  { nombre: "Google", rol: "Proveedor de identidad para el inicio de sesión", lugar: "Estados Unidos" },
  { nombre: "GitHub Pages", rol: "Alojamiento del sitio; recibe tu dirección IP", lugar: "Estados Unidos" },
  { nombre: "Google Fonts", rol: "Tipografías del sitio; recibe tu dirección IP", lugar: "Estados Unidos" },
  { nombre: "Unsplash", rol: "Fotografías del sitio; recibe tu dirección IP", lugar: "Estados Unidos" },
];

const SECTIONS: LegalSection[] = [
  {
    id: "responsable",
    title: "Quién trata tus datos",
    body: (
      <>
        <p>
          Hay dos responsables, según el tipo de dato. Para tu cuenta de acceso (inicio de sesión),
          el responsable es Convivo SpA, RUT <Pendiente>RUT</Pendiente>, con domicilio en{" "}
          <Pendiente>domicilio</Pendiente>.
        </p>
        <p>
          Para los datos de gestión del condominio (unidad, reservas, gastos comunes), el
          responsable es la comunidad de copropietarios, representada por su administración.
          Convivo actúa como encargado: trata esos datos solo por instrucción de la comunidad y
          para los fines que ella define.
        </p>
      </>
    ),
  },
  {
    id: "datos",
    title: "Qué datos tratamos y para qué",
    body: (
      <>
        <p>
          No pedimos datos que no usemos. No tratamos datos sensibles (salud, origen étnico,
          biometría, entre otros) ni hacemos perfiles con fines comerciales.
        </p>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <caption className="sr-only">Datos tratados, origen, finalidad y base de licitud</caption>
            <thead className="bg-slate-50">
              <tr>
                {["Dato", "Origen", "Finalidad", "Base de licitud"].map((h) => (
                  <th key={h} scope="col" className="border-b border-border px-4 py-3 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TRATAMIENTOS.map((t) => (
                <tr key={t.dato} className="align-top [&:not(:last-child)]:border-b [&:not(:last-child)]:border-border">
                  <th scope="row" className="px-4 py-3 font-medium">{t.dato}</th>
                  <td className="px-4 py-3 text-muted">{t.origen}</td>
                  <td className="px-4 py-3 text-muted">{t.finalidad}</td>
                  <td className="px-4 py-3 text-muted">{t.base}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    ),
  },
  {
    id: "consentimiento",
    title: "Consentimiento",
    body: (
      <p>
        Cuando la base es tu consentimiento, lo pedimos por separado para cada finalidad y puedes
        retirarlo en cualquier momento, sin costo y sin tener que justificarlo. Retirarlo no afecta
        lo tratado antes de hacerlo. Si retiras el consentimiento para el inicio de sesión, no
        podrás usar las funciones que requieren cuenta.
      </p>
    ),
  },
  {
    id: "terceros",
    title: "Con quién compartimos datos",
    body: (
      <>
        <p>
          No vendemos ni arrendamos tus datos. Los compartimos solo con proveedores que prestan el
          servicio por encargo nuestro, y con la administración de tu condominio en lo que le
          corresponde.
        </p>
        <ul>
          {PROVEEDORES.map((p) => (
            <li key={p.nombre}>
              <strong>{p.nombre}</strong>: {p.rol}. Ubicación: {p.lugar}.
            </li>
          ))}
        </ul>
        <p>
          Todos estos proveedores están fuera de Chile, lo que constituye una transferencia
          internacional de datos. La respaldamos con <Pendiente>garantías contractuales con cada proveedor</Pendiente>.
        </p>
      </>
    ),
  },
  {
    id: "navegador",
    title: "Qué guardamos en tu navegador",
    body: (
      <>
        <p>
          Al iniciar sesión guardamos tu sesión (tokens de acceso y datos básicos de perfil) en el
          almacenamiento de sesión del navegador. Se borra al cerrar la pestaña o al cerrar sesión.
        </p>
        <p>No usamos cookies de analítica, publicidad ni seguimiento entre sitios.</p>
      </>
    ),
  },
  {
    id: "conservacion",
    title: "Cuánto tiempo conservamos tus datos",
    body: (
      <ul>
        <li>Cuenta de acceso: mientras la mantengas activa; se elimina <Pendiente>plazo</Pendiente> después de que la cierres.</li>
        <li>Unidad y rol: mientras seas residente del condominio.</li>
        <li>Reservas: <Pendiente>plazo</Pendiente>.</li>
        <li>
          Gastos comunes: el plazo que exija la ley a la administración para respaldar los cobros,{" "}
          <Pendiente>plazo exacto</Pendiente>.
        </li>
      </ul>
    ),
  },
  {
    id: "seguridad",
    title: "Seguridad y brechas",
    body: (
      <>
        <p>
          Toda la comunicación viaja cifrada (HTTPS). El inicio de sesión usa el estándar OAuth 2.0
          con PKCE, sin que Convivo vea tu contraseña de Google. Cada persona ve solo la
          información que corresponde a su rol.
        </p>
        <p>
          Si ocurre una vulneración de seguridad que afecte tus datos, la informaremos a la Agencia
          de Protección de Datos Personales y a las personas afectadas, en la forma y los plazos
          que establece la ley.
        </p>
      </>
    ),
  },
  {
    id: "derechos",
    title: "Tus derechos",
    body: (
      <>
        <p>Respecto de tus datos personales puedes ejercer, sin costo, los derechos de:</p>
        <ul>
          <li><strong>Acceso</strong>: saber qué datos tenemos y cómo los usamos.</li>
          <li><strong>Rectificación</strong>: corregir datos inexactos o incompletos.</li>
          <li><strong>Supresión</strong>: pedir que eliminemos tus datos.</li>
          <li><strong>Oposición</strong>: oponerte a un tratamiento determinado.</li>
          <li><strong>Portabilidad</strong>: recibir tus datos en un formato de uso común.</li>
          <li><strong>Bloqueo</strong>: suspender temporalmente un tratamiento mientras se resuelve tu solicitud.</li>
          <li>
            <strong>No ser objeto de decisiones automatizadas</strong> que te afecten de forma
            significativa. Convivo no toma decisiones de ese tipo.
          </li>
        </ul>
        <p>
          Escríbenos a <Pendiente>correo de privacidad</Pendiente> indicando qué derecho quieres
          ejercer. Si se trata de datos del condominio, lo coordinamos con la administración.
          Responderemos dentro del plazo legal.
        </p>
        <p>
          Si no respondemos o no estás de acuerdo con la respuesta, puedes reclamar ante la Agencia
          de Protección de Datos Personales.
        </p>
      </>
    ),
  },
  {
    id: "menores",
    title: "Menores de edad",
    body: (
      <p>
        Convivo está dirigido a residentes adultos. Los datos de menores de 14 años solo se tratan
        con autorización de sus padres o representantes legales, y siempre en su interés superior.
      </p>
    ),
  },
  {
    id: "cambios",
    title: "Cambios a esta política",
    body: (
      <p>
        Si cambiamos cómo tratamos tus datos, te avisaremos dentro de la plataforma antes de que el
        cambio aplique. Cuando el cambio requiera tu consentimiento, lo pediremos de nuevo.
      </p>
    ),
  },
  {
    id: "marco-legal",
    title: "Marco legal",
    body: (
      <ul>
        <li>Ley 19.628 sobre protección de la vida privada, modificada por la Ley 21.719 sobre protección de datos personales.</li>
        <li>Ley 21.442 de Copropiedad Inmobiliaria.</li>
        <li>Ley 21.459 sobre delitos informáticos.</li>
      </ul>
    ),
  },
];

export default function Privacidad() {
  return (
    <LegalLayout
      title="Política de privacidad"
      updated="30 de septiembre de 2026"
      intro={
        <p className="m-0">
          Esta política explica qué datos personales trata Convivo, para qué, con quién los
          compartimos y cómo ejercer tus derechos. Las reglas de uso de la plataforma están en los{" "}
          <Link to="/terminos" className="text-primary">Términos de uso</Link>.
        </p>
      }
      sections={SECTIONS}
    />
  );
}
