import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader, SiteFooter } from '../components/site-shell';

export const metadata: Metadata = {
  title: { default: "Maxbet Pharmacy Ltd | Wholesale Pharmacy", template: "%s | Maxbet Pharmacy Ltd" },
  description: "Maxbet Wholesale Pharmacy Platform",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body><a href="#main-content" className="skip-link">Skip to content</a><SiteHeader />{children}<SiteFooter /></body>
    </html>
  );
}
