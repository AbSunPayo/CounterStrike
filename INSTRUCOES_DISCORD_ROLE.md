
# 📋 Como Configurar Menções de Role no Discord

Para fazer o bot mencionar uma role específica (como @OhnePixel) nos alertas, siga estes passos:

## 1️⃣ Ativar o Modo Desenvolvedor no Discord

1. Abra o **Discord**
2. Clique na **engrenagem de configurações** (canto inferior esquerdo, ao lado do seu nome)
3. Vá em **Configurações Avançadas** (ou **Advanced**)
4. Ative o **Modo Desenvolvedor** (Developer Mode)

## 2️⃣ Copiar o ID da Role

1. Vá até o seu **servidor Discord**
2. Clique no **nome do servidor** (canto superior esquerdo)
3. Selecione **Configurações do Servidor**
4. Vá na seção **Roles**
5. Encontre a role que deseja mencionar (ex: **OhnePixel**)
6. Clique nos **3 pontinhos** ao lado da role
7. Selecione **Copiar ID da Role**

O ID será algo como: `123456789012345678` (uma sequência numérica)

## 3️⃣ Configurar no Sistema

1. Acesse **[csskin.abacusai.app](https://csskin.abacusai.app)**
2. Vá na aba **Configuração**
3. Cole o **ID da role** no campo "ID da Role do Discord"
4. **ATIVE** o switch "Ativar Alertas por Discord"
5. Clique em **Salvar Configurações**

## 4️⃣ Testar

1. Adicione uma skin com um preço alvo
2. Clique em **"Verificar Agora"**
3. Se o preço atingir o alvo, você receberá um alerta no Discord mencionando a role! 🎉

---

## ⚠️ Importante:

- O bot precisa de **permissões** para mencionar roles no canal
- Certifique-se de que a **role é mencionável** nas configurações da role no Discord
- Se não funcionar, verifique se o webhook tem permissões suficientes no canal

## 💡 Dica:

Se você não quer mencionar uma role específica, simplesmente **deixe o campo vazio** e o alerta será enviado sem menção!
