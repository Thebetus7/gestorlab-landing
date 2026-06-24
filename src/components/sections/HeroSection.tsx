import { siteConfig } from '@/lib/site-config';
import styles from './HeroSection.module.css';

const hexIcons = ['⚙', '📊', '🏆', '🎯', '🌐', '💡'];

export function HeroSection() {
  const { hero, urls } = siteConfig;
  const parts = hero.title.split(hero.titleHighlight);

  return (
    <section id="inicio" className={styles.hero}>
      <div
        className={styles.bgImage}
        style={{ backgroundImage: `url(${hero.backgroundImage})` }}
      />
      <div className={styles.overlay} />

      <div className={`container ${styles.content}`}>
        <div className={styles.textCol}>
          <h1 className={styles.title}>
            {parts[0]}
            <span className={styles.highlight}>{hero.titleHighlight}</span>
            {parts[1]}
          </h1>
          <p className={styles.subtitle}>{hero.subtitle}</p>
          <div className={styles.actions}>
            <a
              href={urls.app}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btnPrimary"
            >
              {hero.primaryCta}
            </a>
            <a href="#productos" className="btn btnOutline">
              {hero.secondaryCta}
            </a>
          </div>
        </div>

        <div className={styles.visualCol}>
          <div className={styles.hexGrid}>
            {hexIcons.map((icon, i) => (
              <div key={i} className={styles.hex} style={{ animationDelay: `${i * 0.15}s` }}>
                <span>{icon}</span>
              </div>
            ))}
          </div>
          <div className={styles.glassCard}>
            <div className={styles.barRow}>
              <div className={styles.bar} style={{ width: '85%' }} />
            </div>
            <div className={styles.barRow}>
              <div className={styles.bar} style={{ width: '65%' }} />
            </div>
            <div className={styles.barRow}>
              <div className={styles.bar} style={{ width: '90%' }} />
            </div>
            <div className={styles.barRow}>
              <div className={styles.bar} style={{ width: '50%' }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
