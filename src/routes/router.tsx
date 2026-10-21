/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter } from "react-router";
import ProtectedRoute from "./ProtectedRoute";
import Layout from "../components/Layout";
import RouteError from "../components/RouteError";
import Home from "../pages/Home";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";

const RouteHydrateFallback = () => <div className="min-h-screen bg-surface" />;

const router = createBrowserRouter(
  [
    // Auth routes (no Layout wrapper)
    { path: "/login", Component: Login, errorElement: <RouteError /> },
    {
      path: "/auth/callback",
      lazy: () => import("../pages/AuthCallback").then((m) => ({ Component: m.default })),
      HydrateFallback: RouteHydrateFallback,
      errorElement: <RouteError />,
    },
    {
      path: "/auth/error",
      lazy: () => import("../pages/AuthError").then((m) => ({ Component: m.default })),
      HydrateFallback: RouteHydrateFallback,
      errorElement: <RouteError />,
    },
    {
      path: "/aceptar-terminos",
      lazy: () => import("../pages/AceptarTerminos").then((m) => ({ Component: m.default })),
      HydrateFallback: RouteHydrateFallback,
      errorElement: <RouteError />,
    },
    {
      path: "/crear-cuenta",
      lazy: () => import("../pages/RegistroCuenta").then((m) => ({ Component: m.default })),
      HydrateFallback: RouteHydrateFallback,
      errorElement: <RouteError />,
    },
    {
      path: "/completar-registro",
      lazy: () => import("../pages/CompletarRegistro").then((m) => ({ Component: m.default })),
      HydrateFallback: RouteHydrateFallback,
      errorElement: <RouteError />,
    },

    // App routes (with Layout)
    {
      path: "/",
      Component: Layout,
      HydrateFallback: RouteHydrateFallback,
      errorElement: <RouteError />,
      children: [
        // Public / all roles
        { index: true, Component: Home },
        {
          path: "precios",
          lazy: () => import("../pages/Precios").then((m) => ({ Component: m.default })),
        },
        {
          path: "privacidad",
          lazy: () => import("../pages/Privacidad").then((m) => ({ Component: m.default })),
        },
        {
          path: "terminos",
          lazy: () => import("../pages/Terminos").then((m) => ({ Component: m.default })),
        },

        // Residente only
        {
          element: (
            <ProtectedRoute
              allowedRoles={["residente"]}
              redirectTo="/login"
              permitirSinAsignacion
            />
          ),
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
        {
          element: (
            <ProtectedRoute
              allowedRoles={["residente", "admin", "conserje", "comite"]}
              redirectTo="/login"
            />
          ),
          children: [
            {
              path: "espacios",
              lazy: () =>
                import("../pages/EspaciosComunes").then((m) => ({ Component: m.default })),
            },
            {
              path: "gastos",
              lazy: () => import("../pages/Gastos").then((m) => ({ Component: m.default })),
            },
            {
              path: "tablon",
              lazy: () => import("../pages/Tablon").then((m) => ({ Component: m.default })),
            },
            {
              path: "canales",
              lazy: () => import("../pages/Canales").then((m) => ({ Component: m.default })),
            },
            {
              path: "visitas",
              lazy: () => import("../pages/Visitas").then((m) => ({ Component: m.default })),
            },
            {
              path: "incidentes",
              lazy: () => import("../pages/Incidentes").then((m) => ({ Component: m.default })),
            },
          ],
        },

        // Residente + Admin
        {
          element: <ProtectedRoute allowedRoles={["residente", "admin"]} redirectTo="/login" />,
          children: [
            {
              path: "reservas",
              lazy: () => import("../pages/Reservas").then((m) => ({ Component: m.default })),
            },
          ],
        },

        // Conserje + Admin + Comité
        {
          element: (
            <ProtectedRoute allowedRoles={["conserje", "admin", "comite"]} redirectTo="/login" />
          ),
          children: [
            {
              path: "registro",
              lazy: () => import("../pages/Registro").then((m) => ({ Component: m.default })),
            },
          ],
        },

        // Admin only
        {
          element: <ProtectedRoute allowedRoles={["admin"]} redirectTo="/login" />,
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
