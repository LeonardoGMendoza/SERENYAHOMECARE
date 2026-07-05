import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { promises as fs } from 'fs';
import path from 'path';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function PATCH(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'diretora') {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ error: 'Status é obrigatório.' }, { status: 400 });
    }

    const candidato = await prisma.candidato.update({
      where: { id: parseInt(id) },
      data: { status },
    });

    return NextResponse.json(candidato, { status: 200 });
  } catch (error) {
    console.error('Erro ao atualizar candidato:', error);
    return NextResponse.json({ error: 'Erro interno no servidor.' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'diretora') {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
    }

    const { id } = await params;

    // Buscar o candidato para pegar a URL do currículo antes de deletar
    const candidato = await prisma.candidato.findUnique({
      where: { id: parseInt(id) },
    });

    if (!candidato) {
      return NextResponse.json({ error: 'Candidato não encontrado.' }, { status: 404 });
    }

    // Se houver arquivo físico de currículo, deletá-lo também
    if (candidato.curriculoUrl) {
      try {
        const filepath = path.join(process.cwd(), 'public', candidato.curriculoUrl);
        await fs.unlink(filepath);
      } catch (err) {
        console.error('Erro ao deletar arquivo de currículo físico:', err);
      }
    }

    await prisma.candidato.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Erro ao deletar candidato:', error);
    return NextResponse.json({ error: 'Erro interno no servidor.' }, { status: 500 });
  }
}
