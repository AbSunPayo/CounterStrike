
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

// GET - Buscar todas as skins
export async function GET() {
  try {
    const skins = await prisma.skin.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        alertas: {
          orderBy: { dataAlerta: "desc" },
          take: 1
        }
      }
    });

    return NextResponse.json({ success: true, data: skins });
  } catch (error) {
    console.error("Erro ao buscar skins:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// POST - Adicionar nova skin
export async function POST(request: NextRequest) {
  try {
    const { nome, link, precoAlvo, imagemUrl, tipoAlerta } = await request.json();

    if (!nome || !link || !precoAlvo) {
      return NextResponse.json(
        { success: false, error: "Campos obrigatórios: nome, link e precoAlvo" },
        { status: 400 }
      );
    }

    if (precoAlvo <= 0) {
      return NextResponse.json(
        { success: false, error: "Preço alvo deve ser maior que zero" },
        { status: 400 }
      );
    }

    if (tipoAlerta && !['compra', 'venda'].includes(tipoAlerta)) {
      return NextResponse.json(
        { success: false, error: "Tipo de alerta deve ser 'compra' ou 'venda'" },
        { status: 400 }
      );
    }

    const novaSkin = await prisma.skin.create({
      data: {
        nome: nome.trim(),
        link: link.trim(),
        precoAlvo: parseFloat(precoAlvo),
        tipoAlerta: tipoAlerta || 'compra',
        imagemUrl: imagemUrl?.trim() || null,
        status: "ativo"
      }
    });

    return NextResponse.json({ 
      success: true, 
      data: novaSkin,
      message: "Skin adicionada com sucesso!" 
    });
  } catch (error: any) {
    console.error("Erro ao criar skin:", error);
    
    if (error?.code === "P2002") {
      return NextResponse.json(
        { success: false, error: "Esta skin já está sendo monitorada" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
