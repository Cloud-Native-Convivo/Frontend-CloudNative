# Detección Automática de Rol JWT, Onboarding de Condominio y Limpieza de Selector Manual Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implementar detección automática de rol a través del JWT de Cognito, selección obligatoria de condominio en registro y onboarding con fallback de error bloqueante, guarda perimetral anti-bypass en rutas protegidas y eliminación definitiva del selector manual de roles.

**Architecture:** Se extiende el modelo `User` para incluir `condominioId` y `condominioNombre`. Se añade un servicio cliente para consultar `/api/condominios` vía BFF con vista de error y reintento. Se integran selectores en `/crear-cuenta` y en la nueva vista `/completar-registro` para usuarios de Google OAuth con sanitización de inputs. Se actualiza `ProtectedRoute.tsx` con guarda anti-bypass de onboarding. Se elimina `RoleSwitcherDropdown` de la barra de navegación y se redirige automáticamente al usuario según su rol hacia su vista correspondiente.

**Tech Stack:** React 19, Vite, TypeScript, React Router 7, Vitest, Testing Library, Tailwind CSS v4.

**Spec:** `docs/superpowers/specs/2026-10-17-rol-jwt-condominio-onboarding-design.md`

## Global Constraints

- TypeScript estricto sin tipos `any`.
- Convención de commits obligatoria: Gitmoji + Conventional Commits (`:sparkles: feat(...)`, `:recycle: refactor(...)`, etc.) validada por test suite.
- Cada cambio debe mantener la suite de pruebas unitarias 100% en verde (`npm test`).
- En caso de caída del backend en la carga de condominios, mostrar pantalla de error bloqueante con botón "Reintentar" (sin avance con datos vacíos).
- Todo parámetro de ruta o query (`condominioId`) debe ser sanitizado con `encodeURIComponent`.
- Entradas de texto de unidad (Torre, Piso, Número) deben ser validadas contra whitelist alfanumérica estricta.

## Review Focus

- **THR-01 (BOLA/IDOR & Query Injection):** `getCondominioIdActual()` debe limpiar y codificar caracteres especiales (`encodeURIComponent`) antes de enviarlo en URLs de `gastosApi` y `panelApi`.
- **THR-02 (Bypass de Onboarding):** Si un usuario autenticado con Google no tiene `condominioId` o unidad completa e intenta navegar manualmente a `/gastos` o `/mi-dashboard`, `ProtectedRoute` debe interceptarlo y redirigirlo a `/completar-registro`.
- **THR-03 (Falla de Red en Directorio):** Si `GET /api/condominios` responde 500, timeout o rechazo de conexión, la pantalla debe bloquear el avance y mostrar botón "Reintentar".
- **THR-04 (Inyección en Campos de Unidad):** `validateUnit` debe rechazar strings con caracteres de control, comillas o etiquetas HTML (`<script>`, `'`, `"`, etc.).
- **THR-05 (Integridad de Rol):** `RoleSwitcherDropdown` no debe existir en ningún bundle de producción ni en el DOM del navegador.

---

### Task 1: Modelo de Datos y Servicio API de Condominios

**Files:**
- Modify: `src/types/index.ts`
- Create: `src/services/condominiosApi.ts`
- Test: `tests/services/condominiosApi.test.ts`

**Interfaces:**
- Produces: `CondominioItem` interface y `obtenerCondominios(): Promise<CondominioItem[]>`.
- Produces: `User` actualizado con `condominioId?: string; condominioNombre?: string`.

- [ ] **Step 1: Escribir el test que falla para `condominiosApi`**

Crear `tests/services/condominiosApi.test.ts` probando:
1. `obtenerCondominios` retorna la lista de condominios cuando el fetch responde 200.
2. `obtenerCondominios` lanza error cuando el fetch responde HTTP 500 o falla de red.

- [ ] **Step 2: Ejecutar test para verificar que falla**

Run: `npm test tests/services/condominiosApi.test.ts`
Expected: FAIL porque `condominiosApi.ts` aún no existe.

