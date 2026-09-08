import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

// GitHub Actions setea GITHUB_REPOSITORY como "owner/repo" -> base "/repo/".
// Local (env ausente) -> "/", como requiere dev/preview.
const base = process.env.GITHUB_REPOSITORY
  ? `/${process.env.GITHUB_REPOSITORY.split("/")[1]}/`
  : "/";

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
