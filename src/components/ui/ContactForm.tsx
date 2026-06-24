'use client';

import { useState, FormEvent } from 'react';
import styles from './ContactForm.module.css';

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className={styles.success}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
        <h3>Mensaje enviado</h3>
        <p>Gracias por contactarnos. Te responderemos a la brevedad.</p>
        <button type="button" className="btn btnPrimary" onClick={() => setSubmitted(false)}>
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <div className={styles.group}>
          <label htmlFor="name" className={styles.label}>Nombre</label>
          <input id="name" name="name" type="text" required className={styles.input} placeholder="Tu nombre" />
        </div>
        <div className={styles.group}>
          <label htmlFor="email" className={styles.label}>Email</label>
          <input id="email" name="email" type="email" required className={styles.input} placeholder="tu@email.com" />
        </div>
      </div>
      <div className={styles.group}>
        <label htmlFor="phone" className={styles.label}>Teléfono</label>
        <input id="phone" name="phone" type="tel" className={styles.input} placeholder="+591 7000-0000" />
      </div>
      <div className={styles.group}>
        <label htmlFor="subject" className={styles.label}>Asunto</label>
        <input id="subject" name="subject" type="text" required className={styles.input} placeholder="Asunto del mensaje" />
      </div>
      <div className={styles.group}>
        <label htmlFor="message" className={styles.label}>Mensaje</label>
        <textarea id="message" name="message" required rows={5} className={styles.textarea} placeholder="Escribe tu mensaje..." />
      </div>
      <button type="submit" className={`btn btnPrimary ${styles.submit}`}>
        Enviar Mensaje
      </button>
    </form>
  );
}