- [ ] **Step 3: Implementar `condominiosApi.ts` y extender `User` en `src/types/index.ts`**

Agregar a `src/types/index.ts`:
```typescript
export interface CondominioItem {
  id: string | number;
  nombre: string;
  direccion?: string;
}
```
y añadir `condominioId?: string; condominioNombre?: string;` a `User`.
Crear `src/services/condominiosApi.ts` consultando `${API_ROOT}/api/condominios`.

- [ ] **Step 4: Ejecutar test para verificar que pasa**

Run: `npm test tests/services/condominiosApi.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/types/index.ts src/services/condominiosApi.ts tests/services/condominiosApi.test.ts
git commit -m ":sparkles: feat(api): agregar servicio condominiosApi y extender modelo User"
```

---

### Task 2: Selector de Condominio y Sanitización en Registro Manual (`/crear-cuenta`)

**Files:**
- Modify: `src/components/registro/types.ts`
- Modify: `src/components/registro/StepComponents.tsx`
- Modify: `src/pages/RegistroCuenta.tsx`
- Test: `tests/components/registro/StepUnit.test.tsx`

**Interfaces:**
- Consumes: `obtenerCondominios` de `src/services/condominiosApi.ts`.
- Produces: `StepUnitForm` con `condominioId: string; condominioNombre?: string`.
- Produces: `validateUnit` con whitelist alfanumérica y validación de `condominioId`.

- [ ] **Step 1: Escribir el test que falla para `StepUnit` con selector y sanitización**

Crear `tests/components/registro/StepUnit.test.tsx` verificando:
1. Renderizado de selector de condominio cargado desde `obtenerCondominios`.
2. Error visible y botón "Reintentar" si la carga de condominios falla.
3. Validación de campo requerido en `validateUnit` si `condominioId` está vacío.
4. Rechazo de caracteres maliciosos (`<script>`, comillas, saltos de línea) en Torre o Número de unidad.

- [ ] **Step 2: Ejecutar test para verificar que falla**

Run: `npm test tests/components/registro/StepUnit.test.tsx`
Expected: FAIL con selector de condominio no encontrado o `validateUnit` sin verificar `condominioId` ni sanitizar.

- [ ] **Step 3: Implementar selector en `StepComponents.tsx` y validación sanitizada en `types.ts`**

Actualizar `StepUnitForm` en `src/components/registro/types.ts` con `condominioId: string; condominioNombre?: string`.
En `validateUnit`, añadir validación con regex `^[a-zA-Z0-9\s\-°]+$` para evitar inyecciones.
En `StepComponents.tsx`, agregar hook para cargar condominios, mostrar spinner/error con botón reintentar, y `<select id="condominioId">`.
Actualizar estado inicial en `RegistroCuenta.tsx`.

- [ ] **Step 4: Ejecutar test para verificar que pasa**

Run: `npm test tests/components/registro/StepUnit.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/registro/ src/pages/RegistroCuenta.tsx tests/components/registro/
git commit -m ":sparkles: feat(registro): integrar selector de condominio obligatorio y sanitizacion de unidad"
```

---

### Task 3: Vista de Onboarding y Guarda Perimetral Anti-Bypass (`/completar-registro`)

**Files:**
- Create: `src/pages/CompletarRegistro.tsx`
- Modify: `src/pages/AuthCallback.tsx`
- Modify: `src/routes/ProtectedRoute.tsx`
- Modify: `src/routes/router.tsx`
- Test: `tests/pages/CompletarRegistro.test.tsx`
- Test: `tests/routes/ProtectedRouteOnboarding.test.tsx`

**Interfaces:**
- Consumes: `obtenerCondominios`, `completarSesion`.
- Produces: Guarda en `ProtectedRoute.tsx` que redirige a `/completar-registro` si `residente` no tiene onboarding completo.

- [ ] **Step 1: Escribir tests que fallan para `CompletarRegistro` y control Anti-Bypass**

