import { createBrowserClient, createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabaseConfigured = Boolean(url && anonKey);

/**
 * Cliente Supabase para el navegador, con persistencia de sesión de Auth.
 * Devuelve `null` cuando faltan credenciales, manteniendo la app buildable.
 */
export function getBrowserSupabase(): SupabaseClient | null {
  if (!url || !anonKey) return null;
  const finalUrl: string = url as string;
  const finalKey: string = anonKey as string;
  return createBrowserClient(finalUrl, finalKey, {
    auth: { persistSession: true, detectSessionInUrl: true, flowType: "implicit" },
  });
}

/**
 * Alias backward-compatible para el generador de planos / contacto original.
 * Usa el cliente de navegador por defecto.
 */
export const getSupabase = getBrowserSupabase;

/**
 * Cliente Supabase para el servidor (middleware/route handler).  Env-gated.
 * Devuelve `null` sin credenciales.
 */
export function getServerSupabase(cookieStore: object): SupabaseClient | null {
  if (!supabaseConfigured || !cookieStore) return null;
  const finalUrl: string = url as string;
  const finalKey: string = anonKey as string;
  // We treat cookieStore as an object accessible by .get(name)
  const store = cookieStore as { get?: (name: string) => { value?: string } | undefined };
  return createServerClient(finalUrl, finalKey, {
    cookies: { get: (name: string) => store.get?.(name)?.value },
  });
}