
/**
 * Daemon de monitoramento automático de preços
 * Este script roda em background e verifica os preços periodicamente
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

let verificacaoEmAndamento = false;

async function verificarSeDeveRodar() {
  try {
    const config = await prisma.configuracao.findFirst();
    
    if (!config || !config.email) {
      console.log('⚠️  Email não configurado');
      return false;
    }

    return true;
  } catch (error) {
    console.error('❌ Erro ao verificar configuração:', error);
    return false;
  }
}

async function executarVerificacao() {
  if (verificacaoEmAndamento) {
    console.log('⏳ Verificação já em andamento, pulando...');
    return;
  }

  verificacaoEmAndamento = true;

  try {
    console.log('\n🤖 Daemon: Iniciando verificação automática...');
    
    const response = await fetch(`${API_URL}/api/monitor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    const result = await response.json();

    if (result.success) {
      console.log(`✅ Verificação concluída!`);
      console.log(`📊 Skins verificadas: ${result.skinsVerificadas}`);
      console.log(`📧 Alertas enviados: ${result.alertasEnviados}`);
    } else {
      console.error('❌ Erro na verificação:', result.message || result.error);
    }
  } catch (error) {
    console.error('❌ Erro ao executar verificação:', error);
  } finally {
    verificacaoEmAndamento = false;
  }
}

async function loop() {
  console.log('🚀 Daemon de monitoramento iniciado!');
  console.log(`🔗 API URL: ${API_URL}`);
  console.log('⏰ Verificando a cada 1 minuto se deve executar...\n');

  // Verifica a cada 1 minuto se deve rodar
  setInterval(async () => {
    const deveRodar = await verificarSeDeveRodar();
    
    if (deveRodar) {
      await executarVerificacao();
    }
  }, 60 * 1000); // 60 segundos

  // Executa uma verificação imediata ao iniciar
  const deveRodar = await verificarSeDeveRodar();
  if (deveRodar) {
    await executarVerificacao();
  }
}

// Trata sinais de término
process.on('SIGINT', async () => {
  console.log('\n👋 Encerrando daemon...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n👋 Encerrando daemon...');
  await prisma.$disconnect();
  process.exit(0);
});

// Inicia o loop
loop().catch(async (error) => {
  console.error('❌ Erro fatal no daemon:', error);
  await prisma.$disconnect();
  process.exit(1);
});
