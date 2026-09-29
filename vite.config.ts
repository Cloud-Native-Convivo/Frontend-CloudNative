import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

// Solo el workflow de deploy fija DEPLOY_BASE al nombre del repo para
// GitHub Pages ("/repo/"). En local y en CI (tests, e2e, lighthouse)
// la variable no existe y base queda "/".
// GITHUB_REPOSITORY no se usa porque es una env var protegida del runner
// de GitHub Actions y no se puede sobreescribir de forma fiable.
const base = process.env.DEPLOY_BASE ? `/${process.env.DEPLOY_BASE}/` : "/";

export default defineConfig({
  base,
  plugins: [react({ compiler: true }), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  optimizeDeps: {
    // recharts falla al importarse dinámicamente sin pre-bundling forzado.
    include: ["recharts", "recharts/es6/component/DefaultLegendContent"],
  },
});
