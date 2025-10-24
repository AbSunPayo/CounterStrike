
# 🚀 Guia Rápido - Novas Funcionalidades

## 📱 Como Configurar Alertas no Discord

### Passo 1: Criar o Webhook no Discord

1. Abra o Discord e vá até o **servidor** onde quer receber os alertas
2. Clique com botão direito no **canal** desejado
3. Selecione **"Editar Canal"**
4. Vá em **"Integrações"** → **"Webhooks"**
5. Clique em **"Novo Webhook"** ou **"Criar Webhook"**
6. Dê um nome (ex: "CS2 Skin Monitor")
7. (Opcional) Adicione uma foto de perfil
8. Clique em **"Copiar URL do Webhook"**
9. Cole essa URL no aplicativo (aba Configurações)

**⚠️ IMPORTANTE**: Nunca compartilhe essa URL com ninguém! Quem tiver essa URL pode enviar mensagens no seu canal.

### Passo 2: Configurar no App

1. Acesse a aba **"⚙️ Configurações"**
2. Cole a URL do webhook no campo **"Webhook Discord"**
3. Clique em **"Salvar Configurações"**
4. Pronto! Agora você vai receber alertas no Discord também!

---

## 🔽🔼 Como Usar Alertas de Compra e Venda

### Alerta de Compra (🔽 Preço Baixo)

**Quando usar:** Você quer **COMPRAR** a skin quando ela estiver **BARATA**

**Como funciona:**
- Você define o preço máximo que quer pagar
- Quando o preço **CAI** até esse valor (ou menos), você recebe o alerta
- Ideal para montar coleção ou comprar skins para revenda

**Exemplo:**
```
Skin: AK-47 | Aquamarine Revenge
Preço Atual: R$ 85,00
Preço Alvo: R$ 70,00
Tipo: 🔽 Compra (Preço Baixo)

➜ Você será alertado quando o preço chegar em R$ 70 ou menos
```

### Alerta de Venda (🔼 Preço Alto)

**Quando usar:** Você quer **VENDER** uma skin que já possui quando ela estiver **CARA**

**Como funciona:**
- Você define o preço mínimo pelo qual quer vender
- Quando o preço **SOBE** até esse valor (ou mais), você recebe o alerta
- Ideal para investidores e traders

**Exemplo:**
```
Skin: Butterfly Knife | Doppler
Preço Atual: R$ 3200,00
Preço Alvo: R$ 3500,00
Tipo: 🔼 Venda (Preço Alto)

➜ Você será alertado quando o preço chegar em R$ 3500 ou mais
```

---

## 📋 Passo a Passo Completo

### 1️⃣ Adicionar uma Skin para Monitorar

1. Clique no botão **"+ Adicionar Skin"**
2. Preencha os campos:
   - **Nome da Skin**: Ex: "AWP | Dragon Lore"
   - **Link da Skin**: Cole a URL do Steam Market
   - **Preço Alvo**: Defina seu preço desejado
   - **Tipo de Alerta**: 
     - 🔽 **Compra** se quer comprar quando o preço cair
     - 🔼 **Venda** se quer vender quando o preço subir
   - **URL da Imagem** (opcional): Link da imagem da skin
3. Clique em **"Adicionar"**

### 2️⃣ Configurar Notificações

1. Vá na aba **"⚙️ Configurações"**
2. Configure pelo menos um método:
   - **Email**: Digite seu email
   - **Discord**: Cole a URL do webhook
3. Clique em **"Salvar Configurações"**
4. (Opcional) Clique em **"🔍 Verificar Agora"** para testar

### 3️⃣ Aguardar os Alertas

- O sistema verifica automaticamente **a cada 15 minutos**
- Quando o preço atingir o alvo:
  - ✉️ Você receberá um **email** (se configurado)
  - 🤖 E uma **mensagem no Discord** (se configurado)
- O status da skin mudará para **"Alerta Enviado"**

### 4️⃣ O que Acontece Depois do Alerta

**NOVO! Monitoramento Contínuo:**
- O sistema **continua** monitorando o preço
- Se o preço **sair da faixa do alerta**:
  - Status volta para **"Ativo"** automaticamente
  - Você pode receber um **novo alerta** quando atingir o alvo novamente
- Você sempre verá o **preço atual** atualizado

---

## 💡 Dicas e Truques

### Para Compradores (Colecionadores):
- Use **🔽 Alerta de Compra** em todas as skins que deseja
- Defina preços realistas (10-20% abaixo do preço atual)
- Monitore várias skins ao mesmo tempo
- Configure Discord para alertas instantâneos no celular

### Para Vendedores (Investidores):
- Use **🔼 Alerta de Venda** nas skins que você já possui
- Pesquise tendências de mercado antes de definir o preço alvo
- Combine com Steam Inventory para ver quais skins você tem
- Configure email para ter registro dos alertas

### Para Traders:
- Use **ambos os tipos** de alerta:
  - 🔽 Compra para skins que quer adquirir
  - 🔼 Venda para skins que quer liquidar
- Monitore skins populares com alta liquidez
- Use o botão "Verificar Agora" antes de grandes updates do jogo
- Mantenha uma planilha com histórico de compra/venda

### Para Iniciantes:
- Comece com 3-5 skins para não se perder
- Use skins mais baratas (R$ 10-50) para aprender
- Configure **email E Discord** para não perder nenhum alerta
- Visite o Steam Market diariamente para entender as flutuações

---

## ❓ Perguntas Frequentes

