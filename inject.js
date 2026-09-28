const fs = require('fs');
let content = fs.readFileSync('app/page.js', 'utf8');

const depoimentosHTML = `
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
`;

const regex = /\s*\{\/\*.*?REDES SOCIAIS.*?\*\/\}\s*/;

if (regex.test(content)) {
    content = content.replace(regex, (match) => depoimentosHTML + match);
    fs.writeFileSync('app/page.js', content, 'utf8');
    console.log('Success!');
} else {
    console.log('Anchor not found');
}