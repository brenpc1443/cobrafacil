// ---------------------------------------------------------------------------
// Datos semilla de la demo (Cobranza B2B). Todo en memoria, sin base de datos.
// El negocio dueño de la cuenta es una distribuidora ficticia que vende al
// crédito a otros negocios (bodegas, minimarkets, ferreterías, etc.).
// ---------------------------------------------------------------------------

export interface Negocio {
  razonSocial: string;
  ruc: string;
  hoy: string; // "hoy" fijo para que los KPIs/aging sean estables en la demo
  yapeNombre: string;
  yapeNumero: string;
  yapeQrDataUrl?: string; // QR de Yape subido por el dueño (HU-13), opcional
}

export const NEGOCIO: Negocio = {
  razonSocial: "Distribuidora San Martín S.A.C.",
  ruc: "20512345678",
  hoy: "2026-05-26",
  yapeNombre: "Distribuidora San Martín",
  yapeNumero: "987 654 321",
};

export type EstadoFactura = "pendiente" | "pagada";

export interface Factura {
  id: string; // serie-correlativo, p.ej. F001-00123
  clienteId: string;
  monto: number; // en soles
  fechaEmision: string; // YYYY-MM-DD
  fechaVencimiento: string; // YYYY-MM-DD
  estado: EstadoFactura;
  fechaPago?: string; // YYYY-MM-DD (si fue pagada)
}

export interface Cliente {
  id: string;
  razonSocial: string;
  ruc: string;
  contacto: string;
  telefono: string; // formato internacional sin '+', para wa.me (Perú = 51)
  distrito: string;
}

export const clientes: Cliente[] = [
  { id: "c1", razonSocial: "Bodega Doña Rosa E.I.R.L.", ruc: "20600111222", contacto: "Rosa Quispe", telefono: "51987111222", distrito: "San Juan de Lurigancho" },
  { id: "c2", razonSocial: "Minimarket El Ahorro S.A.C.", ruc: "20600333444", contacto: "Luis Mendoza", telefono: "51987333444", distrito: "Ate" },
  { id: "c3", razonSocial: "Ferretería Los Andes S.R.L.", ruc: "20600555666", contacto: "Carlos Huamán", telefono: "51987555666", distrito: "Villa El Salvador" },
  { id: "c4", razonSocial: "Comercial Tarapoto E.I.R.L.", ruc: "20600777888", contacto: "María Flores", telefono: "51987777888", distrito: "Comas" },
  { id: "c5", razonSocial: "Botica Vida Sana S.A.C.", ruc: "20600999000", contacto: "Jorge Ramírez", telefono: "51987999000", distrito: "Los Olivos" },
  { id: "c6", razonSocial: "Distribuidora El Sol S.R.L.", ruc: "20601222333", contacto: "Ana Torres", telefono: "51987222333", distrito: "Callao" },
  { id: "c7", razonSocial: "Abarrotes La Económica E.I.R.L.", ruc: "20601444555", contacto: "Pedro Castro", telefono: "51987444555", distrito: "San Martín de Porres" },
  { id: "c8", razonSocial: "Mini Market 24h S.A.C.", ruc: "20601666777", contacto: "Lucía Vega", telefono: "51987666777", distrito: "Surco" },
  { id: "c9", razonSocial: "Comercial Hermanos Pérez S.R.L.", ruc: "20601888999", contacto: "Raúl Pérez", telefono: "51987888999", distrito: "Chorrillos" },
  { id: "c10", razonSocial: "Bazar y Librería El Saber E.I.R.L.", ruc: "20602111000", contacto: "Sandra Núñez", telefono: "51987111000", distrito: "Independencia" },
  { id: "c11", razonSocial: "Pollería Don Tito S.A.C.", ruc: "20602333222", contacto: "Tito Mamani", telefono: "51987333222", distrito: "Puente Piedra" },
  { id: "c12", razonSocial: "Restaurante Sabor Norteño S.R.L.", ruc: "20602555444", contacto: "Elena Díaz", telefono: "51987555444", distrito: "La Victoria" },
];

