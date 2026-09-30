import type { Metadata } from 'next';
import { ActionLink, Notice } from '../../components/ui';
export const metadata: Metadata = { title: 'Catalogue' };
export default function ProductsPage() {
  return <main id="main-content" className="container"><div className="page-intro"><p className="eyebrow">PUBLIC CATALOGUE</p><h1>Explore Maxbet products.</h1><p>Our public catalogue will help your pharmacy discover the products available through Maxbet.</p></div><div className="page-body"><Notice title="Catalogue coming soon">We are preparing the product catalogue. Product listings, prices and stock information are not available in this preview.</Notice><div className="empty-state"><span className="empty-icon" aria-hidden="true">+</span><h2>The catalogue is being prepared.</h2><p>When it opens, you can browse products here. Wholesale pricing, live availability and purchasing will require an approved business account.</p><ActionLink href="/register" secondary>About account access</ActionLink></div></div></main>;
}
