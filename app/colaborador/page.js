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
    turno: 'Diurno A',
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

  // Carregar pacientes apenas se o usuário for volante (sem pacientes designados)
  useEffect(() => {
    if (status === 'authenticated') {
      const designados = session?.user?.pacientesDesignados || [];
      if (designados.length === 0) {
        // cuidadora volante: busca todos os pacientes
        fetch('/api/pacientes')
          .then(r => r.json())
          .then(data => {
            setPacientes(Array.isArray(data) ? data : []);
            setLoadingPacientes(false);
          })
          .catch(() => setLoadingPacientes(false));
      } else {
        setPacientes(designados);
        setLoadingPacientes(false);
      }
    }
  }, [status, session]);

  // Pré-selecionar se só tiver 1 paciente designado
  useEffect(() => {
    if (status === 'authenticated') {
      const designados = session?.user?.pacientesDesignados || [];
      if (designados.length === 1) {
        setForm(prev => ({
          ...prev,
          pacienteId: String(designados[0].id),
          pacienteNome: designados[0].nome
        }));
      }
    }
  }, [status, session]);

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

  const novaResposta = () => {
    setSuccess(false);
    const designados = session?.user?.pacientesDesignados || [];
    setForm({
      pacienteId: designados.length === 1 ? String(designados[0].id) : '',
      pacienteNome: designados.length === 1 ? designados[0].nome : '',
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
  };

  if (status === 'loading') {
    return <div className={styles.loadingScreen}>Carregando portal do colaborador...</div>;
  }

  // Se não estiver logado
  if (status === 'unauthenticated') {
    return (
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <div className={styles.logoContainer}>
            <span className={styles.logoIcon}>🌸</span>
            <span className={styles.logoText}>Serenya</span>
          </div>
          <h1 className={styles.title}>Portal do Colaborador</h1>
          <p className={styles.subtitle}>
            Acesso exclusivo para Cuidadores, Técnicos e Enfermeiros. Faça login para enviar seus relatórios de plantão.
          </p>

          <button onClick={() => signIn('google', { callbackUrl: '/colaborador' })} className={styles.googleBtn}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '10px' }}>
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Entrar com Google (E-mail Autorizado)
          </button>

          <p style={{ marginTop: '20px', fontSize: '0.9rem', color: '#666' }}>
            Não tem uma conta Gmail autorizada?
          </p>
          <a href="/dashboard/login" className={styles.linkSecondary}>
            Acessar com Senha Tradicional
          </a>
        </div>
      </div>
    );
  }

  // Se logado
  const isDiretora = session.user.role === 'diretora';

  return (
    <div className={styles.appContainer}>
      {/* Cabeçalho */}
      <div className={styles.headerSpacer}>
        <header className={styles.header}>
          <div className={styles.headerInner}>
            <div className={styles.logoContainer}>
              <span className={styles.logoIcon}>🌸</span>
              <span className={styles.logoText}>Serenya</span>
            </div>
            <div className={styles.userInfo}>
              {session.user.image ? (
                <img src={session.user.image} alt={session.user.name} className={styles.avatar} />
              ) : (
                <div className={styles.avatarPlaceholder}>{session.user.name?.charAt(0) || 'U'}</div>
              )}
              <div className={styles.userDetails}>
                <span className={styles.userName}>{session.user.name?.split(' ')[0]}</span>
                <span className={styles.userRole}>
                  {isDiretora ? 'Diretoria' : session.user.role === 'tecnico' ? 'Técnico(a)' : session.user.role === 'enfermeira' ? 'Enfermeiro(a)' : 'Cuidador(a)'}
                </span>
              </div>
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
                {pacientes.length === 1 ? (
                  <input
                    type="text"
                    className={styles.input}
                    style={{ background: '#f9f9f9', color: '#555', fontWeight: 'bold', border: '1px solid #e2e8f0' }}
                    disabled
                    value={pacientes[0].nome}
                  />
                ) : loadingPacientes ? (
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
                  <option value="Diurno A">Diurno A (12h) — 07h às 19h</option>
                  <option value="Diurno B">Diurno B (12h) — 07h às 19h</option>
                  <option value="Noturno A">Noturno A (12h) — 19h às 07h</option>
                  <option value="Noturno B">Noturno B (12h) — 19h às 07h</option>
                  <option value="24 Horas">Plantão 24h</option>
                  <option value="Avulso">Cobertura / Avulso</option>
                </select>
              </div>
            </div>
          </div>

          <div className={styles.divider}></div>

          <div>
            <h2 className={styles.sectionTitle}>❤️ Sinais Vitais (Opcional)</h2>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Pressão Arterial</label>
                <input 
                  type="text" 
                  className={styles.input} 
                  placeholder="Ex: 120/80" 
                  value={form.pressaoArterial}
                  onChange={e => setForm({ ...form, pressaoArterial: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Freq. Cardíaca</label>
                <input 
                  type="text" 
                  className={styles.input} 
                  placeholder="Ex: 75 bpm" 
                  value={form.frequenciaCardiaca}
                  onChange={e => setForm({ ...form, frequenciaCardiaca: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Temperatura</label>
                <input 
                  type="text" 
                  className={styles.input} 
                  placeholder="Ex: 36.5 °C" 
                  value={form.temperatura}
                  onChange={e => setForm({ ...form, temperatura: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Glicemia</label>
                <input 
                  type="text" 
                  className={styles.input} 
                  placeholder="Ex: 95 mg/dL" 
                  value={form.glicemia}
                  onChange={e => setForm({ ...form, glicemia: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className={styles.divider}></div>

          <div>
            <h2 className={styles.sectionTitle}>📋 Rotina do Dia</h2>
            
            <label className={styles.checkboxLabel}>
              <input 
                type="checkbox" 
                checked={form.banho}
                onChange={e => setForm({ ...form, banho: e.target.checked })}
              />
              Banho realizado no plantão?
            </label>

            <div className={styles.formGroup}>
              <label className={styles.label}>Alimentação</label>
              <select 
                className={styles.select}
                value={form.alimentacao}
                onChange={e => setForm({ ...form, alimentacao: e.target.value })}
              >
                <option value="Aceitou tudo">Aceitou todas as refeições</option>
                <option value="Aceitou parcialmente">Aceitou parcialmente</option>
                <option value="Recusou alimentação">Recusou alimentação</option>
                <option value="Dieta Enteral/GTT sem intercorrências">Dieta Enteral/GTT sem intercorrências</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Eliminações (Fezes / Urina)</label>
              <select 
                className={styles.select}
                value={form.eliminacoes}
                onChange={e => setForm({ ...form, eliminacoes: e.target.value })}
              >
                <option value="Diurese e Evacuação presentes">Diurese e Evacuação presentes</option>
                <option value="Somente Diurese">Somente Diurese (Não evacuou)</option>
                <option value="Fralda / Sonda sem intercorrências">Uso de Fralda / Sonda sem intercorrências</option>
                <option value="Anormalidade observada">Anormalidade observada (Descrever no relato)</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Medicações</label>
              <select 
                className={styles.select}
                value={form.medicacoes}
                onChange={e => setForm({ ...form, medicacoes: e.target.value })}
              >
                <option value="Administradas nos horários corretos">Administradas nos horários corretos</option>
                <option value="Houve atraso ou recusa">Houve recusa ou intercorrência</option>
                <option value="Nenhuma medicação no período">Nenhuma medicação no período</option>
              </select>
            </div>
          </div>

          <div className={styles.divider}></div>

          <div>
            <h2 className={styles.sectionTitle}>📝 Relato do Plantão</h2>
            <div className={styles.formGroup}>
              <label className={styles.label}>Descreva como foi o plantão *</label>
              <textarea 
                className={styles.textarea} 
                required 
                placeholder="Descreva o estado geral do paciente, intercorrências, visitas ou observações importantes..."
                value={form.relatoPlantao}
                onChange={e => setForm({ ...form, relatoPlantao: e.target.value })}
              ></textarea>
            </div>
          </div>

          {erro && <div className={styles.errorBox}>⚠️ {erro}</div>}

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Enviando...' : '📤 Enviar Relatório Diário'}
          </button>
        </form>

        {/* Modal de Sucesso */}
        {success && (
          <div className={styles.overlay}>
            <div className={styles.successModal}>
              <div className={styles.successIcon}>✅</div>
              <h2 className={styles.modalTitle}>Relatório Enviado!</h2>
              <p className={styles.modalText}>
                Seu relatório para <strong>{form.pacienteNome}</strong> foi salvo com sucesso. Bom descanso!
              </p>
              <button onClick={novaResposta} className={styles.submitBtn}>
                Preencher Novo Relatório
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
