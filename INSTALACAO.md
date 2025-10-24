
# 📦 Guia de Instalação - CS2 Skin Monitor

## 1️⃣ Pré-requisitos

- **Node.js** 18+ e **Yarn**
- **PostgreSQL** 14+
- Conta de email Gmail (para envio de alertas)

---

## 2️⃣ Instalação

### Clone o repositório

```bash
git clone https://github.com/AbSunPayo/CounterStrike.git
cd CounterStrike
```

### Instale as dependências

```bash
yarn install
```

---

## 3️⃣ Configuração do Banco de Dados

### Crie um banco PostgreSQL

```sql
CREATE DATABASE cs2_skin_monitor;
```

### Configure a URL de conexão

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` e configure a URL do banco:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/cs2_skin_monitor"
```

### Execute as migrations

```bash
yarn prisma migrate dev
yarn prisma generate
```

### (Opcional) Popule o banco com dados de exemplo

```bash
yarn prisma db seed
```

---

## 4️⃣ Configuração de Email

No arquivo `.env`, configure as credenciais do Gmail:

```env
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="seu-email@gmail.com"
EMAIL_PASSWORD="sua-senha-de-aplicativo"
EMAIL_FROM="seu-email@gmail.com"
```

> ⚠️ **Importante**: Use uma **senha de aplicativo** do Gmail, não sua senha normal.
> 
> Como gerar: https://support.google.com/accounts/answer/185833

---

## 5️⃣ Executar o Projeto

### Modo de desenvolvimento

```bash
yarn dev
```

Acesse: `http://localhost:3000`

### Modo de produção

```bash
yarn build
yarn start
```

---

## 6️⃣ Configuração do Monitoramento Automático

Para que o bot verifique os preços automaticamente a cada 15 minutos, configure um **cron job externo**.

### Opção 1: cron-job.org (Recomendado para deploy na nuvem)

1. Acesse https://cron-job.org
2. Crie uma conta gratuita
3. Crie um novo job com:
   - **URL**: `https://seu-dominio.com/api/monitor?tipo=cron`
   - **Intervalo**: A cada 15 minutos

### Opção 2: Cron local (Linux/Mac)

```bash
crontab -e
```

Adicione a linha:

```cron
*/15 * * * * curl -X GET "http://localhost:3000/api/monitor?tipo=cron"
```

---

## 7️⃣ Recursos Disponíveis

✅ **Adicionar skins** para monitoramento  
✅ **Definir preço alvo** para alertas  
✅ **Verificação manual** com o botão "Verificar Agora"  
✅ **Alertas por email** quando o preço atinge o alvo  
✅ **Histórico de alertas** enviados  
✅ **Interface em português brasileiro**

---

## 📚 Documentação Adicional

- [GUIA_RAPIDO.md](GUIA_RAPIDO.md) - Guia rápido de uso
- [GUIA_ALERTAS.md](GUIA_ALERTAS.md) - Como funcionam os alertas
- [GUIA_CRON.md](GUIA_CRON.md) - Configuração detalhada do cron
- [GUIA_ROTACAO.md](GUIA_ROTACAO.md) - Sistema de rotação de skins
- [CHANGELOG.md](CHANGELOG.md) - Histórico de versões

---

## 🐛 Problemas Comuns

### Erro de conexão com o banco de dados

Verifique se:
- PostgreSQL está rodando
- A URL de conexão no `.env` está correta
- O banco de dados foi criado

### Emails não estão sendo enviados

Verifique se:
- A senha de aplicativo do Gmail está correta
- As configurações de email no `.env` estão corretas
- O Gmail não bloqueou o acesso

### Verificação manual não processa todas as skins

Isso é normal se houver muitas skins. O processo sequencial garante 100% de confiabilidade, mas pode levar até 2 minutos para 20+ skins.

---

## 📞 Suporte

Para reportar bugs ou sugerir melhorias, abra uma issue no GitHub.

---

## 📝 Licença

Este projeto está sob a licença MIT.
