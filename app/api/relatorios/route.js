import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
    }

    const body = await req.json();
    const {
      pacienteId,
      pacienteNome,
      turno,
      pressaoArterial,
      temperatura,
      frequenciaCardiaca,
      glicemia,
      banho,
      alimentacao,
      eliminacoes,
      medicacoes,
      relatoPlantao
    } = body;

    if (!pacienteId || !pacienteNome) {
      return NextResponse.json({ error: 'Selecione um paciente.' }, { status: 400 });
    }

    const cuidadorId = String(session.user.id || '0');
    const cuidadorNome = session.user.name || 'Desconhecido';

    const novoRelatorio = await prisma.relatorioDiario.create({
      data: {
        cuidadorId,
        cuidadorNome,
        pacienteId: parseInt(pacienteId),
        pacienteNome,
        turno,
        pressaoArterial,
        temperatura,
        frequenciaCardiaca,
        glicemia,
        banho: !!banho,
        alimentacao,
        eliminacoes,
        medicacoes,
        relatoPlantao
      }
    });

    return NextResponse.json(novoRelatorio, { status: 201 });
  } catch (error) {
    console.error('Erro ao salvar relatório diário:', error);
    return NextResponse.json({ error: 'Erro interno no servidor.' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'diretora') {
      return NextResponse.json({ error: 'Não autorizado. Apenas a Diretoria pode acessar.' }, { status: 401 });
    }

    const relatorios = await prisma.relatorioDiario.findMany({
      orderBy: { data: 'desc' }
    });

    return NextResponse.json(relatorios, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar relatórios diários:', error);
    return NextResponse.json({ error: 'Erro interno no servidor.' }, { status: 500 });
  }
}
