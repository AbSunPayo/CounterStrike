
/**
 * Biblioteca para enviar alertas via Discord Webhook
 */

interface DiscordAlertParams {
  webhookUrl: string;
  skinNome: string;
  precoAtual: number;
  precoAlvo: number;
  tipoAlerta: 'compra' | 'venda';
  skinLink: string;
  skinImagemUrl?: string;
  roleMention?: string; // Nome da role para mencionar (ex: "OhnePixel")
}

/**
 * Envia um alerta via Discord Webhook com mensagem embed
 */
export async function enviarAlertaDiscord(params: DiscordAlertParams): Promise<{ success: boolean; error?: string }> {
  try {
    const { webhookUrl, skinNome, precoAtual, precoAlvo, tipoAlerta, skinLink, skinImagemUrl, roleMention } = params;

    // Determina cor e texto baseado no tipo de alerta
    const isCompra = tipoAlerta === 'compra';
    const cor = isCompra ? 0x00ff00 : 0xff4444; // Verde para compra, vermelho para venda
    const emoji = isCompra ? '🔽' : '🔼';
    const acao = isCompra ? 'CAIU' : 'SUBIU';
    const preposicao = isCompra ? 'para' : 'para';

    // Cria o embed do Discord
    const embed: any = {
      title: `${emoji} Alerta de ${isCompra ? 'Compra' : 'Venda'} - ${skinNome}`,
      description: `O preço da skin **${acao}** ${preposicao} **R$ ${precoAtual.toFixed(2)}**!`,
      color: cor,
      fields: [
        {
          name: '💰 Preço Atual',
          value: `R$ ${precoAtual.toFixed(2)}`,
          inline: true
        },
        {
          name: '🎯 Preço Alvo',
          value: `R$ ${precoAlvo.toFixed(2)}`,
          inline: true
        },
        {
          name: '📊 Tipo de Alerta',
          value: isCompra ? '🔽 Compra (Preço Baixo)' : '🔼 Venda (Preço Alto)',
          inline: false
        },
        {
          name: '🔗 Link Steam Market',
          value: `[Clique aqui para ver no Steam](${skinLink})`,
          inline: false
        }
      ],
      timestamp: new Date().toISOString(),
      footer: {
        text: 'CS2 Skin Monitor'
      }
    };

    // Adiciona imagem se disponível
    if (skinImagemUrl) {
      embed.thumbnail = {
        url: skinImagemUrl
      };
    }

    // Prepara o payload do webhook
    const payload: any = {
      username: 'CS2 Skin Monitor',
      avatar_url: 'https://cdn.cloudflare.steamstatic.com/apps/csgo/images/csgo_react/social/cs2.jpg',
      embeds: [embed]
    };

    // Adiciona menção da role se configurada
    if (roleMention) {
      // Remove @ se já existir no nome da role
      const cleanRoleName = roleMention.startsWith('@') ? roleMention.slice(1) : roleMention;
      payload.content = `<@&${cleanRoleName}> 🎯 **Alerta de Preço!**`;
    }

    // Envia o webhook
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erro ao enviar webhook Discord:', response.status, errorText);
      return {
        success: false,
        error: `Erro HTTP ${response.status}: ${errorText}`
      };
    }

    console.log('✅ Alerta enviado para o Discord com sucesso!');
    return { success: true };

  } catch (error: any) {
    console.error('❌ Erro ao enviar alerta Discord:', error);
    return {
      success: false,
      error: error.message || 'Erro desconhecido'
    };
  }
}

/**
 * Testa o webhook do Discord
 */
export async function testarWebhookDiscord(webhookUrl: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
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
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: `Erro HTTP ${response.status}: ${errorText}`
      };
    }

    return { success: true };

  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Erro desconhecido'
    };
  }
}
