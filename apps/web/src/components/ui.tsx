import Link from 'next/link';
import type { ReactNode, InputHTMLAttributes } from 'react';

export function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">{diagonal ? <path d="M6 18 18 6M6 6h12v12" /> : <path d="M4 12h15m-6-6 6 6-6 6" />}</svg>;
}
export function ActionLink({ href, children, secondary = false }: { href: string; children: ReactNode; secondary?: boolean }) {
  return <Link className={`button${secondary ? ' button-secondary' : ''}`} href={href}>{children}<Arrow /></Link>;
}
export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'success' | 'warning' | 'error' }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}
export function Field({ label, hint, error, id, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string; error?: string; id: string }) {
  return <div className="field"><label htmlFor={id}>{label}</label><input id={id} aria-invalid={error ? true : undefined} aria-describedby={error || hint ? `${id}-description` : undefined} {...props} />{(error || hint) && <p id={`${id}-description`} className={error ? 'field-error' : 'field-hint'}>{error || hint}</p>}</div>;
}
export function Notice({ children, title }: { children: ReactNode; title: string }) {
  return <div className="notice"><span className="notice-symbol" aria-hidden="true">i</span><div><strong>{title}</strong><p>{children}</p></div></div>;
}
