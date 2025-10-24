
# 📋 Guia de Configuração do Cron-Job.org

Este guia explica como configurar o monitoramento automático usando o cron-job.org.

---

## 🎯 Por que usar o Cron-Job.org?

O bot precisa verificar preços periodicamente, mesmo quando seu computador está desligado. O cron-job.org chama a API do bot automaticamente a cada 15 minutos.

---

## ⚡ Sistema de Rotação Inteligente

Como você tem **23 skins cadastradas** e o cron verifica **15 por vez**:

- **A cada 15 minutos**: 15 skins são verificadas
- **A cada 30 minutos**: Todas as 23 skins são verificadas
- **Sistema de rotação**: Prioriza skins menos atualizadas

**Isso garante que todas as skins sejam monitoradas continuamente!**

---

## 🔧 Configuração no Cron-Job.org

### 1️⃣ Acesse o Site
- Vá para: https://cron-job.org/en/signup/
- Crie uma conta gratuita

### 2️⃣ Crie um Novo Job
- Clique em **"Create cronjob"**
- Preencha os campos:

#### ⚙️ Configurações Básicas
- **Title**: `CS2 Skin Monitor`
- **Address (URL)**: `https://csskin.abacusai.app/api/monitor`
- **Enabled**: ✅ Ativado

#### 🕐 Schedule (Agendamento)
- **Every**: `15 minutes`
- Ou configure manualmente:
  - Minutes: `*/15` (a cada 15 minutos)
  - Hours: `*` (todas as horas)
  - Days: `*` (todos os dias)

#### 🔧 Advanced Settings (Configurações Avançadas)

**Request method:**
- Selecione: `POST`

**Request body:**
```json
{"tipo": "auto"}
```

**Headers:**
```
Content-Type: application/json
```

**Timeout:**
- Configure: `30 seconds` (o máximo permitido)

**HTTP authentication:**
- Deixe desativado (não é necessário)

**Treat redirects with HTTP 3xx status code as success:**
- Deixe ativado ✅

#### 💾 Salvar
- Clique em **"Create cronjob"**
- Pronto! ✅

---

## 📊 Verificando se Está Funcionando

### Método 1: Histórico no Cron-Job.org
1. Acesse sua conta no cron-job.org
2. Clique no job "CS2 Skin Monitor"
3. Veja o histórico de execuções:
   - ✅ Verde = Sucesso
   - ❌ Vermelho = Erro

### Método 2: Última Verificação no App
1. Acesse: https://csskin.abacusai.app/
2. Na aba **"Configurações"**
3. Veja o campo **"Última verificação"**
4. Deve atualizar a cada 15 minutos

### Método 3: Alertas no Discord
- Se uma skin atingir o preço alvo
- Você receberá um alerta no Discord
- Com menção da role configurada

---

## ⚠️ Solução de Problemas

### ❌ Job com erro no Cron-Job.org

**Problema**: Job aparece vermelho no histórico

**Soluções**:
1. Verifique se a URL está correta: `https://csskin.abacusai.app/api/monitor`
2. Certifique-se de usar **POST** (não GET)
3. Verifique se o body JSON está correto: `{"tipo": "auto"}`
4. Timeout deve ser **30 seconds** (não mais que isso)

### 🐌 Timeout no Cron

**Problema**: Job expira antes de terminar

**Solução**: Já resolvido! ✅
- A API agora processa **15 skins em ~7 segundos**
- Muito abaixo do limite de 30 segundos
- Sistema de rotação garante que todas as skins sejam verificadas

### 📧 Não recebo alertas

**Problema**: Cron funciona mas não recebo alertas

**Soluções**:
1. Verifique na aba **"Configurações"**:
   - ✅ "Ativar Alertas por Discord" deve estar ativado
   - Webhook do Discord deve estar configurado
   - Role Mention deve estar com o ID correto

2. Teste manualmente:
   - Clique no botão **"Verificar Agora"** na aba Skins
   - Se funcionar manualmente mas não automaticamente, o problema é no cron

---

## 📈 Estatísticas do Sistema

| Métrica | Valor |
|---------|-------|
| **Skins verificadas por execução** | 15 |
| **Tempo médio de processamento** | ~7 segundos |
| **Intervalo do cron** | 15 minutos |
| **Tempo para verificar todas as skins** | 30 minutos |
| **Execuções por hora** | 4 |
| **Execuções por dia** | 96 |

---

## 🎮 Monitoramento Manual vs Automático

### 🤖 Verificação Automática (Cron)
- **Quando**: A cada 15 minutos
- **Quantas skins**: 15 por execução
- **Alertas**: Enviados sempre que o preço atinge o alvo
- **Cooldown**: Só envia novo alerta quando o preço sair e voltar da faixa

### 👆 Verificação Manual (Botão "Verificar Agora")
- **Quando**: Quando você clica no botão
- **Quantas skins**: Todas (23)
- **Alertas**: Enviados 1 vez por dia por skin
- **Cooldown**: 24 horas

---

## 🔗 Links Úteis

- **App**: https://csskin.abacusai.app/
- **Cron-Job.org**: https://cron-job.org/
- **Guia de Role Mention**: [INSTRUCOES_DISCORD_ROLE.md](./INSTRUCOES_DISCORD_ROLE.md)
- **Guia de Alertas**: [GUIA_ALERTAS.md](./GUIA_ALERTAS.md)

---

## ✅ Checklist Final

- [ ] Conta criada no cron-job.org
- [ ] Job criado com URL correta
- [ ] Método POST configurado
- [ ] Body JSON configurado: `{"tipo": "auto"}`
- [ ] Timeout configurado para 30 segundos
- [ ] Job ativado
- [ ] Webhook Discord configurado no app
- [ ] "Ativar Alertas por Discord" ativado
- [ ] Role Mention configurado (opcional)
- [ ] Primeira execução bem-sucedida (verde) no histórico

---

🎉 **Tudo pronto! Seu bot está monitorando automaticamente 24/7!**
