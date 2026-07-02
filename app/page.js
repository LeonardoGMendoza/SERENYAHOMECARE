import Link from 'next/link';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import styles from './page.module.css';

export default function Home() {
  const whatsappLink = "https://wa.me/5511914339705?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20os%20cuidados%20da%20Serenya.";

  return (
    <main>
      <Navbar />
      <Hero />

      {/* Sobre Nós */}
      <section id="quem-somos" className={`section ${styles.aboutSection}`}>
        <div className={`container ${styles.aboutGrid}`}>
          <div className={styles.aboutContent}>
            <h2>Sobre a Serenya Home Care</h2>
            <p>
              Somos uma empresa especializada em assistência domiciliar humanizada, criada para oferecer cuidado, segurança e qualidade de vida a pessoas que necessitam de acompanhamento em suas próprias residências.
            </p>
            <p>
              Nosso objetivo é proporcionar tranquilidade às famílias, garantindo que seus entes queridos recebam cuidados profissionais, personalizados e realizados com amor, respeito e dignidade.
            </p>
          </div>
          <div style={{ backgroundColor: 'var(--beige-dark)', borderRadius: 'var(--border-radius)', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Espaço para Imagem futuramente */}
            <p style={{color: 'var(--sage-green-dark)'}}>Imagens de Cuidado e Carinho</p>
          </div>
        </div>
      </section>

      {/* Serviços */}
      <section id="servicos" className={`section ${styles.servicesSection}`}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Nossos Serviços Especiais</h2>
          <div className={styles.servicesGrid}>
            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>👵</div>
              <h3>Cuidador de Idosos</h3>
              <p>Assistência diária, controle de medicações e auxílio na mobilidade com muito amor e respeito.</p>
            </div>
            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>🩺</div>
              <h3>Técnico de Enfermagem</h3>
              <p>Procedimentos complexos, plantões de 12h ou 24h com profissionais altamente capacitados.</p>
            </div>
            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>❤️</div>
              <h3>Cuidados Paliativos</h3>
              <p>Conforto e qualidade de vida para pacientes com doenças graves e apoio emocional à família.</p>
            </div>
            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>🏥</div>
              <h3>Acompanhamento Hospitalar</h3>
              <p>Não deixe quem você ama sozinho. Nossos cuidadores e técnicos acompanham durante internações.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Planos Premium */}
      <section id="planos" className={`section ${styles.plansSection}`}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Planos Premium Serenya</h2>
          <div className={styles.plansGrid}>
            
            <div className={styles.planCard}>
              <h3 className={styles.planName}>Plano Essencial</h3>
              <ul className={styles.planFeatures}>
                <li>Cuidador 12h</li>
                <li>Relatório diário</li>
                <li>Suporte à família</li>
              </ul>
              <div className={styles.planPrice}>
                A partir de R$ 4.500/mês
              </div>
            </div>

            <div className={styles.planCard}>
              <h3 className={styles.planName}>Plano Confort</h3>
              <ul className={styles.planFeatures}>
                <li>Cuidador 12h/24h</li>
                <li>Supervisão de Enfermagem</li>
                <li>Relatórios semanais</li>
                <li>Visita mensal de enfermagem</li>
              </ul>
              <div className={styles.planPrice}>
                A partir de R$ 6.500/mês
              </div>
            </div>

            <div className={styles.planCard}>
              <h3 className={styles.planName}>Plano Excellence</h3>
              <ul className={styles.planFeatures}>
                <li>Atendimento 24h</li>
                <li>Supervisão de Enfermagem</li>
                <li>Fisioterapia</li>
                <li>Gestão completa do cuidado</li>
              </ul>
              <div className={styles.planPrice}>
                A partir de R$ 13.000/mês
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={`container`}>
          <div className={styles.footerGrid}>
            <div className={styles.footerCol}>
              <h4>SERENYA HOME CARE</h4>
              <p>Cuidamos de vidas, acolhemos histórias.</p>
            </div>
            <div className={styles.footerCol}>
              <h4>Contato</h4>
              <p>WhatsApp: (11) 91433-9705</p>
              <p>WhatsApp Dir: (11) 97499-5342</p>
              <p>Email: cuidadosserenya@gmail.com</p>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p>&copy; 2026 Serenya Home Care. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Botão Flutuante WhatsApp */}
      <Link href={whatsappLink} target="_blank" className={styles.floatWhatsapp} aria-label="Fale conosco no WhatsApp">
        💬
      </Link>
    </main>
  );
}
