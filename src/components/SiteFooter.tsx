"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { mainNav } from "@/lib/nav";
import SocialIcon from "@/components/SocialIcon";
import type { SiteData } from "@/lib/data";

const DEFAULT_SITE: SiteData = {
  siteName: "TusPlanos3D",
  siteFullName: "TusPlanos3D",
  tagline: "Mira tu espacio en 3D antes de empezar.",
  description: "Generador de planos online gratuito.",
  phone: "",
  phoneHref: "",
  email: "info@tusplanos3d.es",
  address: [],
  social: [
    { label: "Facebook", href: "https://www.facebook.com/" },
    { label: "Instagram", href: "https://www.instagram.com/" },
    { label: "LinkedIn", href: "https://www.linkedin.com/" },
  ],
  channels: [],
};

export default function SiteFooter({ site = DEFAULT_SITE }: { site?: SiteData }) {
  const [footerLogo, setFooterLogo] = useState<string | null>(null);
  useEffect(() => {
    const base = window.location.pathname.startsWith("/pnanos3d") ? "/pnanos3d" : "";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFooterLogo(`${base}/img/logo.svg`.replace(/\/\//g, "/"));
  }, []);

  return (
    <footer className="border-t border-line bg-paper-2 text-ink">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-3">
        <div className="flex items-start gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {footerLogo && <Link href="/"><img src={footerLogo} alt={`${site.siteName} - inicio`} width={120} height={36} className="h-9 w-auto shrink-0 " /></Link>}
          <div>
            <p className="font-serif text-2xl">{site.siteName}</p>
            <p className="mt-2 text-sm text-ink-soft">{site.tagline}</p>
            {site.address.length > 0 && (
              <p className="mt-4 text-sm text-ink-soft">{site.address.join(" | ")}</p>
            )}
          </div>
        </div>

        <nav aria-label="Pie de pagina" className="text-sm">
          <ul className="flex flex-wrap gap-2">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex items-center rounded-full border border-line bg-paper px-3 py-1.5 text-xs font-semibold tracking-wide text-ink-soft uppercase transition hover:-translate-y-0.5 hover:border-accent-soft hover:text-accent-soft"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/electricidad/"
                className="inline-flex items-center rounded-full border border-line bg-paper px-3 py-1.5 text-xs font-semibold tracking-wide text-ink-soft uppercase transition hover:-translate-y-0.5 hover:border-accent-soft hover:text-accent-soft"
              >
                Electricidad
              </Link>
            </li>
            <li>
              <Link
                href="/ayuda/"
                className="inline-flex items-center rounded-full border border-line bg-paper px-3 py-1.5 text-xs font-semibold tracking-wide text-ink-soft uppercase transition hover:-translate-y-0.5 hover:border-accent-soft hover:text-accent-soft"
              >
                Ayuda
              </Link>
            </li>
            <li>
              <Link
                href="/aviso-legal/"
                className="inline-flex items-center rounded-full border border-line bg-paper px-3 py-1.5 text-xs font-semibold tracking-wide text-ink-soft uppercase transition hover:-translate-y-0.5 hover:border-accent-soft hover:text-accent-soft"
              >
                Aviso legal
              </Link>
            </li>
            <li>
              <Link
                href="/cookies/"
                className="inline-flex items-center rounded-full border border-line bg-paper px-3 py-1.5 text-xs font-semibold tracking-wide text-ink-soft uppercase transition hover:-translate-y-0.5 hover:border-accent-soft hover:text-accent-soft"
              >
                Cookies
              </Link>
            </li>
            <li>
              <Link
                href="/contacto/"
                className="inline-flex items-center rounded-full border border-line bg-paper px-3 py-1.5 text-xs font-semibold tracking-wide text-ink-soft uppercase transition hover:-translate-y-0.5 hover:border-accent-soft hover:text-accent-soft"
              >
                Contacto
              </Link>
            </li>
          </ul>
        </nav>

        <div className="text-sm">
          <p className="font-semibold tracking-wide uppercase">Contacto</p>
          <p className="mt-2 space-y-1 text-ink-soft">
            <a href={`tel:${site.phoneHref}`} className="block hover:text-accent-soft">
              {site.phone}
            </a>
            <a href={`mailto:${site.email}`} className="block hover:text-accent-soft">
              {site.email}
            </a>
          </p>
          <ul className="mt-4 flex flex-wrap gap-3">
            {site.social.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  className="group flex h-10 w-10 items-center justify-center rounded-full border border-line bg-paper text-ink-soft transition-all duration-200 hover:-translate-y-0.5 hover:border-accent-soft hover:text-accent-soft hover:shadow-lg"
                >
                  <SocialIcon label={item.label} className="h-5 w-5" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-line px-6 py-5 text-center text-sm font-medium text-ink">
        &copy; {new Date().getFullYear()} TusPlanos3D. Todos los derechos reservados. &mdash; Diseño por
        <a href="https://msoft.com.es" target="_blank" rel="noopener noreferrer" className="ml-1 font-semibold text-accent hover:underline">
          Msoft.com.es
        </a>
      </div>
    </footer>
  );
}