import { siteConfig } from '@/lib/site-config';
import styles from './AboutSection.module.css';

function ValueIcon({ type }: { type: 'lightbulb' | 'shield' | 'users' }) {
  const icons = {
    lightbulb: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 18h6M10 22h4M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
      </svg>
    ),
    shield: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    users: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  };
  return <span className={styles.valueIcon}>{icons[type]}</span>;
}

export function AboutSection() {
  const { about } = siteConfig;

  return (
    <section id="quienes-somos" className={`section ${styles.section}`}>
      <div className="container">
        <h2 className="sectionTitle">{about.title}</h2>
        <p className="sectionSubtitle">{about.subtitle}</p>

        <div className={styles.grid}>
          <div className={styles.missionCol}>
            <h3 className={styles.colTitle}>{about.missionTitle}</h3>
            <p className={styles.missionText}>{about.mission}</p>
            <div className={styles.stats}>
              {about.stats.map((stat) => (
                <div key={stat.label} className={`card ${styles.statCard}`}>
                  <span className={styles.statValue}>{stat.value}</span>
                  <span className={styles.statLabel}>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.valuesCol}>
            <h3 className={styles.colTitle}>{about.valuesTitle}</h3>
            <div className={styles.valuesList}>
              {about.values.map((value) => (
                <div key={value.title} className={`card ${styles.valueCard}`}>
                  <ValueIcon type={value.icon} />
                  <div>
                    <h4 className={styles.valueTitle}>{value.title}</h4>
                    <p className={styles.valueDesc}>{value.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
