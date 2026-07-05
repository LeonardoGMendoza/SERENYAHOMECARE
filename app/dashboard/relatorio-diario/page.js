'use client';
import { useEffect, useState } from 'react';
import DashLayout from '../../../components/DashLayout';
import styles from './relatorio-diario.module.css';

export default function RelatorioDiarioPage() {
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

  useEffect(() => {
    fetch('/api/pacientes')
      .then(r => r.json())
      .then(data => {
        setPacientes(Array.isArray(data) ? data : []);
        setLoadingPacientes(false);
      })
      .catch(() => setLoadingPacientes(false));
  }, []);

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

  if (success) {
    return (
      <DashLayout>
        <div className={styles.successCard}>
          <div className={styles.successIcon}>🎉</div>
          <h2>Relatório Enviado com Sucesso!</h2>
          <p>Seu registro de plantão foi salvo com segurança no banco de dados e já está disponível para a gerência da Serenya Home Care.</p>
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
            ✍️ Registrar Outro Plantão
          </button>
        </div>
      </DashLayout>
    );
  }

  return (
    <DashLayout>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Relatório Diário de Plantão</h1>
          <p className={styles.subtitle}>Preencha as informações do paciente atendido no encerramento do seu turno.</p>
        </header>

        <form onSubmit={handleSubmit} className={styles.formCard}>
          
          {/* Identificação */}
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

          {/* Sinais Vitais */}
          <div>
            <h2 className={styles.sectionTitle}>🩺 Sinais Vitais (Parâmetros Clínicos)</h2>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Pressão Arterial (PA)</label>
                <input 
                  type="text" 
                  className={styles.input} 
                  placeholder="Ex: 120/80 ou 12/8" 
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

          {/* Rotina e Cuidados */}
          <div>
            <h2 className={styles.sectionTitle}>🍎 Alimentação, Higiene e Eliminações</h2>
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
                <label className={styles.label}>Medicamentos do Horário</label>
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

          {/* Relato */}
          <div>
            <h2 className={styles.sectionTitle}>✍️ Observações do Plantão / Intercorrências</h2>
            <div className={styles.formGroup}>
              <label className={styles.label}>Relato Detalhado do Plantão</label>
              <textarea 
                className={styles.textarea} 
                placeholder="Descreva detalhadamente a rotina, o comportamento do paciente, se houve dores, vômitos, picos de pressão ou qualquer intercorrência..." 
                value={form.relatoPlantao}
                onChange={e => setForm({ ...form, relatoPlantao: e.target.value })}
              />
            </div>
          </div>

          {erro && <div style={{ color: '#d84a4a', fontWeight: 'bold', fontSize: '0.95rem' }}>⚠️ {erro}</div>}

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Salvando Relatório...' : 'Enviar Relatório Diário'}
          </button>

        </form>
      </div>
    </DashLayout>
  );
}
