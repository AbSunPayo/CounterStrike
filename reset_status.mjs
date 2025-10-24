import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  const prisma = new PrismaClient();
  
  try {
    // Reset status das skins que já enviaram alerta
    const result = await prisma.skin.updateMany({
      where: {
        status: 'alerta_enviado'
      },
      data: {
        status: 'ativo'
      }
    });
    
    console.log(`✅ ${result.count} skin(s) resetada(s) para status 'ativo'`);
    
  } catch (error) {
    console.error('Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
