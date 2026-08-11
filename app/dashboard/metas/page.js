'use client';
import { useState, useEffect } from 'react';
import DashLayout from '../../../components/DashLayout';
import styles from './metas.module.css';

export default function MetasPage() {
  const [metas, setMetas] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const initialFormState = {
    nome: '',
    valor: '',
    tipo: 'Venda',
    vigencia: '',
    unidade: 'Sede - Itaquera',
    responsavel: 'Rosecler',
    ativo: true
  };
  
  const [formData, setFormData] = useState(initialFormState);

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
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
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
        setIsModalOpen(false);
        setFormData(initialFormState);
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
            <h1 className={styles.title}>Metas</h1>
            <p className={styles.subtitle}>Gestão de Indicadores e Objetivos da Serenya</p>
          </div>
          <button className={styles.btnPrimary} onClick={() => setIsModalOpen(true)}>
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
                    <th>Valor</th>
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
                          {meta.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td>
                        <span className={styles.tipoBadge}>{meta.tipo}</span>
                      </td>
                      <td className={styles.tdBold}>{meta.nome}</td>
                      <td className={styles.tdValor}>{meta.valor}</td>
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

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          {/* Modal Content */}
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <span className={styles.modalBreadcrumb}>Administração {'>'} </span>
                <h2>Metas</h2>
              </div>
              <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>×</button>
            </div>
            
            <form className={styles.modalForm} onSubmit={handleSubmit}>
              <h3 className={styles.sectionTitle}>Informações da Meta</h3>
              
              <div className={styles.formRow}>
                <div className={styles.formGroup} style={{ flex: 3 }}>
                  <label>Unidade *</label>
                  <select name="unidade" value={formData.unidade} onChange={handleInputChange} required>
                    <option value="Sede - Itaquera">Sede - Itaquera</option>
                    <option value="Zona Oeste">Zona Oeste</option>
                    <option value="Zona Sul">Zona Sul</option>
                    <option value="Home Care Brasil">Home Care Brasil</option>
                  </select>
                </div>
                
                <div className={styles.formGroup} style={{ flex: 1, alignItems: 'flex-end' }}>
                  <label>Ativo *</label>
                  <label className={styles.switch}>
                    <input type="checkbox" name="ativo" checked={formData.ativo} onChange={handleInputChange} />
                    <span className={styles.slider}></span>
                  </label>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Nome *</label>
                  <input type="text" name="nome" value={formData.nome} onChange={handleInputChange} required />
                </div>
                
                <div className={styles.formGroup}>
                  <label>Responsável *</label>
                  <select name="responsavel" value={formData.responsavel} onChange={handleInputChange} required>
                    <option value="Rosecler">Rosecler (Diretoria)</option>
                    <option value="Recursos Humanos">Recursos Humanos</option>
                    <option value="Financeiro">Financeiro</option>
                    <option value="Comercial">Comercial</option>
                  </select>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Tipo *</label>
                  <select name="tipo" value={formData.tipo} onChange={handleInputChange} required>
                    <option value="Venda">Venda</option>
                    <option value="Receita">Receita</option>
                    <option value="Despesa">Despesa</option>
                    <option value="Inadimplência">Inadimplência</option>
                    <option value="Recrutamento">Recrutamento</option>
                    <option value="Operacional">Operacional</option>
                  </select>
                </div>
                
                <div className={styles.formGroup}>
                  <label>Valor *</label>
                  <div className={styles.inputWithPrefix}>
                    <span className={styles.prefix}>R$</span>
                    <input type="text" name="valor" value={formData.valor} onChange={handleInputChange} required placeholder="Ex: 5.000,00" />
                  </div>
                </div>
              </div>
              
              <div className={styles.formRow}>
                 <div className={styles.formGroup}>
                  <label>Vigência</label>
                  <input type="text" name="vigencia" value={formData.vigencia} onChange={handleInputChange} placeholder="Ex: Mar 2024 - Jun 2024" />
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button type="submit" className={styles.btnPrimary}>
                  <span className={styles.saveIcon}>💾</span> Salvar
                </button>
                <button type="button" className={styles.btnGhost} onClick={() => setIsModalOpen(false)}>
                  ✕ Fechar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashLayout>
  );
}
