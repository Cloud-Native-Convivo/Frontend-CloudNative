import type { ReactNode } from "react";

export interface LegalSection {
  id: string;
  title: string;
  body: ReactNode;
}

/** Afirmación clave del documento, con la sección que la respalda: el lector verifica, no confía. */
export interface LegalEsencial {
  texto: string;
  id: string;
}

/** Dato que falta definir antes de publicar: visible a propósito, no se disimula. */
export function Pendiente({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-sm bg-alert-yellow/20 px-1 font-mono text-[0.9em] text-text">
      [{children}]
    </span>
  );
}

/** Página legal: portada, lo esencial con enlace a su sección, aviso de borrador, índice y secciones con ancla. */
export function LegalLayout({
  title,
  updated,
  intro,
  esencial,
  sections,
}: {
  title: string;
  updated: string;
  intro: ReactNode;
  esencial?: LegalEsencial[];
  sections: LegalSection[];
}) {
  const indice = (
    <ol className="m-0 list-none p-0 text-sm">
      {sections.map((s, i) => (
        <li key={s.id}>
          <a
            href={`#${s.id}`}
            className="flex min-h-11 items-center gap-3 text-muted no-underline transition-colors hover:text-accent focus-visible:text-accent"
          >
            <span className="w-6 shrink-0 tabular-nums">{i + 1}</span>
            {s.title}
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <div className="bg-white">
      <header className="bg-text pt-14 pb-16">
        <div
          className={`mx-auto grid max-w-page items-end gap-12 px-6 ${
            esencial ? "lg:grid-cols-[1.1fr_1fr]" : ""
          }`}
        >
          <div>
            <h1 className="m-0 font-display text-[clamp(40px,6vw,72px)] font-normal leading-none text-white">
              {title}
            </h1>
            <p className="m-0 mt-4 text-lg text-white/70">Última actualización: {updated}</p>
            <div className="mt-6 max-w-content text-base leading-[1.7] text-white/85 [&_a]:text-primary-on-dark [&_a]:underline">
              {intro}
            </div>
          </div>

          {esencial && (
            <section
              aria-labelledby="esencial-titulo"
              className="border-t-2 border-dashed border-white/30 pt-8 lg:border-l-2 lg:border-t-0 lg:pl-12 lg:pt-0"
            >
              <h2 id="esencial-titulo" className="m-0 text-sm font-normal text-white/70">
                Lo esencial
              </h2>
              <ul className="m-0 mt-3 list-none p-0">
                {esencial.map((e) => (
                  <li key={e.id + e.texto}>
                    <a
                      href={`#${e.id}`}
                      className="group flex min-h-11 items-baseline justify-between gap-6 border-b border-white/15 py-4 text-white no-underline transition-colors hover:text-primary-on-dark focus-visible:text-primary-on-dark"
                    >
                      <span className="font-display text-xl leading-snug">{e.texto}</span>
                      <span className="shrink-0 text-sm tabular-nums text-white/70">
                        Sección {sections.findIndex((s) => s.id === e.id) + 1}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-page px-6 pb-24 pt-10">
        <div
          role="note"
          className="max-w-content rounded-md border border-alert-yellow/60 bg-alert-yellow/10 p-4 text-sm leading-relaxed text-text"
        >
          <strong>Borrador pendiente de revisión legal.</strong> Convivo es un proyecto en
          desarrollo. Los campos marcados como <Pendiente>así</Pendiente> deben completarse y el
          texto revisarse por un abogado antes de usarse con residentes reales.
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-[240px_1fr]">
          {/* Móvil: índice plegado para no empujar el texto. Escritorio: lateral fijo. */}
          <nav aria-label="Contenido" className="lg:sticky lg:top-28 lg:self-start">
            <details className="rounded-md border border-border lg:hidden">
              <summary className="flex min-h-11 cursor-pointer items-center px-4 text-sm font-semibold text-text">
                Contenido ({sections.length} secciones)
              </summary>
              <div className="px-4 pb-4">{indice}</div>
            </details>
            <div className="hidden lg:block">
              <p className="m-0 mb-2 text-sm font-semibold text-text">Contenido</p>
              {indice}
            </div>
          </nav>

          <div>
            {sections.map((s, i) => (
              <section
                key={s.id}
                id={s.id}
                aria-labelledby={`${s.id}-titulo`}
                className="scroll-mt-28 border-t border-border py-10 first:border-t-0 first:pt-0"
              >
                <h2
                  id={`${s.id}-titulo`}
                  className="m-0 mb-6 flex items-baseline gap-4 font-display text-3xl font-normal leading-tight text-text"
                >
                  <span className="text-accent tabular-nums">{i + 1}</span>
                  {s.title}
                </h2>
                <div className="space-y-4 text-base leading-[1.7] text-text [&_a]:text-accent [&_a]:underline [&_li]:ml-5 [&_li]:list-disc [&_p]:max-w-content [&_ul]:space-y-2 [&_ul]:p-0">
                  {s.body}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
