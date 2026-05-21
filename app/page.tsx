import Link from "next/link";
import { calcularKpis, agingPorTramo, resumenClientes, soles, ETIQUETA_TRAMO } from "@/lib/calc";

export default function DashboardPage() {
  const kpis = calcularKpis();
  const aging = agingPorTramo();
  const topDeudores = resumenClientes().slice(0, 5);
  const maxMonto = Math.max(...aging.map((a) => a.monto), 1);

  const tarjetas = [
    { label: "Total por cobrar", valor: kpis.totalPorCobrar, color: "text-slate-900", sub: `${kpis.clientesConDeuda} clientes con deuda` },
    { label: "Vencido", valor: kpis.vencido, color: "text-red-600", sub: "Plata que ya deberías tener" },
    { label: "Por vencer", valor: kpis.porVencer, color: "text-amber-600", sub: "Próximos vencimientos" },
    { label: "Cobrado este mes", valor: kpis.cobradoEsteMes, color: "text-emerald-600", sub: "Pagos recibidos" },
  ];

  const colorTramo: Record<string, string> = {
    porVencer: "bg-amber-400",
    d1_30: "bg-orange-400",
    d31_60: "bg-red-400",
    d60mas: "bg-red-600",
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Resumen de cobranza</h1>
        <p className="mt-1 text-sm text-slate-500">Tu plata por cobrar de un vistazo.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {tarjetas.map((t) => (
          <div key={t.label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-sm font-medium text-slate-500">{t.label}</div>
            <div className={`mt-2 text-2xl font-bold ${t.color}`}>{soles(t.valor)}</div>
            <div className="mt-1 text-xs text-slate-400">{t.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Antigüedad de deuda */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">Antigüedad de la deuda</h2>
          <p className="mt-1 text-xs text-slate-500">Mientras más vieja la deuda, más difícil de cobrar.</p>
          <div className="mt-5 space-y-4">
            {aging.map((a) => (
              <div key={a.tramo}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-slate-600">
                    {ETIQUETA_TRAMO[a.tramo]} <span className="text-slate-400">({a.cantidad})</span>
                  </span>
                  <span className="font-medium text-slate-800">{soles(a.monto)}</span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${colorTramo[a.tramo]}`}
                    style={{ width: `${(a.monto / maxMonto) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top deudores */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">Quiénes te deben más</h2>
            <Link href="/cuentas" className="text-sm font-medium text-brand-600 hover:underline">
              Ver todos →
            </Link>
          </div>
          <div className="mt-4 divide-y divide-slate-100">
            {topDeudores.map((r) => (
              <Link
                key={r.cliente.id}
                href={`/clientes/${r.cliente.id}`}
                className="flex items-center justify-between py-3 transition hover:bg-slate-50"
              >
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-slate-800">{r.cliente.razonSocial}</div>
                  <div className="text-xs text-slate-400">
                    {r.facturasPendientes} factura(s)
                    {r.maxAtraso > 0 ? ` · vencida hace ${r.maxAtraso} día(s)` : " · al día"}
                  </div>
                </div>
                <div className={`shrink-0 text-sm font-semibold ${r.maxAtraso > 0 ? "text-red-600" : "text-slate-700"}`}>
                  {soles(r.totalPendiente)}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
