import { useAuth } from "../hooks/useAuth";

// Sin servicio de incidentes en el backend: la pantalla muestra estado vacío real.
export default function Incidentes() {
  const { role } = useAuth();
  const subtitle =
    role === "residente" ? "Incidentes de tu condominio" : "Incidentes reportados del condominio";

  return (
    <div className="min-h-screen bg-gray-50 font-body">
      <header className="bg-text px-4 pt-8 pb-6">
        <div className="max-w-content mx-auto">
          <p className="text-sm font-bold text-primary/70 mb-2">Gestión</p>
          <h1 className="font-display text-4xl text-white">Incidentes</h1>
          <p className="text-white/60 mt-1 text-sm">{subtitle}</p>
        </div>
      </header>

      <main className="max-w-content mx-auto px-4 py-6">
        <div className="text-center py-20 text-muted">
          <p className="font-semibold">Sin incidentes registrados</p>
          <p className="text-sm mt-1">El registro de incidentes aún no está disponible.</p>
        </div>
      </main>
    </div>
  );
}
