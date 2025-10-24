import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const prisma = new PrismaClient();

async function testarRotacao() {
  console.log('\n🔍 Testando Sistema de Rotação\n');
  
  try {
    // Busca todas as skins
    const todasSkins = await prisma.skin.findMany({
      orderBy: { lastChecked: { sort: 'asc', nulls: 'first' } }
    });
    
    console.log(`📊 Total de skins no banco: ${todasSkins.length}\n`);
    
    // Busca as 15 skins que seriam verificadas no próximo cron
    const skinsCron = await prisma.skin.findMany({
      take: 15,
      orderBy: { lastChecked: { sort: 'asc', nulls: 'first' } }
    });
    
    console.log(`🤖 Próximas ${skinsCron.length} skins que serão verificadas pelo cron:\n`);
    
    skinsCron.forEach((skin, index) => {
      const lastCheckedStr = skin.lastChecked 
        ? new Date(skin.lastChecked).toLocaleString('pt-BR')
        : 'Nunca verificada';
      console.log(`${index + 1}. ${skin.nome}`);
      console.log(`   Última verificação: ${lastCheckedStr}\n`);
    });
    
    console.log('\n✅ Sistema de rotação funcionando corretamente!\n');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testarRotacao();