// Facturas: mezcla de vencidas (varias antigüedades), por vencer y pagadas este mes.
// Fechas relativas a NEGOCIO.hoy = 2026-05-26.
export const facturas: Factura[] = [
  // --- Vencidas hace mucho (60+ días) ---
  { id: "F001-00231", clienteId: "c1", monto: 1850.0, fechaEmision: "2026-02-10", fechaVencimiento: "2026-03-12", estado: "pendiente" },
  { id: "F001-00240", clienteId: "c3", monto: 3200.5, fechaEmision: "2026-02-20", fechaVencimiento: "2026-03-22", estado: "pendiente" },
  { id: "F001-00255", clienteId: "c9", monto: 980.0, fechaEmision: "2026-03-01", fechaVencimiento: "2026-03-16", estado: "pendiente" },

  // --- Vencidas 31-60 días ---
  { id: "F001-00268", clienteId: "c2", monto: 2450.0, fechaEmision: "2026-03-15", fechaVencimiento: "2026-04-14", estado: "pendiente" },
  { id: "F001-00272", clienteId: "c5", monto: 1320.75, fechaEmision: "2026-03-20", fechaVencimiento: "2026-04-04", estado: "pendiente" },
  { id: "F001-00280", clienteId: "c12", monto: 5400.0, fechaEmision: "2026-03-25", fechaVencimiento: "2026-04-09", estado: "pendiente" },

  // --- Vencidas 1-30 días ---
  { id: "F001-00291", clienteId: "c4", monto: 760.0, fechaEmision: "2026-04-10", fechaVencimiento: "2026-05-10", estado: "pendiente" },
  { id: "F001-00295", clienteId: "c7", monto: 2890.0, fechaEmision: "2026-04-22", fechaVencimiento: "2026-05-07", estado: "pendiente" },
  { id: "F001-00298", clienteId: "c1", monto: 640.0, fechaEmision: "2026-04-25", fechaVencimiento: "2026-05-15", estado: "pendiente" },
  { id: "F001-00301", clienteId: "c10", monto: 1190.5, fechaEmision: "2026-04-28", fechaVencimiento: "2026-05-13", estado: "pendiente" },

  // --- Por vencer (próximos días) ---
  { id: "F001-00310", clienteId: "c6", monto: 4100.0, fechaEmision: "2026-05-01", fechaVencimiento: "2026-05-31", estado: "pendiente" },
  { id: "F001-00312", clienteId: "c8", monto: 1575.0, fechaEmision: "2026-05-05", fechaVencimiento: "2026-06-04", estado: "pendiente" },
  { id: "F001-00315", clienteId: "c11", monto: 2230.0, fechaEmision: "2026-05-12", fechaVencimiento: "2026-05-29", estado: "pendiente" },
  { id: "F001-00318", clienteId: "c2", monto: 890.0, fechaEmision: "2026-05-18", fechaVencimiento: "2026-06-17", estado: "pendiente" },

  // --- Pagadas este mes (alimentan "Cobrado este mes") ---
  { id: "F001-00260", clienteId: "c3", monto: 1450.0, fechaEmision: "2026-03-10", fechaVencimiento: "2026-04-09", estado: "pagada", fechaPago: "2026-05-08" },
  { id: "F001-00275", clienteId: "c6", monto: 2300.0, fechaEmision: "2026-03-22", fechaVencimiento: "2026-04-21", estado: "pagada", fechaPago: "2026-05-14" },
  { id: "F001-00288", clienteId: "c5", monto: 980.0, fechaEmision: "2026-04-05", fechaVencimiento: "2026-05-05", estado: "pagada", fechaPago: "2026-05-20" },
  { id: "F001-00305", clienteId: "c8", monto: 1760.0, fechaEmision: "2026-04-30", fechaVencimiento: "2026-05-15", estado: "pagada", fechaPago: "2026-05-22" },
];

// ---------------------------------------------------------------------------
// Caja del negocio: ingresos y egresos (EP-06). En la demo se guardan en el
// navegador (localStorage) a través de lib/store.tsx.
// ---------------------------------------------------------------------------

export type TipoMovimiento = "ingreso" | "egreso";

export interface Movimiento {
  id: string;
  tipo: TipoMovimiento;
  concepto: string;
  monto: number; // en soles
  fecha: string; // YYYY-MM-DD
  categoria: string;
  // Si el ingreso vino de cobrar una factura por Yape del negocio:
  facturaId?: string;
  origen?: "yape-negocio" | "otro";
}

export const CATEGORIAS_INGRESO = ["Cobranza", "Venta", "Otro"] as const;
export const CATEGORIAS_EGRESO = ["Proveedores", "Servicios", "Planilla", "Alquiler", "Otros"] as const;

// Movimientos semilla para que la caja no arranque vacía.
export const movimientos: Movimiento[] = [
  { id: "m1", tipo: "egreso", concepto: "Alquiler del local", monto: 1200.0, fecha: "2026-05-01", categoria: "Alquiler" },
  { id: "m2", tipo: "egreso", concepto: "Compra a proveedor (mercadería)", monto: 3000.0, fecha: "2026-05-05", categoria: "Proveedores" },
  { id: "m3", tipo: "ingreso", concepto: "Cobro factura F001-00260", monto: 1450.0, fecha: "2026-05-08", categoria: "Cobranza", facturaId: "F001-00260", origen: "yape-negocio" },
  { id: "m4", tipo: "egreso", concepto: "Luz y agua", monto: 350.0, fecha: "2026-05-10", categoria: "Servicios" },
  { id: "m5", tipo: "ingreso", concepto: "Cobro factura F001-00275", monto: 2300.0, fecha: "2026-05-14", categoria: "Cobranza", facturaId: "F001-00275", origen: "yape-negocio" },
  { id: "m6", tipo: "egreso", concepto: "Planilla de personal", monto: 2500.0, fecha: "2026-05-15", categoria: "Planilla" },
  { id: "m7", tipo: "ingreso", concepto: "Venta al contado en mostrador", monto: 520.0, fecha: "2026-05-20", categoria: "Venta", origen: "otro" },
];

export function getCliente(id: string): Cliente | undefined {
  return clientes.find((c) => c.id === id);
}

export function facturasDeCliente(clienteId: string): Factura[] {
  return facturas.filter((f) => f.clienteId === clienteId);
}
