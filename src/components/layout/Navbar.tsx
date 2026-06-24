'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { siteConfig } from '@/lib/site-config';
import styles from './Navbar.module.css';

export function Navbar() {
  const [activeSection, setActiveSection] = useState('inicio');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const sectionIds = siteConfig.nav.map((item) => item.href.replace('#', ''));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    const id = href.replace('#', '');
    setActiveSection(id);
  };

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <a href="#inicio" className={styles.logo} onClick={() => handleNavClick('#inicio')}>
          <Image src="/logo.svg" alt="" width={36} height={36} />
          <span>
            {siteConfig.company.name}
            <strong> {siteConfig.company.suffix}</strong>
          </span>
        </a>

        <button
          type="button"
          className={styles.menuToggle}
          aria-label="Abrir menú"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`}>
          {siteConfig.nav.map((item) => {
            const id = item.href.replace('#', '');
            const isActive = activeSection === id;
            return (
              <a
                key={item.href}
                href={item.href}
                className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                onClick={() => handleNavClick(item.href)}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <a
          href={siteConfig.urls.login}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.loginBtn}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          Iniciar sesión
        </a>
      </div>
    </header>
  );
}
