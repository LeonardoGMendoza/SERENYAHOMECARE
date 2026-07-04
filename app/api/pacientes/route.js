import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL
});

export async function POST(req) {
  try {
    // 1. Verificação de Segurança Severa (Apenas Logados)
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado. Acesso negado.' }, { status: 401 });
    }

    // 2. Extrair dados do formulário
    const body = await req.json();
    const { nome, telefone, endereco, diagnostico, alergias, grauDependencia, medicacoes, observacoesEnfermagem } = body;

    if (!nome) {
      return NextResponse.json({ error: 'Nome é obrigatório.' }, { status: 400 });
    }

    // 3. Salvar no banco de dados com segurança
    const novoPaciente = await prisma.paciente.create({
      data: {
        nome,
        telefone,
        endereco,
        diagnostico,
        alergias,
        grauDependencia,
        medicacoes,
        observacoesEnfermagem,
      },
    });

    return NextResponse.json(novoPaciente, { status: 201 });
  } catch (error) {
    console.error("Erro ao salvar paciente:", error);
    return NextResponse.json({ error: 'Erro interno no servidor.' }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    // Apenas logados podem ver a lista de pacientes
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado. Acesso negado.' }, { status: 401 });
    }

    const pacientes = await prisma.paciente.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(pacientes, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar pacientes:", error);
    return NextResponse.json({ error: 'Erro interno no servidor.' }, { status: 500 });
  }
}
