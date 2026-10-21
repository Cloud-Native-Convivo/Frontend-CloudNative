# Hardening de Seguridad OAuth, Mitigación CSRF y Calidad Web en Frontend-CloudNative

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implementar mitigación contra Login CSRF mediante parámetro criptográfico `state` en el flujo OAuth 2.0 PKCE de AWS Cognito, añadir mapeo descriptivo de errores en `AuthError`, crear suite de pruebas unitarias para `AuthCallback` y verificar conformidad de calidad web en `Frontend-CloudNative`.

**Architecture:** Generar y almacenar un `state` criptográfico aleatorio (`crypto.getRandomValues`) en `sessionStorage` antes de redirigir a Cognito. En `AuthCallback`, verificar que el parámetro `state` recibido coincida exactamente con el guardado en `sessionStorage` antes de proceder al intercambio de `code` por tokens; en caso de discrepancia o ausencia, abortar inmediatamente hacia `/auth/error?reason=csrf_detected`.

**Tech Stack:** React 19, TypeScript 5.9, React Router 8, Vitest, Testing Library, Web Crypto API.

**Spec:** [docs/superpowers/specs/2026-10-17-rol-jwt-condominio-onboarding-design.md](file:///C:/Users/river/Desktop/Codigo/Proyectos/cloud-native/Frontend-CloudNative/docs/superpowers/specs/2026-10-17-rol-jwt-condominio-onboarding-design.md)

## Global Constraints

- Seguir estrictamente la convención de Gitmoji + Conventional Commits en cada commit (`^(?::\w+:|[^\w\s:]\S*)\s(\w*)(?:\(([\w$.\-*/ ]*)\))?!?:\s(.*)$`).
- No utilizar scripts de shell `.ps1` o `.sh` externos; usar únicamente runners nativos (`npm test`, `npm run typecheck`, `npm run build`).
- Mantener cobertura y cero regresiones en la suite de pruebas unitarias (138+ tests en verde).
- Mantener los tokens y estados temporales de autenticación estrictamente en `sessionStorage` (aislados por pestaña) y eliminarlos inmediatamente tras su uso.
- Cero bibliotecas o dependencias externas adicionales; utilizar la Web Crypto API nativa del navegador.

## Review Focus

- State ausente o null en el callback OAuth -> Debe abortar antes de cualquier llamada a `exchangeCodeForTokens` y redirigir a `/auth/error?reason=csrf_detected`.
- State manipulado o perteneciente a otra sesión -> Debe fallar la validación, limpiar el storage y navegar a `/auth/error?reason=csrf_detected`.
- Doble invocación en React StrictMode -> El guard `ran.current` en `AuthCallback` debe proteger contra doble consumo de `state` y `code`.
- Reintento desde `AuthError` -> El botón de reintento debe regenerar un nuevo par `verifier`/`challenge` y un nuevo `state` limpio.
- Aceptación de términos y onboarding anti-bypass -> No deben verse afectados por la validación de `state`.

---

### Task 1: Parámetro Criptográfico `state` en `cognitoAuth.ts`

**Files:**
- Modify: `Frontend-CloudNative/src/auth/cognitoAuth.ts:7-75`
- Test: `Frontend-CloudNative/tests/lib/cognitoAuth.test.ts`

**Interfaces:**
- Produces:
  - `OAUTH_STATE_KEY = "convivo.oauth_state"`
  - `generateOAuthState(): string`
  - `validateAndClearOAuthState(receivedState: string | null): boolean`
  - `buildGoogleAuthorizeUrl(): Promise<string>` (actualizado para incluir parámetro `state`)

- [ ] **Step 1: Escribir las pruebas fallidas en `tests/lib/cognitoAuth.test.ts`**

Añadir pruebas para:
1. `generateOAuthState()` genera un string base64url aleatorio de al menos 20 caracteres sin `+/=`.
2. `buildGoogleAuthorizeUrl()` guarda el `state` en `sessionStorage` bajo `convivo.oauth_state` y lo incluye en la URL retornada.
3. `validateAndClearOAuthState(state)` retorna `true` cuando coincide, elimina el valor de `sessionStorage`, y retorna `false` ante ausencia o mismatch.

```typescript
describe("generateOAuthState y validateAndClearOAuthState", () => {
  it("genera un string aleatorio base64url sin caracteres inseguros", () => {
    const state = generateOAuthState();
    expect(state.length).toBeGreaterThanOrEqual(20);
    expect(state).not.toMatch(/[+/=]/);
  });

  it("valida exitosamente cuando el state coincide y lo limpia de sessionStorage", () => {
    sessionStorage.setItem("convivo.oauth_state", "test-state-123");
    expect(validateAndClearOAuthState("test-state-123")).toBe(true);
    expect(sessionStorage.getItem("convivo.oauth_state")).toBeNull();
  });

  it("retorna false y limpia storage si el state es null o no coincide", () => {
    sessionStorage.setItem("convivo.oauth_state", "test-state-123");
    expect(validateAndClearOAuthState("wrong-state")).toBe(false);
    expect(sessionStorage.getItem("convivo.oauth_state")).toBeNull();

    expect(validateAndClearOAuthState(null)).toBe(false);
  });
});
```

- [ ] **Step 2: Ejecutar las pruebas para verificar que fallen**

Run: `npx vitest run tests/lib/cognitoAuth.test.ts`
Expected: FAIL con `generateOAuthState is not defined`.

- [ ] **Step 3: Implementar `generateOAuthState`, `validateAndClearOAuthState` y actualizar `buildGoogleAuthorizeUrl` en `src/auth/cognitoAuth.ts`**

Definir `OAUTH_STATE_KEY = "convivo.oauth_state"`, generar 16 bytes con `crypto.getRandomValues`, codificar con `base64UrlEncodeBytes`, guardar en `sessionStorage.setItem(OAUTH_STATE_KEY, state)` y añadir `state` a los query params de `buildGoogleAuthorizeUrl`. Implementar `validateAndClearOAuthState(receivedState: string | null): boolean`.

- [ ] **Step 4: Ejecutar las pruebas para verificar que pasen**

Run: `npx vitest run tests/lib/cognitoAuth.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/auth/cognitoAuth.ts tests/lib/cognitoAuth.test.ts
git commit -m ":lock: feat(auth): agregar generacion y validacion de state criptografico en flujo oauth"
```

---

### Task 2: Validación de `state` en `AuthCallback.tsx` y Manejo en `AuthError.tsx`

**Files:**
- Modify: `Frontend-CloudNative/src/pages/AuthCallback.tsx:25-45`
- Modify: `Frontend-CloudNative/src/pages/AuthError.tsx:15-35`
- Test: `Frontend-CloudNative/tests/pages/AuthError.test.tsx`
- Test: `Frontend-CloudNative/tests/pages/AuthCallback.test.tsx` (crear)

**Interfaces:**
- Consumes:
  - `validateAndClearOAuthState(receivedState: string | null): boolean` de `cognitoAuth.ts`
  - `exchangeCodeForTokens(code: string)` de `cognitoAuth.ts`

- [ ] **Step 1: Escribir las pruebas para `AuthError.tsx` con reason `csrf_detected`**

En `tests/pages/AuthError.test.tsx`, añadir:
```typescript
it("muestra mensaje descriptivo de seguridad cuando reason=csrf_detected", () => {
  render(
    <MemoryRouter initialEntries={["/auth/error?reason=csrf_detected"]}>
      <AuthError />
    </MemoryRouter>,
  );

  expect(
    screen.getByRole("heading", { name: "Error de validación de seguridad" }),
  ).toBeInTheDocument();
  expect(
    screen.getByText(/No se pudo comprobar la integridad de la sesión de inicio \(CSRF\)/i),
  ).toBeInTheDocument();
});
```

- [ ] **Step 2: Crear suite de pruebas `tests/pages/AuthCallback.test.tsx`**

Verificar:
1. Si `state` no coincide con el guardado en `sessionStorage`, redirige a `/auth/error?reason=csrf_detected` sin llamar a `exchangeCodeForTokens`.
2. Si `state` es válido y coincide, invoca `exchangeCodeForTokens(code)`.

- [ ] **Step 3: Ejecutar las pruebas para verificar que fallen**

Run: `npx vitest run tests/pages/AuthError.test.tsx tests/pages/AuthCallback.test.tsx`
Expected: FAIL con mismatch en mensaje o navegación.

- [ ] **Step 4: Implementar validación en `AuthCallback.tsx` y mapeo en `AuthError.tsx`**

En `src/pages/AuthCallback.tsx`:
```typescript
const stateParam = params.get("state");
if (!validateAndClearOAuthState(stateParam)) {
  navigate("/auth/error?reason=csrf_detected", { replace: true });
  return;
}
```

En `src/pages/AuthError.tsx`:
```typescript
case "csrf_detected":
  return {
    title: "Error de validación de seguridad",
    description:
      "No se pudo comprobar la integridad de la sesión de inicio (CSRF). Por favor, intenta iniciar sesión nuevamente.",
  };
```

- [ ] **Step 5: Ejecutar las pruebas para verificar que pasen**

Run: `npx vitest run tests/pages/AuthError.test.tsx tests/pages/AuthCallback.test.tsx`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/pages/AuthCallback.tsx src/pages/AuthError.tsx tests/pages/AuthCallback.test.tsx tests/pages/AuthError.test.tsx
git commit -m ":shield: feat(auth): validar state anti-csrf en callback y mostrar error descriptivo"
```

---

### Task 3: Verificación Integral, Typecheck, Build y CI Pipeline

**Files:**
- Verify: Toda la suite de `Frontend-CloudNative`

- [ ] **Step 1: Ejecutar verificación estática de TypeScript**

Run: `npm run typecheck`
Expected: 0 errores de tipado.

- [ ] **Step 2: Ejecutar suite completa de pruebas unitarias**

Run: `npm test`
Expected: 27/27 suites en verde (140+ pruebas pasando).

- [ ] **Step 3: Ejecutar build de producción**

Run: `npm run build`
Expected: Compilación exitosa, `sourcemap: false`, chunks optimizados < 500 kB.

- [ ] **Step 4: Push a la rama de trabajo y actualización de PR**

```bash
git push origin feature/rol-jwt-condominio-onboarding
```
Verificar que el pull request #72 refleje los commits de hardening.
