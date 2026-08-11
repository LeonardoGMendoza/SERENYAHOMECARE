import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    // Verificação de autenticação (opcional baseada na sua regra)
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado. Acesso negado.' }, { status: 401 });
    }

    const body = await req.json();
    const { unidade, ativo, nome, responsavel, tipo, valor, vigencia } = body;

    if (!nome || !valor) {
      return NextResponse.json({ error: 'Nome e Valor são obrigatórios.' }, { status: 400 });
    }

    const novaMeta = await prisma.meta.create({
      data: {
        unidade: unidade || "",
        ativo: ativo ?? true,
        nome,
        responsavel: responsavel || "",
        tipo: tipo || "",
        valor: String(valor),
        vigencia: vigencia || "",
      },
    });

    return NextResponse.json({ status: "sucesso", dados_recebidos: novaMeta }, { status: 201 });
  } catch (error) {
    console.error("Erro ao salvar meta:", error);
    return NextResponse.json({ error: 'Erro interno no servidor.' }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado. Acesso negado.' }, { status: 401 });
    }

    const metas = await prisma.meta.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ status: "sucesso", metas }, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar metas:", error);
    return NextResponse.json({ error: 'Erro interno no servidor.' }, { status: 500 });
  }
}
