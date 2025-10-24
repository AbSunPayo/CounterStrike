
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { buscarPrecoSkin } from "@/lib/price-scraper";
import { enviarEmailAlerta } from "@/lib/email";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // Timeout de 60 segundos

const prisma = new PrismaClient();

/**
 * POST /api/monitor
 * Verifica os preços de todas as skins ativas e envia alertas
 */
export async function POST(request: NextRequest) {
  try {
    console.log('🤖 Iniciando verificação de preços...');

    // Busca configuração
    const config = await prisma.configuracao.findFirst();
    
    if (!config || !config.email) {
      return NextResponse.json({ 
        success: false, 
        message: 'Email não configurado' 
      });
    }

    // Busca todas as skins ativas
    const skins = await prisma.skin.findMany({
      where: {
        status: 'ativo'
      }
    });

    console.log(`📊 ${skins.length} skins ativas encontradas`);

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

    // Verifica cada skin
    for (const skin of skins) {
      try {
        console.log(`\n🔍 Verificando: ${skin.nome}`);
        
        // Busca o preço atual
        const precoAtual = await buscarPrecoSkin(skin.link);
        
        if (precoAtual === null) {
          console.log(`⚠️  Não foi possível buscar o preço de ${skin.nome}`);
          resultados.push({
            skinId: skin.id,
            nome: skin.nome,
            sucesso: false,
            erro: 'Não foi possível buscar o preço'
          });
          continue;
        }

        // Atualiza o preço atual no banco
        await prisma.skin.update({
          where: { id: skin.id },
          data: { precoAtual }
        });

        skinsVerificadas++;

        // Verifica se o preço atingiu ou ficou abaixo do alvo
        if (precoAtual <= skin.precoAlvo && skin.status === 'ativo') {
          console.log(`🎯 ALERTA! ${skin.nome}: R$ ${precoAtual.toFixed(2)} <= R$ ${skin.precoAlvo.toFixed(2)}`);
          
          // Envia email de alerta
          const emailResult = await enviarEmailAlerta({
            to: config.email,
            skinNome: skin.nome,
            precoAtual,
            precoAlvo: skin.precoAlvo,
            skinLink: skin.link,
            skinImagemUrl: skin.imagemUrl || undefined
          });

          if (emailResult.success) {
            // Registra o alerta no banco
            await prisma.alerta.create({
              data: {
                skinId: skin.id,
                precoAtingido: precoAtual
              }
            });

            // Atualiza status da skin para 'alerta_enviado'
            await prisma.skin.update({
              where: { id: skin.id },
              data: { status: 'alerta_enviado' }
            });

            alertasEnviados++;
            
            resultados.push({
              skinId: skin.id,
              nome: skin.nome,
              sucesso: true,
              alertaEnviado: true,
              precoAtual,
              precoAlvo: skin.precoAlvo
            });
          } else {
            resultados.push({
              skinId: skin.id,
              nome: skin.nome,
              sucesso: false,
              erro: 'Falha ao enviar email'
            });
          }
        } else {
          console.log(`✅ ${skin.nome}: R$ ${precoAtual.toFixed(2)} (alvo: R$ ${skin.precoAlvo.toFixed(2)})`);
          resultados.push({
            skinId: skin.id,
            nome: skin.nome,
            sucesso: true,
            alertaEnviado: false,
            precoAtual,
            precoAlvo: skin.precoAlvo
          });
        }

        // Delay de 2 segundos entre cada requisição para evitar rate limit
        await new Promise(resolve => setTimeout(resolve, 2000));

      } catch (error) {
        console.error(`❌ Erro ao processar ${skin.nome}:`, error);
        resultados.push({
          skinId: skin.id,
          nome: skin.nome,
          sucesso: false,
          erro: 'Erro ao processar skin'
        });
      }
    }

    // Atualiza última verificação
    await prisma.configuracao.update({
      where: { id: config.id },
      data: { ultimaVerificacao: new Date() }
    });

    console.log(`\n✅ Verificação concluída!`);
    console.log(`📊 Skins verificadas: ${skinsVerificadas}/${skins.length}`);
    console.log(`📧 Alertas enviados: ${alertasEnviados}`);

    return NextResponse.json({
      success: true,
      message: `Verificação concluída. ${alertasEnviados} alerta(s) enviado(s).`,
      skinsVerificadas,
      alertasEnviados,
      resultados
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
