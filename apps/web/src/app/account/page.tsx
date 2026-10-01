import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { ActionLink, Notice } from '../../components/ui';
import { accountsEnabled } from '../../lib/supabase/config';
import { createServerAuthClient } from '../../lib/supabase/server';
import { signOut } from '../auth/actions';
export const metadata: Metadata = { title: 'Your account', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';
export default async function AccountPage() {
  if (!accountsEnabled()) redirect('/login');
  const supabase = await createServerAuthClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user || data.user.is_anonymous) redirect('/login');
  const user = data.user;
  return <main id="main-content" className="container"><div className="page-intro"><p className="eyebrow">YOUR MAXBET ACCOUNT</p><h1>Account setup.</h1><p>Your identity and business access are managed separately.</p></div><div className="page-body">
    <Notice title="Wholesale access is not enabled">Phone verification and the business approval workflow are still being prepared. Signing in does not approve your business or unlock wholesale data.</Notice>
    <dl className="item-facts"><div><dt>Email</dt><dd>{user.email || 'Not provided'}</dd></div><div><dt>Email verification</dt><dd>{user.email_confirmed_at ? 'Verified' : 'Not verified'}</dd></div><div><dt>Phone verification</dt><dd>{user.phone && user.phone_confirmed_at ? 'Verified' : 'Pending'}</dd></div></dl>
    <div className="actions"><ActionLink href="/products" secondary>Browse the catalogue</ActionLink><form action={signOut}><button type="submit" className="button">Sign out</button></form></div>
  </div></main>;
}
