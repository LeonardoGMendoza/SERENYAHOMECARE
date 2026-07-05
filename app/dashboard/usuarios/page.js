'use client';
import { useEffect, useState } from 'react';
import DashLayout from '../../../components/DashLayout';
import styles from './usuarios.module.css';

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [modalReset, setModalReset] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  const [form, setForm] = useState({ name: '', email: '', role: 'cuidador', password: '' });
  const [resetPass, setResetPass] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');

  const carregarUsuarios = () => {
    setLoading(true);
    fetch('/api/usuarios')
      .then(r => r.json())
      .then(data => {
        setUsuarios(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const handleSalvar = async (e) => {
    e.preventDefault();
    setSalvando(true);
    setErro('');
    try {
      const res = await fetch('/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setUsuarios(prev => [data, ...prev]);
        setModal(false);
        setForm({ name: '', email: '', role: 'cuidador', password: '' });
      } else {
        setErro(data.error || 'Erro ao cadastrar usuário.');
      }
    } catch (err) {
      console.error(err);
      setErro('Erro de conexão.');
    } finally {
      setSalvando(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!resetPass) return;
    setSalvando(true);
    setErro('');
    try {
      const res = await fetch(`/api/usuarios/${selectedUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: resetPass }),
      });
      const data = await res.json();
      if (res.ok) {
        alert('Senha alterada com sucesso!');
        setModalReset(false);
        setResetPass('');
        setSelectedUser(null);
      } else {
        setErro(data.error || 'Erro ao alterar senha.');
      }
    } catch (err) {
      console.error(err);
      setErro('Erro de conexão.');
    } finally {
      setSalvando(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Deseja realmente excluir o acesso deste colaborador?')) return;
    try {
      const res = await fetch(`/api/usuarios/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setUsuarios(prev => prev.filter(u => u.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashLayout>
      <div className={styles.container}>
        <div className={styles.topBar}>
          <div>
            <h1 className={styles.title}>Gerenciamento de Equipe</h1>
            <p className={styles.subtitle}>Cadastre as contas de Gmail para liberar o botão "Entrar com Google" para a sua equipe.</p>
          </div>
          <button className={styles.btnNovo} onClick={() => { setErro(''); setModal(true); }}>
            👤 Autorizar Novo Membro
          </button>
        </div>

        <div className={styles.card}>
          {loading ? (
            <div className={styles.empty}>Carregando colaboradores...</div>
          ) : usuarios.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>👥</div>
              <p>Nenhuma conta cadastrada além das diretoras fixas.</p>
              <button className={styles.btnNovo} onClick={() => setModal(true)}>Cadastrar primeira conta</button>
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Gmail Autorizado</th>
                  <th>Cargo / Perfil</th>
                  <th style={{ width: '150px', textAlign: 'right' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map(u => (
                  <tr key={u.id}>
                    <td>
                      <span className={styles.nome}>{u.name}</span>
                    </td>
                    <td>
                      <span className={styles.email}>{u.email}</span>
                    </td>
                    <td>
                      <span className={`${styles.roleBadge} ${u.role === 'diretora' ? styles.roleDiretora : styles.roleCuidador}`}>
                        {u.role === 'diretora' && '🔑 Diretora'}
                        {u.role === 'cuidador' && '🩺 Cuidador(a)'}
                        {u.role === 'tecnico' && '⚡ Técnico(a)'}
                        {u.role === 'enfermeira' && '👩‍⚕️ Enfermeiro(a)'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className={styles.actionCell}>
                        <button
                          className={styles.actionBtn}
                          onClick={() => { setSelectedUser(u); setErro(''); setModalReset(true); }}
                          title="Redefinir Senha de Backup"
                        >
                          🔑
                        </button>
                        <button
                          className={`${styles.actionBtn} ${styles.deleteBtn}`}
                          onClick={() => handleDelete(u.id)}
                          title="Excluir Colaborador"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Modal: Novo Usuário */}
        {modal && (
          <div className={styles.overlay} onClick={() => setModal(false)}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <h2 className={styles.modalTitle}>Autorizar Colaborador</h2>
              <form onSubmit={handleSalvar} className={styles.modalForm}>
                
                <div className={styles.googleTip}>
                  💡 <strong>Importante:</strong> Digite o e-mail real do <strong>Gmail / Google</strong> do colaborador. Ele usará este e-mail para clicar no botão "Entrar com Google".
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Nome Completo</label>
                  <input
                    type="text"
                    className={styles.input}
                    required
                    placeholder="Nome do colaborador"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Gmail do Google</label>
                  <input
                    type="email"
                    className={styles.input}
                    required
                    placeholder="nome.sobrenome@gmail.com"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Cargo / Nível de Acesso</label>
                  <select
                    className={styles.select}
                    value={form.role}
                    onChange={e => setForm({ ...form, role: e.target.value })}
                  >
                    <option value="cuidador">🩺 Cuidador(a) (Acesso Relatório)</option>
                    <option value="tecnico">⚡ Técnico(a) de Enfermagem (Acesso Relatório)</option>
                    <option value="enfermeira">👩‍⚕️ Enfermeiro(a) (Acesso Relatório)</option>
                    <option value="diretora">🔑 Diretora (Acesso Total ao Painel)</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Senha de Backup (Opcional)</label>
                  <input
                    type="password"
                    className={styles.input}
                    placeholder="Senha para login tradicional sem Google"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                  />
                </div>

                {erro && <div style={{ color: '#d84a4a', fontWeight: 'bold', fontSize: '0.9rem' }}>⚠️ {erro}</div>}

                <div className={styles.modalBtns}>
                  <button type="button" className={styles.btnCancelar} onClick={() => setModal(false)}>Cancelar</button>
                  <button type="submit" className={styles.btnSalvar} disabled={salvando}>
                    {salvando ? 'Salvando...' : 'Autorizar Acesso'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Reset de Senha */}
        {modalReset && selectedUser && (
          <div className={styles.overlay} onClick={() => { setModalReset(false); setSelectedUser(null); }}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <h2 className={styles.modalTitle}>Alterar Senha de {selectedUser.name}</h2>
              <form onSubmit={handleResetPassword} className={styles.modalForm}>
                <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '8px' }}>
                  Isso altera a senha de backup para login direto com e-mail/senha.
                </p>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Nova Senha</label>
                  <input
                    type="password"
                    className={styles.input}
                    required
                    placeholder="Digite a nova senha de backup"
                    value={resetPass}
                    onChange={e => setResetPass(e.target.value)}
                  />
                </div>

                {erro && <div style={{ color: '#d84a4a', fontWeight: 'bold', fontSize: '0.9rem' }}>⚠️ {erro}</div>}

                <div className={styles.modalBtns}>
                  <button type="button" className={styles.btnCancelar} onClick={() => { setModalReset(false); setSelectedUser(null); }}>
                    Cancelar
                  </button>
                  <button type="submit" className={styles.btnSalvar} disabled={salvando}>
                    {salvando ? 'Alterando...' : 'Confirmar Nova Senha'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashLayout>
  );
}
