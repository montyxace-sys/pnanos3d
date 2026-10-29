import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Cliente Supabase para el navegador.
 * Devuelve `null` cuando no hay credenciales configuradas, para que el
 * sitio siga construyéndose y funcionando en local sin backend.
 */
export function getSupabase(): SupabaseClient | null {
  if (!url || !anonKey) return null;
  return createClient(url, anonKey, { auth: { persistSession: false } });
}

export const supabaseConfigured = Boolean(url && anonKey);
