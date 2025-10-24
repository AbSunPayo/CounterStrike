
# 🎮 CS2 Skin Price Monitor

Monitor de preços de skins do Counter-Strike 2 (CS2) com alertas automáticos por email quando os preços atingem suas metas definidas.

## 📋 Descrição

Este aplicativo web permite que você monitore os preços de skins do CS2 e receba alertas por email quando os preços caem para o valor desejado. Perfeito para colecionadores e traders que querem comprar skins pelo melhor preço!

## ✨ Funcionalidades

- 📊 **Monitoramento Automático**: Verificação automática de preços a cada 15 minutos
- 📧 **Alertas por Email**: Receba notificações quando o preço atingir sua meta
- 🎯 **Gestão de Skins**: Adicione, edite e remova skins da sua lista de monitoramento
- 💰 **Preço Alvo**: Defina o preço que deseja pagar por cada skin
- 🔍 **Verificação Manual**: Botão "Verificar Agora" para checar preços instantaneamente
- ⚙️ **Configurações**: Configure seu email para receber alertas
- 📱 **Interface Responsiva**: Funciona perfeitamente em desktop e mobile
- 🌐 **Interface em Português**: 100% traduzido para Português Brasileiro

## 🛠️ Tecnologias Utilizadas

- **Next.js 14** - Framework React
- **TypeScript** - Tipagem estática
- **PostgreSQL** - Banco de dados
- **Prisma** - ORM para banco de dados
- **Tailwind CSS** - Estilização
- **shadcn/ui** - Componentes UI
- **Cheerio** - Web scraping para preços
- **Nodemailer** - Envio de emails

## 📦 Instalação

### Pré-requisitos

- Node.js 18+ instalado
- Yarn instalado
- Conta PostgreSQL (ou use o banco fornecido pela plataforma)

### Passo a Passo

1. **Clone o repositório**
```bash
git clone <seu-repositorio>
cd cs2_skin_monitor/nextjs_space
```

2. **Instale as dependências**
```bash
yarn install
```

3. **Configure as variáveis de ambiente**

Crie um arquivo `.env` na raiz do projeto:

```env
# Database
DATABASE_URL="sua-url-do-postgres"

# Email Configuration (para envio de alertas)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_SECURE="false"
EMAIL_USER="seu-email@gmail.com"
EMAIL_PASS="sua-senha-de-app"
EMAIL_FROM="seu-email@gmail.com"
```

**Nota sobre Email Gmail:**
- Use uma "Senha de App" ao invés da sua senha normal
- Gere em: https://myaccount.google.com/apppasswords
- Ative a verificação em 2 etapas primeiro

4. **Configure o banco de dados**
```bash
yarn prisma generate
yarn prisma db push
```

5. **Execute o aplicativo**

**Desenvolvimento:**
```bash
yarn dev
```

**Produção:**
```bash
yarn build
yarn start
```

O aplicativo estará disponível em `http://localhost:3000`

## 🚀 Deploy

### Deploy na Plataforma Abacus.AI

O aplicativo já está configurado para deploy automático. O domínio atual é:
**https://csskin.abacusai.app**

### Monitoramento Automático (Cron Job)

