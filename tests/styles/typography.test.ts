import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('Tokens y Tipografía', () => {
  it('debe definir la clase tabular-nums en index.css', () => {
    const css = fs.readFileSync(path.resolve(__dirname, '../../src/index.css'), 'utf-8');
    expect(css).toContain('tabular-nums');
    expect(css).toContain('font-feature-settings: "tnum"');
  });
});
