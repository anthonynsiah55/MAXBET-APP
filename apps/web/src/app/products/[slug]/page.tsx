import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ItemCard, ItemIllustration } from '../../../components/catalogue';
import { ActionLink, Badge, Notice } from '../../../components/ui';
import { categories, previewItems } from '../../../lib/catalogue/preview';

export const dynamicParams = false;
type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return previewItems.map(item => ({ slug: item.slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = previewItems.find(item => item.slug === slug);
  return { title: item ? `${item.name} — sample` : 'Item not found', robots: { index: false, follow: false } };
}
export default async function ItemPage({ params }: Props) {
  const { slug } = await params;
  const item = previewItems.find(item => item.slug === slug);
  if (!item) notFound();
  const category = categories.find(c => c.id === item.category)!;
  const related = previewItems.filter(other => other.category === item.category && other.slug !== item.slug);
  return <main id="main-content" className="container item-page">
    <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><Link href="/products">Catalogue</Link><span aria-hidden="true">/</span><span aria-current="page">{item.name}</span></nav>
    <div className="item-detail"><div className="item-detail-art"><ItemIllustration item={item} /><p>Illustration for this preview. Not an image of a Maxbet product.</p></div><div className="item-information"><Badge>Sample item</Badge><p className="eyebrow">{category.name}</p><h1>{item.name}</h1><p className="item-summary">{item.summary}</p><dl className="item-facts"><div><dt>Preview reference</dt><dd>{item.reference}</dd></div><div><dt>Category</dt><dd><Link href={`/products?category=${item.category}`}>{category.name}</Link></dd></div><div><dt>Product specifications</dt><dd>Not provided in this preview</dd></div></dl><Notice title="Wholesale account access">Prices, live availability and purchasing require an approved account. Account services are not open yet.</Notice><div className="actions"><ActionLink href="/register">About account access</ActionLink><Link className="text-link" href="/products">Back to catalogue</Link></div></div></div>
    <section className="item-guidance"><h2>About this sample</h2><p>This page demonstrates the layout for product information. It does not confirm Maxbet carries this item. Brand, pack size, specifications, images and availability will come from the verified product catalogue in a later phase.</p></section>
    <section className="related-items"><div className="section-heading"><div><p className="eyebrow">CONTINUE BROWSING</p><h2>More in {category.name.toLowerCase()}.</h2></div><Link className="text-link" href={`/products?category=${item.category}`}>View category</Link></div><div className="catalogue-grid">{related.map(item => <ItemCard key={item.slug} item={item} />)}</div></section>
  </main>;
}

