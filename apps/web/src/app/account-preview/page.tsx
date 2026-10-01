import type { Metadata } from 'next';
import Link from 'next/link';
import { ActionLink, Badge, Notice } from '../../components/ui';

export const metadata: Metadata = { title: 'Account review preview', robots: { index: false, follow: false } };
const states = {
  verification: { label: 'Verify contacts', title: 'Confirm your contact details.', text: 'Your phone number and email address must be verified before your account is ready for review.', next: 'Follow the verification instructions sent to your registered contacts.', tone: 'warning' },
  pending: { label: 'Under review', title: 'Your business request is being reviewed.', text: 'Maxbet will review your business details and customer record before enabling wholesale access.', next: 'You can continue browsing the public catalogue while you wait.', tone: 'warning' },
  approved: { label: 'Approved', title: 'Your business account is approved.', text: 'An approved account will be eligible for wholesale services as those services become available.', next: 'Sign in with your registered phone number or email when account services open.', tone: 'success' },
  declined: { label: 'Not approved', title: 'Your request was not approved.', text: 'A real account decision will include guidance from Maxbet on any available next steps.', next: 'Review the reason provided by Maxbet before making another request.', tone: 'error' },
  suspended: { label: 'Access paused', title: 'Wholesale access is paused.', text: 'A paused account cannot access wholesale prices or purchasing until Maxbet restores access.', next: 'Follow the guidance supplied by Maxbet about resolving your account status.', tone: 'error' },
} as const;
type State = keyof typeof states;
export default async function AccountPreviewPage({ searchParams }: { searchParams: Promise<{ state?: string | string[] }> }) {
  const input = (await searchParams).state;
  const value = Array.isArray(input) ? input[0] : input;
  const selected: State = value && Object.hasOwn(states, value) ? value as State : 'pending';
  const state = states[selected];
  return <main id="main-content" className="container">
    <div className="page-intro"><p className="eyebrow">ACCOUNT EXPERIENCE PREVIEW</p><h1>A clear view of your account.</h1><p>Explore the messages customers will see during account review.</p></div>
    <div className="page-body">
      <Notice title="Illustrative account states">This is a design preview, not your account status. Selecting a state does not create an account, change permissions or approve access.</Notice>
      <nav aria-label="Preview account states" className="account-state-nav">{(Object.keys(states) as State[]).map(key => <Link key={key} href={`/account-preview?state=${key}`} aria-current={key === selected ? 'page' : undefined}>{states[key].label}</Link>)}</nav>
      <section className="account-state-card" aria-labelledby="state-heading"><Badge tone={state.tone}>{state.label}</Badge><h2 id="state-heading">{state.title}</h2><p>{state.text}</p><div className="account-next"><h3>What happens next</h3><p>{state.next}</p></div><div className="actions"><ActionLink href="/products">Browse the catalogue</ActionLink><ActionLink href="/register" secondary>Registration preview</ActionLink></div></section>
    </div>
  </main>;
}
