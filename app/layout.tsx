import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { StoreProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: "CobraFácil — Cobranza para tu negocio",
  description: "Recupera la plata que se te escapa: deudas, recordatorios y cobros en un solo lugar.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <StoreProvider>
          <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex min-w-0 flex-1 flex-col">
              <Topbar />
              <main className="flex-1 overflow-y-auto p-8">{children}</main>
            </div>
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
