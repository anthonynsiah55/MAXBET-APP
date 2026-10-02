import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { ActionLink, Field, Notice, Badge } from '../../components/ui';
import { accountsEnabled } from '../../lib/supabase/config';
import { createServerAuthClient } from '../../lib/supabase/server';
import { accountRecordsEnabled } from '../../lib/accounts/access';
import { signOut } from '../auth/actions';
import { submitApplication } from './application';
export const metadata: Metadata = { title: 'Your account', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';
export default async function AccountPage({searchParams}: {searchParams: Promise<{message?: string}>}) {
  if (!accountsEnabled()) redirect('/login');
  const supabase = await createServerAuthClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user || data.user.is_anonymous) redirect('/login');
  const user = data.user;
  const recordsEnabled=accountRecordsEnabled();
  const record=recordsEnabled ? await supabase.from('customer_accounts').select('business_name,contact_name,status').eq('user_id',user.id).maybeSingle() : null;
  const message=(await searchParams).message;
  return <main id="main-content" className="container"><div className="page-intro"><p className="eyebrow">YOUR MAXBET ACCOUNT</p><h1>Account setup.</h1><p>Your identity and business access are managed separately.</p></div><div className="page-body">
    {message && <Notice title="Account action incomplete">The action could not be completed. Your application may already exist, your contacts may need verification, or the service may be unavailable. Reload before trying again.</Notice>}
    {!recordsEnabled ? <Notice title="Wholesale access is not enabled">Phone verification and the business approval workflow are still being prepared. Signing in does not approve your business or unlock wholesale data.</Notice> :
    record?.error ? <Notice title="Account records unavailable">Your application could not be loaded. Please try again later.</Notice> :
    record?.data ? <section className="account-state-card"><Badge>{record.data.status}</Badge><h2>{record.data.business_name}</h2><p>{record.data.contact_name}</p><p>{record.data.status==='approved' ? 'Your business has been approved. Wholesale services will appear here as they become available.' : 'Wholesale access is not enabled. Maxbet manages the review of your account.'}</p></section> :
    !user.email_confirmed_at || !user.phone_confirmed_at ? <Notice title="Verify both contacts first">Your email and phone number must be verified before you submit your business application. Use phone verification below when SMS delivery is enabled.</Notice> :
    <section className="account-state-card"><h2>Submit your business for review.</h2><form action={submitApplication} className="registration-fields"><Field id="business" name="business" label="Pharmacy or business name" minLength={2} maxLength={120} required/><Field id="contact" name="contact" label="Contact person" minLength={2} maxLength={120} required/><button className="button" type="submit">Submit for review</button></form></section>}
    <dl className="item-facts"><div><dt>Email</dt><dd>{user.email || 'Not provided'}</dd></div><div><dt>Email verification</dt><dd>{user.email_confirmed_at ? 'Verified' : 'Not verified'}</dd></div><div><dt>Phone verification</dt><dd>{user.phone && user.phone_confirmed_at ? 'Verified' : 'Pending'}</dd></div></dl>
    <div className="actions">{!user.phone_confirmed_at && <ActionLink href="/account/verify-phone" secondary>Verify phone</ActionLink>}<ActionLink href="/products" secondary>Browse the catalogue</ActionLink><form action={signOut}><button type="submit" className="button">Sign out</button></form></div>
  </div></main>;
}
