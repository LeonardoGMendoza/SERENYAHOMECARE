'use client';
import { useEffect, useState } from 'react';
import DashLayout from '../../../components/DashLayout';
import styles from './recrutamento.module.css';

const statusConfig = {
  'Novo':       { bg: '#f0f4ff', color: '#3a6fd8' },
  'Em Análise': { bg: '#fff8e6', color: '#f0a500' },
  'Aprovado':   { bg: '#f0fff4', color: '#4a8c52' },
  'Dispensado': { bg: '#fff0f0', color: '#d84a4a' },
};

export default function RecrutamentoPage() {
  const [candidatos, setCandidatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState('Todos');
  const [filtroCargo, setFiltroCargo] = useState('Todos');
  const [selectedCandidato, setSelectedCandidato] = useState(null);

  useEffect(() => {
    fetch('/api/recrutamento')
      .then(r => r.json())
      .then(data => {
        setCandidatos(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/recrutamento/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setCandidatos(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
        if (selectedCandidato && selectedCandidato.id === id) {
          setSelectedCandidato(prev => ({ ...prev, status: newStatus }));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja remover este candidato e seu currículo?')) return;
    try {
      const res = await fetch(`/api/recrutamento/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setCandidatos(prev => prev.filter(c => c.id !== id));
        setSelectedCandidato(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtrados = candidatos.filter(c => {
    const matchStatus = filtroStatus === 'Todos' || c.status === filtroStatus;
    const matchCargo = filtroCargo === 'Todos' || c.cargo === filtroCargo;
    return matchStatus && matchCargo;
  });

  // KPI calculations
  const total = candidatos.length;
  const novos = candidatos.filter(c => c.status === 'Novo').length;
  const emAnalise = candidatos.filter(c => c.status === 'Em Análise').length;
  const aprovados = candidatos.filter(c => c.status === 'Aprovado').length;

  // Obter lista única de cargos para filtro
  const cargosDisponiveis = ['Todos', ...new Set(candidatos.map(c => c.cargo))];

  return (
    <DashLayout>
      <div className={styles.container}>
        <div className={styles.topBar}>
          <div>
            <h1 className={styles.title}>Banco de Currículos</h1>
            <p className={styles.subtitle}>{candidatos.length} candidaturas recebidas</p>
          </div>
        </div>

        {/* KPIs */}
        <div className={styles.kpiRow}>
          <div className={styles.kpiCard} style={{ borderTop: '3px solid #666' }}>
            <div className={styles.kpiNum}>{total}</div>
            <div className={styles.kpiLabel}>Total Currículos</div>
          </div>
          <div className={styles.kpiCard} style={{ borderTop: `3px solid ${statusConfig['Novo'].color}` }}>
            <div className={styles.kpiNum} style={{ color: statusConfig['Novo'].color }}>{novos}</div>
            <div className={styles.kpiLabel}>Novos</div>
          </div>
          <div className={styles.kpiCard} style={{ borderTop: `3px solid ${statusConfig['Em Análise'].color}` }}>
            <div className={styles.kpiNum} style={{ color: statusConfig['Em Análise'].color }}>{emAnalise}</div>
            <div className={styles.kpiLabel}>Em Análise</div>
          </div>
          <div className={styles.kpiCard} style={{ borderTop: `3px solid ${statusConfig['Aprovado'].color}` }}>
            <div className={styles.kpiNum} style={{ color: statusConfig['Aprovado'].color }}>{aprovados}</div>
            <div className={styles.kpiLabel}>Aprovados</div>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className={styles.filtros}>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#666', alignSelf: 'center', marginRight: '8px' }}>Status:</span>
            {['Todos', ...Object.keys(statusConfig)].map(status => (
              <button
                key={status}
                className={`${styles.filtroBtn} ${filtroStatus === status ? styles.filtroAtivo : ''}`}
                onClick={() => setFiltroStatus(status)}
              >
                {status}
              </button>
            ))}
          </div>

          {cargosDisponiveis.length > 2 && (
            <div className={styles.filtros}>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#666', alignSelf: 'center', marginRight: '8px' }}>Cargo:</span>
              {cargosDisponiveis.map(cargo => (
                <button
                  key={cargo}
                  className={`${styles.filtroBtn} ${filtroCargo === cargo ? styles.filtroAtivo : ''}`}
                  onClick={() => setFiltroCargo(cargo)}
                >
                  {cargo}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content Card */}
        <div className={styles.card}>
          {loading ? (
            <div className={styles.empty}>Carregando currículos...</div>
          ) : filtrados.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>💼</div>
              <p>Nenhum currículo encontrado com os filtros selecionados.</p>
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Candidato</th>
                  <th>Cargo</th>
                  <th>Telefone</th>
                  <th>Cidade</th>
                  <th>Status</th>
                  <th style={{ width: '80px', textAlign: 'center' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map(c => {
                  const conf = statusConfig[c.status] || { bg: '#eee', color: '#333' };
                  return (
                    <tr key={c.id}>
                      <td>
                        <div className={styles.nome} onClick={() => setSelectedCandidato(c)}>{c.nome}</div>
                        <div className={styles.secondary}>{c.email}</div>
                      </td>
                      <td>
                        <span style={{ fontWeight: 600, color: '#333' }}>{c.cargo}</span>
                      </td>
                      <td>
                        <a href={`https://wa.me/55${c.telefone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className={styles.secondary} style={{ textDecoration: 'none', color: '#D94F8A', fontWeight: 600 }}>
                          {c.telefone} 💬
                        </a>
                      </td>
                      <td>
                        <span className={styles.secondary}>{c.cidade || 'Não informada'}</span>
                      </td>
                      <td>
                        <select
                          className={styles.statusSelect}
                          style={{ backgroundColor: conf.bg, color: conf.color }}
                          value={c.status}
                          onChange={(e) => handleStatusChange(c.id, e.target.value)}
                        >
                          {Object.keys(statusConfig).map(st => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          className={`${styles.actionBtn} ${styles.deleteBtn}`}
                          onClick={() => handleDelete(c.id)}
                          title="Excluir Candidato"
                        >
                          🗑️
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
        {selectedCandidato && (
          <div className={styles.overlay} onClick={() => setSelectedCandidato(null)}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <h2 className={styles.modalTitle}>Detalhes do Candidato</h2>

              <div className={styles.detailGrid}>
                <div className={styles.detailBlock}>
                  <span className={styles.detailLabel}>Nome Completo</span>
                  <span className={styles.detailValue}>{selectedCandidato.nome}</span>
                </div>
                <div className={styles.detailBlock}>
                  <span className={styles.detailLabel}>Cargo Pretendido</span>
                  <span className={styles.detailValue} style={{ color: '#D94F8A', fontWeight: 700 }}>{selectedCandidato.cargo}</span>
                </div>
                <div className={styles.detailBlock}>
                  <span className={styles.detailLabel}>WhatsApp / Telefone</span>
                  <a href={`https://wa.me/55${selectedCandidato.telefone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className={styles.detailValue} style={{ color: '#3a6fd8', textDecoration: 'none' }}>
                    {selectedCandidato.telefone} 💬
                  </a>
                </div>
                <div className={styles.detailBlock}>
                  <span className={styles.detailLabel}>E-mail</span>
                  <span className={styles.detailValue}>{selectedCandidato.email}</span>
                </div>
                <div className={styles.detailBlock}>
                  <span className={styles.detailLabel}>Cidade / UF</span>
                  <span className={styles.detailValue}>{selectedCandidato.cidade || 'Não informada'}</span>
                </div>
                <div className={styles.detailBlock}>
                  <span className={styles.detailLabel}>Data de Cadastro</span>
                  <span className={styles.detailValue}>{new Date(selectedCandidato.createdAt).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>

              <div className={styles.detailBlock} style={{ marginBottom: '24px' }}>
                <span className={styles.detailLabel}>Resumo da Experiência</span>
                <div className={styles.experienceBox}>
                  {selectedCandidato.experiencia || 'Nenhuma experiência descrita.'}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className={styles.detailBlock}>
                  <span className={styles.detailLabel}>Status da Candidatura</span>
                  <select
                    className={styles.statusSelect}
                    style={{
                      backgroundColor: (statusConfig[selectedCandidato.status] || {}).bg,
                      color: (statusConfig[selectedCandidato.status] || {}).color,
                      marginTop: '4px'
                    }}
                    value={selectedCandidato.status}
                    onChange={(e) => handleStatusChange(selectedCandidato.id, e.target.value)}
                  >
                    {Object.keys(statusConfig).map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                {selectedCandidato.curriculoUrl ? (
                  <a
                    href={selectedCandidato.curriculoUrl}
                    download
                    target="_blank"
                    rel="noreferrer"
                    className={styles.downloadBtn}
                  >
                    📥 Baixar Currículo PDF
                  </a>
                ) : (
                  <span style={{ fontSize: '0.9rem', color: '#999', fontWeight: 600 }}>Nenhum anexo enviado</span>
                )}
              </div>

              <div className={styles.modalBtns}>
                <button className={styles.btnFechar} onClick={() => setSelectedCandidato(null)}>Fechar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashLayout>
  );
}
