"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NEGOCIO } from "@/lib/data";

const items = [
  { href: "/", label: "Resumen", icon: "📊" },
  { href: "/cuentas", label: "Cuentas por cobrar", icon: "📄" },
  { href: "/recordatorios", label: "Recordatorios automáticos", icon: "🔔" },
];

export default function Sidebar() {
  const path = usePathname();
  const activo = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-5 py-5">
        <div className="text-lg font-bold text-brand-600">CobraFácil</div>
        <div className="mt-1 text-xs text-slate-500">Cobranza para tu negocio</div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {items.map((it) => (
          <Link
            key={it.href}
            href={it.href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
              activo(it.href)
                ? "bg-brand-50 text-brand-700"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <span className="text-base">{it.icon}</span>
            {it.label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-slate-100 px-5 py-4 text-xs text-slate-500">
        <div className="font-semibold text-slate-700">{NEGOCIO.razonSocial}</div>
        <div>RUC {NEGOCIO.ruc}</div>
      </div>
    </aside>
  );
}
