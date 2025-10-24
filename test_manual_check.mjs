import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const prisma = new PrismaClient();

async function testarVerificacaoManual() {
  console.log('\n🧪 Simulando verificação MANUAL...\n');
  
  try {
    // Simula o que a API faz para verificação manual
    const tipoVerificacao = 'manual';
    const isManual = tipoVerificacao === 'manual';
    
    console.log(`Tipo: ${tipoVerificacao}`);
    console.log(`isManual: ${isManual}`);
    
    const LIMITE_CRON = 15;
    const skins = !isManual 
      ? await prisma.skin.findMany({ 
          take: LIMITE_CRON,
          orderBy: { lastChecked: { sort: 'asc', nulls: 'first' } }
        })
      : await prisma.skin.findMany();
    
    console.log(`\n📊 Skins que seriam verificadas: ${skins.length}`);
    console.log(`\n✅ ${!isManual ? 'CRON (15 skins)' : 'MANUAL (TODAS as skins)'}\n`);
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testarVerificacaoManual();
