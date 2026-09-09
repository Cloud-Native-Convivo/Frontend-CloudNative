import { IconHome } from "../icons/Icons";

export function Footer() {
  return (
    <footer className="bg-[#00201B] text-white/55 pt-[52px] pb-[28px] px-[24px]">
      <div className="max-w-[1280px] mx-auto">
        <div className="footer-grid grid grid-cols-[2fr_1fr_1fr_1fr] gap-[40px] mb-[40px]">
          <div>
            <div className="flex items-center gap-[10px] mb-[16px]">
              <div className="w-[32px] h-[32px] rounded-[8px] bg-[#0D9488] flex items-center justify-center">
                <IconHome className="text-white w-[16px] h-[16px]" />
              </div>
              <span className="font-['Gloock',Georgia,serif] text-[18px] text-white">Convivo</span>
            </div>
            <p className="text-[13px] leading-[1.7] max-w-[260px] m-0 mb-[16px] text-white/50">
              Plataforma digital para la gestión de condominios en Chile. Tranquilidad, comunidad y
              confianza.
            </p>
            <div className="flex gap-[16px]">
              {["Privacidad", "Términos", "Contacto"].map((l) => (
                <span
                  key={l}
                  className="text-[12px] text-white/35 cursor-pointer transition-colors duration-150 hover:text-[#5EEAD4]"
                >
                  {l}
                </span>
              ))}
            </div>
          </div>
          {[
            {
              title: "Plataforma",
              links: [
                "Reservas",
                "Gastos comunes",
                "Tablón de avisos",
                "Dashboard",
                "Registro fotográfico",
              ],
            },
            {
              title: "Empresa",
              links: ["Precios", "Sobre Convivo", "Blog", "Prensa"],
            },
            {
              title: "Emergencias",
              links: ["Carabineros 133", "Bomberos 132", "SAMU 131", "Conserjería Interno 100"],
            },
          ].map((col) => (
            <div key={col.title}>
              <div className="text-[11px] font-bold text-[#5EEAD4] tracking-[0.1em] uppercase mb-[16px]">
                {col.title}
              </div>
              {col.links.map((l) => (
                <div
                  key={l}
                  className="text-[13px] text-white/45 mb-[10px] cursor-pointer transition-colors duration-150 hover:text-white"
                >
                  {l}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="border-t border-white/5 pt-[20px] flex justify-between flex-wrap gap-[8px]">
          <p className="text-[12px] m-0">© 2026 Convivo SpA. Todos los derechos reservados.</p>
          <p className="text-[12px] m-0">Hecho con ♥ para condominios chilenos</p>
        </div>
      </div>
    </footer>
  );
}