Crear `tests/pages/CompletarRegistro.test.tsx` validando:
1. Vista muestra selector de condominios y campos de unidad para usuario sin perfil asignado.
2. Botón "Reintentar" ante error de API.
3. Al enviar formulario válido, actualiza `User` con `condominioId` e invoca `completarSesion`.
Crear `tests/routes/ProtectedRouteOnboarding.test.tsx` validando que si un usuario autenticado con rol `residente` tiene `condominioId === undefined` o `unidad === "Sin unidad asignada"`, cualquier ruta protegida (`/gastos`, `/reservas`, `/mi-dashboard`) lo redirige a `/completar-registro`.

- [ ] **Step 2: Ejecutar test para verificar que falla**

Run: `npm test tests/pages/CompletarRegistro.test.tsx tests/routes/ProtectedRouteOnboarding.test.tsx`
Expected: FAIL porque la página y la guarda anti-bypass no existen.

- [ ] **Step 3: Implementar `CompletarRegistro.tsx`, actualizar `ProtectedRoute.tsx`, `AuthCallback.tsx` y `router.tsx`**

1. Crear `src/pages/CompletarRegistro.tsx` con formulario sanitizado de condominio y unidad.
2. En `ProtectedRoute.tsx`, agregar chequeo:
   `if (role === "residente" && (!user?.condominioId || !user?.unidad || user.unidad === "Sin unidad asignada")) return <Navigate to="/completar-registro" replace />;`
3. En `AuthCallback.tsx`, verificar si `usuario.unidad === "Sin unidad asignada"` o falta `claims["custom:condominio_id"]`; redirigir a `/completar-registro`.
4. Registrar ruta `/completar-registro` en `router.tsx`.

- [ ] **Step 4: Ejecutar test para verificar que pasa**

Run: `npm test tests/pages/CompletarRegistro.test.tsx tests/routes/ProtectedRouteOnboarding.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/pages/CompletarRegistro.tsx src/pages/AuthCallback.tsx src/routes/ tests/
git commit -m ":sparkles: feat(auth): crear onboarding /completar-registro y guarda anti-bypass en ProtectedRoute"
```

---

### Task 4: Enrutamiento y Aterrizaje Automático según Rol

**Files:**
- Modify: `src/auth/sesion.ts`
- Modify: `src/pages/Home.tsx`
- Modify: `src/pages/Login.tsx`
- Test: `tests/auth/sesion.test.ts`
- Test: `tests/pages/LoginRedirect.test.tsx`

**Interfaces:**
- Produces: `rutaPrincipalPorRol(role: Role): string`.

- [ ] **Step 1: Escribir test que falla para `rutaPrincipalPorRol` y redirección automática**

Crear `tests/auth/sesion.test.ts` validando:
- `residente` redirige a `/mi-dashboard`.
- `conserje` y `comite` redirigen a `/espacios`.
- `admin` redirige a `/dashboard`.
Crear `tests/pages/LoginRedirect.test.tsx` validando que si existe sesión activa con perfil completo en `Login` o `Home`, redirige a la ruta principal de su rol.

- [ ] **Step 2: Ejecutar test para verificar que falla**

Run: `npm test tests/auth/sesion.test.ts tests/pages/LoginRedirect.test.tsx`
Expected: FAIL porque `rutaPrincipalPorRol` no existe o no se evalúa en `completarSesion`/`Login`.

- [ ] **Step 3: Implementar `rutaPrincipalPorRol` y redirecciones en `sesion.ts`, `Home.tsx` y `Login.tsx`**

En `sesion.ts`, cambiar navegación fija a `rutaPrincipalPorRol(usuario.role)`.
En `Login.tsx` y `Home.tsx`, si `user` está definido y tiene onboarding completo, ejecutar `navigate(rutaPrincipalPorRol(user.role), { replace: true })`.

- [ ] **Step 4: Ejecutar test para verificar que pasa**

Run: `npm test tests/auth/sesion.test.ts tests/pages/LoginRedirect.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/auth/sesion.ts src/pages/Home.tsx src/pages/Login.tsx tests/auth/ tests/pages/
git commit -m ":sparkles: feat(auth): agregar navegacion y aterrizaje automatico por rol"
```

---

