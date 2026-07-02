'use client';
import DashLayout from '../../components/DashLayout';
import {
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area
} from 'recharts';
import styles from './dashboard.module.css';

// Dados fictícios para demonstração
const kpis = [
  { title: 'Pacientes Ativos', value: '142', trend: '+12%', color: 'pink' },
  { title: 'Profissionais', value: '45', trend: '+3', color: 'green' },
  { title: 'Novos Leads', value: '28', trend: '+15%', color: 'blue' },
  { title: 'Atendimentos/mês', value: '1.240', trend: '+8%', color: 'purple' }
];

const dataPacientes = [
  { name: 'Idosos', value: 85, color: '#D94F8A' },
  { name: 'Pós-Cirúrgico', value: 30, color: '#4a8c52' },
  { name: 'Pediatria', value: 15, color: '#8b5e8a' },
  { name: 'Outros', value: 12, color: '#F07EB5' }
];

const dataEvolucao = [
  { mes: 'Jan', pacientes: 110, leads: 40 },
  { mes: 'Fev', pacientes: 115, leads: 35 },
  { mes: 'Mar', pacientes: 125, leads: 50 },
  { mes: 'Abr', pacientes: 130, leads: 45 },
  { mes: 'Mai', pacientes: 138, leads: 60 },
  { mes: 'Jun', pacientes: 142, leads: 55 }
];

export default function DashboardOverview() {
  return (
    <DashLayout>
      <div className={styles.container}>
        
        {/* Boas-vindas */}
        <div className={styles.welcomeRow}>
          <div>
            <h1 className={styles.pageTitle}>Visão Geral</h1>
            <p className={styles.pageSub}>Acompanhe os principais indicadores da Serenya.</p>
          </div>
          <button className={styles.reportBtn}>📥 Exportar Relatório</button>
        </div>

        {/* KPIs */}
        <div className={styles.kpiGrid}>
          {kpis.map((kpi, i) => (
            <div key={i} className={styles.kpiCard}>
              <div className={styles.kpiHeader}>
                <span className={styles.kpiTitle}>{kpi.title}</span>
                <span className={`${styles.kpiTrend} ${styles[kpi.color]}`}>{kpi.trend}</span>
              </div>
              <div className={styles.kpiValue}>{kpi.value}</div>
            </div>
          ))}
        </div>

        {/* Gráficos */}
        <div className={styles.chartsGrid}>
          {/* Gráfico 1: Distribuição */}
          <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>Perfil dos Pacientes</h3>
            <div className={styles.chartWrapper}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dataPacientes}
                    cx="50%" cy="50%"
                    innerRadius={60} outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {dataPacientes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
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
              {dataPacientes.map((item, i) => (
                <div key={i} className={styles.legendItem}>
                  <div className={styles.legendDot} style={{ background: item.color }} />
                  <span>{item.name} ({item.value})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Gráfico 2: Evolução */}
          <div className={`${styles.chartCard} ${styles.span2}`}>
            <h3 className={styles.chartTitle}>Crescimento e Leads (Semestre)</h3>
            <div className={styles.chartWrapper}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dataEvolucao} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPac" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D94F8A" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#D94F8A" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4a8c52" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#4a8c52" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                  <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                  />
                  <Area type="monotone" dataKey="pacientes" name="Pacientes" stroke="#D94F8A" strokeWidth={3} fillOpacity={1} fill="url(#colorPac)" />
                  <Area type="monotone" dataKey="leads" name="Leads" stroke="#4a8c52" strokeWidth={3} fillOpacity={1} fill="url(#colorLeads)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>
    </DashLayout>
  );
}
