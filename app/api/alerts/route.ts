
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

// GET - Buscar histórico de alertas
export async function GET() {
  try {
    const alertas = await prisma.alerta.findMany({
      include: {
        skin: {
          select: {
            nome: true,
            link: true,
            imagemUrl: true
          }
        }
      },
      orderBy: { dataAlerta: "desc" },
      take: 50 // Limitar a 50 alertas mais recentes
    });

    return NextResponse.json({ success: true, data: alertas });
  } catch (error) {
    console.error("Erro ao buscar alertas:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// POST - Criar novo alerta (usado pelo daemon)
export async function POST(request: NextRequest) {
  try {
    const { skinId, precoAtingido } = await request.json();

    if (!skinId || !precoAtingido) {
      return NextResponse.json(
        { success: false, error: "Campos obrigatórios: skinId e precoAtingido" },
        { status: 400 }
      );
    }

    // Verificar se a skin existe
    const skin = await prisma.skin.findUnique({
      where: { id: skinId }
    });

    if (!skin) {
      return NextResponse.json(
        { success: false, error: "Skin não encontrada" },
        { status: 404 }
      );
    }

    // Criar o alerta
    const novoAlerta = await prisma.alerta.create({
      data: {
        skinId,
        precoAtingido: parseFloat(precoAtingido)
      },
      include: {
        skin: {
          select: {
            nome: true,
            link: true
          }
        }
      }
    });

    // Atualizar status da skin para "alerta_enviado"
    await prisma.skin.update({
      where: { id: skinId },
      data: { status: "alerta_enviado" }
    });

    return NextResponse.json({ 
      success: true, 
      data: novoAlerta,
      message: "Alerta criado com sucesso!" 
    });
  } catch (error) {
    console.error("Erro ao criar alerta:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
