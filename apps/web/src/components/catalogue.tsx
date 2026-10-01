import Link from 'next/link';
import { Arrow, Badge } from './ui';
import { categories, type PreviewItem } from '../lib/catalogue/preview';

export function ItemIllustration({ item }: { item: PreviewItem }) {
  return <div className={`item-art art-${item.category}`} aria-hidden="true">
    <span className="art-grid" />
    <span className={`sample-package package-${item.illustration}`}><span className="package-band" /><span className="package-plus">+</span><span className="package-label">SAMPLE</span><span className="package-lines" /></span>
    <span className="art-caption">ILLUSTRATIVE PACKAGING</span>
  </div>;
}

export function ItemCard({ item }: { item: PreviewItem }) {
  const category = categories.find(c => c.id === item.category)!;
  return <article className="item-card">
    <Link className="item-card-link" href={`/products/${item.slug}`}>
      <ItemIllustration item={item} />
      <div className="item-card-body"><div className="item-meta"><span>{category.name}</span><Badge>Sample</Badge></div><h2>{item.name}</h2><p className="sample-reference">{item.reference}</p><span className="item-view">View sample details <Arrow diagonal /></span></div>
    </Link>
  </article>;
}
