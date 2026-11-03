"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !pathname) return;
    if (pathname.startsWith("/admin")) return; // no track admin
    (async () => {
      try {
        await fetch(`${SUPABASE_URL}/rest/v1/analytics_events`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            path: pathname,
            referrer: typeof document !== "undefined" ? document.referrer : null,
          }),
        });
      } catch {
        // silently ignore tracking errors
      }
    })();
  }, [pathname]);

  return null;
}