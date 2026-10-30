import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
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
        <footer className="fixed bottom-0 z-50 mb-2 flex w-full justify-center gap-4 text-xs text-gray-400">
          <Link href="/ayuda/" className="hover:text-orange-400 underline">Ayuda</Link>
          <Link href="/cookies/" className="hover:text-orange-400 underline">Cookies</Link>
          <Link href="/login" className="hover:text-orange-400 underline">Login</Link>
        </footer>
        <Script id="sw" strategy="afterInteractive">
          {`if ("serviceWorker" in navigator) { navigator.serviceWorker.register("/sw.js"); }`}
        </Script>
      </body>
    </html>
  );
}
