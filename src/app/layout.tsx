import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ContactWidget } from '@/components/ui/ContactWidget';
import { siteConfig } from '@/lib/site-config';
import './globals.css';

export const metadata: Metadata = {
  title: `${siteConfig.company.name} ${siteConfig.company.suffix} | Innovación Tecnológica`,
  description: siteConfig.hero.subtitle,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <ContactWidget />
      </body>
    </html>
  );
}
