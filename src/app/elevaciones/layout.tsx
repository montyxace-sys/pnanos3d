import type { Metadata } from "next";

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://tusplanos3d.es").replace(/\/$/, "");

export const metadata: Metadata = {
  title: "Elevaciones y fachadas del plano",
  description:
    "Genera las elevaciones y fachadas de tu vivienda a partir del plano 2D: alzados de muros, huecos de puertas y ventanas, listos para revisar antes de la obra.",
  alternates: { canonical: `${SITE}/elevaciones/` },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Elevaciones y fachadas del plano | TusPlanos3D",
    description:
      "Vista de alzados y fachadas generada desde tu plano 2D, gratis y sin registro.",
    url: `${SITE}/elevaciones/`,
    type: "website",
  },
};

export default function ElevacionesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
