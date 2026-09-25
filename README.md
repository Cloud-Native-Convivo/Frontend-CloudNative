# Convivo — Frontend

SPA de gestión para condominios residenciales. React 19 + Vite 8 + TypeScript + Tailwind v4.

## Setup

```bash
npm install
npm run dev          # http://localhost:5173
```

## Comandos

```bash
npm run build         # build de producción a dist/
npm run preview       # preview del build
npm run lint          # eslint .
npm run typecheck     # tsc --noEmit
npm run format        # oxfmt
```

## Pruebas

El proyecto implementa un enfoque de pruebas híbrido: **Caja Blanca** con Vitest y React Testing Library, y **Caja Negra** E2E con Playwright.

### Pruebas de Caja Blanca (Unitarias / Integración — Vitest)

```bash
npm run test          # ejecución completa en consola
npm run test:watch    # modo interactivo continuo
npm run test:ui       # interfaz gráfica interactiva de Vitest (-ui)
npm run test:debug    # modo depuración con breakpoints e inspect (-debug)
npm run coverage      # reporte de cobertura de ramas y sentencias
```

### Pruebas de Caja Negra (End-to-End — Playwright)

```bash
npm run test:e2e        # ejecución headless en navegador
npm run test:e2e:ui     # Playwright UI mode con time-travel y DOM snapshots (-ui)
npm run test:e2e:debug  # Playwright Inspector interactivo paso a paso (-debug)
```

## Documentación

- [`src/docs/plan_pruebas.md`](./src/docs/plan_pruebas.md) — Plan de pruebas formal (ISO/IEC/IEEE 29119-3), diseño de casos de caja negra y caja blanca, y matriz de trazabilidad.
- [`AGENTS.md`](./AGENTS.md) — stack técnico, estructura de carpetas, roles y permisos, convenciones de commits/ramas, gotchas del proyecto.
- [`DESIGN.md`](./DESIGN.md) — sistema de diseño: tipografía, color, iconografía, accesibilidad.
