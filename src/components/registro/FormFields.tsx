import type { ReactNode } from "react";

export function StepIndicator({ current, labels }: { current: number; labels: string[] }) {
  return (
    <div className="flex items-center mb-8" aria-label="Pasos del registro">
      {labels.map((label, i) => {
        const s = i + 1;
        const done = current > s;
        const active = current === s;
        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1 shrink-0">
              <div
                aria-current={active ? "step" : undefined}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  done
                    ? "bg-primary text-white"
                    : active
                      ? "bg-primary text-white"
                      : "bg-border text-muted"
                }`}
              >
                {done ? "✓" : s}
              </div>
              <span
                className={`text-[10px] font-semibold hidden sm:block whitespace-nowrap ${
                  active ? "text-primary" : done ? "text-primary" : "text-muted"
                }`}
              >
                {label}
              </span>
            </div>
            {i < labels.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 ${done ? "bg-primary" : "bg-border"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function Field({
  label,
  id,
  error,
  children,
}: {
  label: string;
  id: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-text mb-1.5">
        {label}
      </label>
      {children}
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-1.5 text-xs text-alert-red flex items-center gap-1"
        >
          <span aria-hidden="true">⚠</span> {error}
        </p>
      )}
    </div>
  );
}
