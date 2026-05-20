// ---------------------------------------------------------------------------
// Utilidades de cálculo: formato de soles/fechas, antigüedad de deuda (aging),
// totales y armado del mensaje de WhatsApp.
// ---------------------------------------------------------------------------

import { NEGOCIO, type Cliente, type Factura, facturas, clientes, facturasDeCliente } from "./data";

const HOY = new Date(NEGOCIO.hoy + "T00:00:00");

export function soles(monto: number): string {
  return "S/ " + monto.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function fechaCorta(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" });
}

/** Días de atraso respecto a "hoy". Negativo = aún no vence. */
export function diasAtraso(fechaVencimiento: string): number {
  const venc = new Date(fechaVencimiento + "T00:00:00");
  return Math.round((HOY.getTime() - venc.getTime()) / 86_400_000);
}

export type TramoAging = "porVencer" | "d1_30" | "d31_60" | "d60mas";

export function tramoAging(f: Factura): TramoAging {
  const d = diasAtraso(f.fechaVencimiento);
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

const pendientes = () => facturas.filter((f) => f.estado === "pendiente");

export interface Kpis {
  totalPorCobrar: number;
  vencido: number;
  porVencer: number;
  cobradoEsteMes: number;
  clientesConDeuda: number;
}

export function calcularKpis(): Kpis {
  const pend = pendientes();
  const vencido = pend.filter((f) => diasAtraso(f.fechaVencimiento) > 0).reduce((s, f) => s + f.monto, 0);
  const porVencer = pend.filter((f) => diasAtraso(f.fechaVencimiento) <= 0).reduce((s, f) => s + f.monto, 0);

  const mesActual = NEGOCIO.hoy.slice(0, 7); // YYYY-MM
  const cobradoEsteMes = facturas
    .filter((f) => f.estado === "pagada" && f.fechaPago?.startsWith(mesActual))
    .reduce((s, f) => s + f.monto, 0);

  const clientesConDeuda = new Set(pend.map((f) => f.clienteId)).size;

  return { totalPorCobrar: vencido + porVencer, vencido, porVencer, cobradoEsteMes, clientesConDeuda };
}

export function agingPorTramo(): { tramo: TramoAging; monto: number; cantidad: number }[] {
  const orden: TramoAging[] = ["porVencer", "d1_30", "d31_60", "d60mas"];
  return orden.map((tramo) => {
    const fs = pendientes().filter((f) => tramoAging(f) === tramo);
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
export function resumenClientes(): FilaCliente[] {
  return clientes
    .map((cliente) => {
      const pend = facturasDeCliente(cliente.id).filter((f) => f.estado === "pendiente");
      return {
        cliente,
        totalPendiente: pend.reduce((s, f) => s + f.monto, 0),
        facturasPendientes: pend.length,
        maxAtraso: pend.reduce((m, f) => Math.max(m, diasAtraso(f.fechaVencimiento)), -9999),
      };
    })
    .filter((r) => r.facturasPendientes > 0)
    .sort((a, b) => b.maxAtraso - a.maxAtraso);
}

/** Mensaje cordial de cobranza, listo para enviar por WhatsApp. */
export function mensajeWhatsapp(cliente: Cliente): string {
  const pend = facturasDeCliente(cliente.id).filter((f) => f.estado === "pendiente");
  const total = pend.reduce((s, f) => s + f.monto, 0);
  const detalle = pend
    .map((f) => {
      const d = diasAtraso(f.fechaVencimiento);
      const estado = d > 0 ? `vencida hace ${d} día(s)` : `vence el ${fechaCorta(f.fechaVencimiento)}`;
      return `• ${f.id} — ${soles(f.monto)} (${estado})`;
    })
    .join("\n");

  return (
    `Estimado(a) ${cliente.contacto}, le saluda ${NEGOCIO.razonSocial}.\n\n` +
    `Le recordamos amablemente que tiene un saldo pendiente de ${soles(total)}:\n` +
    `${detalle}\n\n` +
    `Puede pagar por Yape al ${NEGOCIO.yapeNumero} (${NEGOCIO.yapeNombre}). ` +
    `Si ya realizó el pago, por favor ignore este mensaje. ¡Gracias por su preferencia!`
  );
}

/** Link wa.me con el mensaje pre-cargado (funciona de verdad desde el celular). */
export function linkWhatsapp(cliente: Cliente): string {
  return `https://wa.me/${cliente.telefono}?text=${encodeURIComponent(mensajeWhatsapp(cliente))}`;
}
