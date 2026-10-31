/* eslint-disable react/forbid-dom-props */
import { useState, useMemo, lazy, Suspense } from "react";
import { gastos } from "../data";
import { IconDownload, IconTrendingUp, IconEye, IconTag } from "../components/icons/Icons";

const GastosBarChart = lazy(() => import("../components/charts/GastosBarChart"));

const evolucionMensual = [
  { mes: "Ene", gasto: 540 },
  { mes: "Feb", gasto: 540 },
  { mes: "Mar", gasto: 560 },
  { mes: "Abr", gasto: 560 },
  { mes: "May", gasto: 580 },
  { mes: "Jun", gasto: 590 },
  { mes: "Jul", gasto: 595 },
  { mes: "Ago", gasto: 600 },
];

const registros = [
  {
    fecha: "12 ago 2026",
    categoria: "Jardinería",
    descripcion: "Renovación sistema de riego — Jardín Central",
    proveedor: "Verde Total SpA",
    monto: "$450.000",
    boleta: "BOL-2026-0812",
    estado: "Verificado",
  },
  {
    fecha: "05 ago 2026",
    categoria: "Pintura",
    descripcion: "Pintura de pasillos Torre A (pisos 1–5)",
    proveedor: "Pinturas del Norte Ltda.",
    monto: "$280.000",
    boleta: "BOL-2026-0805",
    estado: "Verificado",
  },
  {
    fecha: "28 jul 2026",
    categoria: "Eléctrico",
    descripcion: "Mantención sala de máquinas",
    proveedor: "ElectroPro Chile",
    monto: "$195.000",
    boleta: "BOL-2026-0728",
    estado: "Verificado",
  },
  {
    fecha: "20 jul 2026",
    categoria: "Limpieza",
    descripcion: "Limpieza fachada principal",
    proveedor: "Clean Masters SpA",
    monto: "$320.000",
    boleta: "BOL-2026-0720",
    estado: "Verificado",
  },
  {
    fecha: "10 jul 2026",
    categoria: "Seguridad",
    descripcion: "Instalación cámara acceso subterráneo",
    proveedor: "SecureTech Chile",
    monto: "$380.000",
    boleta: "BOL-2026-0710",
    estado: "Verificado",
  },
  {
    fecha: "02 jul 2026",
    categoria: "Gasfitería",
    descripcion: "Reparación red de aguas lluvia",
    proveedor: "Gasfitería Central",
    monto: "$145.000",
    boleta: "BOL-2026-0702",
    estado: "Verificado",
  },
];

const categorias = [
  "Todos",
  "Jardinería",
  "Pintura",
  "Eléctrico",
  "Limpieza",
  "Seguridad",
  "Gasfitería",
];

