import Link from 'next/link';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import styles from './page.module.css';

const WA_LINK = "https://wa.me/5511989553812?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20os%20cuidados%20da%20Serenya.";

const services = [
  { icon: '👵', title: 'Cuidador de Idosos', desc: 'Assistência diária, controle de medicações, auxílio na mobilidade e higiene com amor e respeito.' },
  { icon: '🩺', title: 'Técnico de Enfermagem', desc: 'Procedimentos complexos, sondas, curativos avançados — plantões de 12h ou 24h.' },
  { icon: '❤️', title: 'Cuidados Paliativos', desc: 'Conforto e qualidade de vida para pacientes graves, com apoio emocional à família.' },
  { icon: '🏥', title: 'Acompanhamento Hospitalar', desc: 'Não deixe quem você ama sozinho. Cuidadores e técnicos acompanham durante internações.' },
  { icon: '👶', title: 'Cuidador Pediátrico', desc: 'Cuidados especializados para crianças com necessidades especiais ou em recuperação.' },
  { icon: '🎓', title: 'Treinamento de Estomia', desc: 'Nossos cuidadores são capacitados para oferecer cuidado seguro e humanizado em estomias.' },
];

const plans = [
  { name: 'Plano Essencial', features: ['Cuidador 12h Diurno', 'Relatório diário de saúde', 'Controle de medicações', 'Suporte à família'], price: 'Valores sob consulta' },
  { name: 'Plano Confort', features: ['Cuidador 12h ou 24h', 'Supervisão de Enfermagem', 'Relatórios semanais', 'Visita mensal de enfermagem', 'Suporte prioritário'], price: 'Valores sob consulta' },
  { name: 'Plano Ouro', features: ['Cuidador 24h completo', 'Supervisão de Enfermagem', 'Acompanhamento nutricional', 'Relatórios diários', 'Suporte 24h exclusivo'], price: 'Valores sob consulta' },
  { name: 'Plano Excellence', features: ['Atendimento 24h completo', 'Supervisão de Enfermagem', 'Fisioterapia inclusa', 'Gestão completa do cuidado', 'Relatórios diários detalhados', 'Suporte 24h para família'], price: 'Valores sob consulta' },
];

// Fotos da galeria — adicione os arquivos em /public com esses nomes
const galleryImages = [
  { src: '/nursing_team.png', alt: 'Equipe Serenya' },
  { src: '/elderly_care.png', alt: 'Cuidado com idosos' },
  { src: '/serenya.png',      alt: 'Serenya Home Care' },
];

