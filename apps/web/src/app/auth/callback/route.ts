import { NextResponse, type NextRequest } from 'next/server';
import { accountsEnabled } from '../../../lib/supabase/config';
import { createServerAuthClient } from '../../../lib/supabase/server';
export async function GET(request: NextRequest) {
  let destination = '/login?message=verification-failed';
  const code = request.nextUrl.searchParams.get('code');
  if (accountsEnabled() && code) {
    try {
      const supabase = await createServerAuthClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) destination = '/account';
    } catch { /* Never return tokens or raw provider errors. */ }
  }
  // Fixed local destination: ignore any user-controlled redirect parameter.
  const response = NextResponse.redirect(new URL(destination, request.url));
  response.headers.set('Cache-Control', 'private, no-store');
  return response;
}