export default function Dashboard() {
  const [activeCategoria, setActiveCategoria] = useState("Todos");
  const filtered = useMemo(
    () => registros.filter((r) => activeCategoria === "Todos" || r.categoria === activeCategoria),
    [activeCategoria],
  );

  const totalMostrado = useMemo(
    () =>
      filtered
        .reduce((acc, r) => acc + parseInt(r.monto.replace(/\D/g, "")), 0)
        .toLocaleString("es-CL"),
    [filtered],
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-text pt-14 px-6 pb-12">
        <div className="max-w-page mx-auto">
          <p className="text-xs font-bold text-primary-on-dark/70 tracking-wide mb-3">
            Transparencia total
          </p>
          <h1 className="font-[Gloock,Georgia,serif] text-[clamp(32px,4vw,52px)] text-white leading-[1.1] m-0 mb-3 font-normal">
            Dashboard de Transparencia
          </h1>
          <p className="text-lg text-white/65 m-0 max-w-content leading-[1.65]">
            Panel centralizado de todos los gastos del condominio. Cada peso documentado con boleta
            o factura adjunta.
          </p>
        </div>
      </div>

      <div className="max-w-page mx-auto p-[40px_24px_80px]">
        {/* KPI cards */}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-5 mb-7">
          {[
            {
              label: "Gasto del mes (ago)",
              val: "$600.000",
              sub: "CLP · 4 ítems",
              icon: <IconTrendingUp className="w-[20px] h-[20px]" />,
              color: "text-primary",
            },
            {
              label: "Acumulado anual",
              val: "$7.200.000",
              sub: "CLP · 2026",
              icon: <IconTag className="w-[20px] h-[20px]" />,
              color: "text-accent",
            },
            {
              label: "Mejoras implementadas",
              val: "$1.770.000",
              sub: "CLP · 2026",
              icon: <IconEye className="w-[20px] h-[20px]" />,
              color: "text-teal-500",
            },
            {
              label: "Registros con boleta",
              val: `${registros.length} / ${registros.length}`,
              sub: "100% verificados",
              icon: <IconDownload className="w-[20px] h-[20px]" />,
              color: "text-primary",
            },
          ].map((k) => (
            <div key={k.label} className="bg-white border border-border rounded-lg py-6 px-5">
              <div className="flex justify-between items-start mb-3">
                <div className="text-xs text-slate-400 font-semibold tracking-wide max-w-[140px] leading-[1.3]">
                  {k.label}
                </div>
                <div className={k.color}>{k.icon}</div>
              </div>
              <div className="font-[Gloock,Georgia,serif] text-[26px] text-text mb-1">{k.val}</div>
              <div className="text-xs text-slate-400">{k.sub}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-[1.4fr_1fr] gap-6 mb-7">
          {/* Recharts bar chart — Evolución mensual */}
          <div className="bg-white border border-border rounded-lg p-7">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-[Gloock,Georgia,serif] text-xl text-text m-0 font-normal">
                Evolución mensual
              </h3>
              <span className="text-xs text-slate-400">2026 · miles CLP</span>
            </div>
            <Suspense
              fallback={<div className="h-[180px] w-full animate-pulse rounded-sm bg-slate-100" />}
            >
              <GastosBarChart data={evolucionMensual} />
            </Suspense>
          </div>

          {/* Desglose por categoría */}
          <div className="bg-white border border-border rounded-lg p-7">
            <h3 className="font-[Gloock,Georgia,serif] text-xl text-text m-0 mb-6 font-normal">
              Por categoría
            </h3>
            <div className="flex flex-col gap-4">
              {gastos.map((g) => (
                <div key={g.item}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-text font-medium">{g.item}</span>
                    <span className="text-sm font-bold text-text">{g.mensual}</span>
                  </div>
                  <div className="bg-slate-100 rounded-sm h-1.5">
                    <div
                      className={`h-full rounded-sm ${g.color}`}
                      style={{ width: `${g.pct}%` }}
                    />
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {g.pct}% · Anual: {g.anual}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detalle de gastos */}
        <div className="bg-white border border-border rounded-lg p-7">
          <div className="flex justify-between items-center flex-wrap gap-4 mb-5">
            <h3 className="font-[Gloock,Georgia,serif] text-xl text-text m-0 font-normal">
              Detalle de gastos
            </h3>
            <div className="flex gap-3 items-center flex-wrap">
              <select
                aria-label="Filtrar por categoría"
                value={activeCategoria}
                onChange={(e) => setActiveCategoria(e.target.value)}
                className="text-sm border border-border rounded-md py-2 px-3 text-text bg-white outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-shadow"
              >
                {categorias.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              <button className="btn btn-secondary btn-sm">
                <IconDownload className="w-[13px] h-[13px]" /> Exportar PDF
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-max border-collapse">
              <thead>
                <tr className="border-b-2 border-border">
                  {[
                    "Fecha",
                    "Categoría",
                    "Descripción",
                    "Proveedor",
                    "Monto",
                    "Boleta",
                    "Estado",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left pr-3 pb-3 text-xs font-bold text-slate-400 tracking-wide whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => (
                  <tr
                    key={r.boleta}
                    className={
                      i < filtered.length - 1 ? "border-b border-slate-100" : "border-none"
                    }
                  >
                    <td className="py-4 pr-3 text-sm text-muted whitespace-nowrap">{r.fecha}</td>
                    <td className="py-4 pr-3 text-sm">
                      <span className="bg-teal-50 text-accent text-xs font-semibold py-1 px-2 rounded-sm">
                        {r.categoria}
                      </span>
                    </td>
                    <td className="py-4 pr-3 text-sm text-text max-w-[220px]">{r.descripcion}</td>
                    <td className="py-4 pr-3 text-sm text-muted whitespace-nowrap">
                      {r.proveedor}
                    </td>
                    <td className="py-4 pr-3 text-sm font-bold text-text whitespace-nowrap">
                      {r.monto}
                    </td>
                    <td className="py-4 pr-3 text-xs text-primary font-mono whitespace-nowrap">
                      {r.boleta}
                    </td>
                    <td className="py-4">
                      <span className="text-xs font-semibold text-primary bg-teal-50 py-1 px-2 rounded-sm">
                        {r.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-border">
                  <td colSpan={4} className="pt-4 pr-3 text-sm font-semibold text-muted">
                    Total mostrado
                  </td>
                  <td className="pt-4 pr-3 text-base font-bold text-text">${totalMostrado}</td>
                  <td colSpan={2} />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
