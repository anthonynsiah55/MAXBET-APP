import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

function load(path, modules = {}, env = {}) {
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(path, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  vm.runInNewContext(code, { exports, require: name => {
    if (!(name in modules)) throw new Error('Unexpected dependency: ' + name);
    return modules[name];
  }, process: { env }, TextEncoder, URL });
  return exports;
}
const validation = load('apps/web/src/lib/auth/validation.ts');
for (const input of ['024 000 0000', '+233240000000', '233240000000', '(024) 000-0000']) assert.equal(validation.normalizePhone(input), '+233240000000');
for (const input of ['+1240000000', '024000000', '02400000000', '0240000000ext1', 'abc', '']) assert.equal(validation.normalizePhone(input), null);
assert.equal(validation.normalizeEmail(' TEST@Example.com '), 'test@example.com');
assert.equal(validation.normalizeEmail('a@b\n.com'), null);
const valid = { business: 'Example Pharmacy', contact: 'Test Person', email: 'test@example.com', phone: '0240000000', password: 'long-password-123' };
assert.ok(validation.validateRegistration(valid));
for (const key of ['business', 'contact', 'email', 'phone', 'password']) assert.equal(validation.validateRegistration({ ...valid, [key]: '' }), null);
assert.equal(validation.validateRegistration({ ...valid, password: 'é'.repeat(37) }), null);
assert.equal(validation.validateRegistration({ ...valid, business: 'Bad\nname' }), null);

for (const url of ['https://wrong.supabase.co', 'http://ufcerqtdlvtflvkkorzs.supabase.co', 'https://ufcerqtdlvtflvkkorzs.supabase.co.evil.test', 'invalid']) {
  const config = load('apps/web/src/lib/supabase/config.ts', {}, { NEXT_PUBLIC_SUPABASE_URL: url, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'test', MAXBET_ACCOUNTS_ENABLED: 'true' });
  assert.equal(config.accountsEnabled(), false);
}
let enabled = false;
let providerCalls = 0;
let captured;
let providerError = false;
const actions = load('apps/web/src/app/auth/actions.ts', {
  'next/navigation': { redirect: location => { const error = new Error('redirect'); error.location = location; throw error; } },
  '../../lib/supabase/config': { accountsEnabled: () => enabled },
  '../../lib/auth/validation': validation,
  '../../lib/supabase/server': { createServerAuthClient: async () => { providerCalls++; return { auth: {
    signUp: async input => { captured = input; return { error: providerError ? {} : null, data: { session: null } }; },
    signInWithPassword: async input => { captured = input; return { error: providerError ? {} : null, data: { user: providerError ? null : { id: 'test-user' } } }; },
    signOut: async () => ({ error: null }),
  } }; } },
}, { MAXBET_SITE_URL: 'https://example.test' });
const form = new FormData();
Object.entries(valid).forEach(([key,value]) => form.set(key,value));
form.set('status','approved'); form.set('role','super_admin');
async function redirects(call, location) {
  await assert.rejects(call, error => error.location === location);
}
await redirects(() => actions.register(form), '/register?message=unavailable');
assert.equal(providerCalls, 0);
enabled = true;
await redirects(() => actions.register(form), '/login?message=check-email');
assert.equal(captured.options.data.requested_phone, '+233240000000');
assert.equal(captured.options.data.role, undefined);
assert.equal(captured.options.data.status, undefined);
assert.equal(captured.options.emailRedirectTo, 'https://example.test/auth/callback');
const login = new FormData();
login.set('identity','0240000000'); login.set('password','test-password');
await redirects(() => actions.signIn(login), '/account');
assert.equal(captured.phone, '+233240000000');
providerError = true;
await redirects(() => actions.signIn(login), '/login?message=failed');
await redirects(() => actions.register(form), '/register?message=failed');
console.log('Passed: contact validation, password byte limit, project isolation, closed signup, allowlisted metadata, normalized sign-in and generic provider failures.');
