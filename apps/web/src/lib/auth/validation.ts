export function normalizePhone(input: string): string | null {
  const compact = input.trim().replace(/[ ()-]/g, '');
  if (/^0[235]\d{8}$/.test(compact)) return '+233' + compact.slice(1);
  if (/^(?:\+233|233)[235]\d{8}$/.test(compact)) return '+' + compact.replace(/^\+/, '');
  return null;
}
export function normalizeEmail(input: string): string | null {
  const email = input.trim().toLowerCase();
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;
}
export function loginIdentity(input: string) {
  const email = normalizeEmail(input);
  if (email) return { email };
  const phone = normalizePhone(input);
  return phone ? { phone } : null;
}
export function validateRegistration(data: { business: string; contact: string; phone: string; email: string; password: string }) {
  const business = data.business.trim();
  const contact = data.contact.trim();
  const phone = normalizePhone(data.phone);
  const email = normalizeEmail(data.email);
  if (business.length < 2 || business.length > 120 || contact.length < 2 || contact.length > 120 || /[\x00-\x1f]/.test(business + contact)) return null;
  // Supabase passwords use bcrypt: enforce the byte limit, not only JS character length.
  const bytes = new TextEncoder().encode(data.password).length;
  if (!phone || !email || data.password.length < 12 || bytes > 72) return null;
  return { business, contact, phone, email, password: data.password };
}
