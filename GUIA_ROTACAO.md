
# 🔄 Guia de Rotação de Skins

## 📋 Como Funciona a Verificação Automática

O sistema agora verifica **15 skins por vez** para evitar timeout do cron job (limite de 30 segundos).

### ⚙️ Estratégia de Rotação

1. **Cron chama a API** a cada X minutos (configurável no cron-job.org)
2. **API verifica as 15 skins mais antigas** (que não foram verificadas recentemente)
3. **Após verificação**, atualiza o `lastChecked` dessas skins
4. **Próxima chamada** pegará as próximas 15 skins mais antigas

### 📊 Exemplo Prático

**Se você tem 30 skins e configura o cron para 30 minutos:**

```
10:00 → Cron chama API → Verifica skins 1-15
10:30 → Cron chama API → Verifica skins 16-30
11:00 → Cron chama API → Verifica skins 1-15 (reinicia ciclo)
```

**Resultado:** Todas as 30 skins são verificadas em 1 hora!

### 🧮 Calculando o Intervalo do Cron

Use esta fórmula para calcular o intervalo ideal:

```
Intervalo do Cron = (Total de Skins / 15) × Intervalo Desejado
```

**Exemplos:**

| Total de Skins | Intervalo Desejado | Intervalo do Cron |
|----------------|-------------------|-------------------|
| 15 skins       | 1 hora            | 1 hora            |
| 30 skins       | 1 hora            | 30 minutos        |
| 45 skins       | 1 hora            | 20 minutos        |
| 60 skins       | 1 hora            | 15 minutos        |

### 🎯 Configurações Recomendadas

#### Para 15-20 skins (configuração original)
- **Intervalo do Cron:** 1 hora
- **Tempo de ciclo completo:** 1 hora

#### Para 30 skins
- **Intervalo do Cron:** 30 minutos
- **Tempo de ciclo completo:** 1 hora

#### Para 45 skins
- **Intervalo do Cron:** 20 minutos
- **Tempo de ciclo completo:** 1 hora

#### Para 60 skins
- **Intervalo do Cron:** 15 minutos
- **Tempo de ciclo completo:** 1 hora

### ⚡ Vantagens desta Abordagem

✅ **Evita Timeout:** Cada chamada processa apenas 15 skins (~25 segundos)
✅ **Rotação Garantida:** Todas as skins são verificadas eventualmente
✅ **Escalável:** Suporta muitas skins (60+) sem problemas
✅ **Controle Total:** Você define o intervalo no cron-job.org

### 🔍 Verificação Manual

O botão **"Verificar Agora"** continua verificando **TODAS as skins** de uma vez, independente da quantidade.

- ⏰ Alertas manuais: 1 vez por dia
- 🤖 Alertas automáticos (cron): sempre que atingir o preço

### 📝 Como Configurar no Cron-Job.org

1. Acesse [cron-job.org](https://cron-job.org)
2. Edite o job existente
3. Configure o intervalo baseado na tabela acima
4. Salve as alterações

**URL do Job:**
```
https://csskin.abacusai.app/api/monitor
```

### 🎮 Exemplo Completo

**Cenário:** Você tem 30 skins e quer verificar todas a cada 1 hora.

**Configuração:**
1. No cron-job.org, configure intervalo de **30 minutos**
2. A cada 30 minutos, 15 skins são verificadas
3. Após 1 hora, todas as 30 skins foram verificadas
4. O ciclo reinicia automaticamente

---

## 💡 Dicas

- 🎯 Quanto mais skins, menor deve ser o intervalo do cron
- ⚠️ Evite intervalos menores que 15 minutos (pode sobrecarregar o servidor)
- 📊 Monitore os logs do cron-job.org para garantir que não há timeouts
- 🔄 A rotação é automática, não precisa fazer nada

---

**Última atualização:** 24/10/2025
