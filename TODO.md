# TODO — Pendientes DESIGN.md / AGENTS.md

Placeholders restantes tras la adaptación de ambos archivos al proyecto Convivo.
No bloquean el uso del proyecto. Resolver cuando el equipo tenga las decisiones.

## DESIGN.md

| #   | Línea | Placeholder                             | Sección              | Acción requerida                                                                            |
| --- | ----- | --------------------------------------- | -------------------- | ------------------------------------------------------------------------------------------- |
| 1   | 334   | `[navegadores/dispositivos objetivo]`   | §17.1 Compatibilidad | Definir lista de navegadores/dispositivos soportados (ej. Chrome, Edge, Safari mobile)      |
| 2   | 337   | `[comando de lint de tokens]`           | §17.1 Mantenibilidad | No existe herramienta aún. Evaluar Style Dictionary o lint custom                           |
| 3   | 354   | `[peso máximo de fuentes: X KB]`        | §17.1 Rendimiento    | Medir peso actual de Gloock+Inter y fijar techo                                             |
| 4   | 354   | `[LCP objetivo: < X s]`                 | §17.1 Rendimiento    | Medir LCP actual con Lighthouse y fijar objetivo                                            |
| 5   | 356   | `[ruta o sistema]`                      | §17.3 ISO 9241-210   | No aplica sin proceso formal con usuarios. Marcar `(no aplica)` o crear carpeta `research/` |
| 6   | 374   | `[ruta o sistema]`                      | §17.3 IEEE 730       | No aplica sin SQAP formal. Marcar `(no aplica)`                                             |
| 7   | 375   | `[dónde viven los casos y el registro]` | §17.3 ISO 29119      | No aplica sin proceso formal de pruebas. Marcar `(no aplica)`                               |
| 8   | 385   | `[dónde queda el historial]`            | §17.4 NCG 519        | Definir dónde se registra historial de cambios de tokens                                    |

## AGENTS.md

| #   | Línea | Placeholder                                           | Sección             | Acción requerida                                       |
| --- | ----- | ----------------------------------------------------- | ------------------- | ------------------------------------------------------ |
| 9   | 123   | `[80% en funciones nuevas]`                           | §7 Pruebas          | Umbral de referencia. Confirmar si aplica o ajustar    |
| 10  | 137   | `[cuarentena y ticket con dueño / arreglo inmediato]` | §7 Pruebas          | Definir política de tests inestables cuando haya suite |
| 11  | 195   | `[inmediato / antes del próximo release]`             | §9 QA               | Definir plazo para bugs Críticos                       |
| 12  | 195   | `[N días]`                                            | §9 QA               | Definir plazo para bugs Mayores                        |
| 13  | 195   | `[backlog priorizado]`                                | §9 QA               | Confirmar política para bugs Menores                   |
| 14  | 235   | `[límite por usuario/sesión]`                         | §10 Seguridad (LLM) | No aplica: sin superficie LLM. Marcar `(no aplica)`    |
| 15  | 341   | `[comando de bump de versión]`                        | §11.3 Git Flow      | Definir comando de version bump (ej. `npm version`)    |
| 16  | 529   | `[dueño técnico del repositorio]`                     | §17.3 ISO 9001      | Definir quién es responsable del repo                  |
| 17  | 530   | `[registro de riesgos]`                               | §17.3 ISO 9001      | No aplica sin certificación. Marcar `(no aplica)`      |
| 18  | 534   | `[dónde vive]` (post-mortem)                          | §17.3 ISO 9001      | Definir dónde se registran post-mortems                |
| 19  | 546   | `[plazo]`                                             | §17.4 NCG 519       | Definir política de retención de registros             |
| 20  | 562   | `[quién es / no aplica]`                              | §17.4 Ley Karin     | Marcar `(no aplica: sin datos RRHH)`                   |

## Resumen por prioridad

**Alta (funcional):**

- #15: comando de version bump
- #16: dueño técnico del repo

**Media (operacional):**

- #1: navegadores target
- #2: lint de tokens
- #3-4: métricas de performance
- #10-13: políticas de QA
- #18: post-mortems

**Baja (normativa/certificación):**

- #5-8: placeholders normativos ISO/IEEE
- #9, #14, #17, #19-20:`(no aplica)` directo

## Frontend-Cloud

- [ ] Configurar roles en el IDToken de cognito, correspondientes a Admin, comité, residente y conserje.
- [ ] Configurar los permisos en cascada para los roles.
- [x] Crear el app.css.
- [x] Centralizar etiquetas Style en CSS.
- [x] Configurar norma para no tener css tipo , Inline , Bloque Style.
- [x] Mover los Test a una Carpeta en la raíz.
- [x] Configurar a traves del Claim Image de google, la imagen de perfil.
- [x] Configurar las notificaciones a traves de [Sileo](https://sileo.aaryan.design/)

- [ ] Fix: Workflows de CI/CD (deploy, ci-develop) fallan (posible problema con npm ci y --legacy-peer-deps). Arreglar.
