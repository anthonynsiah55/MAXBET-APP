import { redirect, notFound } from 'next/navigation';
import { accountsEnabled } from '../supabase/config';
import { createServerAuthClient } from '../supabase/server';

export function accountRecordsEnabled() {
  return accountsEnabled() && process.env.MAXBET_ACCOUNT_RECORDS_ENABLED === 'true';
}
export async function requireAccountReviewer() {
  if (!accountRecordsEnabled()) redirect('/login?area=staff');
  const client = await createServerAuthClient();
  const { data: identity, error } = await client.auth.getUser();
  if (error || !identity.user || identity.user.is_anonymous) redirect('/login?area=staff');
  const { data: permitted, error: permissionError } = await client.rpc('can_review_customer_accounts');
  if (permissionError || permitted !== true) notFound();
  return client;
}
