
/**
 * Extrai o preço de uma skin do Steam Community Market
 * O link da skin deve estar no formato:
 * https://steamcommunity.com/market/listings/730/nome-da-skin
 */
export async function buscarPrecoSkin(linkSkin: string): Promise<number | null> {
  try {
    // Extrai o nome da skin do link
    const match = linkSkin.match(/\/market\/listings\/730\/(.+)/);
    if (!match) {
      console.error('❌ Link inválido:', linkSkin);
      return null;
    }

    const skinName = decodeURIComponent(match[1]);
    
    // Steam Market API endpoint para buscar preço
    const apiUrl = `https://steamcommunity.com/market/priceoverview/?appid=730&currency=7&market_hash_name=${encodeURIComponent(skinName)}`;
    
    console.log(`🔍 Buscando preço para: ${skinName}`);
    
    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      console.error(`❌ Erro na API Steam: ${response.status}`);
      return null;
    }

    const data = await response.json();
    
    if (!data.success) {
      console.error('❌ API retornou success: false');
      return null;
    }

    // Extrai o preço (lowest_price ou median_price)
    const precoStr = data.lowest_price || data.median_price;
    if (!precoStr) {
      console.error('❌ Nenhum preço encontrado');
      return null;
    }

    // Converte o preço de string para número
    // Exemplo: "R$ 1.234,56" -> 1234.56
    const precoNumero = parseFloat(
      precoStr
        .replace(/[^\d,]/g, '') // Remove tudo exceto dígitos e vírgula
        .replace('.', '')        // Remove pontos (separador de milhar)
        .replace(',', '.')       // Substitui vírgula por ponto (decimal)
    );

    console.log(`✅ Preço encontrado: R$ ${precoNumero.toFixed(2)}`);
    return precoNumero;

  } catch (error) {
    console.error('❌ Erro ao buscar preço:', error);
    return null;
  }
}
