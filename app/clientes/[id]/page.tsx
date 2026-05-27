import Link from "next/link";
import { notFound } from "next/navigation";
import { getCliente, facturasDeCliente } from "@/lib/data";
import { soles, fechaCorta, diasAtraso, mensajeWhatsapp, linkWhatsapp } from "@/lib/calc";
import AccionesCobro from "@/components/AccionesCobro";

export default async function ClientePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cliente = getCliente(id);
  if (!cliente) notFound();

  const todas = facturasDeCliente(cliente.id);
  const pendientes = todas.filter((f) => f.estado === "pendiente");
  const totalPendiente = pendientes.reduce((s, f) => s + f.monto, 0);

  function estadoFactura(fechaVenc: string) {
    const d = diasAtraso(fechaVenc);
    if (d > 0) return <span className="font-medium text-red-600">Vencida hace {d} día(s)</span>;
    if (d === 0) return <span className="font-medium text-amber-600">Vence hoy</span>;
    return <span className="text-slate-500">Vence en {Math.abs(d)} día(s)</span>;
  }

  return (
    <div className="space-y-6">
      <Link href="/cuentas" className="text-sm font-medium text-brand-600 hover:underline">
        ← Volver a cuentas por cobrar
      </Link>

      {/* Encabezado del cliente */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{cliente.razonSocial}</h1>
            <p className="mt-1 text-sm text-slate-500">
              RUC {cliente.ruc} · {cliente.distrito} · Contacto: {cliente.contacto}
            </p>
          </div>
          <div className="rounded-lg bg-red-50 px-5 py-3 text-right">
            <div className="text-xs font-medium text-red-500">Deuda pendiente</div>
            <div className="text-2xl font-bold text-red-600">{soles(totalPendiente)}</div>
          </div>
        </div>

        <div className="mt-6 border-t border-slate-100 pt-5">
          <AccionesCobro
            linkWa={linkWhatsapp(cliente)}
            mensaje={mensajeWhatsapp(cliente)}
          />
        </div>
      </div>

      {/* Facturas */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="text-base font-semibold text-slate-900">Facturas</h2>
        </div>
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-6 py-3">Factura</th>
              <th className="px-6 py-3">Emisión</th>
              <th className="px-6 py-3">Vencimiento</th>
              <th className="px-6 py-3">Estado</th>
              <th className="px-6 py-3 text-right">Monto</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {todas.map((f) => (
              <tr key={f.id} className={f.estado === "pagada" ? "bg-emerald-50/40" : ""}>
                <td className="px-6 py-3 font-medium text-slate-800">{f.id}</td>
                <td className="px-6 py-3 text-slate-600">{fechaCorta(f.fechaEmision)}</td>
                <td className="px-6 py-3 text-slate-600">{fechaCorta(f.fechaVencimiento)}</td>
                <td className="px-6 py-3">
                  {f.estado === "pagada" ? (
                    <span className="font-medium text-emerald-600">Pagada el {fechaCorta(f.fechaPago!)}</span>
                  ) : (
                    estadoFactura(f.fechaVencimiento)
                  )}
                </td>
                <td className="px-6 py-3 text-right font-semibold text-slate-800">{soles(f.monto)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
