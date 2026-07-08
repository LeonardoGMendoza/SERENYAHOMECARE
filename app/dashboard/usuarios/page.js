'use client';
import { useEffect, useState } from 'react';
import DashLayout from '../../../components/DashLayout';
import styles from './usuarios.module.css';

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [modalReset, setModalReset] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  const [form, setForm] = useState({ name: '', email: '', role: 'cuidador', password: '', pacientesIds: [] });
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

    // Carregar lista de pacientes para o dropdown
    fetch('/api/pacientes')
      .then(r => r.json())
      .then(data => {
        setPacientes(Array.isArray(data) ? data : []);
      })
      .catch(err => console.error('Erro ao buscar pacientes:', err));
  }, []);

  const togglePaciente = (id) => {
    setForm(prev => ({
      ...prev,
      pacientesIds: prev.pacientesIds.includes(id)
        ? prev.pacientesIds.filter(i => i !== id)
        : [...prev.pacientesIds, id]
    }));
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    setSalvando(true);
    setErro('');
    try {
      const isEdit = !!selectedUser;
      const url = isEdit ? `/api/usuarios/${selectedUser.id}` : '/api/usuarios';
      const method = isEdit ? 'PATCH' : 'POST';

      const payload = {
        name: form.name,
        email: form.email,
        role: form.role,
        pacientesIds: form.role !== 'diretora' ? form.pacientesIds : []
      };

      if (form.password) {
        payload.password = form.password;
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        if (isEdit) {
          setUsuarios(prev => prev.map(u => u.id === selectedUser.id ? data : u));
        } else {
          setUsuarios(prev => [data, ...prev]);
        }
        setModal(false);
        setSelectedUser(null);
        setForm({ name: '', email: '', role: 'cuidador', password: '', pacientesIds: [] });
      } else {
        setErro(data.error || 'Erro ao salvar colaborador.');
      }
    } catch (err) {
      console.error(err);
      setErro('Erro de conexão.');
    } finally {
      setSalvando(false);
    }
  };

  const handleEditClick = (u) => {
    setSelectedUser(u);
    setForm({
      name: u.name,
      email: u.email,
      role: u.role,
      password: '',
      pacientesIds: u.pacientesDesignados ? u.pacientesDesignados.map(p => p.id) : []
    });
    setErro('');
    setModal(true);
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
          <button className={styles.btnNovo} onClick={() => { setSelectedUser(null); setErro(''); setForm({ name: '', email: '', role: 'cuidador', password: '', pacientesIds: [] }); setModal(true); }}>
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
              <button className={styles.btnNovo} onClick={() => { setSelectedUser(null); setModal(true); }}>Cadastrar primeira conta</button>
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Gmail Autorizado</th>
                  <th>Cargo / Perfil</th>
                  <th>Paciente Designado</th>
                  <th style={{ width: '180px', textAlign: 'right' }}>Ações</th>
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
                    <td>
                      <span style={{ fontWeight: 600, color: u.pacientesDesignados?.length > 0 ? '#D94F8A' : '#777', fontSize: '0.9rem' }}>
                        {u.pacientesDesignados?.length > 0
                          ? u.pacientesDesignados.map(p => `👤 ${p.nome}`).join(', ')
                          : 'Livre (Sem designação)'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className={styles.actionCell}>
                        <button
                          className={styles.actionBtn}
                          onClick={() => handleEditClick(u)}
                          title="Editar Cadastro / Vincular Paciente"
                        >
                          ✏️
                        </button>
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

        {/* Modal: Novo/Editar Usuário */}
        {modal && (
          <div className={styles.overlay} onClick={() => setModal(false)}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <h2 className={styles.modalTitle}>{selectedUser ? `Editar ${selectedUser.name}` : 'Autorizar Colaborador'}</h2>
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

                {/* Checkboxes de Pacientes Designados */}
                {form.role !== 'diretora' && (
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Pacientes Designados (pode marcar vários)</label>
                    <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px', maxHeight: '180px', overflowY: 'auto', background: '#fafafa' }}>
                      {pacientes.length === 0 && <p style={{ color: '#999', fontSize: '0.85rem' }}>Nenhum paciente cadastrado ainda.</p>}
                      {pacientes.map(p => (
                        <label key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 4px', cursor: 'pointer', borderRadius: '4px' }}>
                          <input
                            type="checkbox"
                            checked={form.pacientesIds.includes(p.id)}
                            onChange={() => togglePaciente(p.id)}
                            style={{ accentColor: '#D94F8A', width: '16px', height: '16px' }}
                          />
                          <span style={{ fontSize: '0.9rem', color: '#444' }}>👤 {p.nome}</span>
                        </label>
                      ))}
                    </div>
                    {form.pacientesIds.length === 0 && (
                      <p style={{ fontSize: '0.78rem', color: '#999', marginTop: '4px' }}>Nenhum selecionado — cuidadora volante / sem designação.</p>
                    )}
                  </div>
                )}

                <div className={styles.formGroup}>
                  <label className={styles.label}>Senha de Backup (Opcional)</label>
                  <input
                    type="password"
                    className={styles.input}
                    placeholder={selectedUser ? "Deixe em branco para não alterar" : "Senha para login sem Google"}
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                  />
                </div>

                {erro && <div style={{ color: '#d84a4a', fontWeight: 'bold', fontSize: '0.9rem' }}>⚠️ {erro}</div>}

                <div className={styles.modalBtns}>
                  <button type="button" className={styles.btnCancelar} onClick={() => setModal(false)}>Cancelar</button>
                  <button type="submit" className={styles.btnSalvar} disabled={salvando}>
                    {salvando ? 'Salvando...' : 'Salvar Alterações'}
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
