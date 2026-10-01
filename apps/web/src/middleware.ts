import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { accountsEnabled, publicConfig } from './lib/supabase/config';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });
  const config = publicConfig();
  if (accountsEnabled() && config) {
    const supabase = createServerClient(config.url, config.key, {
      cookieOptions: { sameSite: 'lax', secure: process.env.NODE_ENV === 'production' },
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: values => {
          values.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          values.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    });
    try { await supabase.auth.getUser(); } catch { /* Protected pages independently deny access. */ }
  }
  response.headers.set('Cache-Control', 'private, no-store');
  return response;
}
export const config = { matcher: ['/account/:path*', '/auth/:path*', '/login', '/register'] };
