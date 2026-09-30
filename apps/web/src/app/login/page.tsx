import type { Metadata } from 'next';
import { ActionLink, Notice } from '../../components/ui';
export const metadata: Metadata = { title: 'Sign in' };
export default function LoginPage() {
  return <main id="main-content" className="container"><div className="page-intro"><p className="eyebrow">MAXBET ACCOUNT</p><h1>Welcome to Maxbet.</h1><p>Your account will bring your wholesale pharmacy services together in one place.</p></div><div className="page-body account-grid"><div><Notice title="Sign-in is not open yet">Customer and staff access will become available when account services launch. This preview does not collect passwords or sign you in.</Notice><div className="actions"><ActionLink href="/" secondary>Back to Maxbet</ActionLink></div></div><aside className="info-card"><h2>Access designed for you.</h2><ul><li>Customers will sign in with a registered phone number or email.</li><li>Wholesale prices and purchasing will be available after account approval.</li><li>Staff will use individual accounts with permissions appropriate to their role.</li></ul></aside></div></main>;
}
