import Link from "next/link";
import { mainNav } from "@/lib/nav";
import SocialIcon from "@/components/SocialIcon";
import type { SiteData } from "@/lib/data";

export default function SiteFooter({ site }: { site: SiteData }) {
  return (
    <footer className="border-t border-line bg-ink text-paper">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 md:grid-cols-3">
        <div>
          <p className="font-serif text-xl">{site.siteName}</p>
          <p className="mt-2 text-sm text-paper/70">{site.tagline}</p>
          <p className="mt-4 text-sm text-paper/70">{site.address.join(" · ")}</p>
        </div>

        <nav aria-label="Pie de página" className="text-sm">
          <ul className="space-y-2">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-paper/80 hover:text-accent-soft">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/privacidad/" className="text-paper/80 hover:text-accent-soft">
                Privacidad
              </Link>
            </li>
          </ul>
        </nav>

        <div className="text-sm">
          <p className="font-semibold tracking-wide uppercase">Contacto</p>
          <p className="mt-2 space-y-1 text-paper/70">
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
                  className="group flex h-10 w-10 items-center justify-center rounded-full border border-paper/20 bg-paper/5 text-paper/80 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent-soft hover:text-accent-soft hover:shadow-lg"
                >
                  <SocialIcon label={item.label} className="h-5 w-5" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-paper/15 px-6 py-4 text-center text-xs text-paper/60">
        © {new Date().getFullYear()} {site.siteName}. Todos los derechos reservados.
      </div>
    </footer>
  );
}
