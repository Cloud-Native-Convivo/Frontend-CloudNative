/* eslint-disable react/forbid-dom-props */
import { useState, lazy, Suspense } from "react";
import { gastos } from "../lib/data";
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
  const filtered = registros.filter(
    (r) => activeCategoria === "Todos" || r.categoria === activeCategoria,
  );

  return (
    <div className="min-h-screen bg-[#F8FAFB]">
      {/* Header */}
      <div className="bg-[#00201B] pt-[56px] px-6 pb-12">
        <div className="max-w-[1280px] mx-auto">
          <p className="text-[11px] font-bold text-[#5EEAD4]/70 tracking-[0.12em] uppercase mb-[10px]">
            Transparencia total
          </p>
          <h1 className="font-[Gloock,Georgia,serif] text-[clamp(32px,4vw,52px)] text-white leading-[1.1] m-0 mb-3 font-normal">
            Dashboard de Transparencia
          </h1>
          <p className="text-[17px] text-white/65 m-0 max-w-[560px] leading-[1.65]">
            Panel centralizado de todos los gastos del condominio. Cada peso documentado con boleta
            o factura adjunta.
          </p>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto p-[40px_24px_80px]">
        {/* KPI cards */}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-[18px] mb-7">
          {[
            {
              label: "Gasto del mes (ago)",
              val: "$600.000",
              sub: "CLP · 4 ítems",
              icon: <IconTrendingUp className="w-[20px] h-[20px]" />,
              color: "text-[#0D9488]",
            },
            {
              label: "Acumulado anual",
              val: "$7.200.000",
              sub: "CLP · 2026",
              icon: <IconTag className="w-[20px] h-[20px]" />,
              color: "text-[#005047]",
            },
            {
              label: "Mejoras implementadas",
              val: "$1.770.000",
              sub: "CLP · 2026",
              icon: <IconEye className="w-[20px] h-[20px]" />,
              color: "text-[#14B8A6]",
            },
            {
              label: "Registros con boleta",
              val: `${registros.length} / ${registros.length}`,
              sub: "100% verificados",
              icon: <IconDownload className="w-[20px] h-[20px]" />,
              color: "text-[#0D9488]",
            },
          ].map((k) => (
            <div
              key={k.label}
              className="bg-white border border-[#E2E8F0] rounded-[14px] py-[22px] px-5"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="text-xs text-[#94A3B8] font-semibold tracking-[0.04em] max-w-[140px] leading-[1.3]">
                  {k.label}
                </div>
                <div className={k.color}>{k.icon}</div>
              </div>
              <div className="font-[Gloock,Georgia,serif] text-[26px] text-[#00201B] mb-1">
                {k.val}
              </div>
              <div className="text-[12px] text-[#94A3B8]">{k.sub}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-[1.4fr_1fr] gap-6 mb-7">
          {/* Recharts bar chart — Evolución mensual */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-7">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-[Gloock,Georgia,serif] text-[20px] text-[#00201B] m-0 font-normal">
                Evolución mensual
              </h3>
              <span className="text-[12px] text-[#94A3B8]">2026 · miles CLP</span>
            </div>
            <Suspense
              fallback={<div className="h-[180px] w-full animate-pulse rounded bg-slate-100" />}
            >
              <GastosBarChart data={evolucionMensual} />
            </Suspense>
          </div>

          {/* Desglose por categoría */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-7">
            <h3 className="font-[Gloock,Georgia,serif] text-[20px] text-[#00201B] m-0 mb-6 font-normal">
              Por categoría
            </h3>
            <div className="flex flex-col gap-4">
              {gastos.map((g) => (
                <div key={g.item}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-[13px] text-[#00201B] font-medium">{g.item}</span>
                    <span className="text-[13px] font-bold text-[#00201B]">{g.mensual}</span>
                  </div>
                  <div className="bg-[#F1F5F9] rounded h-1.5">
                    <div
                      className="h-full rounded"
                      style={{
                        width: `${g.pct}%`,
                        background: g.color,
                      }}
                    />
                  </div>
                  <div className="text-[11px] text-[#94A3B8] mt-[3px]">
                    {g.pct}% · Anual: {g.anual}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detalle de gastos */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-7">
          <div className="flex justify-between items-center flex-wrap gap-4 mb-5">
            <h3 className="font-[Gloock,Georgia,serif] text-[20px] text-[#00201B] m-0 font-normal">
              Detalle de gastos
            </h3>
            <div className="flex gap-2.5 items-center flex-wrap">
              <select
                aria-label="Filtrar por categoría"
                value={activeCategoria}
                onChange={(e) => setActiveCategoria(e.target.value)}
                className="text-[13px] border border-[#E2E8F0] rounded-lg py-[7px] px-3 text-[#00201B] bg-white outline-none"
              >
                {categorias.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              <button className="flex items-center gap-1.5 text-[13px] font-semibold text-[#0D9488] bg-transparent border border-[#0D9488] rounded-lg py-[7px] px-[14px] cursor-pointer">
                <IconDownload className="w-[13px] h-[13px]" /> Exportar PDF
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-max border-collapse">
              <thead>
                <tr className="border-b-2 border-[#E2E8F0]">
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
                      className="text-left pr-3 pb-3 text-[11px] font-bold text-[#94A3B8] uppercase tracking-[0.08em] whitespace-nowrap"
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
                      i < filtered.length - 1 ? "border-b border-[#F1F5F9]" : "border-none"
                    }
                  >
                    <td className="py-[14px] pr-3 text-[13px] text-[#64748B] whitespace-nowrap">
                      {r.fecha}
                    </td>
                    <td className="py-[14px] pr-3 text-[13px]">
                      <span className="bg-[#F0FDFA] text-[#005047] text-[11px] font-semibold py-[3px] px-2 rounded-md">
                        {r.categoria}
                      </span>
                    </td>
                    <td className="py-[14px] pr-3 text-[13px] text-[#00201B] max-w-[220px]">
                      {r.descripcion}
                    </td>
                    <td className="py-[14px] pr-3 text-[13px] text-[#64748B] whitespace-nowrap">
                      {r.proveedor}
                    </td>
                    <td className="py-[14px] pr-3 text-[13px] font-bold text-[#00201B] whitespace-nowrap">
                      {r.monto}
                    </td>
                    <td className="py-[14px] pr-3 text-[12px] text-[#0D9488] font-mono whitespace-nowrap">
                      {r.boleta}
                    </td>
                    <td className="py-[14px]">
                      <span className="text-[11px] font-semibold text-[#0D9488] bg-[#F0FDFA] py-[3px] px-2 rounded-md">
                        {r.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-[#E2E8F0]">
                  <td
                    colSpan={4}
                    className="pt-[14px] pr-3 text-[13px] font-semibold text-[#64748B]"
                  >
                    Total mostrado
                  </td>
                  <td className="pt-[14px] pr-3 text-[15px] font-bold text-[#00201B]">
                    $
                    {filtered
                      .reduce((acc, r) => acc + parseInt(r.monto.replace(/\D/g, "")), 0)
                      .toLocaleString("es-CL")}
                  </td>
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
