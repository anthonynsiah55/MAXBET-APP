'use server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { normalizePhone } from '../../../lib/auth/validation';
import { phoneVerificationEnabled } from '../../../lib/auth/delivery';
import { createServerAuthClient } from '../../../lib/supabase/server';
async function identity() {
 if (!phoneVerificationEnabled()) redirect('/account/verify-phone?message=unavailable');
 const client=await createServerAuthClient();
 const {data,error}=await client.auth.getUser();
 if(error || !data.user || data.user.is_anonymous) redirect('/login');
 if(!data.user.email_confirmed_at) redirect('/account/verify-phone?message=email-first');
 if(data.user.phone && data.user.phone_confirmed_at) redirect('/account');
 return {client,user:data.user};
}
export async function sendPhoneCode(form:FormData) {
 const {client}=await identity();
 const phone=normalizePhone(String(form.get('phone') || ''));
 if(!phone) redirect('/account/verify-phone?message=invalid');
 let failed=false;
 try { const {error}=await client.auth.updateUser({phone}); failed=!!error; } catch { failed=true; }
 redirect('/account/verify-phone?message='+(failed?'failed':'sent'));
}
export async function confirmPhoneCode(form:FormData) {
 const {client,user}=await identity();
 // Bind verification to the Auth user's pending phone, not a hidden form value.
 const phone=normalizePhone(user.new_phone || '');
 const token=String(form.get('code') || '').trim();
 if(!phone || !/^\d{6,10}$/.test(token)) redirect('/account/verify-phone?message=invalid');
 let failed=false;
 try {
   const {data,error}=await client.auth.verifyOtp({phone,token,type:'phone_change'});
   failed=!!error || data.user?.id!==user.id || !data.user?.phone_confirmed_at || normalizePhone(data.user?.phone || '')!==phone;
 } catch { failed=true; }
 if(failed) redirect('/account/verify-phone?message=failed');
 revalidatePath('/account');
 redirect('/account');
}
