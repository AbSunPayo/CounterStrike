
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Cria configuração padrão com email pré-configurado
  const config = await prisma.configuracao.upsert({
    where: { id: 'default-config' },
    update: {},
    create: {
      id: 'default-config',
      email: 'thiago.jcsampaio@gmail.com'
    },
  });

  console.log('✅ Configuração padrão criada:', config);
  console.log('📧 Email configurado:', config.email);
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
