import type { SVGProps } from "react";

export default function SocialIcon({ label, className = "h-5 w-5" }: { label: string; className?: string }) {
  const key = label.toLowerCase();
  const props: SVGProps<SVGSVGElement> = { className, viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": true };

  if (key.includes("facebook")) {
    return (
      <svg {...props}>
        <path d="M13.5 8H15V5h-1.5C11.57 5 10 6.57 10 8.5V10H8v3h2v6h3v-6h2.1l.9-3H13v-1.5c0-.83.17-1.5 1.5-1.5z" />
      </svg>
    );
  }
  if (key.includes("instagram")) {
    return (
      <svg {...props}>
        <path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm0 2a3 3 0 00-3 3v10a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H7zm5 3.5A4.5 4.5 0 1112 18.5 4.5 4.5 0 017.5 12 4.5 4.5 0 0112 7.5zm0 2A2.5 2.5 0 1014.5 12 2.5 2.5 0 0012 9.5zm4.75-3.3a1.05 1.05 0 11-1.05 1.05 1.05 1.05 0 011.05-1.05z" />
      </svg>
    );
  }
  if (key.includes("youtube")) {
    return (
      <svg {...props}>
        <path d="M23.5 6.3a3.1 3.1 0 00-2.2-2.2C19.4 3.6 12 3.6 12 3.6s-7.4 0-9.3.5A3.1 3.1 0 00.5 6.3 32 32 0 000 12a32 32 0 00.5 5.7 3.1 3.1 0 002.2 2.2c1.9.5 9.3.5 9.3.5s7.4 0 9.3-.5a3.1 3.1 0 002.2-2.2A32 32 0 0024 12a32 32 0 00-.5-5.7zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
      </svg>
    );
  }
  if (key === "x" || key.includes("twitter")) {
    return (
      <svg {...props}>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.5 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    );
  }
  return (
    <svg {...props}>
      <path d="M12 2a10 10 0 10 0 20 10 10 0 000-20zm1 14h-2v-2h2v2zm0-4h-2V6h2v6z" />
    </svg>
  );
}
