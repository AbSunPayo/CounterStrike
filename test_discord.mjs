import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

async function testDiscord() {
  const prisma = new PrismaClient();
  
  try {
    const config = await prisma.configuracao.findFirst();
    
    if (!config || !config.webhookDiscord) {
      console.log('❌ Webhook do Discord não configurado');
      return;
    }
    
    console.log('📝 Testando webhook do Discord...');
    console.log('Webhook URL:', config.webhookDiscord.substring(0, 50) + '...');
    console.log('Role Mention:', config.discordRoleMention);
    console.log('Alertas Discord:', config.alertasDiscord);
    
    // Prepara o payload de teste
    const payload = {
      username: 'CS2 Skin Monitor',
      avatar_url: 'https://cdn.cloudflare.steamstatic.com/apps/csgo/images/csgo_react/social/cs2.jpg',
      embeds: [{
        title: '✅ Teste de Webhook',
        description: 'Seu webhook do Discord está funcionando perfeitamente!',
        color: 0x00ff00,
        timestamp: new Date().toISOString(),
        footer: {
          text: 'CS2 Skin Monitor - Teste de Configuração'
        }
      }]
    };
    
    // Adiciona menção da role se configurada
    if (config.discordRoleMention) {
      payload.content = `<@&${config.discordRoleMention}> 🎯 **Teste de Alerta!**`;
      console.log('Content:', payload.content);
    }
    
    // Envia o webhook
    const response = await fetch(config.webhookDiscord, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    const responseText = await response.text();
    
    if (!response.ok) {
      console.error('❌ Erro ao enviar webhook Discord:', response.status);
      console.error('Response:', responseText);
    } else {
      console.log('✅ Webhook enviado com sucesso!');
      console.log('Status:', response.status);
    }
    
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDiscord();
