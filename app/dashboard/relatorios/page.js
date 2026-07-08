'use client';
import { useEffect, useState } from 'react';
import DashLayout from '../../../components/DashLayout';
import styles from './relatorios.module.css';

export default function RelatoriosPage() {
  const [relatorios, setRelatorios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroPaciente, setFiltroPaciente] = useState('Todos');
  const [selectedRelatorio, setSelectedRelatorio] = useState(null);
  const [enviandoEmail, setEnviandoEmail] = useState(false);

  useEffect(() => {
    fetch('/api/relatorios')
      .then(r => r.json())
      .then(data => {
        setRelatorios(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const pacientesDisponiveis = ['Todos', ...new Set(relatorios.map(r => r.pacienteNome))];

  const filtrados = filtroPaciente === 'Todos'
    ? relatorios
    : relatorios.filter(r => r.pacienteNome === filtroPaciente);

  const enviarRelatorioSemanal = async (pacienteNome) => {
    if (!confirm(`Deseja enviar o relatório semanal dos últimos 7 dias para o familiar de ${pacienteNome}?`)) return;
    
    setEnviandoEmail(true);
    try {
      const res = await fetch('/api/relatorios/enviar-semanal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pacienteNome })
      });
      const data = await res.json();
      
      if (res.ok) {
        alert('E-mail enviado com sucesso!');
      } else {
        alert(`Erro: ${data.error}`);
      }
    } catch (err) {
      alert('Erro de conexão ao tentar enviar o e-mail.');
    } finally {
      setEnviandoEmail(false);
    }
  };

  // Helper check for abnormal vitals (just a highlight)
  const isVitalAbnormal = (pa, temp) => {
    if (temp) {
      const t = parseFloat(temp.replace(',', '.'));
      if (t >= 37.8 || t <= 35.0) return true;
    }
    if (pa) {
      const parts = pa.split('/');
      if (parts.length === 2) {
        const sys = parseInt(parts[0]);
        const dia = parseInt(parts[1]);
        if (sys >= 140 || sys <= 90 || dia >= 90 || dia <= 60) return true;
      }
    }
    return false;
  }

  return (
    <DashLayout>
      <div className={styles.container}>
        <div className={styles.topBar}>
          <div>
            <h1 className={styles.title}>Relatórios Diários de Saúde</h1>
            <p className={styles.subtitle}>{relatorios.length} plantões registrados pelas cuidadoras</p>
          </div>
          {filtroPaciente !== 'Todos' && (
            <button 
              className={styles.btnPrimary} 
              onClick={() => enviarRelatorioSemanal(filtroPaciente)}
              disabled={enviandoEmail}
              style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #9333ea, #db2777)', color: 'white', fontWeight: 'bold', cursor: enviandoEmail ? 'not-allowed' : 'pointer', opacity: enviandoEmail ? 0.7 : 1 }}
            >
              {enviandoEmail ? '⏳ Enviando...' : '📧 Enviar Relatório Semanal'}
            </button>
          )}
        </div>

        {/* Filters */}
        {pacientesDisponiveis.length > 2 && (
          <div className={styles.filtros}>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#666', alignSelf: 'center', marginRight: '8px' }}>Paciente:</span>
            {pacientesDisponiveis.map(paciente => (
              <button
                key={paciente}
                className={`${styles.filtroBtn} ${filtroPaciente === paciente ? styles.filtroAtivo : ''}`}
                onClick={() => setFiltroPaciente(paciente)}
              >
                {paciente}
              </button>
            ))}
          </div>
        )}

        {/* Content Card */}
        <div className={styles.card}>
          {loading ? (
            <div className={styles.empty}>Carregando relatórios diários...</div>
          ) : filtrados.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>📋</div>
              <p>Nenhum relatório diário registrado ainda.</p>
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Paciente</th>
                  <th>Data / Turno</th>
                  <th>Sinais Vitais</th>
                  <th>Cuidador(a)</th>
                  <th style={{ width: '100px', textAlign: 'center' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map(r => {
                  const abnormal = isVitalAbnormal(r.pressaoArterial, r.temperatura);
                  return (
                    <tr key={r.id}>
                      <td>
                        <div className={styles.pacienteNome} onClick={() => setSelectedRelatorio(r)}>{r.pacienteNome}</div>
                        <div className={styles.secondary}>Higiene: {r.banho ? '✅ Realizada' : '❌ Não realizada'}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: '#333' }}>{new Date(r.data).toLocaleDateString('pt-BR')}</div>
                        <div className={styles.secondary}>Turno: {r.turno || 'Não informado'}</div>
                      </td>
                      <td>
                        <div className={styles.vitalsGrid}>
                          {r.pressaoArterial && (
                            <span className={`${styles.vitalBadge} ${abnormal ? styles.vitalAlert : ''}`}>
                              PA: {r.pressaoArterial}
                            </span>
                          )}
                          {r.temperatura && (
                            <span className={`${styles.vitalBadge} ${abnormal ? styles.vitalAlert : ''}`}>
                              T: {r.temperatura}°C
                            </span>
                          )}
                          {r.glicemia && (
                            <span className={styles.vitalBadge}>
                              Glic.: {r.glicemia} mg/dL
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: '#555' }}>{r.cuidadorNome}</div>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          className={styles.filtroBtn}
                          style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                          onClick={() => setSelectedRelatorio(r)}
                        >
                          👁️ Ver Tudo
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Modal Detalhes */}
        {selectedRelatorio && (
          <div className={styles.overlay} onClick={() => setSelectedRelatorio(null)}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <h2 className={styles.modalTitle}>Relatório Diário de Saúde</h2>

              <div className={styles.detailGrid}>
                <div className={styles.detailBlock}>
                  <span className={styles.detailLabel}>Paciente</span>
                  <span className={styles.detailValue} style={{ color: '#D94F8A', fontWeight: 700 }}>{selectedRelatorio.pacienteNome}</span>
                </div>
                <div className={styles.detailBlock}>
                  <span className={styles.detailLabel}>Cuidador(a) Responsável</span>
                  <span className={styles.detailValue}>{selectedRelatorio.cuidadorNome}</span>
                </div>
                <div className={styles.detailBlock}>
                  <span className={styles.detailLabel}>Data do Plantão</span>
                  <span className={styles.detailValue}>{new Date(selectedRelatorio.data).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className={styles.detailBlock}>
                  <span className={styles.detailLabel}>Turno</span>
                  <span className={styles.detailValue}>{selectedRelatorio.turno || 'Não informado'}</span>
                </div>
              </div>

              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#444', marginBottom: '12px', borderBottom: '1px solid #f5f5f5', paddingBottom: '8px' }}>
                🩺 Parâmetros Clínicos (Sinais Vitais)
              </h3>
              <div className={styles.detailGrid} style={{ marginBottom: '24px' }}>
                <div className={styles.detailBlock}>
                  <span className={styles.detailLabel}>Pressão Arterial (PA)</span>
                  <span className={styles.detailValue}>{selectedRelatorio.pressaoArterial || 'Não aferida'}</span>
                </div>
                <div className={styles.detailBlock}>
                  <span className={styles.detailLabel}>Temperatura</span>
                  <span className={styles.detailValue}>{selectedRelatorio.temperatura ? `${selectedRelatorio.temperatura} °C` : 'Não aferida'}</span>
                </div>
                <div className={styles.detailBlock}>
                  <span className={styles.detailLabel}>Frequência Cardíaca (FC)</span>
                  <span className={styles.detailValue}>{selectedRelatorio.frequenciaCardiaca ? `${selectedRelatorio.frequenciaCardiaca} bpm` : 'Não aferida'}</span>
                </div>
                <div className={styles.detailBlock}>
                  <span className={styles.detailLabel}>Glicemia Capilar (HGT)</span>
                  <span className={styles.detailValue}>{selectedRelatorio.glicemia ? `${selectedRelatorio.glicemia} mg/dL` : 'Não aferida'}</span>
                </div>
              </div>

              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#444', marginBottom: '12px', borderBottom: '1px solid #f5f5f5', paddingBottom: '8px' }}>
                🍎 Rotina e Cuidados Básicos
              </h3>
              <div className={styles.detailGrid} style={{ marginBottom: '24px' }}>
                <div className={styles.detailBlock}>
                  <span className={styles.detailLabel}>Banho / Higiene</span>
                  <span className={styles.detailValue}>{selectedRelatorio.banho ? '✅ Banho Realizado' : '❌ Banho Não Realizado'}</span>
                </div>
                <div className={styles.detailBlock}>
                  <span className={styles.detailLabel}>Aceitação Alimentar</span>
                  <span className={styles.detailValue}>{selectedRelatorio.alimentacao || 'Não informada'}</span>
                </div>
                <div className={styles.detailBlock}>
                  <span className={styles.detailLabel}>Eliminações (Diurese/Fezes)</span>
                  <span className={styles.detailValue}>{selectedRelatorio.eliminacoes || 'Não informadas'}</span>
                </div>
                <div className={styles.detailBlock}>
                  <span className={styles.detailLabel}>Administração de Medicamentos</span>
                  <span className={styles.detailValue}>{selectedRelatorio.medicacoes || 'Não informada'}</span>
                </div>
              </div>

              <div className={styles.detailBlock} style={{ marginBottom: '16px' }}>
                <span className={styles.detailLabel}>Relato do Plantão e Intercorrências</span>
                <div className={styles.obsBox}>
                  {selectedRelatorio.relatoPlantao || 'Sem observações adicionais.'}
                </div>
              </div>

              <div className={styles.modalBtns}>
                <button className={styles.btnFechar} onClick={() => setSelectedRelatorio(null)}>Fechar Relatório</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashLayout>
  );
}
