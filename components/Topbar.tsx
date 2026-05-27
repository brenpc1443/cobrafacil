"use client";

import { useStore } from "@/lib/store";
import { fechaCorta } from "@/lib/calc";

export default function Topbar() {
  const { negocio } = useStore();
  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-4">
      <div className="text-sm text-slate-500">
        Hoy es <span className="font-medium text-slate-700">{fechaCorta(negocio.hoy)}</span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <span className="hidden text-slate-500 sm:inline">Yape del negocio:</span>
        <span className="rounded-full bg-violet-100 px-3 py-1 font-medium text-violet-700">
          {negocio.yapeNumero}
        </span>
      </div>
    </header>
  );
}
