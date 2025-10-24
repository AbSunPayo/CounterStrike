
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { buscarPrecoSkin } from "@/lib/price-scraper";
import { enviarEmailAlerta } from "@/lib/email";
import { enviarAlertaDiscord } from "@/lib/discord";

export const dynamic = "force-dynamic";
export const maxDuration = 600; // Timeout de 10 minutos (para verificação manual de TODAS as skins)
export const runtime = 'nodejs'; // Usa Node.js runtime para melhor performance

const prisma = new PrismaClient();

/**
 * POST /api/monitor
 * Verifica os preços de todas as skins ativas e envia alertas
 * 
 * Body params:
 * - tipo: "manual" | "auto" (opcional, padrão: "auto")
 *   - "manual": Verificação manual (botão "Verificar Agora") - alerta 1x por dia
 *   - "auto": Verificação automática (cron job) - alerta sempre
 */
export async function POST(request: NextRequest) {
  try {
    // Determina o tipo de verificação
    let tipoVerificacao = 'auto'; // padrão: automático
    try {
      const body = await request.json();
      tipoVerificacao = body.tipo || 'auto';
    } catch (e) {
      // Se não conseguir ler o body, usa o padrão
    }

    const isManual = tipoVerificacao === 'manual';
    console.log(`🤖 Iniciando verificação de preços [${isManual ? 'MANUAL' : 'AUTOMÁTICA'}]...`);

    // Busca configuração
    const config = await prisma.configuracao.findFirst();
    
    if (!config || !config.email) {
      return NextResponse.json({ 
        success: false, 
        message: 'Email não configurado' 
      });
    }

    // Busca TODAS as skins (não apenas ativas) - Monitoramento Contínuo
    // Para cron automático, limita a 10 skins para caber no timeout de 30s (REDUZIDO para maior confiabilidade)
    // Usa rotação baseada em lastChecked para garantir que todas sejam verificadas
    const LIMITE_CRON = 10;
    const skins = !isManual 
      ? await prisma.skin.findMany({ 
          take: LIMITE_CRON,
          orderBy: { lastChecked: { sort: 'asc', nulls: 'first' } } // Prioriza skins não verificadas ou mais antigas
        })
      : await prisma.skin.findMany();

    console.log(`📊 ${skins.length} skins encontradas para verificação`);

    if (skins.length === 0) {
      return NextResponse.json({ 
        success: true, 
        message: 'Nenhuma skin ativa para monitorar',
        skinsVerificadas: 0
      });
    }

    let skinsVerificadas = 0;
    let alertasEnviados = 0;
    const resultados = [];

    // Função auxiliar para processar uma skin COM RETRY
    const processarSkin = async (skin: any, tentativa: number = 1): Promise<any> => {
      const MAX_TENTATIVAS = 2; // Tenta 2 vezes antes de desistir
      
      try {
        console.log(`\n🔍 Verificando: ${skin.nome} (${skin.tipoAlerta}) - Tentativa ${tentativa}/${MAX_TENTATIVAS}`);
        
        // Busca o preço atual
        const precoAtual = await buscarPrecoSkin(skin.link);
        
        if (precoAtual === null) {
          // Se falhou e ainda tem tentativas, tenta novamente
          if (tentativa < MAX_TENTATIVAS) {
            console.log(`⚠️  Falha na busca de ${skin.nome}, tentando novamente em 5s...`);
            await new Promise(resolve => setTimeout(resolve, 5000));
            return processarSkin(skin, tentativa + 1); // RETRY
          }
          
          // Esgotou as tentativas
          console.log(`❌ Não foi possível buscar o preço de ${skin.nome} após ${MAX_TENTATIVAS} tentativas`);
          
          // SEMPRE atualiza lastChecked mesmo em caso de erro
          await prisma.skin.update({
            where: { id: skin.id },
            data: { lastChecked: new Date() }
          });
          
          return {
            skinId: skin.id,
            nome: skin.nome,
            sucesso: false,
            erro: `Falha após ${MAX_TENTATIVAS} tentativas`
          };
        }

        // Atualiza o preço atual e lastChecked no banco (SEMPRE atualiza, monitoramento contínuo)
        await prisma.skin.update({
          where: { id: skin.id },
          data: { 
            precoAtual,
            lastChecked: new Date() // Registra timestamp da verificação
          }
        });

        skinsVerificadas++;

        // Determina se o alerta deve ser disparado baseado no tipo
        const isCompra = skin.tipoAlerta === 'compra';
        const precoNoAlvo = isCompra 
          ? (precoAtual <= skin.precoAlvo) // Compra: preço caiu
          : (precoAtual >= skin.precoAlvo); // Venda: preço subiu

        // Verifica se deve RESETAR o status (preço saiu da faixa)
        if (!precoNoAlvo && skin.status === 'alerta_enviado') {
          console.log(`🔄 Resetando status de ${skin.nome} - preço saiu da faixa`);
          await prisma.skin.update({
            where: { id: skin.id },
            data: { status: 'ativo' }
          });
        }

        // Lógica de alerta diferente para MANUAL vs AUTOMÁTICO
        let deveEnviarAlerta = false;

        if (isManual) {
          // VERIFICAÇÃO MANUAL: Alerta 1x por dia (Opção C)
          if (precoNoAlvo) {
            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0); // início do dia de hoje
            
            const ultimoAlerta = skin.ultimoAlertaManual;
            const jaAlertouHoje = ultimoAlerta && ultimoAlerta >= hoje;

            if (!jaAlertouHoje) {
              console.log(`📅 Verificação MANUAL: Enviando alerta diário para ${skin.nome}`);
              deveEnviarAlerta = true;
            } else {
              console.log(`⏸️  Verificação MANUAL: ${skin.nome} já foi alertado hoje`);
            }
          }
        } else {
          // VERIFICAÇÃO AUTOMÁTICA (CRON): Alerta sempre (Opção B)
          if (precoNoAlvo && skin.status === 'ativo') {
            console.log(`🤖 Verificação AUTO: Enviando alerta para ${skin.nome}`);
            deveEnviarAlerta = true;
          }
        }

        // Envia o alerta se necessário
        if (deveEnviarAlerta) {
          console.log(`🎯 ALERTA! ${skin.nome}: R$ ${precoAtual.toFixed(2)} ${isCompra ? '<=' : '>='} R$ ${skin.precoAlvo.toFixed(2)}`);
          
          let alertaSucesso = false;

          // Envia email de alerta (se configurado)
          if (config.email && config.alertasEmail) {
            const emailResult = await enviarEmailAlerta({
              to: config.email,
              skinNome: skin.nome,
              precoAtual,
              precoAlvo: skin.precoAlvo,
              tipoAlerta: skin.tipoAlerta as 'compra' | 'venda',
              skinLink: skin.link,
              skinImagemUrl: skin.imagemUrl || undefined
            });

            if (emailResult.success) {
              console.log(`✅ Email enviado para ${config.email}`);
              alertaSucesso = true;
            } else {
              console.error(`❌ Falha ao enviar email`);
            }
          }

          // Envia alerta Discord (se configurado)
          if (config.webhookDiscord && config.alertasDiscord) {
            const discordResult = await enviarAlertaDiscord({
              webhookUrl: config.webhookDiscord,
              skinNome: skin.nome,
              precoAtual,
              precoAlvo: skin.precoAlvo,
              tipoAlerta: skin.tipoAlerta as 'compra' | 'venda',
              skinLink: skin.link,
              skinImagemUrl: skin.imagemUrl || undefined,
              roleMention: config.discordRoleMention || undefined
            });

            if (discordResult.success) {
              console.log(`✅ Alerta Discord enviado`);
              alertaSucesso = true;
            } else {
              console.error(`❌ Falha ao enviar alerta Discord: ${discordResult.error}`);
            }
          }

          if (alertaSucesso) {
            // Registra o alerta no banco
            await prisma.alerta.create({
              data: {
                skinId: skin.id,
                precoAtingido: precoAtual
              }
            });

            // Atualiza status da skin
            const updateData: any = {};
            
            if (isManual) {
              // Verificação MANUAL: atualiza data do último alerta manual
              updateData.ultimoAlertaManual = new Date();
            } else {
              // Verificação AUTO: marca como 'alerta_enviado' para não repetir até sair da faixa
              updateData.status = 'alerta_enviado';
            }

            await prisma.skin.update({
              where: { id: skin.id },
              data: updateData
            });

            alertasEnviados++;
            
            return {
              skinId: skin.id,
              nome: skin.nome,
              sucesso: true,
              alertaEnviado: true,
              precoAtual,
              precoAlvo: skin.precoAlvo,
              tipoAlerta: skin.tipoAlerta
            };
          } else {
            return {
              skinId: skin.id,
              nome: skin.nome,
              sucesso: false,
              erro: 'Falha ao enviar alertas'
            };
          }
        } else {
          const statusEmoji = precoNoAlvo ? '⏸️' : '✅';
          console.log(`${statusEmoji} ${skin.nome}: R$ ${precoAtual.toFixed(2)} (alvo: R$ ${skin.precoAlvo.toFixed(2)}, status: ${skin.status})`);
          return {
            skinId: skin.id,
            nome: skin.nome,
            sucesso: true,
            alertaEnviado: false,
            precoAtual,
            precoAlvo: skin.precoAlvo,
            tipoAlerta: skin.tipoAlerta
          };
        }

      } catch (error) {
        console.error(`❌ Erro ao processar ${skin.nome}:`, error);
        return {
          skinId: skin.id,
          nome: skin.nome,
          sucesso: false,
          erro: 'Erro ao processar skin'
        };
      }
    };

    // Processa skins SEQUENCIALMENTE (uma de cada vez) para garantir que todas sejam processadas
    // Isso é mais lento, mas mais confiável (evita bloqueios do Steam)
    for (let i = 0; i < skins.length; i++) {
      const skin = skins[i];
      console.log(`\n📦 Processando skin ${i + 1}/${skins.length}: ${skin.nome}`);
      
      const resultado = await processarSkin(skin);
      resultados.push(resultado);

      // Delay de 3 segundos entre skins para evitar rate limiting da Steam
      if (i < skins.length - 1) {
        console.log(`⏳ Aguardando 3 segundos antes da próxima skin...`);
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }

    // Atualiza última verificação
    await prisma.configuracao.update({
      where: { id: config.id },
      data: { ultimaVerificacao: new Date() }
    });

    // Contabiliza resultados
    const totalSkins = skins.length;
    const skinsSucesso = resultados.filter(r => r.sucesso).length;
    const skinsFalha = resultados.filter(r => !r.sucesso).length;
    
    console.log(`\n✅ Verificação concluída!`);
    console.log(`📊 Total de skins tentadas: ${totalSkins}`);
    console.log(`✅ Sucesso: ${skinsSucesso}`);
    console.log(`❌ Falhas: ${skinsFalha}`);
    console.log(`📧 Alertas enviados: ${alertasEnviados}`);
    
    // Log detalhado das skins que falharam
    if (skinsFalha > 0) {
      console.log(`\n⚠️  Skins com falha:`);
      resultados.filter(r => !r.sucesso).forEach(r => {
        console.log(`  - ${r.nome}: ${r.erro}`);
      });
    }

    // Monta mensagem clara para o usuário
    let mensagem = `Verificação concluída! ${totalSkins} skins tentadas: `;
    mensagem += `${skinsSucesso} verificadas com sucesso`;
    if (skinsFalha > 0) {
      mensagem += `, ${skinsFalha} com erro`;
    }
    mensagem += `. ${alertasEnviados} alerta(s) enviado(s).`;

    return NextResponse.json({
      success: true,
      message: mensagem,
      totalSkins,
      skinsVerificadas: skinsSucesso,
      skinsFalha,
      alertasEnviados,
      resultados,
      skinsFalhadas: resultados.filter(r => !r.sucesso).map(r => ({ nome: r.nome, erro: r.erro }))
    });

  } catch (error: any) {
    console.error('❌ Erro na verificação de preços:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao verificar preços',
        details: error.message 
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
