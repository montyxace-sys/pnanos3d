import type { SiteData } from "@/lib/data";

/**
 * Barra lateral de accesos rápidos (redes y canales), equivalente al
 * widget lateral del sitio de referencia. En móvil no se muestra para
 * no estorbar con los elementos flotantes.
 */
export default function SideRail({ site }: { site: SiteData }) {
  return (
    <aside
      aria-label="Redes y canales"
      className="fixed top-1/2 right-0 z-30 hidden -translate-y-1/2 flex-col gap-2 border-y border-l border-line bg-paper-2 px-2 py-4 xl:flex"
    >
      {site.social.map((item) => (
        <a
          key={item.label}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          title={item.label}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-paper text-[11px] font-semibold text-ink-soft uppercase transition hover:border-accent-bright hover:text-accent"
        >
          {item.label.slice(0, 2)}
        </a>
      ))}
      <span aria-hidden className="mx-auto my-1 h-px w-6 bg-line" />
      {site.channels.map((item) => (
        <a
          key={item.label}
          href={item.href}
          title={item.note ? `${item.label} — ${item.note}` : item.label}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-paper text-[11px] font-semibold text-ink-soft uppercase transition hover:border-accent-bright hover:text-accent"
        >
          {item.label.slice(0, 2)}
        </a>
      ))}
    </aside>
  );
}
