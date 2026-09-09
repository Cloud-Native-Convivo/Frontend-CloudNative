# Changelog

Todas las modificaciones notables de este proyecto se documentan en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/),
y este proyecto sigue [Versionado Semántico](https://semver.org/lang/es/).

## [0.4.0] - 2026-09-09

### Added

- Integración de `ResidenteDashboard` con `GET /api/v1/panel` del BFF
  (TD-26): la KPI "Próxima reserva" ahora refleja la reserva real más
  cercana; notices/visits/activity y las demás KPIs siguen siendo demo
  hasta que existan endpoints propios (#25).

### Changed

- Dependencias actualizadas: React 19.3, Vite 8.2.2, Vitest 5.0.0 (#22).

### Fixed

- El rol de usuario se deriva del claim `cognito:groups` del id_token de
  Cognito en vez de hardcodearse a `"residente"` (#24).
- Conflicto de peer dependencies entre `eslint@10` y `eslint-plugin-react`
  (issue upstream sin resolver) que rompía `npm ci`/`npm install` (#23).

### Security

- Corregido bypass de control de acceso (OWASP A01): sin sesión guardada,
  el contexto de auth caía a un usuario mock por defecto y `ProtectedRoute`
  solo validaba el rol, no si había sesión real — cualquier visitante sin
  loguearse entraba a `/mi-dashboard`. `user`/`role` ahora son nulos sin
  sesión, `ProtectedRoute` exige sesión real, y el switcher demo de la nav
  excluye `"residente"` (único rol con login real) (#26).

## [0.3.0] - 2026-09-03

### Added

- Página 404 propia: catch-all `path: "*"` en `router.tsx`
  (`src/pages/NotFound.tsx`) para rutas que no existen en la SPA, y marca
  Convivo en el interstitial `public/404.html` (antes `<body></body>`
  vacío) mientras corre el redirect de GitHub Pages.

## [0.2.1] - 2026-09-03

### Fixed

- 404 real de GitHub Pages en cualquier ruta de React Router (`/login`,
  `/auth/callback`, etc.) — rompía en producción el redirect de Cognito
  tras el login con Google. Fix estándar `public/404.html` +
  decodificador en `index.html` (rafgraph/spa-github-pages).

## [0.2.0] - 2026-09-03

### Added

- Login de residentes con Google vía AWS Cognito Hosted UI (Authorization
  Code + PKCE) — `src/lib/cognitoAuth.ts`, `src/pages/AuthCallback.tsx`.
  Backend (`terraform/cognito.tf`) desplegado en AWS real.
- `.github/workflows/deploy.yml` inyecta `VITE_COGNITO_*` (GitHub Actions
  Variables) en el build de producción.

## [0.1.1] - 2026-08-20

### Added

- Error boundary (`RouteError.tsx`) en las 3 rutas raíz del router —
  antes un error de render dejaba pantalla blanca.
- Regla Mobile First documentada en `AGENTS.md` §5: todo layout nuevo se
  diseña primero para mobile, se escala hacia arriba después.

### Changed

- Código formateado con `oxfmt`. `oxfmt@0.2.0` (versión con la que arrancó
  el proyecto) tiene un bug reproducible que rompe la sintaxis de tipos
  inline de una línea (`{ key: X; label: string }` pierde el `;`) —
  corregido a mano mientras tanto. Actualizado a `oxfmt@0.64.0`, que no
  tiene el bug — confirmado corriendo el formateo de nuevo sobre todo el
  código. Ahora sí es gate obligatorio: `npm run format:check` en
  `ci-develop.yml`.
- Script `format` acotado a `src eslint.config.js vite.config.ts` — sin
  el scope explícito, `oxfmt@0.64.0` reformatea todo el cwd, incluyendo
  `.claude/skills`/`.agents/skills` (contenido de terceros, no del
  proyecto).

### Fixed

- 91 de 93 warnings de `react-doctor` (accesibilidad y performance):
  keys de array por campo real en vez de índice, labels sin `htmlFor`,
  botones sin `aria-label`, `transition: all` por las propiedades reales
  que cambian, valores/funciones estáticas movidas a scope de módulo,
  contexto de `AuthProvider` envuelto en `useMemo`, `Dashboard` y
  `ResidenteDashboard` cargando via `route.lazy()` (bundle principal
  897KB → 502KB). Score subió de 51 a 75/100. Quedan 7 sin tocar,
  documentados como ya resueltos en la práctica o falso positivo.
- Sitio en GitHub Pages mostraba 404 en toda ruta: faltaba `basename`
  en `createBrowserRouter`, no coincidía con el `base` de `vite.config.ts`.
- Overflow horizontal en mobile (375px) en Home y EspaciosComunes:
  grid del footer en `Layout.tsx` sin `className` ni media query,
  a diferencia de cada otro grid del archivo. Verificado con Playwright
  a 375px y 1280px, antes y después del fix.
- Llave de más en el `<style>` del `.pricing-grid` en `Home.tsx`
  (`}}}` en vez de `}}`) — CSS inválido.

## [0.1.0] - 2026-08-20

### Added

- Frontend real de Convivo (export de Figma Make): 14 pantallas, layout con
  selector de rol y guards por ruta, reemplazando el scaffold vacío de Vite.
- Scripts `lint` y `typecheck` en `package.json`, requeridos por el workflow
  de deploy.
- CI para la rama `develop`: corre lint, typecheck y build en PRs hacia
  `develop` y en cada push directo (sin deploy, sin secrets).

### Changed

- `vite.config.ts` reescrito para no depender del entorno de Figma Make
  (`.figma/make/site.json` y plugins de su propio preview).
- TypeScript bajado de 7.0.2 a 5.9.3 por soporte de `typescript-eslint` como
  peer dependency.
- Gestor de paquetes cambiado de pnpm a npm para alinear con el workflow de
  deploy existente (`npm ci`).
- `useAuth.tsx` separado en dos archivos (contexto/hook y componente
  `AuthProvider`) para no romper el fast refresh.
- README reemplazado: ya no describe el template genérico de create-vite,
  ahora documenta Convivo y enlaza a `AGENTS.md`/`DESIGN.md`.

### Fixed

- Errores de lint del export original: imports sin usar, `setState` llamados
  directo dentro de `useEffect` (cierre del menú móvil y cambio de tab activo
  movidos a render).

### Removed

- Código muerto: `spaces` y `navLinks` sin uso en `data.ts`, `public/icons.svg`
  del scaffold viejo, y opciones de `tsconfig` (`resolveJsonModule`,
  `allowImportingTsExtensions`, path comodín `*`) que solo existían para el
  import ya eliminado de `.figma/make/site.json`.
- `src/imports/` (PDF y `figma-brief.md` sin uso, ~320K).
