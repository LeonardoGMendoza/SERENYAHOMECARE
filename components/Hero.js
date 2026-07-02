import Link from 'next/link';
import styles from '../styles/Hero.module.css';

export default function Hero() {
  const whatsappLink = "https://wa.me/5511914339705?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20os%20cuidados%20da%20Serenya.";

  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <h1 className={styles.title}>
          Cuidamos de vidas, acolhemos histórias.
        </h1>
        <p className={styles.subtitle}>
          Assistência domiciliar humanizada, segura e de excelência para idosos, crianças e pacientes em recuperação.
        </p>
        <div className={styles.ctaContainer}>
          <Link href={whatsappLink} target="_blank" className={styles.primaryBtn}>
            Falar com um Especialista
          </Link>
          <Link href="#planos" className={styles.secondaryBtn}>
            Ver Planos Premium
          </Link>
        </div>
      </div>
    </section>
  );
}
