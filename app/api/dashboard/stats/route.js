import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
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

    // Totais gerais
    const [totalPacientes, totalProfissionais, totalLeads] = await Promise.all([
      prisma.paciente.count({ where: { status: 'Ativo' } }),
      prisma.profissional.count({ where: { status: 'Ativo' } }),
      prisma.lead.count(),
    ]);

    // Relatórios do mês atual
    const inicioMes = new Date();
    inicioMes.setDate(1);
    inicioMes.setHours(0, 0, 0, 0);
    const relatoriosMes = await prisma.relatorioDiario.count({
      where: { createdAt: { gte: inicioMes } }
    });

    // Relatórios dos últimos 6 meses (para o gráfico)
    const agora = new Date();
    const relatoriosPorMes = [];
    const mesesNomes = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(agora.getFullYear(), agora.getMonth() - i, 1);
      const inicio = new Date(d.getFullYear(), d.getMonth(), 1);
      const fim = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);

      const total = await prisma.relatorioDiario.count({
        where: { createdAt: { gte: inicio, lte: fim } }
      });

      relatoriosPorMes.push({
        mes: mesesNomes[d.getMonth()],
        total
      });
    }

    // Diagnósticos dos pacientes (top 4 para o gráfico de pizza)
    const pacientes = await prisma.paciente.findMany({
      select: { diagnostico: true },
      where: { status: 'Ativo' }
    });

    const diagMap = {};
    pacientes.forEach(p => {
      const diag = p.diagnostico?.trim() || 'Não informado';
      diagMap[diag] = (diagMap[diag] || 0) + 1;
    });

    const diagnosticos = Object.entries(diagMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([name, value]) => ({ name, value }));

    return NextResponse.json({
      totalPacientes,
      totalProfissionais,
      totalLeads,
      relatoriosMes,
      relatoriosPorMes,
      diagnosticos
    });

  } catch (error) {
    console.error('Erro ao buscar stats do dashboard:', error);
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 });
  }
}
