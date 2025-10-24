
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

// GET - Buscar configuração
export async function GET() {
  try {
    // Busca a primeira (e única) configuração, ou cria uma nova
    let config = await prisma.configuracao.findFirst();
    
    if (!config) {
      config = await prisma.configuracao.create({
        data: {}
      });
    }

    return NextResponse.json({ success: true, data: config });
  } catch (error) {
    console.error("Erro ao buscar configuração:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// PUT - Atualizar configuração
export async function PUT(request: NextRequest) {
  try {
    const { email, webhookDiscord, discordRoleMention, alertasEmail, alertasDiscord } = await request.json();

    // Validação do email
    if (email && email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        return NextResponse.json(
          { success: false, error: "Email inválido" },
          { status: 400 }
        );
      }
    }

    // Validação do webhook Discord (opcional)
    if (webhookDiscord && webhookDiscord.trim()) {
      const webhookRegex = /^https:\/\/discord\.com\/api\/webhooks\/\d+\/[\w-]+$/;
      if (!webhookRegex.test(webhookDiscord.trim())) {
        return NextResponse.json(
          { success: false, error: "URL do webhook Discord inválida. Deve ser no formato: https://discord.com/api/webhooks/..." },
          { status: 400 }
        );
      }
    }

    // Busca a configuração existente ou cria uma nova
    let config = await prisma.configuracao.findFirst();
    
    const updateData: any = {};
    if (email !== undefined) updateData.email = email?.trim() || null;
    if (webhookDiscord !== undefined) updateData.webhookDiscord = webhookDiscord?.trim() || null;
    if (discordRoleMention !== undefined) updateData.discordRoleMention = discordRoleMention?.trim() || null;
    if (alertasEmail !== undefined) updateData.alertasEmail = alertasEmail;
    if (alertasDiscord !== undefined) updateData.alertasDiscord = alertasDiscord;

    if (!config) {
      config = await prisma.configuracao.create({
        data: updateData
      });
    } else {
      config = await prisma.configuracao.update({
        where: { id: config.id },
        data: updateData
      });
    }

    return NextResponse.json({ 
      success: true, 
      data: config,
      message: "Configurações atualizadas com sucesso!" 
    });
  } catch (error: any) {
    console.error("Erro ao atualizar configuração:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
