export default function RecordatoriosPage() {
  const reglas = [
    { cuando: "3 días antes del vencimiento", tono: "Aviso amable", color: "bg-amber-100 text-amber-700" },
    { cuando: "El día del vencimiento", tono: "Recordatorio de pago", color: "bg-orange-100 text-orange-700" },
    { cuando: "7 días después (si no paga)", tono: "Segundo aviso", color: "bg-red-100 text-red-700" },
    { cuando: "15 días después (si no paga)", tono: "Aviso firme", color: "bg-red-200 text-red-800" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Recordatorios automáticos</h1>
        <p className="mt-1 text-sm text-slate-500">
          El sistema cobra por ti: manda WhatsApps cordiales en el momento justo, sin que tengas que perseguir a nadie.
        </p>
      </div>

      {/* Reglas activas */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">Reglas activas</h2>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            ● Activado
          </span>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {reglas.map((r) => (
            <div key={r.cuando} className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
              <div>
                <div className="text-sm font-medium text-slate-800">{r.cuando}</div>
                <div className="text-xs text-slate-500">{r.tono}</div>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${r.color}`}>auto</span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-slate-400">
          Demo: en producción estos mensajes se envían solos por WhatsApp.
        </p>
      </div>
    </div>
  );
}
