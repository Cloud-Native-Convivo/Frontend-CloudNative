import type { ReactNode } from "react";

export interface LegalSection {
  id: string;
  title: string;
  body: ReactNode;
}

/** Dato que falta definir antes de publicar: visible a propósito, no se disimula. */
export function Pendiente({ children }: { children: ReactNode }) {
  return (
    <span className="rounded bg-alert-yellow/20 px-1 font-mono text-[0.9em] text-text">
      [{children}]
    </span>
  );
}

/** Página legal: título, aviso de borrador, índice lateral y secciones con ancla. */
export function LegalLayout({
  title,
  updated,
  intro,
  sections,
}: {
  title: string;
  updated: string;
  intro: ReactNode;
  sections: LegalSection[];
}) {
  const indice = (
    <ol className="m-0 list-none space-y-2 p-0 text-sm">
      {sections.map((s, i) => (
        <li key={s.id}>
          <a
            href={`#${s.id}`}
            className="text-muted no-underline transition-colors hover:text-primary focus-visible:text-primary"
          >
            {i + 1}. {s.title}
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <div className="mx-auto max-w-[1100px] px-6 pb-24 pt-12">
      <header className="max-w-[720px]">
        <h1 className="m-0 mb-3 font-display text-[clamp(32px,4vw,44px)] font-normal leading-[1.15] text-text">
          {title}
        </h1>
        <p className="m-0 text-sm text-muted">Última actualización: {updated}</p>
        <div
          role="note"
          className="mt-8 rounded-lg border border-alert-yellow/60 bg-alert-yellow/10 p-4 text-sm leading-relaxed text-text"
        >
          <strong>Borrador pendiente de revisión legal.</strong> Convivo es un proyecto en
          desarrollo. Los campos marcados como <Pendiente>así</Pendiente> deben completarse y el
          texto revisarse por un abogado antes de usarse con residentes reales.
        </div>
        <div className="mt-8 text-base leading-[1.7] text-text">{intro}</div>
      </header>

      <div className="mt-12 grid gap-12 lg:grid-cols-[220px_1fr]">
        {/* Móvil: índice plegado para no empujar el texto. Escritorio: lateral fijo. */}
        <nav aria-label="Contenido" className="lg:sticky lg:top-28 lg:self-start">
          <details className="rounded-lg border border-border lg:hidden">
            <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-text">
              Contenido ({sections.length} secciones)
            </summary>
            <div className="px-4 pb-4">{indice}</div>
          </details>
          <div className="hidden lg:block">
            <p className="m-0 mb-3 text-sm font-semibold text-text">Contenido</p>
            {indice}
          </div>
        </nav>

        <div className="max-w-[720px]">
          {sections.map((s, i) => (
            <section
              key={s.id}
              id={s.id}
              aria-labelledby={`${s.id}-titulo`}
              className="scroll-mt-28 border-t border-border py-8 first:border-t-0 first:pt-0"
            >
              <h2
                id={`${s.id}-titulo`}
                className="m-0 mb-4 font-display text-2xl font-normal leading-[1.25] text-text"
              >
                {i + 1}. {s.title}
              </h2>
              <div className="space-y-4 text-[15px] leading-[1.7] text-text [&_a]:text-primary [&_li]:ml-5 [&_li]:list-disc [&_ul]:space-y-2 [&_ul]:p-0">
                {s.body}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
