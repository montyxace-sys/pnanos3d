"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = window.localStorage.getItem("tusplanos3d_session");
  if (!id) {
    id = typeof crypto !== "undefined" && "randomUUID" in crypto ? (crypto as { randomUUID: () => string }).randomUUID() : Math.random().toString(36).slice(2);
    window.localStorage.setItem("tusplanos3d_session", id);
  }
  return id;
}

function getDeviceType(): "desktop" | "mobile" | "tablet" {
  if (typeof navigator === "undefined") return "desktop";
  const ua = navigator.userAgent.toLowerCase();
  if (/ipad|tablet|android(?!.*mobile)/.test(ua)) return "tablet";
  if (/mobile|iphone|android.*mobile/.test(ua)) return "mobile";
  return "desktop";
}

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !pathname) return;
    if (pathname.startsWith("/admin")) return;
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
            session_id: getSessionId(),
            device_type: getDeviceType(),
          }),
        });
      } catch {
        // ignore
      }
    })();
  }, [pathname]);

  return null;
}