import type { Metadata } from 'next';
import Link from 'next/link';
import { ActionLink, Notice } from '../../components/ui';
export const metadata: Metadata = { title: 'Customer help' };
const questions = [
  { question: 'Can I browse without an account?', answer: 'Yes. The public catalogue experience is open to everyone. The current items are clearly labelled samples, not live Maxbet product listings.' },
  { question: 'Why can I not see prices or stock?', answer: 'Wholesale prices, live availability and purchasing are reserved for approved business accounts. These services are not available in this preview.' },
  { question: 'How do I request an account?', answer: 'Account registration and approval will be introduced in the next phase. The account information page explains the planned access. There is no form to submit yet.' },
  { question: 'Can I order from the sample catalogue?', answer: 'No. Sample items demonstrate browsing and item details only. No order can be placed and no payment is collected.' },
  { question: 'Will I use my phone number or email to sign in?', answer: 'Customer sign-in is planned to accept the registered phone number or email. Each pharmacy or business will have one customer login in the first version.' },
  { question: 'Are the sample images actual product photographs?', answer: 'No. The packaging illustrations are neutral placeholders. Verified product images and specifications will be added with the product system.' },
];
export default function HelpPage() {
  return <main id="main-content" className="container"><nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><span aria-current="page">Help</span></nav><div className="page-intro"><p className="eyebrow">CUSTOMER GUIDANCE</p><h1>A little help getting started.</h1><p>Understand the catalogue preview, account access and what comes next.</p></div><div className="page-body"><div className="faq-list">{questions.map(item => <details key={item.question} className="reference-details"><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div><div className="actions"><ActionLink href="/products">Explore the catalogue</ActionLink><ActionLink href="/register" secondary>Account information</ActionLink></div><div style={{marginTop:32}}><Notice title="Customer support details">Verified Maxbet contact details will be added before launch. This preview does not provide a contact form or collect enquiries.</Notice></div></div></main>;
}
