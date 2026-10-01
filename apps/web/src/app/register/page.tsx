import type { Metadata } from 'next';
import { ActionLink, Field, Notice } from '../../components/ui';
import { accountsEnabled } from '../../lib/supabase/config';
import { register } from '../auth/actions';

export const metadata: Metadata = { title: 'Request a business account' };
export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ message?: string }> }) {
  const enabled = accountsEnabled();
  const message = (await searchParams).message;
  const fields = <fieldset disabled={!enabled} className="registration-fields"><legend>Required account information</legend>
    <Field id="business-name" name="business" label="Pharmacy or business name" required minLength={2} maxLength={120} autoComplete="organization" />
    <Field id="contact-name" name="contact" label="Contact person" required minLength={2} maxLength={120} autoComplete="name" />
    <Field id="phone" name="phone" label="Phone number" type="tel" required maxLength={24} autoComplete="tel" hint="A Ghana phone number, such as 024 000 0000." />
    <Field id="email" name="email" label="Email address" type="email" required maxLength={254} autoComplete="email" />
    {enabled && <Field id="new-password" name="password" label="Create a password" type="password" autoComplete="new-password" required minLength={12} maxLength={72} hint="At least 12 characters, up to 72 bytes. Use a unique password." />}
  </fieldset>;
  return <main id="main-content" className="container">
    <div className="page-intro"><p className="eyebrow">FOR PHARMACY BUSINESSES</p><h1>Your business account.</h1><p>One account for your pharmacy or business, with a review before wholesale access is enabled.</p></div>
    <div className="page-body account-grid">
      <section className="registration-panel" aria-labelledby="registration-heading">
        <Notice title={enabled ? "Start your account" : "Registration preview"}>{enabled ? "Confirm your email first. Business approval is a separate step and wholesale access stays closed until approval." : "Account requests are not open yet. These fields show what you will need; they are disabled and no details are collected."}</Notice>{message && <Notice title="Check your request">{message === "invalid" ? "Complete all fields with a valid Ghana phone number, email and a password of 12 characters or more (maximum 72 bytes)." : "Account registration could not be completed. Please try again later."}</Notice>}
        <h2 id="registration-heading">Business and contact details.</h2>
        <p className="registration-intro">Both a phone number and email address are required. No pharmacy licence or business registration documents are requested here.</p>
        {enabled ? <form action={register}>{fields}<button type="submit" className="button">Create account</button></form> : fields}
        <p className="registration-note">Password setup and contact verification will be available when secure registration opens.</p>
        <div className="actions"><ActionLink href="/account-preview" secondary>Preview account review</ActionLink></div>
      </section>
      <aside className="info-card"><h2>Your path to access.</h2><ol className="account-steps"><li><strong>Provide your details</strong><p>Use one customer login for your pharmacy or business.</p></li><li><strong>Verify your contact details</strong><p>Confirm ownership before account access is enabled.</p></li><li><strong>Maxbet reviews your request</strong><p>Staff review your business and its customer record.</p></li><li><strong>Receive wholesale access</strong><p>Approval unlocks services as they become available.</p></li></ol><ActionLink href="/login" secondary>Sign-in information</ActionLink></aside>
    </div>
  </main>;
}
