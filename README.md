# CobraFácil — Demo Sprint 1

Plataforma de gestión de cobranza B2B para pymes peruanas. Esta demo es el entregable del **Sprint 1** (27/04/2026 – 24/05/2026): un MVP visual y navegable que muestra el flujo de cobranza de punta a punta con datos de ejemplo.

## Stack

- Next.js 15 (App Router) · React 19
- TypeScript
- Tailwind CSS v3
- Datos semilla en memoria (`lib/data.ts`) y cálculos centralizados (`lib/calc.ts`)

## Pantallas

| Ruta | Descripción |
|------|-------------|
| `/` | Tablero con KPIs (total por cobrar, vencido, por vencer, cobrado) y antigüedad de deuda por tramos |
| `/cuentas` | Listado de cuentas por cobrar con días de atraso, ordenado por mayor atraso |
| `/clientes/[id]` | Detalle del cliente con sus facturas, saldo pendiente y acciones de cobro |
| `/recordatorios` | Reglas de recordatorios automáticos y cola de próximos envíos |

## Acciones de cobro

- **WhatsApp**: enlace `wa.me` con el mensaje de recordatorio pre-cargado (funciona desde el celular).
- **Yape**: cobro simulado con QR ilustrativo y monto (en producción será un cobro real).

## Desarrollo

```bash
yarn install
yarn dev
```

## Alcance del Sprint 1 (cerrado)

- EN-01 · Scaffolding, navegación y datos semilla
- HU-01 · Tablero con KPIs y aging
- HU-02 · Listado de cuentas por cobrar
- HU-03 · Detalle de cliente
- HU-04 · Recordatorio por WhatsApp
- HU-05 · Cobro Yape (simulado)
- HU-06 · Recordatorios automáticos (reglas + cola)

Lo siguiente (persistencia, API, autenticación, envíos reales y despliegue) corresponde al Sprint 2 — ver `documentos/Product Backlog.docx`.
