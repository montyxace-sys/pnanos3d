import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import ChatWidget from "@/components/ChatWidget";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: { default: "TusPlanos3D", template: `%s · TusPlanos3D` },
    description: "Generador de planos gratuito para tu vivienda con dibujo técnico rápido.",
    manifest: "/manifest.json",
    themeColor: "#f6821f",
    appleWebApp: { capable: true, title: "TusPlanos3D", statusBarStyle: "default" },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-gray-900 text-white antialiased">
        {children}
        <footer className="fixed bottom-0 z-50 mb-2 flex w-full flex-wrap items-center justify-center gap-3 rounded-lg bg-gray-800/95 px-6 py-3 shadow-lg backdrop-blur">
          <Link href="/ayuda/" className="text-sm font-medium text-orange-400 underline hover:text-orange-300">Ayuda</Link>
          <Link href="/cookies/" className="text-sm font-medium text-orange-400 underline hover:text-orange-300">Cookies</Link>
          <Link href="/login" className="text-sm font-medium text-orange-400 underline hover:text-orange-300">Login</Link>
        </footer>
        <ChatWidget />
        <Script id="sw" strategy="afterInteractive">
          {`if ("serviceWorker" in navigator) { navigator.serviceWorker.register("/sw.js"); }`}
        </Script>
      </body>
    </html>
  );
}