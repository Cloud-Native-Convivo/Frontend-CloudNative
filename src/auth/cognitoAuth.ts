// Login de residentes con Google vía AWS Cognito Hosted UI (OAuth 2.0
// Authorization Code + PKCE). El backend (Cognito User Pool + Google IdP)
// está modelado en terraform/cognito.tf pero aún no desplegado — las env
// vars VITE_COGNITO_* son placeholders hasta que exista un `terraform apply`
// real (ver .env.example).

const PKCE_VERIFIER_KEY = "convivo.pkce_verifier";

function base64UrlEncodeBytes(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function generateCodeVerifier(): string {
  return base64UrlEncodeBytes(crypto.getRandomValues(new Uint8Array(32)));
}

export async function generateCodeChallenge(verifier: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
  return base64UrlEncodeBytes(new Uint8Array(digest));
}

export function isCognitoConfigured(): boolean {
  const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID;
  const domain = import.meta.env.VITE_COGNITO_DOMAIN;
  const redirectUri = import.meta.env.VITE_COGNITO_REDIRECT_URI;
  return Boolean(clientId && domain && redirectUri);
}

export async function checkCognitoReachability(timeoutMs = 2500): Promise<boolean> {
  if (!isCognitoConfigured()) return false;
  const domain = import.meta.env.VITE_COGNITO_DOMAIN;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    await fetch(`https://${domain}`, {
      method: "HEAD",
      mode: "no-cors",
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return true;
  } catch {
    return false;
  }
}

export async function buildGoogleAuthorizeUrl(): Promise<string> {
  if (!isCognitoConfigured()) {
    throw new Error("La configuración de AWS Cognito no está disponible en este entorno.");
  }

  const verifier = generateCodeVerifier();
  sessionStorage.setItem(PKCE_VERIFIER_KEY, verifier);
  const challenge = await generateCodeChallenge(verifier);

  const params = new URLSearchParams({
    client_id: import.meta.env.VITE_COGNITO_CLIENT_ID,
    response_type: "code",
    // aws.cognito.signin.user.admin: permite UpdateUserAttributes (aceptación de términos).
    scope: "openid email profile aws.cognito.signin.user.admin",
    redirect_uri: import.meta.env.VITE_COGNITO_REDIRECT_URI,
    identity_provider: "Google", // salta el selector propio de Cognito, va directo a Google
    code_challenge: challenge,
    code_challenge_method: "S256",
  });

  return `https://${import.meta.env.VITE_COGNITO_DOMAIN}/oauth2/authorize?${params.toString()}`;
}

export interface CognitoTokens {
  id_token: string;
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
}

export async function exchangeCodeForTokens(code: string): Promise<CognitoTokens> {
  const verifier = sessionStorage.getItem(PKCE_VERIFIER_KEY);
  if (!verifier) {
    throw new Error(
      "No hay code_verifier guardado — el flujo de login expiró o se abrió en otra pestaña.",
    );
  }

  const response = await fetch(`https://${import.meta.env.VITE_COGNITO_DOMAIN}/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: import.meta.env.VITE_COGNITO_CLIENT_ID,
      code,
      redirect_uri: import.meta.env.VITE_COGNITO_REDIRECT_URI,
      code_verifier: verifier,
    }),
  });

  if (!response.ok) {
    throw new Error(`Cognito rechazó el intercambio de code por tokens (HTTP ${response.status}).`);
  }

  sessionStorage.removeItem(PKCE_VERIFIER_KEY);
  return response.json();
}

export interface CognitoIdTokenClaims {
  sub: string;
  email?: string;
  name?: string;
  given_name?: string;
  picture?: string;
  "custom:unidad"?: string;
  "custom:torre"?: string;
  "custom:piso"?: string;
  "custom:terminos_version"?: string;
  "custom:terminos_fecha"?: string;
  "cognito:groups"?: string[];
  [key: string]: unknown;
}

const VALID_ROLES = ["residente", "conserje", "admin", "comite"] as const;

export function roleFromClaims(claims: CognitoIdTokenClaims): (typeof VALID_ROLES)[number] {
  const groups = claims["cognito:groups"] ?? [];
  const match = groups
    .map((g) => g.toLowerCase())
    .find((g) => (VALID_ROLES as readonly string[]).includes(g));
  return (match as (typeof VALID_ROLES)[number]) ?? "residente";
}

// Versión vigente de /terminos y /privacidad. Subirla cuando cambie el texto: todo usuario
// cuyo custom:terminos_version no coincida vuelve a pasar por /aceptar-terminos.
export const TERMINOS_VERSION = "2026-09-30";

export function aceptoTerminosVigentes(claims: CognitoIdTokenClaims): boolean {
  return claims["custom:terminos_version"] === TERMINOS_VERSION;
}

export function cognitoRegion(): string {
  // ponytail: solo dominios prefijo de Cognito (*.auth.<region>.amazoncognito.com); con
  // dominio custom, agregar VITE_COGNITO_REGION.
  const match = /\.auth\.([a-z0-9-]+)\.amazoncognito\.com$/.exec(
    import.meta.env.VITE_COGNITO_DOMAIN ?? "",
  );
  if (!match) throw new Error("No se pudo deducir la región de AWS desde VITE_COGNITO_DOMAIN.");
  return match[1];
}

/** Registra en el usuario de Cognito qué versión de los términos aceptó y cuándo. */
export async function registrarAceptacionTerminos(accessToken: string): Promise<void> {
  const response = await fetch(`https://cognito-idp.${cognitoRegion()}.amazonaws.com/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-amz-json-1.1",
      "X-Amz-Target": "AWSCognitoIdentityProviderService.UpdateUserAttributes",
    },
    body: JSON.stringify({
      AccessToken: accessToken,
      UserAttributes: [
        { Name: "custom:terminos_version", Value: TERMINOS_VERSION },
        { Name: "custom:terminos_fecha", Value: new Date().toISOString() },
      ],
    }),
  });
  if (!response.ok) {
    throw new Error(`Cognito rechazó el registro de aceptación (HTTP ${response.status}).`);
  }
}

export function decodeIdToken(idToken: string): CognitoIdTokenClaims {
  const [, payload] = idToken.split(".");
  const padded = payload.padEnd(payload.length + ((4 - (payload.length % 4)) % 4), "=");
  const binary = atob(padded.replace(/-/g, "+").replace(/_/g, "/"));
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
}
