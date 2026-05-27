// ---------------------------------------------------------------------------
// Utilidades de cálculo (puras): formato de soles/fechas, antigüedad de deuda
// (aging), KPIs de cobranza, mensaje de WhatsApp y resumen de caja.
// Reciben los datos por parámetro para poder usarse con datos vivos del store.
// ---------------------------------------------------------------------------

import type { Cliente, Factura, Movimiento, Negocio } from "./data";

export function soles(monto: number): string {
  return "S/ " + monto.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function fechaCorta(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" });
}

/** Días de atraso respecto a "hoy". Negativo = aún no vence. */
export function diasAtraso(fechaVencimiento: string, hoy: string): number {
  const venc = new Date(fechaVencimiento + "T00:00:00");
  const ref = new Date(hoy + "T00:00:00");
  return Math.round((ref.getTime() - venc.getTime()) / 86_400_000);
}

export type TramoAging = "porVencer" | "d1_30" | "d31_60" | "d60mas";

export function tramoAging(f: Factura, hoy: string): TramoAging {
  const d = diasAtraso(f.fechaVencimiento, hoy);
  if (d <= 0) return "porVencer";
  if (d <= 30) return "d1_30";
  if (d <= 60) return "d31_60";
  return "d60mas";
}

export const ETIQUETA_TRAMO: Record<TramoAging, string> = {
  porVencer: "Por vencer",
  d1_30: "1–30 días",
  d31_60: "31–60 días",
  d60mas: "60+ días",
};

const pendientes = (facturas: Factura[]) => facturas.filter((f) => f.estado === "pendiente");

export function facturasDe(clienteId: string, facturas: Factura[]): Factura[] {
  return facturas.filter((f) => f.clienteId === clienteId);
}

export interface Kpis {
  totalPorCobrar: number;
  vencido: number;
  porVencer: number;
  cobradoEsteMes: number;
  clientesConDeuda: number;
}

export function calcularKpis(facturas: Factura[], hoy: string): Kpis {
  const pend = pendientes(facturas);
  const vencido = pend.filter((f) => diasAtraso(f.fechaVencimiento, hoy) > 0).reduce((s, f) => s + f.monto, 0);
  const porVencer = pend.filter((f) => diasAtraso(f.fechaVencimiento, hoy) <= 0).reduce((s, f) => s + f.monto, 0);

  const mesActual = hoy.slice(0, 7); // YYYY-MM
  const cobradoEsteMes = facturas
    .filter((f) => f.estado === "pagada" && f.fechaPago?.startsWith(mesActual))
    .reduce((s, f) => s + f.monto, 0);

  const clientesConDeuda = new Set(pend.map((f) => f.clienteId)).size;

  return { totalPorCobrar: vencido + porVencer, vencido, porVencer, cobradoEsteMes, clientesConDeuda };
}

export function agingPorTramo(facturas: Factura[], hoy: string): { tramo: TramoAging; monto: number; cantidad: number }[] {
  const orden: TramoAging[] = ["porVencer", "d1_30", "d31_60", "d60mas"];
  return orden.map((tramo) => {
    const fs = pendientes(facturas).filter((f) => tramoAging(f, hoy) === tramo);
    return { tramo, monto: fs.reduce((s, f) => s + f.monto, 0), cantidad: fs.length };
  });
}

export interface FilaCliente {
  cliente: Cliente;
  totalPendiente: number;
  facturasPendientes: number;
  maxAtraso: number; // mayor días de atraso entre sus facturas
}

/** Una fila por cliente con deuda pendiente, ordenada por mayor atraso. */
export function resumenClientes(clientes: Cliente[], facturas: Factura[], hoy: string): FilaCliente[] {
  return clientes
    .map((cliente) => {
      const pend = facturasDe(cliente.id, facturas).filter((f) => f.estado === "pendiente");
      return {
        cliente,
        totalPendiente: pend.reduce((s, f) => s + f.monto, 0),
        facturasPendientes: pend.length,
        maxAtraso: pend.reduce((m, f) => Math.max(m, diasAtraso(f.fechaVencimiento, hoy)), -9999),
      };
    })
    .filter((r) => r.facturasPendientes > 0)
    .sort((a, b) => b.maxAtraso - a.maxAtraso);
}

/** Mensaje cordial de cobranza, listo para enviar por WhatsApp. */
export function mensajeWhatsapp(cliente: Cliente, facturas: Factura[], negocio: Negocio, hoy: string): string {
  const pend = facturasDe(cliente.id, facturas).filter((f) => f.estado === "pendiente");
  const total = pend.reduce((s, f) => s + f.monto, 0);
  const detalle = pend
    .map((f) => {
      const d = diasAtraso(f.fechaVencimiento, hoy);
      const estado = d > 0 ? `vencida hace ${d} día(s)` : `vence el ${fechaCorta(f.fechaVencimiento)}`;
      return `• ${f.id} — ${soles(f.monto)} (${estado})`;
    })
    .join("\n");

  return (
    `Estimado(a) ${cliente.contacto}, le saluda ${negocio.razonSocial}.\n\n` +
    `Le recordamos amablemente que tiene un saldo pendiente de ${soles(total)}:\n` +
    `${detalle}\n\n` +
    `Puede pagar por Yape al ${negocio.yapeNumero} (${negocio.yapeNombre}). ` +
    `Si ya realizó el pago, por favor ignore este mensaje. ¡Gracias por su preferencia!`
  );
}

/** Link wa.me con el mensaje pre-cargado (funciona de verdad desde el celular). */
export function linkWhatsapp(cliente: Cliente, facturas: Factura[], negocio: Negocio, hoy: string): string {
  return `https://wa.me/${cliente.telefono}?text=${encodeURIComponent(mensajeWhatsapp(cliente, facturas, negocio, hoy))}`;
}

// --- Caja: ingresos y egresos (EP-06) ---

export interface ResumenCaja {
  totalIngresos: number;
  totalEgresos: number;
  saldo: number;
}

export function resumenCaja(movimientos: Movimiento[]): ResumenCaja {
  const totalIngresos = movimientos.filter((m) => m.tipo === "ingreso").reduce((s, m) => s + m.monto, 0);
  const totalEgresos = movimientos.filter((m) => m.tipo === "egreso").reduce((s, m) => s + m.monto, 0);
  return { totalIngresos, totalEgresos, saldo: totalIngresos - totalEgresos };
}

/** Agrupa ingresos/egresos por mes (YYYY-MM), ordenado ascendente. */
export function flujoPorMes(movimientos: Movimiento[]): { mes: string; ingresos: number; egresos: number }[] {
  const mapa = new Map<string, { ingresos: number; egresos: number }>();
  for (const m of movimientos) {
    const mes = m.fecha.slice(0, 7);
    const acc = mapa.get(mes) ?? { ingresos: 0, egresos: 0 };
    if (m.tipo === "ingreso") acc.ingresos += m.monto;
    else acc.egresos += m.monto;
    mapa.set(mes, acc);
  }
  return [...mapa.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([mes, v]) => ({ mes, ...v }));
}
