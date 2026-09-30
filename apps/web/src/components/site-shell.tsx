import Image from 'next/image';
import Link from 'next/link';
import { Arrow } from './ui';

function Navigation() {
  return <><Link href="/products">Catalogue</Link><Link href="/#how-it-works">How it works</Link><Link href="/login">Sign in</Link><Link href="/register" className="nav-cta">Request an account <Arrow diagonal /></Link></>;
}
export function SiteHeader() {
  return <><div className="preview-bar"><div className="container"><span><span className="preview-dot" />Platform preview</span><span>Account access and ordering are coming soon</span></div></div><header className="site-header container"><Link className="brand" href="/" aria-label="Maxbet Pharmacy Ltd home"><Image src="/brand/maxbet-logo.png" width={116} height={116} alt="" unoptimized priority /><span>MAXBET<small>PHARMACY LTD</small></span></Link><nav className="desktop-nav" aria-label="Main navigation"><Navigation /></nav><details className="mobile-nav"><summary>Menu <span aria-hidden="true">＋</span></summary><nav aria-label="Mobile navigation"><Navigation /></nav></details></header></>;
}
export function SiteFooter() {
  return <footer className="site-footer"><div className="container footer-top"><div><p className="footer-brand">MAXBET <span>PHARMACY LTD</span></p><p>Wholesale pharmacy platform · Ghana</p></div><nav aria-label="Footer navigation"><Link href="/products">Catalogue</Link><Link href="/register">Account access</Link><Link href="/brand">Visual system</Link></nav></div><div className="container footer-bottom"><span>© {new Date().getUTCFullYear()} Maxbet Pharmacy Ltd</span><span>Customer access by account approval</span></div></footer>;
}

