import { siteConfig } from '@/lib/site-config';
import styles from './Footer.module.css';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <span className={styles.brandName}>
            {siteConfig.company.name}
            <span className={styles.brandAccent}>{siteConfig.company.suffix}</span>
          </span>
          <p className={styles.tagline}>{siteConfig.company.tagline}</p>
        </div>

        <div className={styles.links}>
          {siteConfig.nav.map((item) => (
            <a key={item.href} href={item.href} className={styles.link}>
              {item.label}
            </a>
          ))}
        </div>

        <p className={styles.copy}>
          © {year} {siteConfig.footer.copyright}
        </p>
      </div>
    </footer>
  );
}
