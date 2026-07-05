import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { promises as fs } from 'fs';
import path from 'path';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function POST(req) {
  try {
    const formData = await req.formData();
    const nome = formData.get('nome');
    const email = formData.get('email');
    const telefone = formData.get('telefone');
    const cargo = formData.get('cargo');
    const experiencia = formData.get('experiencia');
    const cidade = formData.get('cidade');
    const file = formData.get('curriculo');

    if (!nome || !email || !telefone || !cargo) {
      return NextResponse.json({ error: 'Campos obrigatórios ausentes.' }, { status: 400 });
    }

    let curriculoUrl = null;

    if (file && typeof file !== 'string' && file.name) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Limpar nome do arquivo
      const safeFilename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'curriculos');

      // Garantir que a pasta exista
      await fs.mkdir(uploadDir, { recursive: true });

      const filepath = path.join(uploadDir, safeFilename);
      await fs.writeFile(filepath, buffer);
      
      curriculoUrl = `/uploads/curriculos/${safeFilename}`;
    }

    const candidato = await prisma.candidato.create({
      data: {
        nome,
        email,
        telefone,
        cargo,
        experiencia,
        cidade,
        curriculoUrl,
      },
    });

    return NextResponse.json(candidato, { status: 201 });
  } catch (error) {
    console.error('Erro ao cadastrar candidato:', error);
    return NextResponse.json({ error: 'Erro interno no servidor.' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'diretora') {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
    }

    const candidatos = await prisma.candidato.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(candidatos, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar candidatos:', error);
    return NextResponse.json({ error: 'Erro interno no servidor.' }, { status: 500 });
  }
}
