import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { describe, expect, test } from 'vitest';

/**
 * Guard de `npm run dev:local`: exige `.env.local` con VITE_BFF_URL antes de
 * arrancar Vite. Sin el archivo, Vite lee `.env` (que apunta al API Gateway de
 * AWS) y el comando "local" dejaria de ser local sin avisar.
 */
describe('check-local-env (guard de dev:local)', () => {
  const SCRIPT = path.resolve(import.meta.dirname, '../../check-local-env.mjs');

  function runGuard(envLocal?: string) {
    const dir = mkdtempSync(path.join(tmpdir(), 'check-local-env-'));
    try {
      if (envLocal !== undefined) {
        writeFileSync(path.join(dir, '.env.local'), envLocal, 'utf8');
      }
      const result = spawnSync(process.execPath, [SCRIPT], { cwd: dir, encoding: 'utf8' });
      return { status: result.status, output: `${result.stdout}${result.stderr}` };
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  }

  test('falla sin .env.local y nombra .env.example', () => {
    const { status, output } = runGuard();
    expect(status).toBe(1);
    expect(output).toContain('.env.local');
    expect(output).toContain('.env.example');
    expect(output).toContain('VITE_BFF_URL');
  });

  test('falla si .env.local no define VITE_BFF_URL', () => {
    const { status, output } = runGuard('# sin endpoint\nVITE_CONDOMINIO_NOMBRE="Otro"\n');
    expect(status).toBe(1);
    expect(output).toContain('VITE_BFF_URL');
  });

  test('pasa si .env.local define VITE_BFF_URL', () => {
    const { status } = runGuard('VITE_BFF_URL=http://localhost:3000/api/v1\n');
    expect(status).toBe(0);
  });
});
