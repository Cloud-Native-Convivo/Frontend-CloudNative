import { createBrowserRouter } from "react-router";
import ProtectedRoute from "./ProtectedRoute";
import Layout from "../components/Layout";
import RouteError from "../components/RouteError";
import Home from "../pages/Home";
import Reservas from "../pages/Reservas";
import Gastos from "../pages/Gastos";
import Tablon from "../pages/Tablon";
import Canales from "../pages/Canales";
import Registro from "../pages/Registro";
import Precios from "../pages/Precios";
import Login from "../pages/Login";
import AuthCallback from "../pages/AuthCallback";
import AuthError from "../pages/AuthError";
import RegistroCuenta from "../pages/RegistroCuenta";
import EspaciosComunes from "../pages/EspaciosComunes";
import Visitas from "../pages/Visitas";
import Incidentes from "../pages/Incidentes";
import NotFound from "../pages/NotFound";

const router = createBrowserRouter(
  [
    // Auth routes (no Layout wrapper)
    { path: "/login", Component: Login, errorElement: <RouteError /> },
    { path: "/auth/callback", Component: AuthCallback, errorElement: <RouteError /> },
    { path: "/auth/error", Component: AuthError, errorElement: <RouteError /> },
    {
      path: "/crear-cuenta",
      Component: RegistroCuenta,
      errorElement: <RouteError />,
    },

    // App routes (with Layout)
    {
      path: "/",
      Component: Layout,
      errorElement: <RouteError />,
      children: [
        // Public / all roles
        { index: true, Component: Home },
        { path: "tablon", Component: Tablon },
        { path: "canales", Component: Canales },
        { path: "precios", Component: Precios },

        // Residente only
        {
          element: <ProtectedRoute allowedRoles={["residente"]} />,
          children: [
            // recharts es pesada — lazy-load para no meterla en el chunk principal.
            {
              path: "mi-dashboard",
              lazy: () =>
                import("../pages/ResidenteDashboard").then((m) => ({
                  Component: m.default,
                })),
            },
          ],
        },

        // All authenticated roles
        { path: "espacios", Component: EspaciosComunes },
        { path: "gastos", Component: Gastos },

        // Residente + Admin
        {
          element: <ProtectedRoute allowedRoles={["residente", "admin"]} />,
          children: [{ path: "reservas", Component: Reservas }],
        },

        // Visitas: all roles — content adapts per role
        { path: "visitas", Component: Visitas },

        // Incidentes: all roles — residente reports, conserje/admin manage
        { path: "incidentes", Component: Incidentes },

        // Conserje + Admin + Comité
        {
          element: <ProtectedRoute allowedRoles={["conserje", "admin", "comite"]} />,
          children: [{ path: "registro", Component: Registro }],
        },

        // Admin only
        {
          element: <ProtectedRoute allowedRoles={["admin"]} />,
          children: [
            // recharts es pesada — lazy-load para no meterla en el chunk principal.
            {
              path: "dashboard",
              lazy: () =>
                import("../pages/Dashboard").then((m) => ({
                  Component: m.default,
                })),
            },
          ],
        },
      ],
    },

    // Catch-all: rutas que no existen en la app (llegan acá tras el redirect
    // de public/404.html en GitHub Pages, o por navegación interna directa).
    { path: "*", Component: NotFound, errorElement: <RouteError /> },
  ],
  {
    // Debe matchear el `base` de vite.config.ts (GITHUB_REPOSITORY en CI, "/" local).
    basename: import.meta.env.BASE_URL,
  },
);

export default router;
