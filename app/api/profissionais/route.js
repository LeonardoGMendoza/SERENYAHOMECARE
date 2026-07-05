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

    const profissionais = await prisma.profissional.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(profissionais, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar profissionais:', error);
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
    const { nome, telefone, cargo, documento } = body;

    if (!nome || !cargo) {
      return NextResponse.json({ error: 'Nome e cargo são obrigatórios.' }, { status: 400 });
    }

    const novoProfissional = await prisma.profissional.create({
      data: { nome, telefone, cargo, documento }
    });

    return NextResponse.json(novoProfissional, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar profissional:', error);
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 });
  }
}
