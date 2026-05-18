import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { NEGOCIO } from "@/lib/data";
import { fechaCorta } from "@/lib/calc";

export const metadata: Metadata = {
  title: "CobraFácil — Cobranza para tu negocio",
  description: "Recupera la plata que se te escapa: deudas, recordatorios y cobros en un solo lugar.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex min-w-0 flex-1 flex-col">
            <header className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-4">
              <div className="text-sm text-slate-500">
                Hoy es <span className="font-medium text-slate-700">{fechaCorta(NEGOCIO.hoy)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="hidden text-slate-500 sm:inline">Yape del negocio:</span>
                <span className="rounded-full bg-violet-100 px-3 py-1 font-medium text-violet-700">
                  {NEGOCIO.yapeNumero}
                </span>
              </div>
            </header>
            <main className="flex-1 overflow-y-auto p-8">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
