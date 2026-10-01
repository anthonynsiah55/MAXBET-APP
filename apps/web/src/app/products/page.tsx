import type { Metadata } from 'next';
import Link from 'next/link';
import { ItemCard } from '../../components/catalogue';
import { Arrow, Notice } from '../../components/ui';
import { categories, catalogueHref, selectCatalogue, PAGE_SIZE, type CatalogueParams } from '../../lib/catalogue/preview';

export const metadata: Metadata = { title: 'Catalogue preview', robots: { index: false, follow: false } };
export default async function ProductsPage({ searchParams }: { searchParams: Promise<CatalogueParams> }) {
  const result = selectCatalogue(await searchParams);
  const href = (page: number) => catalogueHref({ q: result.query, category: result.category, sort: result.sort, page });
  return <main id="main-content" className="container catalogue-page">
    <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><span aria-current="page">Catalogue</span></nav>
    <div className="catalogue-heading"><div><p className="eyebrow">EXPLORE THE CATALOGUE</p><h1>Find your pharmacy essentials.</h1><p>Browse by name or category, then open an item to explore its information.</p></div><Link className="text-link" href="/help">How account access works <Arrow diagonal /></Link></div>
    <Notice title="You are browsing sample items">These examples demonstrate the catalogue experience. They are not Maxbet product listings, offers or stock information.</Notice>
    <form action="/products" method="get" className="catalogue-filters" aria-label="Catalogue filters">
      <div className="field search-field"><label htmlFor="catalogue-search">Search sample items</label><input id="catalogue-search" name="q" type="search" maxLength={80} defaultValue={result.query} placeholder="Item name or sample reference" /></div>
      <div className="field"><label htmlFor="catalogue-category">Category</label><select id="catalogue-category" name="category" defaultValue={result.category}><option value="">All categories</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
      <div className="field"><label htmlFor="catalogue-sort">Sort by</label><select id="catalogue-sort" name="sort" defaultValue={result.sort}><option value="name-asc">Name: A to Z</option><option value="name-desc">Name: Z to A</option></select></div>
      <button className="button" type="submit">Apply filters <Arrow /></button>
    </form>
    <div className="catalogue-results-bar"><p role="status">{result.total ? `Showing ${(result.page - 1) * PAGE_SIZE + 1}–${Math.min(result.page * PAGE_SIZE, result.total)} of ${result.total} sample items` : 'No sample items found'}</p>{(result.query || result.category || result.sort !== 'name-asc') && <Link className="text-link" href="/products">Clear filters <span aria-hidden="true">×</span></Link>}</div>
    {result.items.length ? <div className="catalogue-grid">{result.items.map(item => <ItemCard key={item.slug} item={item} />)}</div> : <div className="empty-state catalogue-empty"><span className="empty-icon" aria-hidden="true">⌕</span><h2>No matching sample items.</h2><p>Try a shorter search or a different category. This preview contains only a small set of sample items.</p><Link className="button button-secondary" href="/products">Reset all filters <Arrow /></Link></div>}
    {result.pages > 1 && <nav className="pagination" aria-label="Catalogue pages">{result.page > 1 ? <Link href={href(result.page - 1)}>Previous</Link> : <span aria-disabled="true">Previous</span>}{Array.from({ length: result.pages }, (_, i) => <Link key={i} href={href(i + 1)} aria-label={`Page ${i + 1}`} aria-current={result.page === i + 1 ? 'page' : undefined}>{i + 1}</Link>)}{result.page < result.pages ? <Link href={href(result.page + 1)}>Next</Link> : <span aria-disabled="true">Next</span>}</nav>}
    <aside className="catalogue-access"><div><h2>Wholesale access for your business.</h2><p>Prices, live availability and purchasing will be available to approved accounts.</p></div><Link className="text-link" href="/register">About account access <Arrow /></Link></aside>
    <noscript><p className="field-hint">Search, filters and page navigation work without JavaScript. Apply filters to update your results.</p></noscript>
  </main>;
}
