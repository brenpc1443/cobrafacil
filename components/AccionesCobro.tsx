"use client";

import { useState } from "react";

export default function AccionesCobro({
  linkWa,
  mensaje,
}: {
  linkWa: string;
  mensaje: string;
}) {
  const [copiado, setCopiado] = useState(false);

  async function copiarMensaje() {
    try {
      await navigator.clipboard.writeText(mensaje);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      /* noop */
    }
  }

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <a
          href={linkWa}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600"
        >
          <span>💬</span> Enviar recordatorio por WhatsApp
        </a>
        <button
          onClick={copiarMensaje}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
        >
          {copiado ? "✓ Copiado" : "Copiar mensaje"}
        </button>
      </div>

      {/* Vista previa del mensaje (incluye el Yape del negocio para pago directo) */}
      <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
        <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Mensaje que se enviará
        </div>
        <pre className="whitespace-pre-wrap font-sans text-sm text-slate-700">{mensaje}</pre>
      </div>
    </>
  );
}
