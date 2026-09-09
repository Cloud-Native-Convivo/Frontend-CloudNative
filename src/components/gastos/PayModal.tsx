interface PayModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

export function PayModal({ onClose, onConfirm }: PayModalProps) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-5">
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute inset-0 bg-[#00201B]/60 backdrop-blur-[4px] border-none p-0 cursor-default"
      />
      <div className="relative bg-white rounded-[20px] w-full max-w-[440px] py-8 px-7 shadow-[0_24px_80px_rgba(0,0,0,0.2)]">
        <h3 className="font-serif text-[22px] text-[#00201B] m-0 mb-1.5 font-normal">
          Pagar gasto común
        </h3>
        <p className="text-[13px] text-slate-500 m-0 mb-6">Agosto 2026 · Unidad 301 Torre A</p>
        <div className="bg-[#F8FAFB] rounded-xl py-4 px-[18px] mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-[14px] text-slate-500">Total a pagar</span>
            <span className="text-[18px] font-bold text-[#00201B]">$600.000 CLP</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[13px] text-slate-400">Vence el</span>
            <span className="text-[13px] text-slate-400">15 sep 2026</span>
          </div>
        </div>
        <div className="mb-5">
          <div className="text-[13px] font-semibold text-[#00201B] mb-3">Método de pago</div>
          {["Tarjeta de crédito/débito", "Transferencia bancaria", "WebPay"].map((m) => (
            <label
              key={m}
              className="flex items-center gap-2.5 py-2.5 cursor-pointer border-b border-slate-100 text-[14px] text-[#00201B]"
            >
              <input
                type="radio"
                name="pago"
                defaultChecked={m === "WebPay"}
                className="accent-teal-600"
              />{" "}
              {m}
            </label>
          ))}
        </div>
        <button
          onClick={onConfirm}
          className="w-full p-3.5 text-[15px] font-bold rounded-[10px] border-none bg-teal-600 text-white cursor-pointer transition-colors duration-200 hover:bg-teal-800"
          data-cuelume-press="tick"
          data-cuelume-release="chime"
        >
          Confirmar pago
        </button>
      </div>
    </div>
  );
}
