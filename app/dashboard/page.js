'use client';
import DashLayout from '../../components/DashLayout';
import { useEffect, useState } from 'react';
import {
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid
} from 'recharts';
import styles from './dashboard.module.css';

const COLORS = ['#D94F8A', '#4a8c52', '#8b5e8a', '#F07EB5'];

export default function DashboardOverview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard/stats')
      .then(r => r.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const kpis = stats ? [
    { title: 'Pacientes Ativos', value: stats.totalPacientes, trend: '', color: 'pink' },
    { title: 'Profissionais', value: stats.totalProfissionais, trend: '', color: 'green' },
    { title: 'Novos Leads', value: stats.totalLeads, trend: '', color: 'blue' },
    { title: 'Relatórios este mês', value: stats.relatoriosMes, trend: '', color: 'purple' }
  ] : [];

  return (
    <DashLayout>
      <div className={styles.container}>

        {/* Boas-vindas */}
        <div className={styles.welcomeRow}>
          <div>
            <h1 className={styles.pageTitle}>Visão Geral</h1>
            <p className={styles.pageSub}>Acompanhe os principais indicadores da Serenya.</p>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#aaa', fontSize: '1.1rem' }}>
            Carregando dados reais...
          </div>
        ) : (
          <>
            {/* KPIs */}
            <div className={styles.kpiGrid}>
              {kpis.map((kpi, i) => (
                <div key={i} className={styles.kpiCard}>
                  <div className={styles.kpiHeader}>
                    <span className={styles.kpiTitle}>{kpi.title}</span>
                  </div>
                  <div className={styles.kpiValue}>{kpi.value}</div>
                </div>
              ))}
            </div>

            {/* Gráficos */}
            <div className={styles.chartsGrid}>

              {/* Gráfico de pizza: diagnósticos */}
              {stats?.diagnosticos?.length > 0 ? (
                <div className={styles.chartCard}>
                  <h3 className={styles.chartTitle}>Perfil dos Pacientes</h3>
                  <div className={styles.chartWrapper}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stats.diagnosticos}
                          cx="50%" cy="50%"
                          innerRadius={60} outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {stats.diagnosticos.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                          itemStyle={{ fontWeight: 'bold' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className={styles.chartLegend}>
                    {stats.diagnosticos.map((item, i) => (
                      <div key={i} className={styles.legendItem}>
                        <div className={styles.legendDot} style={{ background: COLORS[i % COLORS.length] }} />
                        <span>{item.name} ({item.value})</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className={styles.chartCard}>
                  <h3 className={styles.chartTitle}>Perfil dos Pacientes</h3>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '160px', color: '#bbb', fontSize: '0.95rem' }}>
                    Nenhum paciente cadastrado ainda.
                  </div>
                </div>
              )}

              {/* Gráfico de área: relatórios por mês */}
              {stats?.relatoriosPorMes?.length > 0 ? (
                <div className={`${styles.chartCard} ${styles.span2}`}>
                  <h3 className={styles.chartTitle}>Relatórios por Mês</h3>
                  <div className={styles.chartWrapper}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={stats.relatoriosPorMes} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorRel" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#D94F8A" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#D94F8A" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                        <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                        <RechartsTooltip
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                        />
                        <Area type="monotone" dataKey="total" name="Relatórios" stroke="#D94F8A" strokeWidth={3} fillOpacity={1} fill="url(#colorRel)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ) : (
                <div className={`${styles.chartCard} ${styles.span2}`}>
                  <h3 className={styles.chartTitle}>Relatórios por Mês</h3>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '160px', color: '#bbb', fontSize: '0.95rem' }}>
                    Nenhum relatório registrado ainda.
                  </div>
                </div>
              )}

            </div>
          </>
        )}

      </div>
    </DashLayout>
  );
}
