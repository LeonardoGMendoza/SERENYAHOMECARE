import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function PATCH(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'diretora') {
      return NextResponse.json({ error: 'Não autorizado. Apenas a Diretoria pode acessar.' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { name, email, role, password, pacientesIds } = body;

    const dataToUpdate = {};
    if (name) dataToUpdate.name = name;
    if (email) dataToUpdate.email = email;
    if (role) dataToUpdate.role = role;
    if (password) {
      dataToUpdate.password = await bcrypt.hash(password, 10);
    }
    if (pacientesIds !== undefined) {
      dataToUpdate.pacientesDesignados = {
        set: pacientesIds.map(id => ({ id: parseInt(id) }))
      };
    }

    const usuario = await prisma.user.update({
      where: { id: parseInt(id) },
      data: dataToUpdate,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        pacientesDesignados: {
          select: {
            id: true,
            nome: true
          }
        },
        createdAt: true,
      }
    });

    return NextResponse.json(usuario, { status: 200 });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    return NextResponse.json({ error: 'Erro interno no servidor.' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'diretora') {
      return NextResponse.json({ error: 'Não autorizado. Apenas a Diretoria pode acessar.' }, { status: 401 });
    }

    const { id } = await params;

    await prisma.user.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    return NextResponse.json({ error: 'Erro interno no servidor.' }, { status: 500 });
  }
}
