import { useAuth } from "../hooks/useAuth";
import { VisitasHeader } from "../components/visitas/VisitasHeader";

// Sin servicio de visitas en el backend: la pantalla muestra estado vacío real.
export default function Visitas() {
  const { role } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 font-body">
      <VisitasHeader role={role} />
      <main className="max-w-content mx-auto px-4 py-6">
        <div className="text-center py-16 text-muted">
          <p className="text-lg font-semibold">Sin visitas registradas</p>
          <p className="text-sm mt-1">El registro de visitas aún no está disponible.</p>
        </div>
      </main>
    </div>
  );
}
