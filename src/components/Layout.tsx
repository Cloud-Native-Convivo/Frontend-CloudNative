/* eslint-disable react/forbid-dom-props */
import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { IconHome, IconDollar, IconCalendar, IconTrendingUp } from "./icons/Icons";
import { useAuth } from "../hooks/useAuth";
import type { Role } from "../types";
import { NavHeader } from "./layout/NavHeader";
import { AnnouncementRibbon } from "./layout/AnnouncementRibbon";
import { FloatingSidebar } from "./layout/FloatingSidebar";
import { Footer } from "./layout/Footer";

const NAV_LINKS_BY_ROLE: Record<
  Role,
  {
    label: string;
    path: string;
    icon: React.ReactElement;
  }[]
> = {
  residente: [
    {
      label: "Mi panel",
      path: "/mi-dashboard",
      icon: <IconHome className="w-[15px] h-[15px]" />,
    },
    {
      label: "Espacios",
      path: "/espacios",
      icon: <IconHome className="w-[15px] h-[15px]" />,
    },
    {
      label: "Reservas",
      path: "/reservas",
      icon: <IconCalendar className="w-[15px] h-[15px]" />,
    },
    {
      label: "Gastos",
      path: "/gastos",
      icon: <IconDollar className="w-[15px] h-[15px]" />,
    },
  ],
  conserje: [
    {
      label: "Espacios",
      path: "/espacios",
      icon: <IconHome className="w-[15px] h-[15px]" />,
    },
    {
      label: "Reservas",
      path: "/reservas",
      icon: <IconCalendar className="w-[15px] h-[15px]" />,
    },
    {
      label: "Gastos",
      path: "/gastos",
      icon: <IconDollar className="w-[15px] h-[15px]" />,
    },
  ],
  admin: [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: <IconTrendingUp className="w-[15px] h-[15px]" />,
    },
    {
      label: "Espacios",
      path: "/espacios",
      icon: <IconHome className="w-[15px] h-[15px]" />,
    },
    {
      label: "Reservas",
      path: "/reservas",
      icon: <IconCalendar className="w-[15px] h-[15px]" />,
    },
    {
      label: "Gastos",
      path: "/gastos",
      icon: <IconDollar className="w-[15px] h-[15px]" />,
    },
  ],
  comite: [
    {
      label: "Espacios",
      path: "/espacios",
      icon: <IconHome className="w-[15px] h-[15px]" />,
    },
    {
      label: "Reservas",
      path: "/reservas",
      icon: <IconCalendar className="w-[15px] h-[15px]" />,
    },
    {
      label: "Gastos",
      path: "/gastos",
      icon: <IconDollar className="w-[15px] h-[15px]" />,
    },
  ],
};

export default function Layout() {
  const { role, setRole, user, setUser } = useAuth();
  const [ribbonVisible, setRibbonVisible] = useState(true);
  const location = useLocation();
  const isHome = location.pathname === "/";

  const navLinks = role ? NAV_LINKS_BY_ROLE[role] : [];
  const RIBBON_H = ribbonVisible ? 32 : 0;
  const NAV_H = 64;
  const TOP_OFFSET = RIBBON_H + NAV_H;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Ribbon */}
      {ribbonVisible && <AnnouncementRibbon onDismiss={() => setRibbonVisible(false)} />}

      {/* Nav */}
      <NavHeader
        ribbonH={RIBBON_H}
        navH={NAV_H}
        navLinks={navLinks}
        role={role}
        setRole={setRole}
        user={user}
        onLogout={() => setUser(null)}
      />

      {/* Page content */}
      <main className="flex-1" style={{ paddingTop: isHome ? 0 : TOP_OFFSET }}>
        <Outlet />
      </main>

      {/* Floating sidebar */}
      <FloatingSidebar />

      {/* Footer */}
      <Footer />
    </div>
  );
}
