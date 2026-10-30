import type { Metadata, Viewport } from "next";
import Link from "next/link";
import Script from "next/script";
import ChatWidget from "@/components/ChatWidget";
import CookieBanner from "@/components/CookieBanner";
import "./globals.css";

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://montyxace-sys.github.io/pnanos3d").replace(/\/$/, "");

export async function generateMetadata(): Promise<Metadata> {
  const title = "TusPlanos3D - Generador de planos 3D";
  const description = "Dibuja planos tecnicos rapidos de tu vivienda y calcula la contratacion minima de electricidad.";
  return {
    metadataBase: new URL(SITE),
    title: { default: title, template: "%s | TusPlanos3D" },
    description,
    manifest: "/manifest.json",
    appleWebApp: { capable: true, title: "TusPlanos3D", statusBarStyle: "default" },
    openGraph: {
      title,
      description,
      url: SITE,
      siteName: "TusPlanos3D",
      type: "website",
      locale: "es_ES",
      images: ["/img/logo.svg"],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/img/logo.svg"] },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = { themeColor: "#f6821f" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-gray-900 text-white antialiased">
        {children}
        <footer className="fixed bottom-0 z-50 mb-2 flex w-full justify-center gap-4 text-xs text-gray-400">
          <Link href="/ayuda/" className="hover:text-orange-400 underline">Ayuda</Link>
          <Link href="/cookies/" className="hover:text-orange-400 underline">Cookies</Link>
        </footer>
        <ChatWidget />
        <CookieBanner />
        <Script id="sw" strategy="afterInteractive">
          {`if ("serviceWorker" in navigator) { navigator.serviceWorker.register("/sw.js"); }`}
        </Script>
      </body>
    </html>
  );
}
