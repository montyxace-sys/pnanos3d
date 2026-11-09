import type { Metadata } from "next";

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://tusplanos3d.es").replace(/\/$/, "");

export const metadata: Metadata = {
  title: "Visor 3D de planos de vivienda",
  description:
    "Abre tu plano en 3D y recorre tu vivienda: muros extruidos, puertas, ventanas y mobiliario del catálogo. Visor gratuito, sin registro y sin instalar nada.",
  alternates: { canonical: `${SITE}/vista-3d/` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Visor 3D de planos de vivienda | TusPlanos3D",
    description:
      "Recorre tu vivienda en 3D antes de empezar la obra: muros, puertas, ventanas y muebles del catálogo.",
    url: `${SITE}/vista-3d/`,
    type: "website",
  },
};

export default function Vista3DLayout({ children }: { children: React.ReactNode }) {
  return children;
}