### **O bot funciona 24/7?**
Sim! O sistema usa um cron job externo que verifica os preços automaticamente a cada 15 minutos, 24 horas por dia, 7 dias por semana.

### **Posso monitorar quantas skins?**
Sem limite! Monitore quantas skins quiser. O sistema foi testado com 20+ skins sem problemas.

### **Preciso deixar o computador ligado?**
Não! O sistema roda na nuvem. Você só precisa acessar para configurar e consultar.

### **O que acontece se o preço subir/descer muito rápido?**
O sistema verifica a cada 15 minutos. Se o preço mudar drasticamente entre verificações, você será alertado na próxima verificação.

### **Posso usar só Discord sem email?**
Sim! Email e Discord são opcionais. Configure pelo menos um método de notificação.

### **Os alertas expiram?**
Não! O sistema continua monitorando indefinidamente. Você pode deletar uma skin a qualquer momento.

### **Como sei se o webhook Discord está funcionando?**
Após salvar as configurações, clique em "🔍 Verificar Agora". Se houver alguma skin com alerta pendente, você receberá no Discord imediatamente.

### **O que significa "Alerta Enviado"?**
Significa que o preço atingiu o alvo e você já foi notificado. Mas não se preocupe: o sistema continua monitorando e vai resetar automaticamente se o preço sair da faixa.

### **Posso editar o tipo de alerta depois?**
Sim! Clique no ícone de lápis na skin e altere o tipo de alerta quando quiser.

### **O que é o "Histórico de Alertas"?**
É uma lista de todos os alertas que foram enviados, com data, hora e preço atingido. Útil para análise de histórico.

---

## 🎯 Exemplos de Estratégias

### Estratégia 1: Comprador de Oportunidades
```
Objetivo: Comprar skins populares em promoções

Configuração:
- Monitore 10-15 skins populares
- Use 🔽 Alerta de Compra
- Defina preços 15-20% abaixo do mercado
- Configure Discord para alertas rápidos
- Tenha saldo no Steam pronto

Resultado: Aproveita quedas rápidas de preço
```

### Estratégia 2: Investidor de Longo Prazo
```
Objetivo: Vender skins quando atingirem meta de lucro

Configuração:
- Adicione skins que você já possui
- Use 🔼 Alerta de Venda
- Defina preço alvo = Preço de Compra + 30% de lucro
- Configure email para registro
- Mantenha planilha de custo x venda

Resultado: Maximiza lucro em cada venda
```

### Estratégia 3: Trader Ativo
```
Objetivo: Comprar e vender rapidamente

Configuração:
- Monitore 20+ skins líquidas
- Use AMBOS os alertas:
  * 🔽 Compra: 10% abaixo do preço médio
  * 🔼 Venda: 10% acima do preço de compra
- Configure Discord + Email
- Verifique alertas múltiplas vezes ao dia

Resultado: Alta frequência de trades lucrativos
```

---

## 🔥 Recursos Avançados

### Entendendo o Monitoramento Contínuo

**Antes (Problema):**
```
1. Preço cai → Alerta enviado → Status: "Alerta Enviado"
2. Sistema PARA de monitorar
3. Preço continua mudando mas você não sabe
4. Dados ficam desatualizados ❌
```

**Agora (Solução):**
```
1. Preço cai → Alerta enviado → Status: "Alerta Enviado"
2. Sistema CONTINUA monitorando! ✅
3. Se preço sobe de novo → Status: "Ativo" automaticamente
4. Se preço cai novamente → Novo alerta! 🔔
5. Você sempre vê o preço atual atualizado
```

### Fluxo Completo de um Alerta

```
📊 Estado Inicial:
   Skin: AK-47 | Redline
   Preço Atual: R$ 60,00
   Preço Alvo: R$ 50,00
   Tipo: 🔽 Compra
   Status: Ativo

⏰ 15 minutos depois...
   Preço Atual: R$ 48,00 ✅
   
🔔 ALERTA!
   ✉️ Email enviado
   🤖 Discord notificado
   Status: Alerta Enviado

⏰ Continua monitorando...
   30 minutos: R$ 49,00 (ainda na faixa)
   45 minutos: R$ 51,00 (saiu da faixa!)
   
🔄 RESET AUTOMÁTICO
   Status: Ativo
   
⏰ Continua monitorando...
   60 minutos: R$ 47,00 ✅
   
🔔 NOVO ALERTA!
   ✉️ Email enviado novamente
   🤖 Discord notificado novamente
```

---

## 🎨 Visual das Notificações

### Email:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 Alerta de Compra Atingido!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

AK-47 | Redline (Field-Tested)
[Imagem da Skin]

💰 Preço Atual: R$ 48,00
🎯 Preço Alvo: R$ 50,00
📊 Tipo: 🔽 Compra (Preço Baixo)

[Ver no Steam Market]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Discord:
```
[Embed Verde com Thumbnail da Skin]

🔽 Alerta de Compra - AK-47 | Redline

O preço da skin CAIU para R$ 48,00!

💰 Preço Atual       🎯 Preço Alvo
   R$ 48,00             R$ 50,00

📊 Tipo de Alerta
🔽 Compra (Preço Baixo)

🔗 Link Steam Market
Clique aqui para ver no Steam

CS2 Skin Monitor • Hoje às 14:35
```

---

**🎉 Aproveite as novas funcionalidades e bons trades!**

Para suporte, consulte o README.md ou abra uma issue no GitHub.
