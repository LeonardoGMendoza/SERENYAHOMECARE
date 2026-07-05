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
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
    }

    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(leads, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar leads:', error);
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
    }

    const body = await req.json();
    const { nome, telefone, origem, interesse } = body;

    if (!nome || !telefone) {
      return NextResponse.json({ error: 'Nome e telefone são obrigatórios.' }, { status: 400 });
    }

    const novoLead = await prisma.lead.create({
      data: { nome, telefone, origem, interesse }
    });

    return NextResponse.json(novoLead, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar lead:', error);
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 });
  }
}
