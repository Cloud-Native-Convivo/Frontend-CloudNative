import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import type { Visita, EstadoVisita } from "../components/visitas/types";
import { VisitasHeader } from "../components/visitas/VisitasHeader";
import { AdminTabBar, type ActiveTab } from "../components/visitas/AdminTabBar";
import { VisitasList } from "../components/visitas/VisitasList";
import { QRModal } from "../components/visitas/QRModal";
import { PreRegistroModal } from "../components/visitas/PreRegistroModal";
import { ConserjeriaPanel } from "../components/visitas/ConserjeriaPanel";

const SEED_VISITAS: Visita[] = [
  {
    id: "1",
    nombre: "Carlos Rodríguez",
    documento: "19.456.789-2",
    fecha: "2026-08-25",
    fechaDisplay: "25 ago 2026",
    hora: "15:00",
    motivo: "Visita personal",
    estado: "confirmada",
    codigo: "CONV-VIS-20260825-B3X2",
    unidad: "Torre A · Piso 12 · Unidad 1204",
  },
  {
    id: "2",
    nombre: "Delivery Rappi",
    documento: "(empresa)",
    fecha: "2026-08-19",
    fechaDisplay: "19 ago 2026",
    hora: "11:00",
    motivo: "Delivery / Encomienda",
    estado: "completada",
    codigo: "CONV-VIS-20260819-D5M7",
    unidad: "Torre A · Piso 12 · Unidad 1204",
  },
  {
    id: "3",
    nombre: "Técnico Claro",
    documento: "20.123.456-7",
    fecha: "2026-08-22",
    fechaDisplay: "22 ago 2026",
    hora: "10:00",
    motivo: "Técnico / Servicio",
    estado: "pendiente_qr",
    codigo: "CONV-VIS-20260822-A7K9",
    unidad: "Torre A · Piso 12 · Unidad 1204",
  },
];

export default function Visitas() {
  const { role } = useAuth();
  const canSeeConserjeria = role === "conserje" || role === "admin";
  const canSeeResidente = role === "residente" || role === "admin";

  const [activeTab, setActiveTab] = useState<ActiveTab>(
    canSeeResidente ? "mis-visitas" : "conserjeria",
  );
  const [visitas, setVisitas] = useState<Visita[]>(SEED_VISITAS);
  const [showPreRegistro, setShowPreRegistro] = useState(false);
  const [qrVisita, setQrVisita] = useState<Visita | null>(null);

  const handleCreated = (v: Visita) => setVisitas((prev) => [v, ...prev]);
  const handleUpdateEstado = (id: string, estado: EstadoVisita) =>
    setVisitas((prev) => prev.map((v) => (v.id === id ? { ...v, estado } : v)));

  const showingResidente = activeTab === "mis-visitas";

  return (
    <div className="min-h-screen bg-gray-50 font-body">
      <VisitasHeader
        role={role}
        showingResidente={showingResidente}
        onOpenPreRegistro={() => setShowPreRegistro(true)}
      />

      {role === "admin" && <AdminTabBar activeTab={activeTab} onSelectTab={setActiveTab} />}

      <main className="max-w-2xl mx-auto px-4 py-6">
        {canSeeConserjeria && !showingResidente ? (
          <ConserjeriaPanel visitas={visitas} onUpdateEstado={handleUpdateEstado} />
        ) : (
          <VisitasList visitas={visitas} onVerQR={setQrVisita} />
        )}
      </main>

      {showPreRegistro && (
        <PreRegistroModal onClose={() => setShowPreRegistro(false)} onCreated={handleCreated} />
      )}
      {qrVisita && <QRModal visita={qrVisita} onClose={() => setQrVisita(null)} />}
    </div>
  );
}
