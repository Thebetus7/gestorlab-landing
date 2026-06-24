import Image from 'next/image';
import { siteConfig } from '@/lib/site-config';
import styles from './ProductsSection.module.css';

export function ProductsSection() {
  const { products, urls } = siteConfig;
  const { flagship } = products;

  return (
    <section id="productos" className={`section ${styles.section}`}>
      <div className="container">
        <h2 className="sectionTitle">{products.title}</h2>
        <p className="sectionSubtitle">{products.subtitle}</p>

        <div className={`card ${styles.flagship}`}>
          <div className={styles.flagshipImage}>
            <Image
              src={flagship.image}
              alt={flagship.name}
              width={800}
              height={500}
              className={styles.flagshipImg}
            />
          </div>
          <div className={styles.flagshipContent}>
            <span className={styles.badge}>Producto Principal</span>
            <h3 className={styles.productName}>{flagship.name}</h3>
            <p className={styles.productDesc}>{flagship.description}</p>
            <a
              href={urls.app}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btnPrimary"
            >
              Acceder a GestorLab
            </a>
          </div>
        </div>

        <div className={styles.featuresGrid}>
          {flagship.features.map((feat, idx) => (
            <div key={feat.title} className={`card ${styles.featureCard}`}>
              <span className={styles.featureNum}>0{idx + 1}</span>
              <h4 className={styles.featureTitle}>{feat.title}</h4>
              <p className={styles.featureDesc}>{feat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
