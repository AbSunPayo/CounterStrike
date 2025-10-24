
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
    const { email } = await request.json();

    // Validação do email
    if (!email || !email.trim()) {
      return NextResponse.json(
        { success: false, error: "Email é obrigatório" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { success: false, error: "Email inválido" },
        { status: 400 }
      );
    }

    // Busca a configuração existente ou cria uma nova
    let config = await prisma.configuracao.findFirst();
    
    if (!config) {
      config = await prisma.configuracao.create({
        data: {
          email: email.trim()
        }
      });
    } else {
      config = await prisma.configuracao.update({
        where: { id: config.id },
        data: {
          email: email.trim()
        }
      });
    }

    return NextResponse.json({ 
      success: true, 
      data: config,
      message: "Email atualizado com sucesso!" 
    });
  } catch (error: any) {
    console.error("Erro ao atualizar configuração:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
