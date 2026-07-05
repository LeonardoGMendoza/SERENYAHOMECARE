'use client';
import { useEffect, useState } from 'react';
import DashLayout from '../../../components/DashLayout';
import styles from './profissionais.module.css';

const cargoCores = {
  'Cuidador': { bg: '#fff0f5', color: '#D94F8A' },
  'Enfermeiro': { bg: '#f0f4ff', color: '#3a6fd8' },
  'Técnico de Enfermagem': { bg: '#f0fff4', color: '#4a8c52' },
  'Fisioterapeuta': { bg: '#fff8e6', color: '#f0a500' },
};

export default function ProfissionaisPage() {
  const [profissionais, setProfissionais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('Todos');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ nome: '', cargo: 'Cuidador', telefone: '', documento: '' });
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    fetch('/api/profissionais')
      .then(r => r.json())
      .then(data => { setProfissionais(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const cargos = ['Todos', ...new Set(profissionais.map(p => p.cargo))];
  const filtrados = filtro === 'Todos' ? profissionais : profissionais.filter(p => p.cargo === filtro);

  const handleSalvar = async (e) => {
    e.preventDefault();
    setSalvando(true);
    try {
      const res = await fetch('/api/profissionais', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const novo = await res.json();
        setProfissionais(prev => [novo, ...prev]);
        setModal(false);
        setForm({ nome: '', cargo: 'Cuidador', telefone: '', documento: '' });
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
            <h1 className={styles.title}>Profissionais</h1>
            <p className={styles.subtitle}>{profissionais.length} profissionais cadastrados</p>
          </div>
          <button className={styles.btnNovo} onClick={() => setModal(true)}>+ Novo Profissional</button>
        </div>

        <div className={styles.filtros}>
          {cargos.map(f => (
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
              <div className={styles.emptyIcon}>👩‍⚕️</div>
              <p>Nenhum profissional cadastrado ainda.</p>
              <button className={styles.btnNovo} onClick={() => setModal(true)}>Cadastrar primeiro profissional</button>
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Cargo</th>
                  <th>Telefone</th>
                  <th>Documento</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map(p => {
                  const cor = cargoCores[p.cargo] || { bg: '#f5f5f5', color: '#888' };
                  return (
                    <tr key={p.id}>
                      <td className={styles.nome}>{p.nome}</td>
                      <td>
                        <span className={styles.badge} style={{ background: cor.bg, color: cor.color }}>{p.cargo}</span>
                      </td>
                      <td className={styles.secondary}>{p.telefone || '—'}</td>
                      <td className={styles.secondary}>{p.documento || '—'}</td>
                      <td>
                        <span className={`${styles.badge} ${p.status === 'Ativo' ? styles.badgeAtivo : styles.badgeInativo}`}>
                          {p.status}
                        </span>
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
              <h2 className={styles.modalTitle}>Novo Profissional</h2>
              <form onSubmit={handleSalvar} className={styles.modalForm}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Nome Completo</label>
                  <input className={styles.input} required value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} placeholder="Nome do profissional" />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Cargo</label>
                  <select className={styles.input} value={form.cargo} onChange={e => setForm({ ...form, cargo: e.target.value })}>
                    <option>Cuidador</option>
                    <option>Enfermeiro</option>
                    <option>Técnico de Enfermagem</option>
                    <option>Fisioterapeuta</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Telefone</label>
                  <input className={styles.input} value={form.telefone} onChange={e => setForm({ ...form, telefone: e.target.value })} placeholder="(00) 00000-0000" />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>CPF / COREN</label>
                  <input className={styles.input} value={form.documento} onChange={e => setForm({ ...form, documento: e.target.value })} placeholder="Documento" />
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