Para que o bot funcione continuamente, um cron job externo foi configurado em [cron-job.org](https://cron-job.org) para chamar a API de monitoramento a cada 15 minutos:

```
Endpoint: https://csskin.abacusai.app/api/monitor
Frequência: A cada 15 minutos
```

**Para configurar seu próprio cron job:**

1. Acesse https://cron-job.org
2. Crie uma conta gratuita
3. Crie um novo cron job:
   - Title: "CS2 Skin Monitor"
   - URL: `https://seu-dominio.com/api/monitor`
   - Schedule: Cada 15 minutos
4. Salve e ative o job

## 📖 Como Usar

### 1. Configurar Email

1. Acesse a aba "⚙️ Configurações"
2. Digite seu email para receber alertas
3. Clique em "Salvar Configurações"

### 2. Adicionar Skins para Monitorar

1. Na aba "🎯 Monitorar Skins", clique em "Adicionar Skin"
2. Preencha os campos:
   - **Nome da Skin**: Ex: "AK-47 | Redline"
   - **Link do Steam Market**: URL completa da skin
   - **Preço Alvo**: O preço que você quer pagar
   - **Upload de Imagem**: (Opcional) Adicione uma imagem da skin
3. Clique em "Adicionar Skin"

### 3. Monitoramento

- O sistema verifica automaticamente os preços a cada 15 minutos
- Você receberá um email quando o preço de uma skin atingir ou ficar abaixo do preço alvo
- Use o botão "Verificar Agora" para uma verificação manual imediata

### 4. Gerenciar Skins

- **Editar**: Clique no ícone de lápis para atualizar informações
- **Deletar**: Clique no ícone de lixeira para remover uma skin
- **Status**: Veja se o monitoramento está ativo ou se o alerta já foi enviado

## 📂 Estrutura do Projeto

```
nextjs_space/
├── app/
│   ├── api/              # Endpoints da API
│   │   ├── alerts/       # Gerenciamento de alertas
│   │   ├── config/       # Configurações do usuário
│   │   ├── monitor/      # Sistema de monitoramento
│   │   └── skins/        # CRUD de skins
│   ├── globals.css       # Estilos globais
│   ├── layout.tsx        # Layout principal
│   └── page.tsx          # Página inicial
├── components/
│   ├── skins-monitor-app.tsx  # Componente principal
│   └── ui/               # Componentes UI (shadcn)
├── daemon/
│   └── monitor-daemon.ts # Daemon de monitoramento
├── lib/
│   ├── db.ts            # Configuração do Prisma
│   ├── email.ts         # Sistema de envio de emails
│   ├── price-scraper.ts # Scraper de preços
│   ├── types.ts         # Tipos TypeScript
│   └── utils.ts         # Utilitários
├── prisma/
│   └── schema.prisma    # Schema do banco de dados
├── public/              # Arquivos estáticos
└── scripts/
    └── seed.ts          # Seed do banco de dados
```

## 🗄️ Schema do Banco de Dados

```prisma
model Skin {
  id              String   @id @default(uuid())
  name            String
  steamMarketLink String
  targetPrice     Float
  currentPrice    Float?
  imageUrl        String?
  status          String   @default("active")
  alertSent       Boolean  @default(false)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model Config {
  id        String   @id @default(uuid())
  key       String   @unique
  value     String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## 🔧 API Endpoints

### Skins
- `GET /api/skins` - Lista todas as skins
- `POST /api/skins` - Adiciona nova skin
- `PUT /api/skins` - Atualiza skin
- `DELETE /api/skins` - Remove skin

### Monitoramento
- `POST /api/monitor` - Executa verificação de preços

### Configurações
- `GET /api/config` - Busca configurações
- `POST /api/config` - Salva configurações

### Alertas
- `POST /api/alerts/send` - Envia alerta de teste

## 🐛 Solução de Problemas

### Problema: Emails não estão sendo enviados

**Solução:**
1. Verifique se as credenciais de email no `.env` estão corretas
2. Use uma "Senha de App" do Gmail, não sua senha normal
3. Verifique se a verificação em 2 etapas está ativada
4. Teste o envio usando o botão "Enviar Email de Teste" nas configurações

### Problema: Preços não estão sendo atualizados

**Solução:**
1. Verifique se o link do Steam Market está correto
2. Confirme que o cron job está ativo em cron-job.org
3. Use o botão "Verificar Agora" para teste manual
4. Verifique os logs do servidor

### Problema: Erro de conexão com banco de dados

**Solução:**
1. Verifique se a `DATABASE_URL` no `.env` está correta
2. Execute `yarn prisma generate` e `yarn prisma db push`
3. Reinicie o servidor

## 📝 Backup de Dados

Para fazer backup das suas skins:

```bash
yarn tsx scripts/export-skins.ts
```

Isso criará arquivos JSON e CSV com todas as suas skins.

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abrir um Pull Request

## 📄 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.

## 👤 Autor

Desenvolvido com ❤️ para a comunidade CS2

## 🔗 Links Úteis

- [Steam Market](https://steamcommunity.com/market/)
- [CS2 Skins](https://steamcommunity.com/market/search?appid=730)
- [Documentação Next.js](https://nextjs.org/docs)
- [Documentação Prisma](https://www.prisma.io/docs)

---

**Nota**: Este aplicativo não é afiliado à Valve Corporation ou Steam. É uma ferramenta independente para monitoramento de preços.
