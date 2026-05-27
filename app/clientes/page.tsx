"use client";

import { useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { facturasDe, soles } from "@/lib/calc";

export default function ClientesPage() {
  const { clientes, facturas, addCliente } = useStore();
  const [mostrarForm, setMostrarForm] = useState(false);

  function onNuevoCliente(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    addCliente({
      razonSocial: String(fd.get("razonSocial")),
      ruc: String(fd.get("ruc")),
      contacto: String(fd.get("contacto")),
      telefono: String(fd.get("telefono")),
      distrito: String(fd.get("distrito")),
    });
    e.currentTarget.reset();
    setMostrarForm(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Clientes</h1>
          <p className="mt-1 text-sm text-slate-500">{clientes.length} cliente(s) en tu cartera.</p>
        </div>
        <button
          onClick={() => setMostrarForm((v) => !v)}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
        >
          {mostrarForm ? "Cancelar" : "+ Nuevo cliente"}
        </button>
      </div>

      {mostrarForm && (
        <form onSubmit={onNuevoCliente} className="grid grid-cols-1 gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-2">
          <label className="text-sm">
            <span className="mb-1 block font-medium text-slate-600">Razón social</span>
            <input name="razonSocial" required className="w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="Bodega Doña Rosa E.I.R.L." />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium text-slate-600">RUC</span>
            <input name="ruc" required className="w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="20600111222" />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium text-slate-600">Contacto</span>
            <input name="contacto" required className="w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="Rosa Quispe" />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium text-slate-600">Teléfono (con 51)</span>
            <input name="telefono" required className="w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="51987111222" />
          </label>
          <label className="text-sm sm:col-span-2">
            <span className="mb-1 block font-medium text-slate-600">Distrito</span>
            <input name="distrito" required className="w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="San Juan de Lurigancho" />
          </label>
          <div className="sm:col-span-2">
            <button type="submit" className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800">
              Guardar cliente
            </button>
          </div>
        </form>
      )}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3">Cliente</th>
              <th className="px-5 py-3">Contacto</th>
              <th className="px-5 py-3">Distrito</th>
              <th className="px-5 py-3 text-right">Deuda pendiente</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {clientes.map((c) => {
              const pend = facturasDe(c.id, facturas).filter((f) => f.estado === "pendiente");
              const total = pend.reduce((s, f) => s + f.monto, 0);
              return (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="px-5 py-3">
                    <div className="font-medium text-slate-800">{c.razonSocial}</div>
                    <div className="text-xs text-slate-400">RUC {c.ruc}</div>
                  </td>
                  <td className="px-5 py-3 text-slate-600">{c.contacto}</td>
                  <td className="px-5 py-3 text-slate-600">{c.distrito}</td>
                  <td className={`px-5 py-3 text-right font-semibold ${total > 0 ? "text-red-600" : "text-slate-400"}`}>
                    {soles(total)}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link href={`/clientes/${c.id}`} className="text-sm font-medium text-brand-600 hover:underline">
                      Abrir →
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
