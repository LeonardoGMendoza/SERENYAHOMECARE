import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'diretora') {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
    }

    const { pacienteNome } = await req.json();

    if (!pacienteNome) {
      return NextResponse.json({ error: 'Nome do paciente é obrigatório.' }, { status: 400 });
    }

    // Buscar o paciente para pegar o email do familiar
    const paciente = await prisma.paciente.findFirst({
      where: { nome: pacienteNome },
      orderBy: { createdAt: 'desc' }
    });

    if (!paciente || !paciente.emailFamiliar) {
      return NextResponse.json({ error: 'Paciente não possui e-mail cadastrado.' }, { status: 400 });
    }

    // Pegar os relatórios dos últimos 7 dias
    const seteDiasAtras = new Date();
    seteDiasAtras.setDate(seteDiasAtras.getDate() - 7);

    const relatorios = await prisma.relatorioDiario.findMany({
      where: {
        pacienteId: paciente.id,
        data: {
          gte: seteDiasAtras
        }
      },
      orderBy: { data: 'asc' }
    });

    if (relatorios.length === 0) {
      return NextResponse.json({ error: 'Nenhum relatório encontrado nos últimos 7 dias.' }, { status: 404 });
    }

    // Configurar o Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Montar o e-mail HTML
    let htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <div style="text-align: center; padding: 20px 0; background-color: #fdf5f8; border-bottom: 2px solid #D94F8A;">
          <h1 style="color: #D94F8A; margin: 0;">🌸 Serenya Homecare</h1>
          <p style="margin: 5px 0 0 0; color: #555; font-size: 14px;">Relatório Semanal de Saúde</p>
        </div>
        
        <div style="padding: 20px;">
          <h2 style="color: #4a8c52; border-bottom: 1px solid #eee; padding-bottom: 10px;">Paciente: ${pacienteNome}</h2>
          <p><strong>Período:</strong> ${seteDiasAtras.toLocaleDateString('pt-BR')} a ${new Date().toLocaleDateString('pt-BR')}</p>
          
          <h3 style="color: #333; margin-top: 30px;">📋 Resumo dos Plantões</h3>
    `;

    relatorios.forEach(r => {
      const dataStr = new Date(r.data).toLocaleDateString('pt-BR');
      htmlContent += `
        <div style="background-color: #fafbfc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; margin-bottom: 15px;">
          <h4 style="margin: 0 0 10px 0; color: #D94F8A;">📅 ${dataStr} - Turno: ${r.turno || 'N/A'}</h4>
          <p style="margin: 5px 0; font-size: 14px;"><strong>Cuidador(a):</strong> ${r.cuidadorNome}</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 14px;">
            <tr>
              <td style="padding: 4px 0;"><strong>PA:</strong> ${r.pressaoArterial || '--'}</td>
              <td style="padding: 4px 0;"><strong>Temp:</strong> ${r.temperatura ? r.temperatura + '°C' : '--'}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0;"><strong>FC:</strong> ${r.frequenciaCardiaca ? r.frequenciaCardiaca + 'bpm' : '--'}</td>
              <td style="padding: 4px 0;"><strong>Glicemia:</strong> ${r.glicemia ? r.glicemia + 'mg/dL' : '--'}</td>
            </tr>
          </table>

          <div style="font-size: 14px; color: #555; border-top: 1px dashed #ccc; padding-top: 10px;">
            <p style="margin: 3px 0;"><strong>Banho:</strong> ${r.banho ? '✅ Sim' : '❌ Não'}</p>
            <p style="margin: 3px 0;"><strong>Alimentação:</strong> ${r.alimentacao || '--'}</p>
            <p style="margin: 3px 0;"><strong>Medicações:</strong> ${r.medicacoes || '--'}</p>
            <p style="margin: 3px 0;"><strong>Relato:</strong> ${r.relatoPlantao || 'Sem observações.'}</p>
          </div>
        </div>
      `;
    });

    htmlContent += `
        </div>
        <div style="text-align: center; padding: 20px; font-size: 12px; color: #888; background-color: #f9f9f9;">
          <p>Este é um e-mail automático gerado pelo sistema Serenya Homecare.</p>
          <p>Qualquer dúvida, entre em contato com a nossa equipe.</p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: '"Serenya Homecare" <' + process.env.EMAIL_USER + '>',
      to: paciente.emailFamiliar,
      subject: `Relatório Semanal de Saúde - ${pacienteNome}`,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'E-mail enviado com sucesso!' }, { status: 200 });
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    return NextResponse.json({ error: 'Erro ao enviar e-mail. Verifique as configurações.' }, { status: 500 });
  }
}