export default function Home() {
  return (
    <main style={{ background: 'var(--bg-base)' }}>
      <Navbar />
      <Hero />

      {/* ── SOBRE ── */}
      <section id="sobre" className={`section section-alt`}>
        <div className="container">
          <div className="text-center">
            <div className="section-label">Quem Somos</div>
            <h2 className="section-title">Dedicação e expertise<br />no cuidado domiciliar</h2>
            <p className="section-sub" style={{ margin: '0 auto 50px' }}>
              Somos uma agência especializada em assistência domiciliar humanizada, criada para oferecer cuidado, segurança e qualidade de vida. Nosso objetivo é proporcionar tranquilidade às famílias, garantindo que seus entes queridos recebam cuidados profissionais com amor, respeito e dignidade.
            </p>
          </div>
        </div>
      </section>

      {/* ── GALERIA DE FOTOS ── */}
      <section className={`section ${styles.gallerySection}`}>
        <div className="container">
          <div className="section-label">Nossa Equipe</div>
          <h2 className="section-title">Imagens que falam por si</h2>
          <div className={styles.galleryGrid}>
            {galleryImages.map((img, i) => (
              <div key={i} className={styles.galleryItem}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${img.src}?v=2`} alt={img.alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVIÇOS ── */}
      <section id="servicos" className={`section section-alt`}>
        <div className="container text-center">
          <div className="section-label">O que oferecemos</div>
          <h2 className="section-title">Serviços Especializados</h2>
          <p className="section-sub">Cuidado profissional adaptado a cada paciente</p>
          <div className={styles.servicesGrid}>
            {services.map((s, i) => (
              <div key={i} className={styles.serviceCard}>
                <div className={styles.serviceIcon}>{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLANOS ── */}
      <section id="planos" className="section">
        <div className="container text-center">
          <div className="section-label">Planos Premium</div>
          <h2 className="section-title">Escolha o cuidado ideal</h2>
          <p className="section-sub">Planos personalizados para cada necessidade. Solicite um orçamento via WhatsApp.</p>
          <div className={styles.plansGrid}>
            {plans.map((p, i) => (
              <div key={i} className={styles.planCard}>
                <div className={styles.planName}>{p.name}</div>
                <ul className={styles.planFeatures}>
                  {p.features.map((f, j) => <li key={j}>{f}</li>)}
                </ul>
                <div className={styles.planPrice}>{p.price}</div>
                <Link href={WA_LINK} target="_blank" className="btn btn-outline btn-sm" style={{ marginTop: '20px', textAlign: 'center', justifyContent: 'center' }}>
                  Solicitar Orçamento
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REDES SOCIAIS (igual Enfermeira Feridas) ── */}
      <section id="redes" className={`section section-alt ${styles.socialSection}`}>
        <div className="container">
          <div className="section-label">Redes Sociais</div>
          <h2 className="section-title">Acompanhe Nosso Trabalho</h2>
          <p className="section-sub">Dicas de cuidados, rotinas da equipe e muito mais</p>
          <div className={styles.socialGrid}>
            {/* Instagram */}
            <a
              href="https://www.instagram.com/cuidadosserenya/"
              className={`${styles.socialCard} ${styles.insta}`}
              target="_blank" rel="noreferrer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
              </svg>
              <span>Instagram</span>
              <span className={styles.socialHandle}>@cuidadosserenya</span>
            </a>

            {/* Facebook */}
            <a
              href="https://facebook.com/cuidadosserenya"
              className={`${styles.socialCard} ${styles.fb}`}
              target="_blank" rel="noreferrer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
              <span>Facebook</span>
              <span className={styles.socialHandle}>/cuidadosserenya</span>
            </a>

            {/* WhatsApp */}
            <a
              href={WA_LINK}
              className={`${styles.socialCard} ${styles.wa}`}
              target="_blank" rel="noreferrer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
              </svg>
              <span>WhatsApp</span>
              <span className={styles.socialHandle}>(11) 98955-3812</span>
            </a>
          </div>
        </div>
      </section>

      {/* ── PARCERIA ── */}
      <section id="parceria" className="section">
        <div className="container text-center">
          <div className="section-label">🤝 Parceria Oficial</div>
          <h2 className="section-title">Parceiras de Confiança</h2>
          <p className="section-sub">Trabalhamos juntas para oferecer cuidado completo ao seu familiar</p>
          <div className={styles.parceiraCard}>
            <div className={styles.parceiraLogoWrap}>
              <img src="/serenya-logo.jpg" alt="Serenya" />
            </div>
            <div>
              <h3 className={styles.parceiraName}>Enfermeira Feridas</h3>
              <p className={styles.parceiraDesc}>
                Parceria oficial com especialistas em cuidados de feridas complexas, úlceras e curativos avançados. Quando seu paciente precisa de <strong>cuidados de feridas</strong> combinados com <strong>suporte domiciliar completo</strong>, as duas equipes trabalham juntas para garantir o melhor resultado.
              </p>
              <div className={styles.parceiraActions}>
                <Link href={WA_LINK} target="_blank" className="btn btn-primary btn-sm">
                  💬 WhatsApp Serenya
                </Link>
                <Link href="https://enfermeiraferidas.com.br/#parceiras" target="_blank" className="btn btn-outline btn-sm">
                  Ver Parceria Completa
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTATO ── */}
      <section id="contato" className="section section-alt">
        <div className="container text-center">
          <div className="section-label">Contato</div>
          <h2 className="section-title">Agende sua Avaliação</h2>
          <p className="section-sub">Atendemos Alto Tietê, Guarulhos, ABC e Grande São Paulo</p>
          <div className={styles.contactGrid}>
            <div className={styles.contactCard}>
              <div className={styles.contactIcon}>💬</div>
              <h3>WhatsApp</h3>
              <p>Resposta em até 1 hora</p>
              <Link href={WA_LINK} target="_blank" className="btn btn-wa btn-sm">(11) 98955-3812</Link>
            </div>
            <div className={styles.contactCard}>
              <div className={styles.contactIcon}>📍</div>
              <h3>Área de Atendimento</h3>
              <p>Alto Tietê, Guarulhos, ABC e toda Grande São Paulo</p>
            </div>
            <div className={styles.contactCard}>
              <div className={styles.contactIcon}>⏰</div>
              <h3>Horários</h3>
              <p>Segunda a Sábado, 7h às 20h. Plantões 24h disponíveis.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerGrid}>
            <div className={styles.footerCol}>
              <h4>SERENYA HOME CARE</h4>
              <p>Cuidamos de vidas, acolhemos histórias.</p>
              <p style={{ marginTop: '12px' }}>Email: cuidadosserenya@gmail.com</p>
            </div>
            <div className={styles.footerCol}>
              <h4>Serviços</h4>
              <p>Cuidador de Idosos</p>
              <p>Técnico de Enfermagem</p>
              <p>Cuidados Paliativos</p>
              <p>Acompanhamento Hospitalar</p>
            </div>
            <div className={styles.footerCol}>
              <h4>Contato</h4>
              <p>WhatsApp: (11) 98955-3812</p>
              <p>Instagram: @cuidadosserenya</p>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p>© {new Date().getFullYear()} Serenya Home Care. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Float WhatsApp */}
      <Link href={WA_LINK} target="_blank" className={styles.floatWa} aria-label="WhatsApp">
        💬
      </Link>
    </main>
  );
}
