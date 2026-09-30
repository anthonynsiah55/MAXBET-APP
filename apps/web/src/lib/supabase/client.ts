"use client";
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Supabase public environment variables are not configured.");
  if (new URL(url).hostname !== "ufcerqtdlvtflvkkorzs.supabase.co") throw new Error("Expected the connected Maxbet Supabase project.");
  return createBrowserClient(url, key);
}