### Task 5: Eliminación Definitiva de `RoleSwitcherDropdown`

**Files:**
- Modify: `src/components/layout/NavHeader.tsx`
- Modify: `src/components/Layout.tsx`
- Test: `tests/components/NavHeaderRoleSwitcher.test.tsx`

**Interfaces:**
- Modifies: `NavHeaderProps` eliminando `setRole`.

- [ ] **Step 1: Escribir test para verificar ausencia de selector de roles en la barra de navegación**

Crear `tests/components/NavHeaderRoleSwitcher.test.tsx` renderizando `NavHeader` con usuario autenticado y asegurando que no exista ningún botón ni dropdown con selector o cambio de rol.

- [ ] **Step 2: Ejecutar test para verificar que falla (o detecta selector existente)**

Run: `npm test tests/components/NavHeaderRoleSwitcher.test.tsx`
Expected: FAIL porque el componente `RoleSwitcherDropdown` todavía se renderiza en `NavHeader`.

- [ ] **Step 3: Eliminar `RoleSwitcherDropdown` de `NavHeader.tsx` y limpiar referencias en `Layout.tsx`**

1. Quitar función y componente `RoleSwitcherDropdown` de `NavHeader.tsx`.
2. Remover prop `setRole` de `NavHeaderProps` e interfaz de `NavHeader`.
3. En `Layout.tsx`, remover paso de `setRole` a `NavHeader`.

- [ ] **Step 4: Ejecutar suite de pruebas completa**

Run: `npm test`
Expected: PASS en todos los tests.

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/NavHeader.tsx src/components/Layout.tsx tests/components/
git commit -m ":recycle: refactor(nav): eliminar selector manual de roles de la barra de navegacion"
```

---

### Task 6: Inyección Dinámica y Sanitización de `condominioId` en Servicios de API

**Files:**
- Modify: `src/utils/authStorage.ts`
- Modify: `src/services/gastosApi.ts`
- Modify: `src/services/panelApi.ts`
- Test: `tests/services/gastosApiCondominio.test.ts`
- Test: `tests/services/panelApiCondominio.test.ts`

**Interfaces:**
- Produces: `getCondominioIdActual(): string` sanitizado con `encodeURIComponent`.
- Consumes: `getCondominioIdActual` en `gastosApi` y `panelApi`.

- [ ] **Step 1: Escribir tests que fallan para llamadas de API con `condominioId` dinámico y sanitizado**

Crear tests verificando:
1. Si el usuario tiene `condominioId = "42"`, la URL generada contenga `condominioId=42`.
2. Si el usuario tiene caracteres con espacios o símbolos (ej. `"condo #1"`), se codifique como `condominioId=condo%20%231`.
3. Si no existe usuario, use el fallback de entorno sanitizado.

- [ ] **Step 2: Ejecutar test para verificar que falla**

Run: `npm test tests/services/gastosApiCondominio.test.ts tests/services/panelApiCondominio.test.ts`
Expected: FAIL porque el servicio hoy utiliza exclusivamente la constante fija sin sanitización dinámica.

- [ ] **Step 3: Implementar `getCondominioIdActual` en `authStorage.ts` y actualizar `gastosApi.ts` y `panelApi.ts`**

En `src/utils/authStorage.ts`:
```typescript
export function getCondominioIdActual(): string {
  const usuario = getStoredUser();
  const idRaw = usuario?.condominioId || (typeof import.meta !== "undefined" && import.meta.env?.VITE_CONDOMINIO_ID) || "1";
  return encodeURIComponent(String(idRaw).trim());
}
```
Actualizar `gastosApi.ts` y `panelApi.ts` para consumir `getCondominioIdActual()`.

- [ ] **Step 4: Ejecutar suite completa**

Run: `npm test`
Expected: PASS en todos los tests.

- [ ] **Step 5: Commit**

```bash
git add src/utils/authStorage.ts src/services/gastosApi.ts src/services/panelApi.ts tests/services/
git commit -m ":sparkles: feat(api): sanitizar e inyectar condominioId dinamico en llamadas API"
```
