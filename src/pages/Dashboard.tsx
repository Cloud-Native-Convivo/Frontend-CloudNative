// Sin servicio de transparencia de gastos en el backend: la pantalla muestra estado vacío real.
export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-text pt-14 px-6 pb-12">
        <div className="max-w-page mx-auto">
          <p className="text-xs font-bold text-primary-on-dark/70 tracking-wide mb-3">
            Transparencia total
          </p>
          <h1 className="font-[Gloock,Georgia,serif] text-[clamp(32px,4vw,52px)] text-white leading-[1.1] m-0 mb-3 font-normal">
            Dashboard de Transparencia
          </h1>
          <p className="text-lg text-white/65 m-0 max-w-content leading-[1.65]">
            Panel centralizado de todos los gastos del condominio.
          </p>
        </div>
      </div>

      <div className="max-w-page mx-auto px-6 py-16 text-center text-text-muted">
        <p className="text-lg font-semibold">Sin gastos registrados</p>
        <p className="text-sm mt-1">El detalle de gastos aún no está disponible.</p>
      </div>
    </div>
  );
}
