"use client";

// ---------------------------------------------------------------------------
// Store de la demo: mantiene clientes, facturas, movimientos de caja y la
// configuración del negocio en estado de React, persistido en localStorage.
// Es la capa "sin backend" para que se pueda crear y guardar datos hoy mismo.
// ---------------------------------------------------------------------------

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  clientes as seedClientes,
  facturas as seedFacturas,
  movimientos as seedMovimientos,
  NEGOCIO as seedNegocio,
  type Cliente,
  type Factura,
  type Movimiento,
  type Negocio,
} from "./data";

const STORAGE_KEY = "cobrafacil-demo-v1";

interface Datos {
  clientes: Cliente[];
  facturas: Factura[];
  movimientos: Movimiento[];
  negocio: Negocio;
}

function semilla(): Datos {
  return {
    clientes: structuredClone(seedClientes),
    facturas: structuredClone(seedFacturas),
    movimientos: structuredClone(seedMovimientos),
    negocio: structuredClone(seedNegocio),
  };
}

function uid(prefix: string): string {
  return prefix + "_" + Math.random().toString(36).slice(2, 9);
}

interface StoreCtx extends Datos {
  hidratado: boolean;
  // clientes
  addCliente: (c: Omit<Cliente, "id">) => string;
  updateCliente: (id: string, c: Partial<Cliente>) => void;
  deleteCliente: (id: string) => void;
  // facturas
  addFactura: (f: Omit<Factura, "id" | "estado">) => void;
  registrarPago: (facturaId: string, fechaPago: string) => void;
  deleteFactura: (id: string) => void;
  // caja
  addMovimiento: (m: Omit<Movimiento, "id">) => void;
  deleteMovimiento: (id: string) => void;
  // negocio
  updateNegocio: (n: Partial<Negocio>) => void;
  // demo
  reiniciar: () => void;
}

const Ctx = createContext<StoreCtx | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [datos, setDatos] = useState<Datos>(() => semilla());
  const [hidratado, setHidratado] = useState(false);

  // Carga desde localStorage al montar (evita desajuste de hidratación
  // porque el primer render usa la semilla igual que en el servidor).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setDatos(JSON.parse(raw));
    } catch {
      /* noop */
    }
    setHidratado(true);
  }, []);

  // Persiste en cada cambio (solo después de hidratar).
  useEffect(() => {
    if (!hidratado) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(datos));
    } catch {
      /* noop */
    }
  }, [datos, hidratado]);

  const addCliente = useCallback((c: Omit<Cliente, "id">) => {
    const id = uid("c");
    setDatos((d) => ({ ...d, clientes: [...d.clientes, { ...c, id }] }));
    return id;
  }, []);

  const updateCliente = useCallback((id: string, c: Partial<Cliente>) => {
    setDatos((d) => ({ ...d, clientes: d.clientes.map((x) => (x.id === id ? { ...x, ...c } : x)) }));
  }, []);

  const deleteCliente = useCallback((id: string) => {
    setDatos((d) => ({
      ...d,
      clientes: d.clientes.filter((x) => x.id !== id),
      facturas: d.facturas.filter((f) => f.clienteId !== id),
    }));
  }, []);

  const addFactura = useCallback((f: Omit<Factura, "id" | "estado">) => {
    setDatos((d) => ({
      ...d,
      facturas: [...d.facturas, { ...f, id: uid("F"), estado: "pendiente" }],
    }));
  }, []);

  const registrarPago = useCallback((facturaId: string, fechaPago: string) => {
    setDatos((d) => {
      const f = d.facturas.find((x) => x.id === facturaId);
      const facturas = d.facturas.map((x) =>
        x.id === facturaId ? { ...x, estado: "pagada" as const, fechaPago } : x,
      );
      // Un cobro alimenta la caja como ingreso (origen Yape del negocio).
      const movimientos = f
        ? [
            ...d.movimientos,
            {
              id: uid("m"),
              tipo: "ingreso" as const,
              concepto: `Cobro factura ${f.id}`,
              monto: f.monto,
              fecha: fechaPago,
              categoria: "Cobranza",
              facturaId: f.id,
              origen: "yape-negocio" as const,
            },
          ]
        : d.movimientos;
      return { ...d, facturas, movimientos };
    });
  }, []);

  const deleteFactura = useCallback((id: string) => {
    setDatos((d) => ({ ...d, facturas: d.facturas.filter((x) => x.id !== id) }));
  }, []);

  const addMovimiento = useCallback((m: Omit<Movimiento, "id">) => {
    setDatos((d) => ({ ...d, movimientos: [...d.movimientos, { ...m, id: uid("m") }] }));
  }, []);

  const deleteMovimiento = useCallback((id: string) => {
    setDatos((d) => ({ ...d, movimientos: d.movimientos.filter((x) => x.id !== id) }));
  }, []);

  const updateNegocio = useCallback((n: Partial<Negocio>) => {
    setDatos((d) => ({ ...d, negocio: { ...d.negocio, ...n } }));
  }, []);

  const reiniciar = useCallback(() => {
    setDatos(semilla());
  }, []);

  const value = useMemo<StoreCtx>(
    () => ({
      ...datos,
      hidratado,
      addCliente,
      updateCliente,
      deleteCliente,
      addFactura,
      registrarPago,
      deleteFactura,
      addMovimiento,
      deleteMovimiento,
      updateNegocio,
      reiniciar,
    }),
    [datos, hidratado, addCliente, updateCliente, deleteCliente, addFactura, registrarPago, deleteFactura, addMovimiento, deleteMovimiento, updateNegocio, reiniciar],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore(): StoreCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore debe usarse dentro de <StoreProvider>");
  return ctx;
}
