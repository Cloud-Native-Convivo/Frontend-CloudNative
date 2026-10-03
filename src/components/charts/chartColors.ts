// Props SVG (Recharts, QR) necesitan colores literales: las clases de Tailwind no aplican y
// @theme inline no emite --color-* en runtime. Espejo de los tokens de src/index.css —
// si cambia un token allí, cambiarlo aquí.
export const CHART_COLORS = {
  primary: "#0d9488",
  accent: "#005047",
  text: "#00201b",
  alertYellow: "#eab308",
  axis: "#94a3b8", // slate-400
  grid: "#f1f5f9", // slate-100
  highlight: "#f0fdfa", // teal-50
  barMuted: "#ccfbf1", // teal-100
} as const;
