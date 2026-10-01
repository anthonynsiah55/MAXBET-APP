/** Presentation-only fixtures for Phase 3. Not a product model or live inventory. */
export const categories = [
  { id: 'wound-care', name: 'Dressings & first aid', mark: '01' },
  { id: 'protection', name: 'Personal protection', mark: '02' },
  { id: 'equipment', name: 'Pharmacy essentials', mark: '03' },
] as const;

export type CategoryId = typeof categories[number]['id'];
export type PreviewItem = {
  slug: string;
  name: string;
  category: CategoryId;
  reference: string;
  illustration: 'box' | 'bottle' | 'device';
  summary: string;
};

export const previewItems: readonly PreviewItem[] = [
  { slug: 'adhesive-bandages', name: 'Adhesive bandages', category: 'wound-care', reference: 'DEMO-001', illustration: 'box', summary: 'An example of how a first-aid item will appear in the catalogue.' },
  { slug: 'cotton-wool', name: 'Cotton wool', category: 'wound-care', reference: 'DEMO-002', illustration: 'box', summary: 'An example of how a dressing supply will appear in the catalogue.' },
  { slug: 'gauze-swabs', name: 'Gauze swabs', category: 'wound-care', reference: 'DEMO-003', illustration: 'box', summary: 'An example of how a packaged supply will appear in the catalogue.' },
  { slug: 'examination-gloves', name: 'Examination gloves', category: 'protection', reference: 'DEMO-004', illustration: 'box', summary: 'An example of how a personal-protection item will appear in the catalogue.' },
  { slug: 'face-masks', name: 'Face masks', category: 'protection', reference: 'DEMO-005', illustration: 'box', summary: 'An example of how a boxed item will appear in the catalogue.' },
  { slug: 'hand-sanitiser', name: 'Hand sanitiser', category: 'protection', reference: 'DEMO-006', illustration: 'bottle', summary: 'An example of how a bottled item will appear in the catalogue.' },
  { slug: 'digital-thermometer', name: 'Digital thermometer', category: 'equipment', reference: 'DEMO-007', illustration: 'device', summary: 'An example of how a pharmacy device will appear in the catalogue.' },
  { slug: 'measuring-cup', name: 'Measuring cup', category: 'equipment', reference: 'DEMO-008', illustration: 'device', summary: 'An example of how a pharmacy accessory will appear in the catalogue.' },
  { slug: 'first-aid-scissors', name: 'First-aid scissors', category: 'equipment', reference: 'DEMO-009', illustration: 'device', summary: 'An example of how a pharmacy essential will appear in the catalogue.' },
];

export const PAGE_SIZE = 6;
export type CatalogueParams = Record<string, string | string[] | undefined>;
export function selectCatalogue(params: CatalogueParams) {
  const first = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value;
  const query = (first(params.q) || '').trim().slice(0, 80);
  const requestedCategory = first(params.category);
  const category = categories.some(c => c.id === requestedCategory) ? requestedCategory! : '';
  const sort = first(params.sort) === 'name-desc' ? 'name-desc' : 'name-asc';
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
  const filtered = previewItems.filter(item => (!category || item.category === category) && tokens.every(token => `${item.name} ${item.reference}`.toLowerCase().includes(token)))
    .sort((a, b) => sort === 'name-desc' ? b.name.localeCompare(a.name, 'en') : a.name.localeCompare(b.name, 'en'));
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const requestedPage = Number(first(params.page));
  const page = Number.isSafeInteger(requestedPage) && requestedPage > 0 ? Math.min(requestedPage, pages) : 1;
  return { query, category, sort, page, pages, total: filtered.length, items: filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE) };
}

export function catalogueHref(values: { q?: string; category?: string; sort?: string; page?: number }) {
  const params = new URLSearchParams();
  if (values.q) params.set('q', values.q);
  if (values.category) params.set('category', values.category);
  if (values.sort === 'name-desc') params.set('sort', values.sort);
  if (values.page && values.page > 1) params.set('page', String(values.page));
  return `/products${params.size ? `?${params}` : ''}`;
}
