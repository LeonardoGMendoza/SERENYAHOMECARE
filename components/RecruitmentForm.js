'use client';
import { useState } from 'react';
import styles from '../app/page.module.css';

export default function RecruitmentForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tamanho (máximo 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('O currículo deve ter no máximo 10MB.');
        e.target.value = '';
        setFileName('');
        return;
      }
      // Validar formato (PDF, DOC, DOCX)
      const allowedTypes = ['.pdf', '.doc', '.docx'];
      const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      if (!allowedTypes.includes(fileExtension)) {
        setError('Formato inválido. Envie apenas PDF ou Word (.doc, .docx).');
        e.target.value = '';
        setFileName('');
        return;
      }

      setError('');
      setFileName(file.name);
    } else {
      setFileName('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.target);

    try {
      const res = await fetch('/api/recrutamento', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();

      if (res.ok) {
        setSuccess(true);
      } else {
        setError(result.error || 'Erro ao enviar candidatura. Tente novamente.');
      }
    } catch (err) {
      console.error(err);
      setError('Erro de conexão. Verifique sua internet e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={styles.successCard}>
        <div className={styles.successIcon}>🎉</div>
        <h3>Candidatura Enviada!</h3>
        <p>Agradecemos o interesse em fazer parte da equipe Serenya Home Care. Seu currículo foi registrado com sucesso e nossa equipe de enfermagem entrará em contato em breve caso seu perfil seja selecionado.</p>
      </div>
    );
  }

  return (
    <div className={styles.recruitmentForm}>
      <form onSubmit={handleSubmit}>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="nome">Nome Completo *</label>
            <input
              type="text"
              id="nome"
              name="nome"
              className={styles.formInput}
              required
              placeholder="Digite seu nome completo"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">E-mail *</label>
            <input
              type="email"
              id="email"
              name="email"
              className={styles.formInput}
              required
              placeholder="seu.email@exemplo.com"
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="telefone">WhatsApp / Telefone *</label>
            <input
              type="tel"
              id="telefone"
              name="telefone"
              className={styles.formInput}
              required
              placeholder="(00) 90000-0000"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="cidade">Cidade / UF *</label>
            <input
              type="text"
              id="cidade"
              name="cidade"
              className={styles.formInput}
              required
              placeholder="Ex: Mogi das Cruzes - SP"
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="cargo">Cargo Pretendido *</label>
          <select id="cargo" name="cargo" className={styles.formSelect} required>
            <option value="">Selecione...</option>
            <option value="Cuidador(a) de Idosos">Cuidador(a) de Idosos</option>
            <option value="Técnico(a) de Enfermagem">Técnico(a) de Enfermagem</option>
            <option value="Enfermeiro(a)">Enfermeiro(a)</option>
            <option value="Outros">Outros cargos de saúde</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="experiencia">Resumo da Experiência Profissional</label>
          <textarea
            id="experiencia"
            name="experiencia"
            className={styles.formTextarea}
            placeholder="Conte-nos brevemente sobre sua experiência em cuidados domiciliares, cursos realizados, etc..."
          />
        </div>

        <div className={styles.formGroup}>
          <label>Anexar Currículo (PDF ou Word) *</label>
          <div className={styles.fileInputWrapper}>
            <input
              type="file"
              name="curriculo"
              className={styles.fileInput}
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              required
            />
            <div className={styles.fileLabel}>
              {fileName ? (
                <>
                  <span>Arquivo selecionado:</span>
                  <strong>{fileName}</strong>
                </>
              ) : (
                <>
                  <span>Clique ou arraste para anexar o arquivo</span>
                  <small>Formatos aceitos: PDF ou Word (.doc, .docx). Máx: 10MB</small>
                </>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div style={{ color: '#d84a4a', fontWeight: 'bold', fontSize: '0.9rem', marginTop: '10px' }}>
            ⚠️ {error}
          </div>
        )}

        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? 'Enviando Currículo...' : 'Enviar Candidatura'}
        </button>
      </form>
    </div>
  );
}
