import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'diretora') {
      return NextResponse.json({ error: 'Não autorizado. Apenas a Diretoria pode acessar.' }, { status: 401 });
    }

    const usuarios = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      }
    });

    return NextResponse.json(usuarios, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return NextResponse.json({ error: 'Erro interno no servidor.' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'diretora') {
      return NextResponse.json({ error: 'Não autorizado. Apenas a Diretoria pode acessar.' }, { status: 401 });
    }

    const body = await req.json();
    const { name, email, role, password } = body;

    if (!name || !email || !role) {
      return NextResponse.json({ error: 'Nome, E-mail e Cargo são obrigatórios.' }, { status: 400 });
    }

    // Verificar se usuário já existe
    const usuarioExistente = await prisma.user.findUnique({
      where: { email }
    });

    if (usuarioExistente) {
      return NextResponse.json({ error: 'Este e-mail já está autorizado/cadastrado.' }, { status: 400 });
    }

    // Hashing de senha (se fornecido, senão gerar aleatório ou senha fixa como backup)
    const rawPassword = password || 'SerenyaColab2026';
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    const novoUsuario = await prisma.user.create({
      data: {
        name,
        email,
        role,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      }
    });

    return NextResponse.json(novoUsuario, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return NextResponse.json({ error: 'Erro interno no servidor.' }, { status: 500 });
  }
}
