import { siteConfig } from '@/lib/site-config';
import styles from './ProjectSection.module.css';

export function ProjectSection() {
  const { project, urls } = siteConfig;

  return (
    <section id="proyecto" className={`section ${styles.section}`}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.content}>
          <h2 className={styles.title}>{project.title}</h2>
          <p className={styles.subtitle}>{project.subtitle}</p>
          <div className={styles.actions}>
            <a
              href={urls.app}
              target="_blank"
              rel="noopener noreferrer"
              className={`btn btnPrimary ${styles.cta}`}
            >
              {project.cta}
            </a>
            <a
              href={urls.appDownload}
              target="_blank"
              rel="noopener noreferrer"
              className={`btn btnSecondary ${styles.download}`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Descargar App
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
