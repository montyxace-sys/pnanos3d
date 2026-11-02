import type { SupabaseClient } from "@supabase/supabase-js";

export type ChatMessageRow = {
  id: string;
  thread_id: string;
  sender_id: string;
  ciphertext: string;
  iv: string;
  created_at: string;
};

function b64Encode(bytes: Uint8Array): string {
  let s = "";
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s);
}

function b64Decode(s: string): Uint8Array {
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function deriveKey(passphrase: string, salt: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const material = await crypto.subtle.importKey("raw", enc.encode(passphrase), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: enc.encode(salt), iterations: 100000, hash: "SHA-256" },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function encryptText(passphrase: string, salt: string, text: string) {
  const key = await deriveKey(passphrase, salt);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(text));
  return { ciphertext: b64Encode(new Uint8Array(ct)), iv: b64Encode(iv) };
}

export async function decryptText(passphrase: string, salt: string, ciphertext: string, iv: string) {
  try {
    const key = await deriveKey(passphrase, salt);
    const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv: b64Decode(iv) as unknown as BufferSource }, key, b64Decode(ciphertext) as unknown as BufferSource);
    return new TextDecoder().decode(pt);
  } catch {
    return "[mensaje cifrado / clave incorrecta]";
  }
}

export async function ensureThread(sb: SupabaseClient, userId: string) {
  const { data } = await sb
    .from("chat_threads")
    .select("id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (data?.id) return data.id as string;
  const { data: created } = await sb
    .from("chat_threads")
    .insert({ user_id: userId })
    .select("id")
    .single();
  return created?.id as string;
}

export async function sendEncryptedMessage(sb: SupabaseClient, threadId: string, senderId: string, passphrase: string, text: string) {
  const { ciphertext, iv } = await encryptText(passphrase, threadId, text);
  await sb.from("chat_messages").insert({ thread_id: threadId, sender_id: senderId, ciphertext, iv });
}

export async function listThreads(sb: SupabaseClient) {
  return sb.from("chat_threads").select("id,user_id,created_at,updated_at").order("updated_at", { ascending: false });
}

export async function loadMessages(sb: SupabaseClient, threadId: string) {
  return sb.from("chat_messages").select("id,sender_id,ciphertext,iv,created_at").eq("thread_id", threadId).order("created_at", { ascending: true });
}

export function subscribeThread(sb: SupabaseClient, threadId: string, cb: (row: ChatMessageRow) => void) {
  return sb
    .channel(`chat:${threadId}`)
    .on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_messages", filter: `thread_id=eq.${threadId}` }, (payload) => {
      cb(payload.new as ChatMessageRow);
    })
    .subscribe();
}
