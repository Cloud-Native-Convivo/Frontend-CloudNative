/* eslint-disable react/forbid-dom-props */
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";

const RIBBON_ITEMS = [
  {
    text: "📢 Asamblea de copropietarios — 22 agosto, 19:00 hrs · Sala de Juegos",
    path: "/tablon",
  },
  {
    text: "💧 Corte de agua programado Torres A y B — 25 agosto 09:00 hrs",
    path: "/tablon",
  },
  {
    text: "🎟️ Rifa solidaria — Bazar Comunidad · Boletos en conserjería",
    path: "/tablon",
  },
  {
    text: "📸 Nuevo registro fotográfico: renovación jardín central",
    path: "/registro",
  },
];

export function AnnouncementRibbon({ onDismiss }: { onDismiss: () => void }) {
  const [idx, setIdx] = useState(0);
  const [fading, setFading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const rotate = () => {
    setFading(true);
    fadeTimerRef.current = setTimeout(() => {
      setIdx((i) => (i + 1) % RIBBON_ITEMS.length);
      setFading(false);
    }, 250);
  };

  useEffect(() => {
    if (RIBBON_ITEMS.length < 2) return;
    timerRef.current = setInterval(rotate, 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
    };
  }, []);

  const item = RIBBON_ITEMS[idx];

  return (
    <div className="fixed top-0 inset-x-0 z-[60] h-[32px] bg-[#005047] flex items-center">
      <div className="max-w-[1280px] mx-auto px-4 flex items-center gap-[12px] w-full">
        <div className="shrink-0 bg-[#0D9488] rounded-[3px] px-2 py-[1px] flex items-center gap-[5px]">
          <span className="w-[5px] h-[5px] rounded-full bg-[#4ADE80] inline-block" />
          <span className="text-[10px] font-bold text-white tracking-[0.08em] uppercase">
            Tablón
          </span>
        </div>

        <Link
          to={item.path}
          className="flex-1 text-[12px] text-white/90 no-underline overflow-hidden whitespace-nowrap text-ellipsis transition-opacity duration-300"
          style={{ opacity: fading ? 0 : 1 }}
        >
          {item.text}
        </Link>

        <div className="flex gap-[4px] shrink-0 ribbon-dots">
          {RIBBON_ITEMS.map((ribbonItem, i) => (
            <button
              key={ribbonItem.text}
              aria-label={`Ver aviso ${i + 1} de ${RIBBON_ITEMS.length}`}
              onClick={() => {
                setIdx(i);
                setFading(false);
              }}
              className="h-[5px] rounded-[3px] border-none cursor-pointer p-0 transition-[width,background-color] duration-300"
              style={{
                width: i === idx ? 14 : 5,
                background: i === idx ? "#5EEAD4" : "rgba(255,255,255,0.3)",
              }}
            />
          ))}
        </div>

        <button
          onClick={onDismiss}
          aria-label="Cerrar aviso"
          className="shrink-0 bg-transparent border-none cursor-pointer text-white/60 hover:text-white px-1 py-0.5 leading-none text-[14px] transition-colors duration-150"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
