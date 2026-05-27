"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useStore } from "@/lib/store";
import { soles, fechaCorta, diasAtraso, mensajeWhatsapp, linkWhatsapp, facturasDe } from "@/lib/calc";
import AccionesCobro from "@/components/AccionesCobro";

export default function ClientePage() {
  const { id } = useParams<{ id: string }>();
  const { clientes, facturas, negocio, addFactura, registrarPago, deleteFactura } = useStore();
  const [mostrarForm, setMostrarForm] = useState(false);

  const cliente = clientes.find((c) => c.id === id);

  if (!cliente) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-500">No se encontró el cliente.</p>
        <Link href="/clientes" className="text-sm font-medium text-brand-600 hover:underline">
          ← Volver a clientes
        </Link>
      </div>
    );
  }

  const todas = facturasDe(cliente.id, facturas);
  const pendientes = todas.filter((f) => f.estado === "pendiente");
  const totalPendiente = pendientes.reduce((s, f) => s + f.monto, 0);

  function estadoFactura(fechaVenc: string) {
    const d = diasAtraso(fechaVenc, negocio.hoy);
    if (d > 0) return <span className="font-medium text-red-600">Vencida hace {d} día(s)</span>;
    if (d === 0) return <span className="font-medium text-amber-600">Vence hoy</span>;
    return <span className="text-slate-500">Vence en {Math.abs(d)} día(s)</span>;
  }

  function onNuevaFactura(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    addFactura({
      clienteId: cliente!.id,
      monto: Number(fd.get("monto")),
      fechaEmision: String(fd.get("fechaEmision")),
      fechaVencimiento: String(fd.get("fechaVencimiento")),
    });
    setMostrarForm(false);
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

        {pendientes.length > 0 && (
          <div className="mt-6 border-t border-slate-100 pt-5">
            <AccionesCobro
              linkWa={linkWhatsapp(cliente, facturas, negocio, negocio.hoy)}
              mensaje={mensajeWhatsapp(cliente, facturas, negocio, negocio.hoy)}
            />
          </div>
        )}
      </div>

      {/* Facturas */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-base font-semibold text-slate-900">Facturas</h2>
          <button
            onClick={() => setMostrarForm((v) => !v)}
            className="rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            {mostrarForm ? "Cancelar" : "+ Nueva factura"}
          </button>
        </div>

        {mostrarForm && (
          <form onSubmit={onNuevaFactura} className="grid grid-cols-1 gap-4 border-b border-slate-100 bg-slate-50 p-6 sm:grid-cols-4">
            <label className="text-sm">
              <span className="mb-1 block font-medium text-slate-600">Monto (S/)</span>
              <input name="monto" type="number" step="0.01" min="0" required className="w-full rounded-lg border border-slate-300 px-3 py-2" />
            </label>
            <label className="text-sm">
              <span className="mb-1 block font-medium text-slate-600">Emisión</span>
              <input name="fechaEmision" type="date" defaultValue={negocio.hoy} required className="w-full rounded-lg border border-slate-300 px-3 py-2" />
            </label>
            <label className="text-sm">
              <span className="mb-1 block font-medium text-slate-600">Vencimiento</span>
              <input name="fechaVencimiento" type="date" required className="w-full rounded-lg border border-slate-300 px-3 py-2" />
            </label>
            <div className="flex items-end">
              <button type="submit" className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
                Guardar factura
              </button>
            </div>
          </form>
        )}

        {todas.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-slate-400">Este cliente aún no tiene facturas.</p>
        ) : (
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-6 py-3">Factura</th>
                <th className="px-6 py-3">Emisión</th>
                <th className="px-6 py-3">Vencimiento</th>
                <th className="px-6 py-3">Estado</th>
                <th className="px-6 py-3 text-right">Monto</th>
                <th className="px-6 py-3 text-right">Acciones</th>
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
                  <td className="px-6 py-3 text-right">
                    {f.estado === "pendiente" ? (
                      <button
                        onClick={() => registrarPago(f.id, negocio.hoy)}
                        className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-600"
                      >
                        Registrar pago
                      </button>
                    ) : (
                      <button
                        onClick={() => deleteFactura(f.id)}
                        className="text-xs font-medium text-slate-400 hover:text-red-600"
                      >
                        Eliminar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
