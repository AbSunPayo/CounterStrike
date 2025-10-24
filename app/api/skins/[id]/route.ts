
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

// PUT - Atualizar skin existente
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { nome, link, precoAlvo, imagemUrl, status, tipoAlerta } = await request.json();
    const { id } = params;

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

    const skinAtualizada = await prisma.skin.update({
      where: { id },
      data: {
        nome: nome.trim(),
        link: link.trim(),
        precoAlvo: parseFloat(precoAlvo),
        tipoAlerta: tipoAlerta || 'compra',
        imagemUrl: imagemUrl?.trim() || null,
        status: status || "ativo"
      }
    });

    return NextResponse.json({ 
      success: true, 
      data: skinAtualizada,
      message: "Skin atualizada com sucesso!" 
    });
  } catch (error: any) {
    console.error("Erro ao atualizar skin:", error);
    
    if (error?.code === "P2025") {
      return NextResponse.json(
        { success: false, error: "Skin não encontrada" },
        { status: 404 }
      );
    }

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

// DELETE - Remover skin
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await prisma.skin.delete({
      where: { id }
    });

    return NextResponse.json({ 
      success: true,
      message: "Skin removida com sucesso!" 
    });
  } catch (error: any) {
    console.error("Erro ao deletar skin:", error);
    
    if (error?.code === "P2025") {
      return NextResponse.json(
        { success: false, error: "Skin não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
