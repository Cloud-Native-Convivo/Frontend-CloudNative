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
        className="absolute inset-0 bg-text/60 border-none p-0 cursor-default"
      />
      <div className="relative bg-white rounded-lg w-full max-w-narrow py-8 px-7 shadow-[0_24px_80px_rgba(0,0,0,0.2)]">
        <h3 className="font-serif text-[22px] text-text m-0 mb-2 font-normal">Pagar gasto común</h3>
        <p className="text-sm text-slate-500 m-0 mb-6">Agosto 2026 · Unidad 301 Torre A</p>
        <div className="bg-slate-50 rounded-md py-4 px-5 mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-slate-500">Total a pagar</span>
            <span className="text-lg font-bold text-text">$600.000 CLP</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-slate-400">Vence el</span>
            <span className="text-sm text-slate-400">15 sep 2026</span>
          </div>
        </div>
        <div className="mb-5">
          <div className="text-sm font-semibold text-text mb-3">Método de pago</div>
          {["Tarjeta de crédito/débito", "Transferencia bancaria", "WebPay"].map((m) => (
            <label
              key={m}
              className="flex items-center gap-3 py-3 cursor-pointer border-b border-slate-100 text-sm text-text"
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
          className="btn btn-primary w-full"
          data-cuelume-press="tick"
          data-cuelume-release="chime"
        >
          Confirmar pago
        </button>
      </div>
    </div>
  );
}
