export function publicConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  try {
    if (new URL(url).origin !== 'https://ufcerqtdlvtflvkkorzs.supabase.co' || new URL(url).pathname !== '/') return null;
  } catch { return null; }
  return { url, key };
}
export function accountsEnabled() {
  return process.env.MAXBET_ACCOUNTS_ENABLED === 'true' && publicConfig() !== null;
}
