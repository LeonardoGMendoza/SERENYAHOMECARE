const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'app', 'page.js');
let content = fs.readFileSync(filePath, 'utf8');

const plansTarget = ];\n\n// Itens do Super Carrossel;
const testimonialsData = ];\n\nconst testimonials = [
  { name: 'Amigo de paciente', bairro: 'Vila Verde', text: 'Melhor agência de home care aqui da região. Eles atenderam um familiar e a recuperação foi maravilhosa, obrigado Serenya pela ajuda e carinho.', stars: 5 },
  { name: 'Rosecler Santos', bairro: 'São Paulo - SP', text: 'Profissionais excelentes, muito cuidadosos, atenciosos e comprometidos. Demonstraram muita paciência para explicar todos os cuidados e nos deixaram muito mais tranquilos e seguros. Trataram minha avó com muito amor e carinho. Super recomendo!', stars: 5 },
  { name: 'Sr. Carlos', bairro: 'São Paulo - SP', text: 'Serviço de altíssima qualidade. A equipe veio até minha casa, explicou tudo direitinho e o atendimento foi feito com muito cuidado. Parabéns pelo trabalho!', stars: 5 },
];\n\n// Itens do Super Carrossel;

content = content.replace(plansTarget, testimonialsData);

const redesTarget = {/* 🌟 REDES SOCIAIS (igual Enfermeira Feridas) 🌟 */};
const depoimentosHTML = {/* 🌟 DEPOIMENTOS 🌟 */}
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

      {/* 🌟 REDES SOCIAIS (igual Enfermeira Feridas) 🌟 */};

content = content.replace(redesTarget, depoimentosHTML);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Feito!');