"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { resumenCaja, flujoPorMes, soles, fechaCorta } from "@/lib/calc";
import { CATEGORIAS_INGRESO, CATEGORIAS_EGRESO, type TipoMovimiento } from "@/lib/data";

export default function CajaPage() {
  const { movimientos, negocio, addMovimiento, deleteMovimiento } = useStore();
  const [tipo, setTipo] = useState<TipoMovimiento>("egreso");

  const caja = resumenCaja(movimientos);
  const flujo = flujoPorMes(movimientos);
  const lista = [...movimientos].sort((a, b) => b.fecha.localeCompare(a.fecha));
  const categorias = tipo === "ingreso" ? CATEGORIAS_INGRESO : CATEGORIAS_EGRESO;

  function onNuevoMovimiento(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    addMovimiento({
      tipo,
      concepto: String(fd.get("concepto")),
      monto: Number(fd.get("monto")),
      fecha: String(fd.get("fecha")),
      categoria: String(fd.get("categoria")),
      origen: "otro",
    });
    e.currentTarget.reset();
  }

  const tarjetas = [
    { label: "Ingresos", valor: caja.totalIngresos, color: "text-emerald-600" },
    { label: "Egresos", valor: caja.totalEgresos, color: "text-red-600" },
    { label: "Saldo", valor: caja.saldo, color: caja.saldo >= 0 ? "text-slate-900" : "text-red-600" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Caja del negocio</h1>
        <p className="mt-1 text-sm text-slate-500">
          Lleva tus ingresos y egresos para saber cuánto entra, cuánto sale y cuánto te queda.
        </p>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {tarjetas.map((t) => (
          <div key={t.label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-sm font-medium text-slate-500">{t.label}</div>
            <div className={`mt-2 text-2xl font-bold ${t.color}`}>{soles(t.valor)}</div>
          </div>
        ))}
      </div>

      {/* Registrar movimiento */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">Registrar movimiento</h2>
        <div className="mt-4 inline-flex rounded-lg border border-slate-200 p-1">
          <button
            onClick={() => setTipo("ingreso")}
            className={`rounded-md px-4 py-1.5 text-sm font-semibold transition ${tipo === "ingreso" ? "bg-emerald-500 text-white" : "text-slate-500"}`}
          >
            Ingreso
          </button>
          <button
            onClick={() => setTipo("egreso")}
            className={`rounded-md px-4 py-1.5 text-sm font-semibold transition ${tipo === "egreso" ? "bg-red-500 text-white" : "text-slate-500"}`}
          >
            Egreso
          </button>
        </div>

        <form onSubmit={onNuevoMovimiento} className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-5">
          <label className="text-sm sm:col-span-2">
            <span className="mb-1 block font-medium text-slate-600">Concepto</span>
            <input name="concepto" required className="w-full rounded-lg border border-slate-300 px-3 py-2" placeholder={tipo === "ingreso" ? "Venta al contado" : "Compra a proveedor"} />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium text-slate-600">Monto (S/)</span>
            <input name="monto" type="number" step="0.01" min="0" required className="w-full rounded-lg border border-slate-300 px-3 py-2" />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium text-slate-600">Fecha</span>
            <input name="fecha" type="date" defaultValue={negocio.hoy} required className="w-full rounded-lg border border-slate-300 px-3 py-2" />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium text-slate-600">Categoría</span>
            <select name="categoria" className="w-full rounded-lg border border-slate-300 px-3 py-2">
              {categorias.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>
          <div className="sm:col-span-5">
            <button type="submit" className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800">
              Registrar {tipo}
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Movimientos */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm lg:col-span-2">
          <div className="border-b border-slate-100 px-6 py-4">
            <h2 className="text-base font-semibold text-slate-900">Movimientos</h2>
          </div>
          {lista.length === 0 ? (
            <p className="px-6 py-8 text-center text-sm text-slate-400">Aún no hay movimientos.</p>
          ) : (
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <tbody className="divide-y divide-slate-100">
                {lista.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50">
                    <td className="px-6 py-3">
                      <div className="font-medium text-slate-800">{m.concepto}</div>
                      <div className="text-xs text-slate-400">
                        {fechaCorta(m.fecha)} · {m.categoria}
                        {m.origen === "yape-negocio" ? " · Yape negocio" : ""}
                      </div>
                    </td>
                    <td className={`px-6 py-3 text-right font-semibold ${m.tipo === "ingreso" ? "text-emerald-600" : "text-red-600"}`}>
                      {m.tipo === "ingreso" ? "+" : "−"} {soles(m.monto)}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <button onClick={() => deleteMovimiento(m.id)} className="text-xs font-medium text-slate-400 hover:text-red-600">
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Flujo por mes */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">Flujo por mes</h2>
          <div className="mt-4 space-y-3">
            {flujo.map((f) => (
              <div key={f.mes} className="text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-700">{f.mes}</span>
                  <span className={`font-semibold ${f.ingresos - f.egresos >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                    {soles(f.ingresos - f.egresos)}
                  </span>
                </div>
                <div className="mt-1 text-xs text-slate-400">
                  +{soles(f.ingresos)} · −{soles(f.egresos)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
