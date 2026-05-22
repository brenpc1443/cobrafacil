import Link from "next/link";
import { resumenClientes, soles } from "@/lib/calc";

export default function CuentasPage() {
  const filas = resumenClientes();
  const totalGeneral = filas.reduce((s, r) => s + r.totalPendiente, 0);

  function badgeAtraso(dias: number) {
    if (dias <= 0) return <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">Por vencer</span>;
    if (dias <= 30) return <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-700">{dias} días</span>;
    if (dias <= 60) return <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">{dias} días</span>;
    return <span className="rounded-full bg-red-600 px-2.5 py-0.5 text-xs font-medium text-white">{dias} días</span>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Cuentas por cobrar</h1>
          <p className="mt-1 text-sm text-slate-500">{filas.length} clientes te deben en total {soles(totalGeneral)}.</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3">Cliente</th>
              <th className="px-5 py-3">Distrito</th>
              <th className="px-5 py-3 text-center">Facturas</th>
              <th className="px-5 py-3 text-center">Atraso</th>
              <th className="px-5 py-3 text-right">Monto</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filas.map((r) => (
              <tr key={r.cliente.id} className="hover:bg-slate-50">
                <td className="px-5 py-3">
                  <div className="font-medium text-slate-800">{r.cliente.razonSocial}</div>
                  <div className="text-xs text-slate-400">RUC {r.cliente.ruc}</div>
                </td>
                <td className="px-5 py-3 text-slate-600">{r.cliente.distrito}</td>
                <td className="px-5 py-3 text-center text-slate-600">{r.facturasPendientes}</td>
                <td className="px-5 py-3 text-center">{badgeAtraso(r.maxAtraso)}</td>
                <td className={`px-5 py-3 text-right font-semibold ${r.maxAtraso > 0 ? "text-red-600" : "text-slate-700"}`}>
                  {soles(r.totalPendiente)}
                </td>
                <td className="px-5 py-3 text-right">
                  <Link href={`/clientes/${r.cliente.id}`} className="text-sm font-medium text-brand-600 hover:underline">
                    Cobrar →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
