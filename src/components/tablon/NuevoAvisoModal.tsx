interface NuevoAvisoModalProps {
  canPublishDirect: boolean;
  onClose: () => void;
}

export function NuevoAvisoModal({ canPublishDirect, onClose }: NuevoAvisoModalProps) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-5">
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute inset-0 bg-[#00201B]/60 backdrop-blur-sm border-none p-0 cursor-default"
      />
      <div className="relative bg-white rounded-[20px] w-full max-w-[480px] px-7 py-8 shadow-[0_24px_80px_rgba(0,0,0,0.2)]">
        <h3 className="font-display text-[22px] text-[#00201B] m-0 mb-1.5">
          {canPublishDirect ? "Publicar aviso" : "Solicitar publicación"}
        </h3>
        <p className="text-[13px] text-text-muted m-0 mb-6">
          {canPublishDirect
            ? "El aviso quedará publicado de inmediato en el tablón comunitario."
            : "Tu solicitud será revisada por el comité antes de publicarse."}
        </p>
        <div className="flex flex-col gap-3.5">
          <div>
            <label
              htmlFor="nuevo-aviso-tipo"
              className="text-[12px] font-semibold text-text-muted block mb-1.5"
            >
              Tipo
            </label>
            <select
              id="nuevo-aviso-tipo"
              className="w-full px-3 py-2.5 border border-border rounded-lg text-[14px] text-[#00201B] bg-white outline-none focus:border-[#0D9488]"
            >
              <option>Aviso de interés comunitario</option>
              <option>Rifa / bazar</option>
              <option>Venta</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="nuevo-aviso-titulo"
              className="text-[12px] font-semibold text-text-muted block mb-1.5"
            >
              Título
            </label>
            <input
              id="nuevo-aviso-titulo"
              type="text"
              placeholder="Título del aviso"
              className="w-full px-3 py-2.5 border border-border rounded-lg text-[14px] text-[#00201B] outline-none box-border focus:border-[#0D9488]"
            />
          </div>
          <div>
            <label
              htmlFor="nuevo-aviso-desc"
              className="text-[12px] font-semibold text-text-muted block mb-1.5"
            >
              Descripción
            </label>
            <textarea
              id="nuevo-aviso-desc"
              rows={4}
              placeholder="Descripción detallada..."
              className="w-full px-3 py-2.5 border border-border rounded-lg text-[14px] text-[#00201B] outline-none resize-y font-sans box-border focus:border-[#0D9488]"
            />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 p-3 text-[14px] font-semibold rounded-[10px] border border-border bg-white text-text-muted cursor-pointer hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={onClose}
            className="flex-[2] p-3 text-[14px] font-bold rounded-[10px] border-none bg-[#0D9488] text-white cursor-pointer hover:bg-[#005047]"
          >
            {canPublishDirect ? "Publicar" : "Enviar solicitud"}
          </button>
        </div>
      </div>
    </div>
  );
}
