'use server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { accountRecordsEnabled } from '../../lib/accounts/access';
import { createServerAuthClient } from '../../lib/supabase/server';
export async function submitApplication(form: FormData) {
  if (!accountRecordsEnabled()) redirect('/account');
  const client=await createServerAuthClient();
  const {data,error}=await client.auth.getUser();
  if(error || !data.user || data.user.is_anonymous) redirect('/login');
  const business=String(form.get('business') || '').trim();
  const contact=String(form.get('contact') || '').trim();
  if(business.length<2 || business.length>120 || contact.length<2 || contact.length>120) redirect('/account?message=application-failed');
  const {error:submitError}=await client.rpc('submit_customer_account',{p_business:business,p_contact:contact});
  if(submitError) redirect('/account?message=application-failed');
  revalidatePath('/account');
  redirect('/account');
}
