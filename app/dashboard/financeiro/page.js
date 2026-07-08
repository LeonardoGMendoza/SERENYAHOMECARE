'use client';
import { useEffect, useState } from 'react';
import DashLayout from '../../../components/DashLayout';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  BarChart, Bar, ReferenceLine
} from 'recharts';
import styles from './financeiro.module.css';

const COLORS_ENTRADA = ['#D94F8A', '#f07eb5', '#8b5e8a', '#4a8c52', '#F5A623', '#5B8DEF', '#FF6B6B'];
const COLORS_DIST = ['#4a8c52', '#D94F8A'];

const fmt = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

const CATEGORIAS_ENTRADA = ['Pagamento de Cliente', 'Adiantamento', 'Reembolso', 'Outros'];
const CATEGORIAS_SAIDA = ['Salário Cuidadora', 'Salário Enfermeira', 'Material/Insumos', 'Transporte', 'Aluguel', 'Impostos', 'Outros'];

export default function FinanceiroPage() {
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [form, setForm] = useState({ tipo: 'entrada', categoria: 'Pagamento de Cliente', descricao: '', valor: '', data: new Date().toISOString().split('T')[0] });

  const carregar = () => {
    setLoading(true);
    fetch('/api/financeiro')
      .then(r => r.json())
      .then(d => { setDados(d); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { carregar(); }, []);

  const handleSalvar = async (e) => {
    e.preventDefault();
    setSalvando(true);
    try {
      const res = await fetch('/api/financeiro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setModal(false);
        setForm({ tipo: 'entrada', categoria: 'Pagamento de Cliente', descricao: '', valor: '', data: new Date().toISOString().split('T')[0] });
        carregar();
      }
    } finally {
      setSalvando(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Excluir esta movimentação?')) return;
    await fetch(`/api/financeiro?id=${id}`, { method: 'DELETE' });
    carregar();
  };

  const categorias = form.tipo === 'entrada' ? CATEGORIAS_ENTRADA : CATEGORIAS_SAIDA;

  return (
    <DashLayout>
      <div className={styles.container}>

        {/* Header */}
        <div className={styles.topBar}>
          <div>
            <h1 className={styles.title}>💰 Financeiro</h1>
            <p className={styles.subtitle}>Painel de gestão financeira com análise preditiva — Serenya Homecare</p>
          </div>
          <button className={styles.btnNovo} onClick={() => setModal(true)}>
            + Nova Movimentação
          </button>
        </div>

        {loading ? (
          <div className={styles.loading}>⏳ Carregando dados financeiros...</div>
        ) : (
          <>
            {/* Alertas de IA */}
            {dados?.alertas?.length > 0 && (
              <div className={styles.alertasRow}>
                {dados.alertas.map((a, i) => (
                  <div key={i} className={`${styles.alerta} ${styles[a.tipo]}`}>{a.msg}</div>
                ))}
              </div>
            )}

            {/* KPI Cards — igual ao "4-Column KPI Row" do Streamlit */}
            <div className={styles.kpiGrid}>
              <div className={styles.kpiCard}>
                <div className={styles.kpiLabel}>💚 Entradas do Mês</div>
                <div className={`${styles.kpiValue} ${styles.green}`}>{fmt(dados?.kpis?.entradaMes)}</div>
              </div>
              <div className={styles.kpiCard}>
                <div className={styles.kpiLabel}>🔴 Saídas do Mês</div>
                <div className={`${styles.kpiValue} ${styles.red}`}>{fmt(dados?.kpis?.saidaMes)}</div>
              </div>
              <div className={styles.kpiCard}>
                <div className={styles.kpiLabel}>⚖️ Saldo do Mês</div>
                <div className={`${styles.kpiValue} ${dados?.kpis?.saldoMes >= 0 ? styles.green : styles.red}`}>
                  {fmt(dados?.kpis?.saldoMes)}
                </div>
              </div>
              <div className={styles.kpiCard} style={{ background: 'linear-gradient(135deg, #1a1a2e, #2d1b69)' }}>
                <div className={styles.kpiLabel} style={{ color: '#ccc' }}>🤖 Previsão Próximo Mês</div>
                <div className={styles.kpiValue} style={{ color: '#D94F8A' }}>{fmt(dados?.previsao?.entrada)}</div>
                <div style={{ fontSize: '0.75rem', color: '#aaa', marginTop: '4px' }}>Regressão Linear</div>
              </div>
            </div>

            {/* Linha 1 de Gráficos: Tendência + Distribuição */}
            <div className={styles.chartsRow}>

              {/* Gráfico de Área — Tendência Mensal (igual tc_agg_tendencia_mensal) */}
              <div className={`${styles.chartCard} ${styles.span2}`}>
                <h3 className={styles.chartTitle}>📈 Evolução Financeira — Últimos 6 Meses</h3>
                <div className={styles.chartWrap}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dados?.tendencia} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="gEntrada" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4a8c52" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#4a8c52" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="gSaida" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#D94F8A" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#D94F8A" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                      <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#888' }} tickFormatter={v => `R$${(v/1000).toFixed(0)}k`} />
                      <Tooltip formatter={(v) => fmt(v)} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                      <Legend />
                      <Area type="monotone" dataKey="entrada" name="Entradas" stroke="#4a8c52" strokeWidth={3} fill="url(#gEntrada)" />
                      <Area type="monotone" dataKey="saida" name="Saídas" stroke="#D94F8A" strokeWidth={3} fill="url(#gSaida)" />
                      <ReferenceLine y={0} stroke="#ccc" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Donut — Distribuição Entradas x Saídas (igual tc_agg_vendas_por_canal) */}
              <div className={styles.chartCard}>
                <h3 className={styles.chartTitle}>🍩 Distribuição Geral</h3>
                <div className={styles.chartWrap}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={dados?.distribuicao} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                        {dados?.distribuicao?.map((_, i) => <Cell key={i} fill={COLORS_DIST[i]} />)}
                      </Pie>
                      <Tooltip formatter={(v) => fmt(v)} contentStyle={{ borderRadius: '12px', border: 'none' }} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Linha 2: Receita por Categoria + Barras Previsão */}
            <div className={styles.chartsRow}>

              {/* Donut — Por Categoria (igual tc_agg_vendas_por_categoria) */}
              <div className={styles.chartCard}>
                <h3 className={styles.chartTitle}>🍕 Entradas por Categoria</h3>
                {dados?.porCategoria?.length > 0 ? (
                  <div className={styles.chartWrap}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={dados.porCategoria} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                          {dados.porCategoria.map((_, i) => <Cell key={i} fill={COLORS_ENTRADA[i % COLORS_ENTRADA.length]} />)}
                        </Pie>
                        <Tooltip formatter={(v) => fmt(v)} contentStyle={{ borderRadius: '12px', border: 'none' }} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className={styles.empty}>Nenhuma entrada registrada.</div>
                )}
              </div>

              {/* Barras — Previsão vs Atual (IA Preditiva) */}
              <div className={`${styles.chartCard} ${styles.span2}`}>
                <h3 className={styles.chartTitle}>🤖 Análise Preditiva — Próximo Mês vs Atual</h3>
                <div className={styles.chartWrap}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: 'Mês Atual', entrada: dados?.kpis?.entradaMes, saida: dados?.kpis?.saidaMes, lucro: dados?.kpis?.saldoMes },
                        { name: 'Previsão', entrada: dados?.previsao?.entrada, saida: dados?.previsao?.saida, lucro: dados?.previsao?.lucro }
                      ]}
                      margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#555' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#888' }} tickFormatter={v => `R$${(v/1000).toFixed(0)}k`} />
                      <Tooltip formatter={(v) => fmt(v)} contentStyle={{ borderRadius: '12px', border: 'none' }} />
                      <Legend />
                      <Bar dataKey="entrada" name="Entradas" fill="#4a8c52" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="saida" name="Saídas" fill="#D94F8A" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="lucro" name="Lucro" fill="#5B8DEF" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <p className={styles.chartNote}>Previsão baseada em regressão linear sobre os últimos 6 meses de dados.</p>
              </div>
            </div>

            {/* Tabela de Movimentações */}
            <div className={styles.tableCard}>
              <h3 className={styles.chartTitle}>📋 Últimas Movimentações</h3>
              {dados?.movimentacoes?.length === 0 ? (
                <div className={styles.empty}>Nenhuma movimentação registrada. Clique em "+ Nova Movimentação" para começar.</div>
              ) : (
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Data</th>
                      <th>Tipo</th>
                      <th>Categoria</th>
                      <th>Descrição</th>
                      <th>Valor</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {dados?.movimentacoes?.slice(0, 20).map(m => (
                      <tr key={m.id}>
                        <td>{new Date(m.data).toLocaleDateString('pt-BR')}</td>
                        <td>
                          <span className={`${styles.badge} ${m.tipo === 'entrada' ? styles.badgeGreen : styles.badgeRed}`}>
                            {m.tipo === 'entrada' ? '↑ Entrada' : '↓ Saída'}
                          </span>
                        </td>
                        <td>{m.categoria}</td>
                        <td style={{ color: '#666', fontSize: '0.88rem' }}>{m.descricao || '—'}</td>
                        <td className={m.tipo === 'entrada' ? styles.valGreen : styles.valRed}>{fmt(m.valor)}</td>
                        <td>
                          <button onClick={() => handleDelete(m.id)} className={styles.delBtn} title="Excluir">🗑️</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {/* Modal Nova Movimentação */}
        {modal && (
          <div className={styles.overlay} onClick={() => setModal(false)}>
            <div className={styles.modalCard} onClick={e => e.stopPropagation()}>
              <h2 className={styles.modalTitle}>+ Nova Movimentação</h2>
              <form onSubmit={handleSalvar} className={styles.modalForm}>
                <div className={styles.tipoRow}>
                  <button type="button" className={`${styles.tipoBtn} ${form.tipo === 'entrada' ? styles.tipoBtnGreen : ''}`}
                    onClick={() => setForm({ ...form, tipo: 'entrada', categoria: 'Pagamento de Cliente' })}>
                    ↑ Entrada
                  </button>
                  <button type="button" className={`${styles.tipoBtn} ${form.tipo === 'saida' ? styles.tipoBtnRed : ''}`}
                    onClick={() => setForm({ ...form, tipo: 'saida', categoria: 'Salário Cuidadora' })}>
                    ↓ Saída
                  </button>
                </div>

                <div className={styles.formGroup}>
                  <label>Categoria</label>
                  <select className={styles.input} value={form.categoria} onChange={e => setForm({ ...form, categoria: e.target.value })}>
                    {categorias.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>Valor (R$)</label>
                  <input type="number" step="0.01" min="0" required className={styles.input}
                    placeholder="Ex: 1500.00" value={form.valor}
                    onChange={e => setForm({ ...form, valor: e.target.value })} />
                </div>

                <div className={styles.formGroup}>
                  <label>Data</label>
                  <input type="date" required className={styles.input} value={form.data}
                    onChange={e => setForm({ ...form, data: e.target.value })} />
                </div>

                <div className={styles.formGroup}>
                  <label>Descrição (opcional)</label>
                  <input type="text" className={styles.input} placeholder="Ex: Pagamento família Silva — julho"
                    value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })} />
                </div>

                <div className={styles.modalBtns}>
                  <button type="button" className={styles.btnCancelar} onClick={() => setModal(false)}>Cancelar</button>
                  <button type="submit" className={styles.btnSalvar} disabled={salvando}>
                    {salvando ? 'Salvando...' : 'Salvar'}
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
