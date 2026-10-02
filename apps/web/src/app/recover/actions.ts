'use server';
import { redirect } from 'next/navigation';
import { normalizeEmail } from '../../lib/auth/validation';
import { recoveryEnabled } from '../../lib/auth/delivery';
import { createRecoveryClient } from '../../lib/supabase/recovery';
function value(form: FormData, key: string) { const v=form.get(key); return typeof v==='string' ? v : ''; }

export async function requestRecovery(form: FormData) {
  if (!recoveryEnabled()) redirect('/recover?message=unavailable');
  const email=normalizeEmail(value(form,'email'));
  if (!email) redirect('/recover?message=invalid');
  try { await createRecoveryClient().auth.resetPasswordForEmail(email); }
  catch { /* Same response for unknown addresses, throttling and provider failures. */ }
  redirect('/recover?message=requested');
}
export async function finishRecovery(form: FormData) {
  if (!recoveryEnabled()) redirect('/recover?message=unavailable');
  const email=normalizeEmail(value(form,'email'));
  const token=value(form,'code').trim();
  const password=value(form,'password');
  if (!email || !/^\d{6,10}$/.test(token) || password.length<12 || new TextEncoder().encode(password).length>72 ||
      password!==value(form,'confirm')) redirect('/recover?message=invalid');
  let updated=false;
  const client=createRecoveryClient();
  try {
    const {data,error}=await client.auth.verifyOtp({email,token,type:'recovery'});
    if (!error && data.user && data.session && data.user.email?.toLowerCase()===email && !data.user.is_anonymous) {
      const result=await client.auth.updateUser({password});
      updated=!result.error;
    }
  } catch { /* Never put an OTP, password or provider response into a URL or log. */ }
  finally { try { await client.auth.signOut({scope:'global'}); } catch { /* Tokens still expire normally if revocation fails. */ } }
  redirect(updated ? '/login?message=password-updated' : '/recover?message=failed');
}
