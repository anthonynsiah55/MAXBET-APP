import type { Metadata } from 'next';
import { ActionLink, Field, Notice } from '../../components/ui';

export const metadata: Metadata = { title: 'Request a business account' };
export default function RegisterPage() {
  return <main id="main-content" className="container">
    <div className="page-intro"><p className="eyebrow">FOR PHARMACY BUSINESSES</p><h1>Your business account.</h1><p>One account for your pharmacy or business, with a review before wholesale access is enabled.</p></div>
    <div className="page-body account-grid">
      <section className="registration-panel" aria-labelledby="registration-heading">
        <Notice title="Registration preview">Account requests are not open yet. These fields show what you will need; they are disabled and no details are collected.</Notice>
        <h2 id="registration-heading">Business and contact details.</h2>
        <p className="registration-intro">Both a phone number and email address are required. No pharmacy licence or business registration documents are requested here.</p>
        <fieldset disabled className="registration-fields">
          <legend>Required account information</legend>
          <Field id="business-name" label="Pharmacy or business name" placeholder="Your business name" required autoComplete="off" />
          <Field id="contact-name" label="Contact person" placeholder="Full name" required autoComplete="off" />
          <Field id="phone" label="Phone number" placeholder="e.g. 024 000 0000" type="tel" required hint="Use a number your business can access." autoComplete="off" />
          <Field id="email" label="Email address" placeholder="you@example.com" type="email" required hint="Use an inbox you can access for account messages and recovery." autoComplete="off" />
        </fieldset>
        <p className="registration-note">Password setup and contact verification will be available when secure registration opens.</p>
        <div className="actions"><ActionLink href="/account-preview" secondary>Preview account review</ActionLink></div>
      </section>
      <aside className="info-card"><h2>Your path to access.</h2><ol className="account-steps"><li><strong>Provide your details</strong><p>Use one customer login for your pharmacy or business.</p></li><li><strong>Verify your contact details</strong><p>Confirm ownership before account access is enabled.</p></li><li><strong>Maxbet reviews your request</strong><p>Staff review your business and its customer record.</p></li><li><strong>Receive wholesale access</strong><p>Approval unlocks services as they become available.</p></li></ol><ActionLink href="/login" secondary>Sign-in information</ActionLink></aside>
    </div>
  </main>;
}
