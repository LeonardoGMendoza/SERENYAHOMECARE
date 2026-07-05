'use client';
import { useEffect, useState } from 'react';
import DashLayout from '../../../components/DashLayout';
import styles from './leads.module.css';

const statusConfig = {
  'Novo':       { bg: '#f0f4ff', color: '#3a6fd8' },
  'Em contato': { bg: '#fff8e6', color: '#f0a500' },
  'Convertido': { bg: '#f0fff4', color: '#4a8c52' },
  'Perdido':    { bg: '#fff0f0', color: '#d84a4a' },
};

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('Todos');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ nome: '', telefone: '', origem: '', interesse: '' });
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    fetch('/api/leads')
      .then(r => r.json())
      .then(data => { setLeads(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtrados = filtro === 'Todos' ? leads : leads.filter(l => l.status === filtro);

  const convertidos = leads.filter(l => l.status === 'Convertido').length;
  const taxaConversao = leads.length > 0 ? Math.round((convertidos / leads.length) * 100) : 0;

  const handleStatus = async (id, novoStatus) => {
    await fetch(`/api/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: novoStatus }),
    });
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status: novoStatus } : l));
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    setSalvando(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const novo = await res.json();
        setLeads(prev => [novo, ...prev]);
        setModal(false);
        setForm({ nome: '', telefone: '', origem: '', interesse: '' });
      }
    } finally {
      setSalvando(false);
    }
  };

  return (
    <DashLayout>
      <div className={styles.container}>
        <div className={styles.topBar}>
          <div>
            <h1 className={styles.title}>Leads</h1>
            <p className={styles.subtitle}>{leads.length} contatos · {taxaConversao}% convertidos</p>
          </div>
          <button className={styles.btnNovo} onClick={() => setModal(true)}>+ Novo Lead</button>
        </div>

        <div className={styles.kpiRow}>
          {Object.entries(statusConfig).map(([status, cor]) => (
            <div key={status} className={styles.kpiCard} style={{ borderTop: `3px solid ${cor.color}` }}>
              <div className={styles.kpiNum} style={{ color: cor.color }}>
                {leads.filter(l => l.status === status).length}
              </div>
              <div className={styles.kpiLabel}>{status}</div>
            </div>
          ))}
        </div>

        <div className={styles.filtros}>
          {['Todos', ...Object.keys(statusConfig)].map(f => (
            <button key={f} className={`${styles.filtroBtn} ${filtro === f ? styles.filtroAtivo : ''}`} onClick={() => setFiltro(f)}>
              {f}
            </button>
          ))}
        </div>

        <div className={styles.card}>
          {loading ? (
            <div className={styles.empty}>Carregando...</div>
          ) : filtrados.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>📋</div>
              <p>Nenhum lead cadastrado ainda.</p>
              <button className={styles.btnNovo} onClick={() => setModal(true)}>Adicionar primeiro lead</button>
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Telefone</th>
                  <th>Origem</th>
                  <th>Interesse</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map(l => {
                  const cor = statusConfig[l.status] || { bg: '#f5f5f5', color: '#888' };
                  return (
                    <tr key={l.id}>
                      <td className={styles.nome}>{l.nome}</td>
                      <td className={styles.secondary}>{l.telefone}</td>
                      <td className={styles.secondary}>{l.origem || '—'}</td>
                      <td className={styles.secondary}>{l.interesse || '—'}</td>
                      <td>
                        <select
                          className={styles.statusSelect}
                          style={{ background: cor.bg, color: cor.color }}
                          value={l.status}
                          onChange={e => handleStatus(l.id, e.target.value)}
                        >
                          {Object.keys(statusConfig).map(s => <option key={s}>{s}</option>)}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {modal && (
          <div className={styles.overlay}>
            <div className={styles.modal}>
              <h2 className={styles.modalTitle}>Novo Lead</h2>
              <form onSubmit={handleSalvar} className={styles.modalForm}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Nome</label>
                  <input className={styles.input} required value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} placeholder="Nome do contato" />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Telefone</label>
                  <input className={styles.input} required value={form.telefone} onChange={e => setForm({ ...form, telefone: e.target.value })} placeholder="(00) 00000-0000" />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Origem</label>
                  <select className={styles.input} value={form.origem} onChange={e => setForm({ ...form, origem: e.target.value })}>
                    <option value="">Selecione...</option>
                    <option>Instagram</option>
                    <option>WhatsApp</option>
                    <option>Site</option>
                    <option>Indicação</option>
                    <option>Google</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Interesse / Tipo de Cuidado</label>
                  <input className={styles.input} value={form.interesse} onChange={e => setForm({ ...form, interesse: e.target.value })} placeholder="Ex: Cuidador 24h, Pós-cirúrgico..." />
                </div>
                <div className={styles.modalBtns}>
                  <button type="button" className={styles.btnCancelar} onClick={() => setModal(false)}>Cancelar</button>
                  <button type="submit" className={styles.btnNovo} disabled={salvando}>{salvando ? 'Salvando...' : 'Salvar'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashLayout>
  );
}
