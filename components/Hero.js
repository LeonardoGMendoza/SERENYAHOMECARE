import Link from 'next/link';
import styles from '../styles/Hero.module.css';

export default function Hero() {
  const waLink = "https://wa.me/5511974995342?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20os%20cuidados%20da%20Serenya.";

  return (
    <section className={styles.hero}>
      <div className={styles.heroBg}>
        <div className={styles.heroGlow} />
      </div>

      <div className="container">
        <div className={styles.heroRow}>
          {/* Texto */}
          <div className={styles.heroContent}>
            <div className={styles.heroBadge}>
              🏆 Referência em Cuidados Domiciliares
            </div>
            <h1 className={styles.heroTitle}>
              Cuidamos de vidas,<br />
              <span className="gradient-text">acolhemos histórias.</span>
            </h1>
            <p className={styles.heroSub}>
              Assistência domiciliar humanizada, segura e de excelência para idosos, crianças e pacientes que merecem o melhor cuidado — no conforto do lar.
            </p>
            <div className={styles.heroActions}>
              <Link href={waLink} target="_blank" className="btn btn-primary btn-lg">
                💬 Falar no WhatsApp
              </Link>
              <Link href="#planos" className="btn btn-outline-green btn-lg">
                Ver Planos Premium
              </Link>
            </div>
            <div className={styles.heroStats}>
              <div className={styles.heroStat}>
                <span className={styles.heroStatNum}>1.000+</span>
                <span className={styles.heroStatLabel}>Famílias Atendidas</span>
              </div>
              <div className={styles.heroStatDivider} />
              <div className={styles.heroStat}>
                <span className={styles.heroStatNum}>24h</span>
                <span className={styles.heroStatLabel}>Disponibilidade</span>
              </div>
              <div className={styles.heroStatDivider} />
              <div className={styles.heroStat}>
                <span className={styles.heroStatNum}>5★</span>
                <span className={styles.heroStatLabel}>Avaliação Média</span>
              </div>
            </div>
          </div>

          {/* Imagem */}
          <div className={styles.heroVisual}>
            <div className={styles.heroImgWrap}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/nursing_team_cima.png?v=${Date.now()}`}
                alt="Equipe Serenya Home Care"
                style={{ width: '100%', height: '420px', objectFit: 'cover', display: 'block' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
