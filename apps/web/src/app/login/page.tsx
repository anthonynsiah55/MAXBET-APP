import type { Metadata } from 'next';
import { ActionLink, Field, Notice } from '../../components/ui';
import { accountsEnabled } from '../../lib/supabase/config';
import { signIn } from '../auth/actions';
export const metadata: Metadata = { title: 'Sign in' };
const messages: Record<string, string> = {
  'check-email': 'If your request can be processed, a confirmation email will arrive. Follow its link, then return to sign in.',
  failed: 'We could not sign you in. Check your details and try again.',
  invalid: 'Enter a valid email or Ghana phone number and your password.',
  unavailable: 'Sign-in is not available yet.',
  'verification-failed': 'That confirmation link could not be verified. It may have expired or been opened in a different browser.',
};
export default async function LoginPage({ searchParams }: { searchParams: Promise<{ message?: string }> }) {
  const enabled = accountsEnabled();
  const message = (await searchParams).message;
  const fields = <><Field id="identity" name="identity" label="Email or phone number" autoComplete="username" required maxLength={254} /><Field id="password" name="password" label="Password" type="password" autoComplete="current-password" required maxLength={256} /></>;
  return <main id="main-content" className="container"><div className="page-intro"><p className="eyebrow">MAXBET ACCOUNT</p><h1>Welcome to Maxbet.</h1><p>Sign in to manage your business account.</p></div><div className="page-body account-grid"><section>
    {message && Object.hasOwn(messages, message) && <Notice title="Account message">{messages[message]}</Notice>}
    {enabled ? <form action={signIn} className="registration-fields">{fields}<button type="submit" className="button">Sign in</button></form> : <><Notice title="Sign-in is not open yet">The secure account flow is being prepared. These preview fields are disabled and do not collect passwords.</Notice><fieldset className="registration-fields" disabled><legend>Sign-in preview</legend>{fields}</fieldset></>}
    <ActionLink href="/register" secondary>Request an account</ActionLink>
  </section><aside className="info-card"><h2>Access for your business.</h2><ul><li>Use your verified email or phone number.</li><li>Business approval is separate from signing in.</li><li>Wholesale services require an approved account.</li></ul></aside></div></main>;
}
