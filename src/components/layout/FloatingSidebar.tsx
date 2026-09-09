/* eslint-disable react/forbid-dom-props */
import { useState } from "react";
import { Link } from "react-router";
import { IconCalendar, IconDollar } from "../icons/Icons";

const FLOATING_SIDEBAR_ITEMS = [
  {
    id: "reservar",
    icon: <IconCalendar className="w-[17px] h-[17px]" />,
    label: "Reservar",
    path: "/reservas",
    bg: "#0D9488",
  },
  {
    id: "gastos",
    icon: <IconDollar className="w-[17px] h-[17px]" />,
    label: "Mis gastos",
    path: "/gastos",
    bg: "#005047",
  },
];

export function FloatingSidebar() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="float-sidebar fixed right-0 top-1/2 -translate-y-1/2 z-[45] flex flex-col gap-[6px]">
      {FLOATING_SIDEBAR_ITEMS.map((item) => (
        <Link
          key={item.id}
          to={item.path}
          onMouseEnter={() => setHovered(item.id)}
          onMouseLeave={() => setHovered(null)}
          className="flex items-center justify-end no-underline"
        >
          <div
            className="flex items-center h-[40px] overflow-hidden whitespace-nowrap rounded-l-[6px] transition-[max-width,padding,opacity] duration-[220ms] ease-out"
            style={{
              background: item.bg,
              maxWidth: hovered === item.id ? 120 : 0,
              paddingLeft: hovered === item.id ? 12 : 0,
              opacity: hovered === item.id ? 1 : 0,
            }}
          >
            <span className="text-[12px] font-bold text-white">{item.label}</span>
          </div>

          <div
            className="w-[40px] h-[40px] shrink-0 flex items-center justify-center text-white shadow-[0_2px_12px_rgba(0,0,0,0.22)] transition-[border-radius] duration-[220ms] ease-out"
            style={{
              background: item.bg,
              borderRadius: hovered === item.id ? "0 6px 6px 0" : "6px 0 0 6px",
            }}
          >
            {item.icon}
          </div>
        </Link>
      ))}
    </div>
  );
}
