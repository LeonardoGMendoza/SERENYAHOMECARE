import Link from 'next/link';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import CopyEmailButton from '../components/CopyEmailButton';
import RecruitmentForm from '../components/RecruitmentForm';
import Carousel from '../components/Carousel';
import styles from './page.module.css';
const WA_LINK = "https://wa.me/5511974995342?text=OlÃ¡!%20Gostaria%20de%20saber%20mais%20sobre%20os%20cuidados%20da%20Serenya.";

const services = [
  { icon: 'ðŸ‘µ', title: 'Cuidador de Idosos', desc: 'AssistÃªncia diÃ¡ria, controle de medicaÃ§Ãµes, auxÃ­lio na mobilidade e higiene com amor e respeito.' },
  { icon: 'ðŸ©º', title: 'TÃ©cnico de Enfermagem', desc: 'Procedimentos complexos, sondas, curativos avanÃ§ados â€” plantÃµes de 12h ou 24h.' },
  { icon: 'â¤ï¸', title: 'Cuidados Paliativos', desc: 'Conforto e qualidade de vida para pacientes graves, com apoio emocional Ã  famÃ­lia.' },
  { icon: 'ðŸ¥', title: 'Acompanhamento Hospitalar', desc: 'NÃ£o deixe quem vocÃª ama sozinho. Cuidadores e tÃ©cnicos acompanham durante internaÃ§Ãµes.' },
  { icon: 'ðŸ‘¶', title: 'Cuidador PediÃ¡trico', desc: 'Cuidados especializados para crianÃ§as com necessidades especiais ou em recuperaÃ§Ã£o.' },
  { icon: 'ðŸŽ“', title: 'Treinamento de Estomia', desc: 'Nossos cuidadores sÃ£o capacitados para oferecer cuidado seguro e humanizado em estomias.' },
];

const plans = [
  { name: 'Plano Essencial', features: ['Cuidador 12h Diurno', 'RelatÃ³rio diÃ¡rio de saÃºde', 'Controle de medicaÃ§Ãµes', 'Suporte Ã  famÃ­lia'], price: 'Valores sob consulta' },
  { name: 'Plano Confort', features: ['Cuidador 12h ou 24h', 'SupervisÃ£o de Enfermagem', 'RelatÃ³rios semanais', 'Visita mensal de enfermagem', 'Suporte prioritÃ¡rio'], price: 'Valores sob consulta' },
  { name: 'Plano Ouro', features: ['Cuidador 24h completo', 'SupervisÃ£o de Enfermagem', 'Acompanhamento nutricional', 'RelatÃ³rios diÃ¡rios', 'Suporte 24h exclusivo'], price: 'Valores sob consulta' },
  { name: 'Plano Excellence', features: ['Atendimento 24h completo', 'SupervisÃ£o de Enfermagem', 'Fisioterapia inclusa', 'GestÃ£o completa do cuidado', 'RelatÃ³rios diÃ¡rios detalhados', 'Suporte 24h para famÃ­lia'], price: 'Valores sob consulta' },
];

const testimonials = [
  { name: 'Amigo de paciente', bairro: 'Vila Verde', text: 'Melhor agÃªncia de home care aqui da regiÃ£o. Eles atenderam um familiar e a recuperaÃ§Ã£o foi maravilhosa, obrigado Serenya pela ajuda e carinho.', stars: 5 },
  { name: 'Rosecler Santos', bairro: 'SÃ£o Paulo - SP', text: 'Profissionais excelentes, muito cuidadosos, atenciosos e comprometidos. Demonstraram muita paciÃªncia para explicar todos os cuidados e nos deixaram muito mais tranquilos e seguros. Trataram minha avÃ³ com muito amor e carinho. Super recomendo!', stars: 5 },
  { name: 'Sr. Carlos', bairro: 'SÃ£o Paulo - SP', text: 'ServiÃ§o de altÃ­ssima qualidade. A equipe veio atÃ© minha casa, explicou tudo direitinho e o atendimento foi feito com muito cuidado. ParabÃ©ns pelo trabalho!', stars: 5 },
];

// Itens do Super Carrossel (Fotos Locais + VÃ­deo Destaque + Instagram Feed)
const mixedCarouselItems = [
  { type: 'image', src: '/nursing_team.png', alt: 'Equipe Serenya' },
  { type: 'image', src: '/elderly_care.png', alt: 'Cuidado com idosos' },
  { type: 'image', src: '/serenya.png', alt: 'Serenya Home Care' },
  { type: 'instagram', src: 'https://www.instagram.com/p/DbkAD30ytpc' }, // VÃ­deo Destaque
  { type: 'instagram', src: 'https://www.instagram.com/p/DbXwzaUFgHN' },
  { type: 'instagram', src: 'https://www.instagram.com/p/DayqxSZpeNZ' },
  { type: 'instagram', src: 'https://www.instagram.com/p/DaWmuuKy0Bn' },
  { type: 'instagram', src: 'https://www.instagram.com/p/DZ_bLm9DULn' },
  { type: 'instagram', src: 'https://www.instagram.com/p/DZv_U7QjbGh' },
];

