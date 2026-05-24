"use client";

import { useState } from "react";
import { NEGOCIO } from "@/lib/data";

export default function AccionesCobro({
  linkWa,
  mensaje,
  total,
  cliente,
}: {
  linkWa: string;
  mensaje: string;
  total: string;
  cliente: string;
}) {
  const [verYape, setVerYape] = useState(false);
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
          onClick={() => setVerYape(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700"
        >
          <span>📱</span> Generar cobro Yape
        </button>
        <button
          onClick={copiarMensaje}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
        >
          {copiado ? "✓ Copiado" : "Copiar mensaje"}
        </button>
      </div>

      {/* Vista previa del mensaje */}
      <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
        <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Mensaje que se enviará
        </div>
        <pre className="whitespace-pre-wrap font-sans text-sm text-slate-700">{mensaje}</pre>
      </div>

      {/* Modal Yape (simulado para la demo) */}
      {verYape && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setVerYape(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-violet-700">
              📱
            </div>
            <h3 className="mt-3 text-lg font-bold text-slate-900">Cobro por Yape</h3>
            <p className="text-sm text-slate-500">Muéstrale este QR a {cliente}</p>

            {/* QR simulado */}
            <div className="mx-auto mt-4 grid h-44 w-44 grid-cols-8 gap-0.5 rounded-xl border border-slate-200 bg-white p-3">
              {Array.from({ length: 64 }).map((_, i) => (
                <div
                  key={i}
                  className={(i * 7 + ((i * i) % 5)) % 3 === 0 ? "bg-slate-900" : "bg-transparent"}
                />
              ))}
            </div>

            <div className="mt-4 rounded-lg bg-violet-50 p-3">
              <div className="text-xs text-violet-500">Monto a cobrar</div>
              <div className="text-2xl font-bold text-violet-700">{total}</div>
              <div className="mt-1 text-sm text-slate-600">
                {NEGOCIO.yapeNombre} · {NEGOCIO.yapeNumero}
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-400">
              Demo: el QR es ilustrativo. En producción se genera un cobro Yape real.
            </p>
            <button
              onClick={() => setVerYape(false)}
              className="mt-4 w-full rounded-lg bg-slate-900 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
