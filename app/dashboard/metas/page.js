'use client';
import { useState, useEffect } from 'react';
import DashLayout from '../../../components/DashLayout';
import styles from './metas.module.css';

export default function MetasPage() {
  const [metas, setMetas] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nome: '',
    valor: '',
    tipo: 'Financeira',
    vigencia: '',
    unidade: 'São Paulo',
    responsavel: ''
  });

  useEffect(() => {
    fetchMetas();
  }, []);

  const fetchMetas = async () => {
    try {
      const res = await fetch('/api/metas');
      const data = await res.json();
      if (res.ok) {
        setMetas(data.metas || []);
      }
    } catch (error) {
      console.error('Erro ao buscar metas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/metas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsDrawerOpen(false);
        setFormData({
          nome: '', valor: '', tipo: 'Financeira', vigencia: '', unidade: 'São Paulo', responsavel: ''
        });
        fetchMetas();
      } else {
        alert('Erro ao salvar meta');
      }
    } catch (error) {
      console.error('Erro ao salvar meta:', error);
      alert('Erro de conexão ao salvar meta.');
    }
  };

  return (
    <DashLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Painel de Metas</h1>
            <p className={styles.subtitle}>Acompanhe os objetivos e resultados da Serenya</p>
          </div>
          <button className={styles.btnPrimary} onClick={() => setIsDrawerOpen(true)}>
            + Nova Meta
          </button>
        </div>

        <div className={styles.tableCard}>
          {loading ? (
            <div className={styles.loadingState}>Carregando metas...</div>
          ) : metas.length === 0 ? (
            <div className={styles.emptyState}>Nenhuma meta cadastrada ainda.</div>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>Tipo</th>
                    <th>Nome da Meta</th>
                    <th>Valor / Alvo</th>
                    <th>Unidade</th>
                    <th>Responsável</th>
                    <th>Vigência</th>
                  </tr>
                </thead>
                <tbody>
                  {metas.map((meta) => (
                    <tr key={meta.id}>
                      <td>
                        <span className={`${styles.badge} ${meta.ativo ? styles.badgeActive : styles.badgeInactive}`}>
                          {meta.ativo ? 'Em Andamento' : 'Concluída'}
                        </span>
                      </td>
                      <td>
                        <span className={styles.tipoBadge}>{meta.tipo}</span>
                      </td>
                      <td className={styles.tdBold}>{meta.nome}</td>
                      <td>{meta.valor}</td>
                      <td>{meta.unidade || '-'}</td>
                      <td>{meta.responsavel || '-'}</td>
                      <td>{meta.vigencia || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Drawer Overlay */}
      {isDrawerOpen && (
        <div className={styles.drawerOverlay} onClick={() => setIsDrawerOpen(false)}></div>
      )}

      {/* Drawer */}
      <div className={`${styles.drawer} ${isDrawerOpen ? styles.drawerOpen : ''}`}>
        <div className={styles.drawerHeader}>
          <h2>Cadastrar Nova Meta</h2>
          <button className={styles.closeBtn} onClick={() => setIsDrawerOpen(false)}>×</button>
        </div>
        <form className={styles.drawerForm} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Nome da Meta *</label>
            <input type="text" name="nome" value={formData.nome} onChange={handleInputChange} required placeholder="Ex: Captação de Currículos" />
          </div>
          <div className={styles.formGroup}>
            <label>Tipo *</label>
            <select name="tipo" value={formData.tipo} onChange={handleInputChange} required>
              <option value="Recrutamento">Recrutamento</option>
              <option value="Financeira">Financeira</option>
              <option value="Operacional">Operacional</option>
              <option value="Marketing">Marketing</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Valor / Alvo *</label>
            <input type="text" name="valor" value={formData.valor} onChange={handleInputChange} required placeholder="Ex: 50 Currículos" />
          </div>
          <div className={styles.formGroup}>
            <label>Vigência (Prazo)</label>
            <input type="text" name="vigencia" value={formData.vigencia} onChange={handleInputChange} placeholder="Ex: Até sexta-feira" />
          </div>
          <div className={styles.formGroup}>
            <label>Responsável</label>
            <input type="text" name="responsavel" value={formData.responsavel} onChange={handleInputChange} placeholder="Ex: Rosecler" />
          </div>
          <div className={styles.formGroup}>
            <label>Unidade / Região</label>
            <input type="text" name="unidade" value={formData.unidade} onChange={handleInputChange} placeholder="Ex: São Paulo - Zona Oeste" />
          </div>

          <div className={styles.drawerFooter}>
            <button type="button" className={styles.btnSecondary} onClick={() => setIsDrawerOpen(false)}>Cancelar</button>
            <button type="submit" className={styles.btnPrimary}>Salvar Meta</button>
          </div>
        </form>
      </div>
    </DashLayout>
  );
}
