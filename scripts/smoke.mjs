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
