export function getSupabaseUrlError(value: string | undefined) {
  if (!value) return "NEXT_PUBLIC_SUPABASE_URL is missing.";

  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    return "NEXT_PUBLIC_SUPABASE_URL must be a valid URL.";
  }

  const isLocal = parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1";
  if (parsed.protocol !== "https:" && !(isLocal && parsed.protocol === "http:")) {
    return "Use an https:// Supabase project URL.";
  }

  if (
    parsed.hostname === "supabase.com" ||
    parsed.hostname.endsWith(".supabase.com")
  ) {
    return "This is a Supabase dashboard URL. Use the Project URL from Project Settings → API instead (usually https://<project-ref>.supabase.co).";
  }

  if (parsed.pathname !== "/" || parsed.search || parsed.hash) {
    return "Use only the Supabase Project URL, such as https://<project-ref>.supabase.co. Remove paths like /rest/v1/ or /auth/v1/ and remove any query string.";
  }

  return null;
}

export function readableSupabaseError(message: string) {
  if (/<\s*(?:!doctype|html)\b/i.test(message)) {
    return "Supabase returned a webpage instead of API data. Check that NEXT_PUBLIC_SUPABASE_URL is your project's API URL, not a dashboard link.";
  }
  return message;
}
