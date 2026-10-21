#!/usr/bin/env node
/**
 * Guard de `npm run dev:local` (ver AGENTS.md §4).
 *
 * Vite carga `.env.local` con mas prioridad que `.env`, pero ninguno de los dos
 * se versiona: `.env` se copia de `.env.example` y por defecto apunta al API
 * Gateway de AWS. Si `.env.local` falta o no define VITE_BFF_URL, `dev:local`
 * quedaria pegandole a produccion sin ningun sintoma visible.
 */
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const envLocal = path.join(process.cwd(), '.env.local');
const hasEndpoint =
  existsSync(envLocal) && /^\s*VITE_BFF_URL\s*=\s*\S/m.test(readFileSync(envLocal, 'utf8'));

if (!hasEndpoint) {
  console.error(
    [
      `dev:local necesita ${envLocal} con VITE_BFF_URL definido.`,
      'Sin esa variable Vite usa .env, que apunta al API Gateway de AWS.',
      'Copiar el bloque "Entorno local" de .env.example, por ejemplo:',
      '  VITE_BFF_URL=http://localhost:3000/api/v1',
    ].join('\n'),
  );
  process.exit(1);
}
