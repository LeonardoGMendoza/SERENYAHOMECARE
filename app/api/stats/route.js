import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Arquivo local para salvar os dados sem precisar mexer no banco de dados principal agora
const statsFilePath = path.join(process.cwd(), 'site-stats.json');

// Valores iniciais para não começar do zero e manter a prova social alta
const defaultStats = {
  visits: 42950,
  videoViews: 15840
};

async function getStats() {
  try {
    const data = await fs.readFile(statsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // Se o arquivo não existir, cria com os valores padrão
    await fs.writeFile(statsFilePath, JSON.stringify(defaultStats, null, 2));
    return defaultStats;
  }
}

async function saveStats(stats) {
  await fs.writeFile(statsFilePath, JSON.stringify(stats, null, 2));
}

export async function GET() {
  const stats = await getStats();
  return NextResponse.json(stats);
}

export async function POST(request) {
  try {
    const { action } = await request.json();
    const stats = await getStats();

    if (action === 'visit') {
      stats.visits += 1;
    } else if (action === 'videoView') {
      stats.videoViews += 1;
    }

    await saveStats(stats);
    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao processar estatística' }, { status: 500 });
  }
}
