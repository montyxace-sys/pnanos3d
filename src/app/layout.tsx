import type { Metadata } from "next";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SideRail from "@/components/SideRail";
import JsonLd from "@/components/JsonLd";
import { getSite } from "@/lib/data";
import { siteUrl } from "@/app/sitemap";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: site.siteFullName,
      template: `%s · ${site.siteName}`,
    },
    description: site.description,
    openGraph: {
      type: "website",
      locale: "es_ES",
      siteName: site.siteName,
      title: site.siteFullName,
      description: site.description,
      url: `${siteUrl}/`,
    },
    twitter: {
      card: "summary_large_image",
      title: site.siteFullName,
      description: site.description,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const site = await getSite();

  return (
    <html lang="es">
      <body className="flex min-h-screen flex-col">
        <JsonLd site={site} />
        <SiteHeader site={site} />
        <SideRail site={site} />
        <main className="flex-1">{children}</main>
        <SiteFooter site={site} />
      </body>
    </html>
  );
}
