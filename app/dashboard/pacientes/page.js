'use client';
import { useEffect, useState } from 'react';
import DashLayout from '../../../components/DashLayout';
import Link from 'next/link';
import styles from './pacientes.module.css';

const grauCores = {
  'Total': { bg: '#fff0f5', color: '#D94F8A', label: 'Total' },
  'Parcial': { bg: '#fff8e6', color: '#f0a500', label: 'Parcial' },
  'Independente': { bg: '#f0fff4', color: '#4a8c52', label: 'Independente' },
};

export default function PacientesPage() {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('Todos');

  useEffect(() => {
    fetch('/api/pacientes')
      .then(r => r.json())
      .then(data => { setPacientes(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtrados = filtro === 'Todos' ? pacientes : pacientes.filter(p => p.status === filtro);

  return (
    <DashLayout>
      <div className={styles.container}>
        <div className={styles.topBar}>
          <div>
            <h1 className={styles.title}>Pacientes</h1>
            <p className={styles.subtitle}>{pacientes.length} pacientes cadastrados</p>
          </div>
          <Link href="/dashboard/pacientes/novo" className={styles.btnNovo}>
            + Nova Avaliação
          </Link>
        </div>

        <div className={styles.filtros}>
          {['Todos', 'Ativo', 'Inativo'].map(f => (
            <button
              key={f}
              className={`${styles.filtroBtn} ${filtro === f ? styles.filtroAtivo : ''}`}
              onClick={() => setFiltro(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <div className={styles.card}>
          {loading ? (
            <div className={styles.empty}>Carregando...</div>
          ) : filtrados.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>🏥</div>
              <p>Nenhum paciente cadastrado ainda.</p>
              <Link href="/dashboard/pacientes/novo" className={styles.btnNovo}>
                Cadastrar primeiro paciente
              </Link>
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Diagnóstico</th>
                  <th>Dependência</th>
                  <th>Telefone</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map(p => {
                  const grau = grauCores[p.grauDependencia] || { bg: '#f5f5f5', color: '#888', label: p.grauDependencia || '—' };
                  return (
                    <tr key={p.id}>
                      <td className={styles.nome}>{p.nome}</td>
                      <td className={styles.secondary}>{p.diagnostico || '—'}</td>
                      <td>
                        <span className={styles.badge} style={{ background: grau.bg, color: grau.color }}>
                          {grau.label}
                        </span>
                      </td>
                      <td className={styles.secondary}>{p.telefone || '—'}</td>
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
      </div>
    </DashLayout>
  );
}
