import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Carrega variáveis de ambiente
dotenv.config();

async function main() {
  const prisma = new PrismaClient();
  
  try {
    const config = await prisma.configuracao.findFirst();
    console.log('=== CONFIGURAÇÃO ATUAL ===');
    console.log('Email:', config?.email);
    console.log('Alertas Email:', config?.alertasEmail);
    console.log('Alertas Discord:', config?.alertasDiscord);
    console.log('Webhook Discord:', config?.webhookDiscord ? '(configurado)' : '(não configurado)');
    console.log('Discord Role Mention:', config?.discordRoleMention || '(não configurado)');
    
    const skins = await prisma.skin.findMany();
    console.log('\n=== SKINS CADASTRADAS ===');
    console.log(`Total: ${skins.length}`);
    skins.forEach(skin => {
      console.log(`\n- ${skin.nome}`);
      console.log(`  Status: ${skin.status}`);
      console.log(`  Tipo: ${skin.tipoAlerta}`);
      console.log(`  Preço Alvo: R$ ${skin.precoAlvo}`);
      console.log(`  Preço Atual: R$ ${skin.precoAtual || 'N/A'}`);
    });
    
  } catch (error) {
    console.error('Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
