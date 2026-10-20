"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseUrlError } from "@/lib/supabase-config";

let supabase: SupabaseClient | null | undefined;

export function getSupabaseBrowserClient() {
  if (supabase !== undefined) return supabase;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey || getSupabaseUrlError(url)) {
    supabase = null;
    return supabase;
  }

  supabase = createClient(url, anonKey);
  return supabase;
}

export const hasSupabaseConfig = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    !getSupabaseUrlError(process.env.NEXT_PUBLIC_SUPABASE_URL),
);
