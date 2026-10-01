import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { publicConfig } from './config';

// Create a fresh client per request; never share a user's cookies across requests.
export async function createServerAuthClient() {
  const config = publicConfig();
  if (!config) throw new Error('Maxbet authentication is not configured.');
  const jar = await cookies();
  return createServerClient(config.url, config.key, {
    cookieOptions: { sameSite: 'lax', secure: process.env.NODE_ENV === 'production' },
    cookies: {
      getAll: () => jar.getAll(),
      setAll: values => {
        // Server Components cannot write cookies; middleware performs refresh there.
        try { values.forEach(({ name, value, options }) => jar.set(name, value, options)); }
        catch { /* Read-only Server Component context. */ }
      },
    },
  });
}
