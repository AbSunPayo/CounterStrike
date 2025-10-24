
# 🔔 Guia de Alertas e Verificação

## 📊 Como Funciona a Verificação

Quando você clica em **"Verificar Agora"** ou o **cron automático** roda, o sistema:

1. Busca as skins que devem ser verificadas
2. Para cada skin, consulta o preço na Steam API
3. Atualiza o banco de dados
4. Envia alertas se o preço atingiu o alvo

---

## ⚠️ Problema Comum: "Poucas Skins Verificadas"

### Sintoma
Você tem 23 skins, mas a mensagem mostra:
```
Verificação concluída!
2 skins verificadas. 0 alerta(s) enviado(s).
```

### Por Que Isso Acontece?

A variável `skinsVerificadas` conta **apenas skins verificadas COM SUCESSO**.

Motivos para falhas:
- **Timeout:** Steam API demorou mais de 15 segundos
- **Rate Limiting:** Muitas requisições à Steam em pouco tempo
- **Link Inválido:** URL da skin está incorreta
- **Preço Indisponível:** Skin sem preço na Steam no momento
- **Erro na API:** Steam API retornou erro

---

## ✅ Melhorias Implementadas (v2.3)

### 1. Timeout de 15 Segundos
Cada requisição à Steam agora tem limite de 15 segundos.

### 2. Delay Entre Lotes
2 segundos de espera entre lotes de 3 skins (evita rate limiting).

### 3. Timeout da API: 5 Minutos
A API do monitor agora tem 5 minutos de timeout para verificação manual.

### 4. Mensagens Claras
Agora a mensagem mostra:
```
Verificação concluída. 20 skin(s) verificada(s) com sucesso, 3 com erro. 0 alerta(s) enviado(s).
```

### 5. Logs Detalhados
No console, você vê quais skins falharam:
```
⚠️  Skins com falha:
  - Shadow Daggers: Timeout ao buscar preço (15s)
  - AWP | BOOM: Erro na API Steam: 429
```

---

## 🎯 O Que Fazer Se Algumas Skins Falharem

### 1. Verifique o Link
Certifique-se que o link da skin está correto:
```
https://steamcommunity.com/market/listings/730/NOME-DA-SKIN
```

### 2. Aguarde e Tente Novamente
Se foi **rate limiting**, aguarde alguns minutos e clique em "Verificar Agora" novamente.

### 3. Verifique se a Skin Existe na Steam
Algumas skins podem não estar mais disponíveis no mercado da Steam.

### 4. Teste o Link Manualmente
Abra o link no navegador e veja se o preço aparece.

---

## 📊 Exemplo de Verificação Completa

### Cenário: 23 Skins Cadastradas

**1ª Tentativa (algumas falhas):**
```
Verificação concluída!
20 skin(s) verificada(s) com sucesso, 3 com erro.
0 alerta(s) enviado(s).
```

**2ª Tentativa (após alguns minutos):**
```
Verificação concluída!
23 skin(s) verificada(s) com sucesso.
2 alerta(s) enviado(s).
```

---

## 🤖 Cron Automático vs Verificação Manual

| **Tipo** | **Skins Verificadas** | **Timeout** | **Frequência** |
|----------|----------------------|-------------|----------------|
| **Cron Automático** | 15 por vez (rotação) | 30s (limite do cron) | A cada X minutos (configurável) |
| **Verificação Manual** | TODAS (23 no seu caso) | 5 minutos | Quando você clicar |

---

## 💡 Dicas

- ✅ Use a **Verificação Manual** para testar alertas imediatamente
- ✅ Use o **Cron Automático** para monitoramento contínuo 24/7
- ⚠️ Se muitas skins falharem, verifique os links no banco de dados
- 🔄 O sistema tenta novamente nas próximas verificações

---

## 🔧 Ferramentas de Diagnóstico

### Verificar Status das Skins
```bash
node check_config.mjs
```

### Resetar Status de Alertas
```bash
node reset_status.mjs
```

### Testar Discord
```bash
node test_discord.mjs
```

### Testar Rotação
```bash
node test_rotacao.mjs
```

---

**Última atualização:** 24/10/2025
