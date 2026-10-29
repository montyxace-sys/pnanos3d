import type { Metadata } from "next";
import "./globals.css";
import { getSite } from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();
  return {
    title: {
      default: site.siteFullName,
      template: `%s · ${site.siteName}`,
    },
    description: site.description,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-paper text-ink antialiased">
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}