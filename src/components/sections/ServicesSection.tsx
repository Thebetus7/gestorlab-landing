import { siteConfig } from '@/lib/site-config';
import styles from './ServicesSection.module.css';

function ServiceIcon({ type }: { type: 'code' | 'chart' | 'support' | 'network' }) {
  const icons = {
    code: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    chart: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
    support: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    network: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
      </svg>
    ),
  };
  return <span className={styles.icon}>{icons[type]}</span>;
}

export function ServicesSection() {
  const { services } = siteConfig;

  return (
    <section id="servicios" className={`section ${styles.section}`}>
      <div className="container">
        <h2 className="sectionTitle">{services.title}</h2>
        <p className="sectionSubtitle">{services.subtitle}</p>

        <div className={styles.grid}>
          {services.items.map((item) => (
            <div key={item.title} className={`card ${styles.card}`}>
              <ServiceIcon type={item.icon} />
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardDesc}>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
