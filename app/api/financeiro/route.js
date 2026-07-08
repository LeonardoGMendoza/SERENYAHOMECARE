import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'diretora') {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
    }

    const movimentacoes = await prisma.financeiro.findMany({
      orderBy: { data: 'desc' }
    });

    // KPIs do mês atual
    const agora = new Date();
    const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1);
    const fimMes = new Date(agora.getFullYear(), agora.getMonth() + 1, 0, 23, 59, 59);

    const doMes = movimentacoes.filter(m => new Date(m.data) >= inicioMes && new Date(m.data) <= fimMes);
    const entradaMes = doMes.filter(m => m.tipo === 'entrada').reduce((s, m) => s + m.valor, 0);
    const saidaMes = doMes.filter(m => m.tipo === 'saida').reduce((s, m) => s + m.valor, 0);
    const saldoMes = entradaMes - saidaMes;

    // Totais gerais
    const totalEntradas = movimentacoes.filter(m => m.tipo === 'entrada').reduce((s, m) => s + m.valor, 0);
    const totalSaidas = movimentacoes.filter(m => m.tipo === 'saida').reduce((s, m) => s + m.valor, 0);

    // Tendência dos últimos 6 meses (igual ao gold.tc_agg_tendencia_mensal do projeto)
    const mesesNomes = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const tendencia = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(agora.getFullYear(), agora.getMonth() - i, 1);
      const inicio = new Date(d.getFullYear(), d.getMonth(), 1);
      const fim = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
      const doMesFiltro = movimentacoes.filter(m => new Date(m.data) >= inicio && new Date(m.data) <= fim);
      const entrada = doMesFiltro.filter(m => m.tipo === 'entrada').reduce((s, m) => s + m.valor, 0);
      const saida = doMesFiltro.filter(m => m.tipo === 'saida').reduce((s, m) => s + m.valor, 0);
      tendencia.push({ mes: mesesNomes[d.getMonth()], entrada, saida, lucro: entrada - saida });
    }

    // Crescimento MoM (Window function LAG equivalente)
    for (let i = 1; i < tendencia.length; i++) {
      const anterior = tendencia[i - 1].entrada;
      const atual = tendencia[i].entrada;
      tendencia[i].crescimento = anterior > 0 ? (((atual - anterior) / anterior) * 100).toFixed(1) : 0;
    }

    // Receita por categoria (igual ao gold.tc_agg_vendas_por_categoria)
    const catMap = {};
    movimentacoes.filter(m => m.tipo === 'entrada').forEach(m => {
      catMap[m.categoria] = (catMap[m.categoria] || 0) + m.valor;
    });
    const porCategoria = Object.entries(catMap)
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({ name, value: parseFloat(value.toFixed(2)) }));

    // Distribuição por tipo (igual ao gold.tc_agg_vendas_por_canal)
    const distribuicao = [
      { name: 'Entradas', value: parseFloat(totalEntradas.toFixed(2)) },
      { name: 'Saídas', value: parseFloat(totalSaidas.toFixed(2)) }
    ];

    // Previsão próximo mês (regressão linear simples sobre as entradas)
    const entradas6meses = tendencia.map(t => t.entrada);
    const n = entradas6meses.length;
    const sumX = n * (n - 1) / 2;
    const sumY = entradas6meses.reduce((s, v) => s + v, 0);
    const sumXY = entradas6meses.reduce((s, v, i) => s + i * v, 0);
    const sumX2 = entradas6meses.reduce((s, _, i) => s + i * i, 0);
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX) || 0;
    const intercept = (sumY - slope * sumX) / n || 0;
    const previsaoEntrada = Math.max(0, intercept + slope * n);

    const saidasArr = tendencia.map(t => t.saida);
    const sumYs = saidasArr.reduce((s, v) => s + v, 0);
    const sumXYs = saidasArr.reduce((s, v, i) => s + i * v, 0);
    const slopes = (n * sumXYs - sumX * sumYs) / (n * sumX2 - sumX * sumX) || 0;
    const intercepts = (sumYs - slopes * sumX) / n || 0;
    const previsaoSaida = Math.max(0, intercepts + slopes * n);

    // Alertas de ciência de dados
    const alertas = [];
    const ultimoLucro = tendencia[tendencia.length - 1]?.lucro || 0;
    const penultimoLucro = tendencia[tendencia.length - 2]?.lucro || 0;
    if (ultimoLucro < penultimoLucro && penultimoLucro !== 0) {
      alertas.push({ tipo: 'warning', msg: '⚠️ Lucro deste mês está abaixo do mês anterior.' });
    }
    const ultimaEntrada = tendencia[tendencia.length - 1]?.entrada || 0;
    const ultimaSaida = tendencia[tendencia.length - 1]?.saida || 0;
    if (ultimaSaida > ultimaEntrada * 0.8) {
      alertas.push({ tipo: 'danger', msg: '🔴 Despesas representam mais de 80% das receitas este mês!' });
    }
    const crescMes = parseFloat(tendencia[tendencia.length - 1]?.crescimento || 0);
    if (crescMes > 10) {
      alertas.push({ tipo: 'success', msg: `🚀 Crescimento de ${crescMes}% em relação ao mês anterior!` });
    }

    return NextResponse.json({
      movimentacoes,
      kpis: { entradaMes, saidaMes, saldoMes, totalEntradas, totalSaidas },
      tendencia,
      porCategoria,
      distribuicao,
      previsao: {
        entrada: parseFloat(previsaoEntrada.toFixed(2)),
        saida: parseFloat(previsaoSaida.toFixed(2)),
        lucro: parseFloat((previsaoEntrada - previsaoSaida).toFixed(2))
      },
      alertas
    });

  } catch (error) {
    console.error('Erro ao buscar financeiro:', error);
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'diretora') {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
    }

    const body = await req.json();
    const { tipo, categoria, descricao, valor, data } = body;

    if (!tipo || !categoria || !valor) {
      return NextResponse.json({ error: 'Tipo, categoria e valor são obrigatórios.' }, { status: 400 });
    }

    const mov = await prisma.financeiro.create({
      data: {
        tipo,
        categoria,
        descricao: descricao || '',
        valor: parseFloat(valor),
        data: data ? new Date(data) : new Date()
      }
    });

    return NextResponse.json(mov, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar movimentação:', error);
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'diretora') {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    await prisma.financeiro.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao excluir:', error);
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 });
  }
}
