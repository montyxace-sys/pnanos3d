"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { mainNav } from "@/lib/nav";
import type { SiteData } from "@/lib/data";

export default function SiteHeader({ site }: { site: SiteData }) {
  const [logoSrc, setLogoSrc] = useState<string | null>(null);
  useEffect(() => {
    const base = window.location.pathname.startsWith("/pnanos3d") ? "/pnanos3d" : "";
    /* eslint-disable-next-line react-hooks/set-state-in-effect */
    setLogoSrc(`${base}/img/logo.svg`.replace(/\/\//g, "/"));
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur">
      <div className="hidden bg-ink text-paper md:block">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-2 text-xs">
          <div className="flex items-center gap-6">
            <a href={`tel:${site.phoneHref}`} className="hover:text-accent-soft">
              {site.phone}
            </a>
            <a href={`mailto:${site.email}`} className="hover:text-accent-soft">
              {site.email}
            </a>
          </div>
          <span className="tracking-widest text-paper/70 uppercase">{site.tagline}</span>
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {logoSrc && <img src={logoSrc} alt={`${site.siteName} - inicio`} width={160} height={48} className="h-10 w-auto" />}
        </Link>

        <nav aria-label="Principal" className="-mr-2 flex items-center gap-1 overflow-x-auto">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 rounded px-3 py-2 text-[13px] font-medium tracking-wide text-ink-soft uppercase hover:bg-paper-2 hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
