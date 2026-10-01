import assert from 'node:assert/strict';

const base = process.env.SMOKE_BASE_URL || 'http://localhost:3000';
for (const route of ['/', '/products', '/login', '/register', '/brand']) {
  const response = await fetch(new URL(route, base));
  assert.equal(response.status, 200, route);
  const html = await response.text();
  assert.match(html, /<html/);
  assert.match(html, /id="main-content"/);
  assert.match(html, /brand\/maxbet-logo.png/);
}
for (const [route, destination] of [['/account', '/login'], ['/admin', '/login?area=staff']]) {
  const response = await fetch(new URL(route, base), { redirect: 'manual' });
  assert.equal(response.status, 307, route);
  assert.equal(new URL(response.headers.get('location'), base).pathname, new URL(destination, base).pathname);
  assert.equal(new URL(response.headers.get('location'), base).search, new URL(destination, base).search);
}
const health = await fetch(new URL('/api/health', base));
const logo = await fetch(new URL('/brand/maxbet-logo.png', base));
assert.equal(logo.status, 200);
assert.match(logo.headers.get('content-type'), /image\/png/);
assert.deepEqual([...new Uint8Array(await logo.arrayBuffer()).slice(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
assert.equal(health.status, 200);
assert.equal(health.headers.get('cache-control'), 'no-store');
assert.deepEqual(await health.json(), { application: 'maxbet', status: 'ok' });
assert.equal((await fetch(new URL('/missing-page', base))).status, 404);
console.log('Passed: public routes, protected placeholders, health and 404.');

// Phase 3 customer browsing uses presentation-only fixtures.
async function pageHTML(path) {
  const response = await fetch(new URL(path, base));
  assert.equal(response.status, 200, path);
  return response.text();
}
const catalogue = await pageHTML('/products');
assert.match(catalogue, /Showing 1–6 of 9 sample items/);
assert.match(catalogue, /You are browsing sample items/);
assert.match(catalogue, /name="robots" content="noindex, nofollow"/);
const searched = await pageHTML('/products?q=gloves');
assert.match(searched, /Showing 1–1 of 1 sample items/);
assert.match(searched, /href="\/products\/examination-gloves"/);
assert.doesNotMatch(searched, /href="\/products\/cotton-wool"/);
const combined = await pageHTML('/products?category=wound-care&q=gauze');
assert.match(combined, /Showing 1–1 of 1 sample items/);
assert.match(combined, /href="\/products\/gauze-swabs"/);
const empty = await pageHTML('/products?category=equipment&q=gauze');
assert.match(empty, /No matching sample items/);
assert.match(empty, /Reset all filters/);
const second = await pageHTML('/products?page=2');
assert.match(second, /Showing 7–9 of 9 sample items/);
assert.doesNotMatch(second, /href="\/products\/adhesive-bandages"/);
const sorted = await pageHTML('/products?sort=name-desc');
assert.ok(sorted.indexOf('href="/products/measuring-cup"') < sorted.indexOf('href="/products/hand-sanitiser"'));
assert.match(sorted, /sort=name-desc(?:&amp;|&)page=2/);
assert.match(await pageHTML('/products?category=invalid&sort=invalid&page=-3'), /Showing 1–6 of 9 sample items/);
assert.match(await pageHTML('/products?page=999'), /Showing 7–9 of 9 sample items/);
assert.match(await pageHTML('/products?q=gloves&q=gauze'), /Showing 1–1 of 1 sample items/);
const escaped = await pageHTML('/products?q=%3Cscript%3Ealert(1)%3C%2Fscript%3E');
assert.match(escaped, /No matching sample items/);
assert.doesNotMatch(escaped, /<script>alert\(1\)<\/script>/);
const detail = await pageHTML('/products/examination-gloves');
assert.match(detail, /Sample item/);
assert.match(detail, /Not provided in this preview/);
assert.match(detail, /href="\/products\?category=protection"/);
assert.equal((await fetch(new URL('/products/not-a-sample', base))).status, 404);
for (const route of ['/help', '/about']) assert.match(await pageHTML(route), /id="main-content"/);
console.log('Passed: customer catalogue search, filters, sort, pagination, empty/invalid states, details and guidance.');

const registration = await pageHTML('/register');
assert.match(registration, /<fieldset disabled=""/);
assert.doesNotMatch(registration, /<form[\s>]/);
assert.match(registration, /Both a phone number and email address are required/);
const accountPreview = await pageHTML('/account-preview?state=approved');
assert.match(accountPreview, /This is a design preview, not your account status/);
assert.match(accountPreview, /Your business account is approved/);
assert.match(await pageHTML('/account-preview?state=__proto__'), /Your business request is being reviewed/);
console.log('Passed: account preview cannot collect registration or grant account access.');

const callback = await fetch(new URL('/auth/callback?code=invalid&next=https://example.org', base), { redirect: 'manual' });
assert.equal(callback.status, 307);
assert.equal(new URL(callback.headers.get('location')).pathname, '/login');
assert.equal(new URL(callback.headers.get('location')).origin, new URL(base).origin);
assert.match(callback.headers.get('cache-control'), /private, no-store/);
for (const route of ['/login', '/register', '/account']) {
  const response = await fetch(new URL(route, base), { redirect: 'manual' });
  assert.match(response.headers.get('cache-control'), /private, no-store/);
}
console.log('Passed: authentication callbacks use local destinations and private responses are not cacheable.');
