'use client';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import styles from './colaborador.module.css';

export default function ColaboradorPortal() {
  const { data: session, status } = useSession();
  const [pacientes, setPacientes] = useState([]);
  const [loadingPacientes, setLoadingPacientes] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [erro, setErro] = useState('');

  const [form, setForm] = useState({
    pacienteId: '',
    pacienteNome: '',
    turno: 'Diurno',
    pressaoArterial: '',
    temperatura: '',
    frequenciaCardiaca: '',
    glicemia: '',
    banho: false,
    alimentacao: 'Aceitou tudo',
    eliminacoes: 'Diurese e Evacuação presentes',
    medicacoes: 'Administradas nos horários corretos',
    relatoPlantao: ''
  });

  // Carregar pacientes apenas se o usuário estiver autenticado
  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/pacientes')
        .then(r => r.json())
        .then(data => {
          setPacientes(Array.isArray(data) ? data : []);
          setLoadingPacientes(false);
        })
        .catch(() => setLoadingPacientes(false));
    }
  }, [status]);

  const handlePacienteChange = (e) => {
    const pId = e.target.value;
    const p = pacientes.find(item => String(item.id) === String(pId));
    setForm(prev => ({
      ...prev,
      pacienteId: pId,
      pacienteNome: p ? p.nome : ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.pacienteId) {
      setErro('Por favor, selecione o paciente.');
      return;
    }
    setLoading(true);
    setErro('');

    try {
      const res = await fetch('/api/relatorios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
      } else {
        setErro(data.error || 'Erro ao enviar o relatório diário.');
      }
    } catch (err) {
      console.error(err);
      setErro('Erro de conexão. Verifique sua rede.');
    } finally {
      setLoading(false);
    }
  };

  // 1. Carregamento Inicial
  if (status === 'loading') {
    return (
      <div className={styles.page}>
        <div style={{ margin: 'auto', textAlign: 'center', color: '#666' }}>
          <p>Verificando credenciais...</p>
        </div>
      </div>
    );
  }

  // 2. Tela de Login (Se Deslogado)
  if (status === 'unauthenticated') {
    return (
      <div className={styles.page}>
        <div className={styles.bg}>
          <div className={styles.blob1} />
          <div className={styles.blob2} />
        </div>

        <div className={styles.loginCard}>
          <div className={styles.logo}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/serenya-logo.jpg" alt="Serenya" className={styles.logoImg} />
            <div>
              <div className={styles.logoName}>SERENYA</div>
              <div className={styles.logoSub}>HOME CARE — Portal da Equipe</div>
            </div>
          </div>

          <h1 className={styles.title}>Portal do Colaborador</h1>
          <p className={styles.subtitle}>
            Espaço de preenchimento para Cuidadores, Técnicos de Enfermagem e Enfermeiros.
          </p>

          <button className={styles.googleBtn} onClick={() => signIn('google', { callbackUrl: '/colaborador' })}>
            <svg className={styles.googleIcon} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
            Entrar com Google
          </button>

          <a href="/" className={styles.backLink}>← Voltar ao site principal</a>
        </div>
      </div>
    );
  }

  // 3. Tela de Sucesso (Se relatório enviado)
  if (success) {
    return (
      <div className={styles.page}>
        <div className={styles.successCard}>
          <div className={styles.successIcon}>🎉</div>
          <h2>Relatório Enviado!</h2>
          <p>O registro do plantão foi salvo com sucesso. A gerência da Serenya já pode visualizá-lo.</p>
          <button 
            className={styles.btnBack} 
            onClick={() => {
              setSuccess(false);
              setForm({
                pacienteId: '',
                pacienteNome: '',
                turno: 'Diurno',
                pressaoArterial: '',
                temperatura: '',
                frequenciaCardiaca: '',
                glicemia: '',
                banho: false,
                alimentacao: 'Aceitou tudo',
                eliminacoes: 'Diurese e Evacuação presentes',
                medicacoes: 'Administradas nos horários corretos',
                relatoPlantao: ''
              });
            }}
          >
            ✍️ Enviar Novo Relatório
          </button>
        </div>
      </div>
    );
  }

  // 4. Tela do Formulário (Se Logado)
  const isDiretora = session.user.role === 'diretora';

  return (
    <div className={styles.page}>
      <div className={styles.formContainer}>
        
        {/* Cabeçalho do Portal */}
        <header className={styles.formHeader}>
          <div className={styles.userMiniInfo}>
            <div className={styles.avatar}>🩺</div>
            <div>
              <div style={{ fontWeight: 700, color: '#1a1a1a' }}>Olá, {session.user.name}</div>
              <button onClick={() => signOut({ callbackUrl: '/colaborador' })} className={styles.logoutBtn}>
                Sair da conta
              </button>
            </div>
          </div>
          {isDiretora && (
            <a href="/dashboard" className={styles.linkAdmin}>
              ← Ir para o Painel
            </a>
          )}
        </header>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className={styles.formCard}>
          <div>
            <h2 className={styles.sectionTitle}>👤 Identificação do Plantão</h2>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Paciente *</label>
                {loadingPacientes ? (
                  <select className={styles.select} disabled><option>Carregando pacientes...</option></select>
                ) : (
                  <select 
                    className={styles.select} 
                    required 
                    value={form.pacienteId} 
                    onChange={handlePacienteChange}
                  >
                    <option value="">Selecione o paciente...</option>
                    {pacientes.map(p => (
                      <option key={p.id} value={p.id}>{p.nome}</option>
                    ))}
                  </select>
                )}
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Turno *</label>
                <select 
                  className={styles.select} 
                  required 
                  value={form.turno} 
                  onChange={e => setForm({ ...form, turno: e.target.value })}
                >
                  <option value="Diurno">☀️ Diurno</option>
                  <option value="Noturno">🌙 Noturno</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <h2 className={styles.sectionTitle}>🩺 Sinais Vitais</h2>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Pressão Arterial (PA)</label>
                <input 
                  type="text" 
                  className={styles.input} 
                  placeholder="Ex: 12/8 ou 120/80" 
                  value={form.pressaoArterial}
                  onChange={e => setForm({ ...form, pressaoArterial: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Temperatura (°C)</label>
                <input 
                  type="text" 
                  className={styles.input} 
                  placeholder="Ex: 36.5" 
                  value={form.temperatura}
                  onChange={e => setForm({ ...form, temperatura: e.target.value })}
                />
              </div>
            </div>
            <div className={styles.formRow} style={{ marginTop: '20px' }}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Frequência Cardíaca (FC)</label>
                <input 
                  type="text" 
                  className={styles.input} 
                  placeholder="Ex: 75 bpm" 
                  value={form.frequenciaCardiaca}
                  onChange={e => setForm({ ...form, frequenciaCardiaca: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Glicemia Capilar (HGT)</label>
                <input 
                  type="text" 
                  className={styles.input} 
                  placeholder="Ex: 110 mg/dL" 
                  value={form.glicemia}
                  onChange={e => setForm({ ...form, glicemia: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className={styles.sectionTitle}>🍎 Alimentação, Higiene e Medicamentos</h2>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Aceitação Alimentar</label>
                <select 
                  className={styles.select} 
                  value={form.alimentacao} 
                  onChange={e => setForm({ ...form, alimentacao: e.target.value })}
                >
                  <option value="Aceitou tudo">Aceitou tudo</option>
                  <option value="Aceitou parcialmente">Aceitou parcialmente</option>
                  <option value="Recusou alimentação">Recusou alimentação</option>
                  <option value="Apenas líquidos">Apenas líquidos</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Eliminações (Diurese/Fezes)</label>
                <input 
                  type="text" 
                  className={styles.input} 
                  placeholder="Ex: Ambas presentes, Diurese normal, etc." 
                  value={form.eliminacoes}
                  onChange={e => setForm({ ...form, eliminacoes: e.target.value })}
                />
              </div>
            </div>

            <div className={styles.formRow} style={{ marginTop: '20px' }}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Administração de Medicamentos</label>
                <select 
                  className={styles.select} 
                  value={form.medicacoes} 
                  onChange={e => setForm({ ...form, medicacoes: e.target.value })}
                >
                  <option value="Administradas nos horários corretos">Administradas nos horários corretos</option>
                  <option value="Administradas com atraso (ver relato)">Administradas com atraso (ver relato)</option>
                  <option value="Não administradas (ver relato)">Não administradas (ver relato)</option>
                </select>
              </div>
              <div className={styles.formGroup} style={{ justifyContent: 'center' }}>
                <label className={styles.checkboxGroup}>
                  <input 
                    type="checkbox" 
                    className={styles.checkbox} 
                    checked={form.banho} 
                    onChange={e => setForm({ ...form, banho: e.target.checked })}
                  />
                  <span style={{ fontWeight: 600, color: '#444', fontSize: '0.95rem' }}>🧼 Banho / Higiene Realizado</span>
                </label>
              </div>
            </div>
          </div>

          <div>
            <h2 className={styles.sectionTitle}>✍️ Observações e Intercorrências</h2>
            <div className={styles.formGroup}>
              <label className={styles.label}>Relato Detalhado do Plantão</label>
              <textarea 
                className={styles.textarea} 
                placeholder="Descreva a rotina, o comportamento do paciente, se houve dores, vômitos, picos de pressão ou qualquer observação relevante..." 
                value={form.relatoPlantao}
                onChange={e => setForm({ ...form, relatoPlantao: e.target.value })}
              />
            </div>
          </div>

          {erro && <div style={{ color: '#d84a4a', fontWeight: 'bold', fontSize: '0.95rem' }}>⚠️ {erro}</div>}

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Enviando Relatório...' : 'Enviar Relatório Diário'}
          </button>
        </form>

      </div>
    </div>
  );
}
