import type { Metadata } from 'next';
import { ActionLink, Notice } from '../../components/ui';
export const metadata: Metadata = { title: 'Account access' };
export default function RegisterPage() {
  return <main id="main-content" className="container"><div className="page-intro"><p className="eyebrow">FOR PHARMACY BUSINESSES</p><h1>Your business account.</h1><p>Access Maxbet wholesale services through an approved account for your pharmacy or business.</p></div><div className="page-body account-grid"><div><Notice title="Account requests are coming soon">Registration is being prepared. There is no application to submit yet, and this preview does not collect business or contact details.</Notice><div className="actions"><ActionLink href="/products" secondary>View catalogue information</ActionLink></div></div><aside className="info-card"><h2>What to expect.</h2><ul><li>One customer login for your pharmacy or business.</li><li>A review step before wholesale account access is enabled.</li><li>Approved access to wholesale prices, live availability and purchasing.</li></ul></aside></div></main>;
}