export default function Home() {
  return (
    <main style={{ background: 'var(--bg-base)' }}>
      <Navbar />
      <Hero />

      {/* â”€â”€ SOBRE â”€â”€ */}
      <section id="sobre" className={`section section-alt`}>
        <div className="container">
          <div className="text-center">
            <div className="section-label">Quem Somos</div>
            <h2 className="section-title">DedicaÃ§Ã£o e expertise<br />no cuidado domiciliar</h2>
            <p className="section-sub" style={{ margin: '0 auto 50px' }}>
              Somos uma agÃªncia especializada em assistÃªncia domiciliar humanizada, criada para oferecer cuidado, seguranÃ§a e qualidade de vida. Nosso objetivo Ã© proporcionar tranquilidade Ã s famÃ­lias, garantindo que seus entes queridos recebam cuidados profissionais com amor, respeito e dignidade.
            </p>
          </div>
        </div>
      </section>

      {/* â”€â”€ SUPER CARROSSEL (FOTOS + VÃDEOS + INSTAGRAM) â”€â”€ */}
      <section id="galeria-mista" className={`section section-alt`}>
        <div className="container text-center">
          <div className="section-label">Nossa Equipe</div>
          <h2 className="section-title">Imagens que falam por si</h2>
          <p className="section-sub" style={{ marginBottom: '40px' }}>
            Acompanhe nossa rotina de cuidados e treinamentos diretamente pelo nosso Instagram.
          </p>
          <Carousel items={mixedCarouselItems} autoPlay={true} interval={4000} />
        </div>
      </section>

      {/* â”€â”€ SERVIÃ‡OS â”€â”€ */}
      <section id="servicos" className={`section section-alt`}>
        <div className="container text-center">
          <div className="section-label">O que oferecemos</div>
          <h2 className="section-title">ServiÃ§os Especializados</h2>
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

      {/* â”€â”€ PLANOS â”€â”€ */}
      <section id="planos" className="section">
        <div className="container text-center">
          <div className="section-label">Planos Premium</div>
          <h2 className="section-title">Escolha o cuidado ideal</h2>
          <p className="section-sub">Planos personalizados para cada necessidade. Solicite um orÃ§amento via WhatsApp.</p>
          <div className={styles.plansGrid}>
            {plans.map((p, i) => (
              <div key={i} className={styles.planCard}>
                <div className={styles.planName}>{p.name}</div>
                <ul className={styles.planFeatures}>
                  {p.features.map((f, j) => <li key={j}>{f}</li>)}
                </ul>
                <div className={styles.planPrice}>{p.price}</div>
                <Link href={WA_LINK} target="_blank" className="btn btn-outline btn-sm" style={{ marginTop: '20px', textAlign: 'center', justifyContent: 'center' }}>
                  Solicitar OrÃ§amento
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* â”€â”€ REDES SOCIAIS (igual Enfermeira Feridas) â”€â”€ */}
            {/* 🌟 DEPOIMENTOS 🌟 */}
      <section className="section" id="depoimentos">
        <div className="container text-center">
          <div className="section-label">O que dizem nossos pacientes</div>
          <h2 className="section-title">Depoimentos</h2>
          <p className="section-sub">A satisfação de nossos pacientes é nossa maior recompensa</p>
          
          <div className={styles.testimonialsGrid}>
            {testimonials.map((t, i) => (
              <div key={i} className={styles.testimonialCard}>
                <div className={styles.testimonialStars}>
                  {'★'.repeat(t.stars)}
                </div>
                <p className={styles.testimonialText}>"{t.text}"</p>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.testimonialAvatar}>{t.name.charAt(0)}</div>
                  <div>
                    <div className={styles.testimonialName}>{t.name}</div>
                    <div className={styles.testimonialBairro}>📍 {t.bairro}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Chamada para Avaliação */}
          <div style={{ marginTop: '40px', textAlign: 'center', background: 'rgba(74,140,82,0.05)', padding: '30px', borderRadius: '16px', border: '1px solid rgba(74,140,82,0.1)' }}>
            <h3 style={{ fontSize: '20px', marginBottom: '10px', color: 'var(--text-primary)' }}>Já foi atendido por nós?</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Sua opinião é muito importante. Ajude outras pessoas a encontrarem um cuidado humanizado e especializado.
            </p>
            <a 
              href="https://g.page/r/CdR8uWI63QTYEBM/review" 
              target="_blank" 
              rel="noreferrer" 
              className="btn btn-green"
              style={{ display: 'inline-flex', padding: '12px 24px', fontSize: '16px' }}
            >
              ⭐ Deixe sua avaliação no Google
            </a>
          </div>
        </div>
      </section>

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
              <span className={styles.socialHandle}>(11) 97499-5342</span>
            </a>
          </div>
        </div>
      </section>

      {/* â”€â”€ PARCERIA â”€â”€ */}
      <section id="parceria" className="section">
        <div className="container text-center">
          <div className="section-label">ðŸ¤ Parceria Oficial</div>
          <h2 className="section-title">Parceiras de ConfianÃ§a</h2>
          <p className="section-sub">Trabalhamos juntas para oferecer cuidado completo ao seu familiar</p>
          <div className={styles.parceiraCard}>
            <div className={styles.parceiraLogoWrap}>
              <img src="/serenya-logo.jpg" alt="Serenya" />
            </div>
            <div>
              <h3 className={styles.parceiraName}>Enfermeira Feridas</h3>
              <p className={styles.parceiraDesc}>
                Parceria oficial com especialistas em cuidados de feridas complexas, Ãºlceras e curativos avanÃ§ados. Quando seu paciente precisa de <strong>cuidados de feridas</strong> combinados com <strong>suporte domiciliar completo</strong>, as duas equipes trabalham juntas para garantir o melhor resultado.
              </p>
              <div className={styles.parceiraActions}>
                <Link href="https://enfermeiraferidas.com.br/#parceiras" target="_blank" className="btn btn-outline btn-sm">
                  Ver Parceria Completa
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* â”€â”€ CONTATO â”€â”€ */}
      <section id="contato" className="section section-alt">
        <div className="container text-center">
          <div className="section-label">Contato</div>
          <h2 className="section-title">Agende sua AvaliaÃ§Ã£o</h2>
          <p className="section-sub">Atendemos Alto TietÃª, Guarulhos, ABC e Grande SÃ£o Paulo</p>
          <div className={styles.contactGrid}>
            <div className={styles.contactCard}>
              <div className={styles.contactIcon}>ðŸ’¬</div>
              <h3>WhatsApp</h3>
              <p>Resposta em atÃ© 1 hora</p>
              <Link href={WA_LINK} target="_blank" className="btn btn-wa btn-sm">(11) 97499-5342</Link>
            </div>
            <div className={styles.contactCard}>
              <div className={styles.contactIcon}>ðŸ“</div>
              <h3>Ãrea de Atendimento</h3>
              <p>Alto TietÃª, Guarulhos, ABC e toda Grande SÃ£o Paulo</p>
            </div>
            <div className={styles.contactCard}>
              <div className={styles.contactIcon}>â°</div>
              <h3>HorÃ¡rios</h3>
              <p>Segunda a SÃ¡bado, 7h Ã s 20h. PlantÃµes 24h disponÃ­veis.</p>
            </div>
          </div>
        </div>
      </section>

      {/* â”€â”€ TRABALHE CONOSCO â”€â”€ */}
      <section id="trabalhe-conosco" className="section">
        <div className="container text-center">
          <div className="section-label">FaÃ§a parte da equipe</div>
          <h2 className="section-title">Trabalhe Conosco</h2>
          <p className="section-sub" style={{ maxWidth: '600px', margin: '0 auto 10px' }}>
            VocÃª Ã© Cuidador(a), TÃ©cnico(a) de Enfermagem ou Enfermeiro(a) e ama cuidar de pessoas com humanizaÃ§Ã£o e respeito? Junte-se Ã  famÃ­lia Serenya!
          </p>
          <RecruitmentForm />
        </div>
      </section>

      {/* â”€â”€ FOOTER â”€â”€ */}
      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerGrid}>
            <div className={styles.footerCol}>
              <h4>SERENYA HOME CARE</h4>
              <p>Cuidamos de vidas, acolhemos histÃ³rias.</p>
              <p style={{ marginTop: '12px' }}>Email: cuidadosserenya@gmail.com</p>
            </div>
            <div className={styles.footerCol}>
              <h4>ServiÃ§os</h4>
              <p>Cuidador de Idosos</p>
              <p>TÃ©cnico de Enfermagem</p>
              <p>Cuidados Paliativos</p>
              <p>Acompanhamento Hospitalar</p>
            </div>
            <div className={styles.footerCol}>
              <h4>Contato</h4>
              <p>WhatsApp: (11) 97499-5342</p>
              <p>Instagram: @cuidadosserenya</p>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p>Â© {new Date().getFullYear()} Serenya Home Care. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Float WhatsApp */}
      <Link href={WA_LINK} target="_blank" className={styles.floatWa} aria-label="WhatsApp">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
        Como posso te ajudar?
      </Link>
    </main>
  );
}

