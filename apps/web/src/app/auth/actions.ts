'use server';
import { redirect } from 'next/navigation';
import { accountsEnabled } from '../../lib/supabase/config';
import { createServerAuthClient } from '../../lib/supabase/server';
import { loginIdentity, validateRegistration } from '../../lib/auth/validation';

function value(form: FormData, key: string) {
  const value = form.get(key);
  return typeof value === 'string' ? value : '';
}
export async function register(form: FormData) {
  if (!accountsEnabled()) redirect('/register?message=unavailable');
  const input = validateRegistration({ business: value(form, 'business'), contact: value(form, 'contact'), phone: value(form, 'phone'), email: value(form, 'email'), password: value(form, 'password') });
  if (!input) redirect('/register?message=invalid');
  const origin = process.env.MAXBET_SITE_URL;
  if (!origin) redirect('/register?message=unavailable');
  let failed = false;
  try {
    const supabase = await createServerAuthClient();
    const { error, data } = await supabase.auth.signUp({
      email: input.email, password: input.password,
      options: {
        emailRedirectTo: new URL('/auth/callback', origin).toString(),
        // These are unverified application details, never authorization claims.
        data: { business_name: input.business, contact_name: input.contact, requested_phone: input.phone },
      },
    });
    failed = !!error;
    // Email confirmation must stay enabled. Never grant a signup session wholesale access.
    if (data.session) await supabase.auth.signOut();
  } catch { failed = true; }
  redirect(failed ? '/register?message=failed' : '/login?message=check-email');
}
export async function signIn(form: FormData) {
  if (!accountsEnabled()) redirect('/login?message=unavailable');
  const identity = loginIdentity(value(form, 'identity'));
  const password = value(form, 'password');
  if (!identity || !password || password.length > 256) redirect('/login?message=invalid');
  let failed = false;
  try {
    const supabase = await createServerAuthClient();
    const { data, error } = await supabase.auth.signInWithPassword({ ...identity, password });
    failed = !!error || !data.user;
  } catch { failed = true; }
  if (failed) redirect('/login?message=failed');
  redirect('/account');
}
export async function signOut() {
  if (!accountsEnabled()) redirect('/login');
  try {
    const supabase = await createServerAuthClient();
    const { error } = await supabase.auth.signOut({ scope: 'local' });
    if (error) redirect('/account?message=signout-failed');
  } catch { redirect('/account?message=signout-failed'); }
  redirect('/login');
}
