# Racun Analytics - Guia de Implementação Completo

## 📋 Visão Geral

**Racun Analytics** é uma plataforma SaaS enterprise-grade que centraliza marketing, vendas, CRM e operações comerciais em um único ecossistema inteligente. A plataforma é projetada para agências de marketing digital gerenciarem o crescimento dos seus clientes com dados em tempo real e recomendações de IA.

### Pilares Principais

1. **Site Público Premium** - Landing page com foco em conversão
2. **Portal Privado Multi-tenant** - Plataforma de gestão integrada
3. **Integrações Automáticas** - Meta, Google, TikTok, Mercado Livre, Shopee, Amazon
4. **CRM Unificado** - Gestão de leads com funil de vendas
5. **IA de Crescimento** - 5 analistas especializados
6. **Relatórios Automáticos** - Envio por e-mail, WhatsApp e PDF

---

## 🏗️ Arquitetura Técnica

### Stack Tecnológico

```
Frontend:
- React 19 + TypeScript
- Tailwind CSS 4 + shadcn/ui
- Wouter (routing)
- React Query (data fetching)
- tRPC (type-safe RPC)

Backend:
- Express 4 + Node.js
- tRPC 11 (procedures)
- Drizzle ORM
- MySQL/TiDB (database)
- Redis (cache)
- BullMQ (job queue)

Integrações:
- Meta Marketing API
- Google Ads API
- TikTok Ads API
- Mercado Livre API
- Shopee API
- Amazon SP-API
- Google Calendar API
- WhatsApp Business API
- Google Analytics 4
- LLM (IA)
```

### Arquitetura Multi-tenant

Cada cliente tem isolamento total de dados:

```
- clientId em todas as tabelas
- Filtros de segurança em cada query
- Row-level security no banco
- Verificação de permissões em cada procedure
- Logs de auditoria completos
```

---

## 📁 Estrutura do Projeto

```
racun-analytics/
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx              # Landing page
│   │   │   ├── Resources.tsx         # Página de recursos
│   │   │   ├── Solutions.tsx         # Página de soluções
│   │   │   ├── Schedule.tsx          # Agendamento de demo
│   │   │   ├── portal/
│   │   │   │   ├── Dashboard.tsx     # Dashboard executivo
│   │   │   │   ├── DashboardTechnical.tsx
│   │   │   │   ├── Integrations.tsx
│   │   │   │   ├── Traffic.tsx
│   │   │   │   ├── Marketplaces.tsx
│   │   │   │   ├── Products.tsx
│   │   │   │   ├── CRM.tsx
│   │   │   │   ├── AI.tsx
│   │   │   │   ├── Requests.tsx
│   │   │   │   ├── Reports.tsx
│   │   │   │   └── Documents.tsx
│   │   │   └── admin/
│   │   │       ├── Clients.tsx
│   │   │       ├── Leads.tsx
│   │   │       ├── Reports.tsx
│   │   │       └── Settings.tsx
│   │   ├── components/
│   │   │   ├── ui/                  # shadcn/ui components
│   │   │   ├── DashboardLayout.tsx
│   │   │   ├── Charts/
│   │   │   ├── CRM/
│   │   │   ├── AI/
│   │   │   └── Integrations/
│   │   ├── hooks/
│   │   ├── contexts/
│   │   ├── lib/
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── index.html
├── server/
│   ├── routers/
│   │   ├── auth.ts
│   │   ├── clients.ts
│   │   ├── dashboard.ts
│   │   ├── integrations.ts
│   │   ├── traffic.ts
│   │   ├── marketplaces.ts
│   │   ├── products.ts
│   │   ├── crm.ts
│   │   ├── ai.ts
│   │   ├── requests.ts
│   │   ├── reports.ts
│   │   └── admin.ts
│   ├── services/
│   │   ├── integrations/
│   │   ├── ai/
│   │   ├── reports/
│   │   ├── crm.ts
│   │   ├── sync.ts
│   │   └── cache.ts
│   ├── jobs/
│   │   ├── syncMetrics.ts
│   │   ├── analyzeAI.ts
│   │   ├── sendReports.ts
│   │   └── cleanupOldData.ts
│   ├── db.ts
│   └── routers.ts
├── drizzle/
│   ├── schema.ts                    # Database schema
│   └── migrations/
├── shared/
│   ├── const.ts
│   ├── types.ts
│   └── utils.ts
├── ARCHITECTURE.md                  # Arquitetura completa
├── IMPLEMENTATION_GUIDE.md          # Este arquivo
├── TODO.md                          # Lista de tarefas
└── README.md
```

---

## 🚀 Funcionalidades Implementadas

### ✅ Fase 1: Site Público (CONCLUÍDO)

- [x] Landing page com hero section premium
- [x] Página de Recursos com detalhes de funcionalidades
- [x] Página de Soluções com casos de uso
- [x] Página de Agendamento de Demonstração
- [x] Design responsivo em dark mode
- [x] Navegação intuitiva
- [x] CTAs estratégicos

### 📋 Próximas Fases

#### Fase 2: Portal Privado (EM DESENVOLVIMENTO)
- [ ] Dashboard Executivo
- [ ] Dashboard Técnico
- [ ] Central de Integrações
- [ ] Autenticação multi-tenant

#### Fase 3: Integrações (PLANEJADO)
- [ ] Meta Ads API
- [ ] Google Ads API
- [ ] TikTok Ads API
- [ ] Mercado Livre API
- [ ] Shopee API
- [ ] Amazon SP-API

#### Fase 4: CRM Unificado (PLANEJADO)
- [ ] Gestão de leads
- [ ] Funil de vendas (kanban/lista)
- [ ] Automações de captura
- [ ] Histórico de interações

#### Fase 5: IA de Crescimento (PLANEJADO)
- [ ] Campaign AI Analyst
- [ ] Sales AI Analyst
- [ ] Product & Pricing AI Advisor
- [ ] CRM AI Assistant
- [ ] Growth Strategist AI

#### Fase 6: Módulos Adicionais (PLANEJADO)
- [ ] Tráfego Pago
- [ ] Marketplaces e Vendas
- [ ] Produtos e Precificação
- [ ] Solicitações e Aprovações
- [ ] Relatórios Automáticos
- [ ] Documentos e Timeline

---

## 🔐 Segurança

### Isolamento Multi-tenant

```typescript
// Todas as queries filtram por clientId
export const getClientData = async (clientId: string, userId: string) => {
  // 1. Verificar que o usuário pertence ao cliente
  const user = await verifyUserAccess(userId, clientId);
  
  // 2. Buscar dados apenas deste cliente
  return db.query.data.findMany({
    where: eq(data.clientId, clientId)
  });
};
```

### Controle de Acesso

- **Admin**: Acesso total a todos os clientes
- **Cliente**: Acesso apenas aos seus dados
- **Gestor**: Acesso aos clientes atribuídos

### Proteções Implementadas

- ✅ Hash bcrypt para senhas
- ✅ Cookies httpOnly
- ✅ Controle por perfil
- ✅ Isolamento multi-tenant
- ✅ Logs de auditoria
- ✅ Rate limit em login
- ✅ Validação de entrada

---

## 📊 Banco de Dados

### Tabelas Principais

| Tabela | Propósito | Campos Chave |
|--------|-----------|--------------|
| `users` | Usuários do sistema | id, openId, clientId, role |
| `clients` | Dados dos clientes | id, name, email, status |
| `leads` | Leads do CRM | id, clientId, email, stage |
| `platformConnections` | Integrações | id, clientId, platform, status |
| `campaignMetrics` | Métricas de tráfego | id, clientId, platform, date |
| `marketplaceMetrics` | Métricas de vendas | id, clientId, marketplace, date |
| `products` | Catálogo de produtos | id, clientId, sku, price |
| `aiInsights` | Insights da IA | id, clientId, type, severity |
| `requests` | Solicitações de clientes | id, clientId, type, status |
| `tasks` | Tarefas internas | id, clientId, title, status |
| `reports` | Histórico de relatórios | id, clientId, type, status |
| `notes` | Notas e observações | id, clientId, content, type |

---

## 🔌 Integrações

### Meta Ads

```typescript
// Buscar campanhas
const campaigns = await metaAPI.getCampaigns(accountId);

// Buscar métricas
const metrics = await metaAPI.getMetrics(campaignId, dateRange);

// Dados retornados
{
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  conversionValue: number;
  roas: number;
}
```

### Google Ads

```typescript
// Buscar campanhas
const campaigns = await googleAdsAPI.getCampaigns(customerId);

// Buscar performance
const performance = await googleAdsAPI.getPerformance(campaignId, dateRange);
```

### Mercado Livre

```typescript
// Buscar pedidos
const orders = await mercadoLivreAPI.getOrders(sellerId);

// Buscar vendas
const sales = await mercadoLivreAPI.getSales(sellerId, dateRange);
```

---

## 🤖 Racun Growth AI

### 5 Analistas Especializados

#### 1. Campaign AI Analyst
Analisa campanhas de tráfego pago e detecta:
- Queda de CTR
- Alta de CPC
- Gasto sem conversão
- ROAS baixo

#### 2. Sales AI Analyst
Analisa vendas e marketplaces:
- Queda de conversão
- Produtos com baixa performance
- Canais com baixo faturamento

#### 3. Product & Pricing AI Advisor
Analisa produtos e margem:
- Produtos com margem baixa
- Produtos com potencial de escala
- Oportunidades de repricing

#### 4. CRM AI Assistant
Analisa leads e funil:
- Funil travado
- Oportunidades perdidas
- Leads de alta qualidade

#### 5. Growth Strategist AI
Cruza dados de todas as fontes:
- Diagnóstico completo
- Recomendações prioritizadas
- Plano de ação estratégico

---

## 📈 Fluxos Principais

### Fluxo de Onboarding

```
1. Cliente faz login
2. Detecta novo cliente
3. Inicia wizard:
   - Dados básicos
   - Conectar Meta Ads
   - Conectar Google Ads
   - Conectar TikTok Ads
   - Conectar Mercado Livre
   - Conectar Shopee
   - Conectar Amazon
   - Conectar CRM/WhatsApp
   - Configurar relatórios
   - Configurar metas
4. Puxa dados iniciais
5. Libera acesso ao portal
```

### Fluxo de Sincronização

```
1. Job diário dispara (BullMQ)
2. Para cada cliente com integrações:
   - Puxa dados de Meta Ads API
   - Puxa dados de Google Ads API
   - Puxa dados de TikTok Ads API
   - Puxa dados de Mercado Livre API
   - Puxa dados de Shopee API
   - Puxa dados de Amazon SP-API
3. Processa e normaliza dados
4. Salva em banco de dados
5. Atualiza cache Redis
6. Notifica se houver erros
```

### Fluxo de Análise de IA

```
1. Job diário dispara (ou manual)
2. Coleta dados do cliente (últimos 30 dias)
3. Passa para cada AI Analyst
4. Growth Strategist cruza insights
5. Gera recomendações prioritizadas
6. Salva em aiInsights
7. Notifica admin e cliente
```

---

## 🧪 Testes

### Executar Testes

```bash
# Rodar todos os testes
pnpm test

# Rodar testes em modo watch
pnpm test -- --watch

# Rodar testes com cobertura
pnpm test -- --coverage
```

### Exemplo de Teste

```typescript
import { describe, it, expect } from "vitest";
import { verifyUserAccess } from "./auth";

describe("verifyUserAccess", () => {
  it("should allow user to access their own client data", async () => {
    const result = await verifyUserAccess(userId, clientId);
    expect(result).toBe(true);
  });

  it("should deny access to other client data", async () => {
    const result = await verifyUserAccess(userId, otherClientId);
    expect(result).toBe(false);
  });
});
```

---

## 🚀 Deploy

### Preparar para Deploy

```bash
# Build do frontend
pnpm build

# Verificar tipos
pnpm check

# Rodar testes
pnpm test

# Criar checkpoint
# (via UI do Manus)
```

### Deploy para Produção

1. Criar checkpoint no Manus
2. Clicar em "Publish" na Management UI
3. Configurar domínio customizado (opcional)
4. Ativar SSL (automático)

---

## 📚 Documentação de APIs

### tRPC Procedures

Todas as APIs são type-safe via tRPC. Exemplos:

```typescript
// Frontend
const { data } = trpc.dashboard.metrics.useQuery({ clientId });

// Backend
router({
  dashboard: router({
    metrics: protectedProcedure
      .input(z.object({ clientId: z.number() }))
      .query(async ({ ctx, input }) => {
        // Implementação
      })
  })
});
```

---

## 🎯 Roadmap Técnico

### Semana 1-2: Fundação ✅
- [x] Banco de dados
- [x] Autenticação
- [x] Site público

### Semana 3-4: Portal Privado (EM ANDAMENTO)
- [ ] Dashboard executivo
- [ ] Dashboard técnico
- [ ] Central de integrações

### Semana 5-6: Integrações
- [ ] Meta Ads
- [ ] Google Ads
- [ ] TikTok Ads
- [ ] Mercado Livre
- [ ] Shopee
- [ ] Amazon

### Semana 7-8: CRM e IA
- [ ] CRM unificado
- [ ] IA com recomendações
- [ ] Relatórios automáticos

### Semana 9-10: Refinamento
- [ ] Testes
- [ ] Otimizações
- [ ] Documentação

---

## 🔧 Configuração de Ambiente

### .env Necessário

```env
# Database
DATABASE_URL=mysql://user:password@host:3306/racun_analytics

# Redis
REDIS_URL=redis://localhost:6379

# OAuth
VITE_APP_ID=your-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://login.manus.im
JWT_SECRET=your-secret

# API Keys
META_API_KEY=your-meta-key
GOOGLE_API_KEY=your-google-key
TIKTOK_API_KEY=your-tiktok-key
MERCADOLIVRE_API_KEY=your-ml-key
SHOPEE_API_KEY=your-shopee-key
AMAZON_API_KEY=your-amazon-key

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email
SMTP_PASS=your-password

# WhatsApp
WHATSAPP_API_KEY=your-whatsapp-key
WHATSAPP_PHONE_ID=your-phone-id

# LLM
OPENAI_API_KEY=your-openai-key
```

---

## 💡 Melhorias Estratégicas Extras

1. **White-label** - Permitir que agências parceiras usem com sua marca
2. **API Pública** - Expor endpoints para integrações de terceiros
3. **Webhooks** - Notificações em tempo real
4. **Automações Avançadas** - Criar workflows customizados
5. **Marketplace de Apps** - Extensões de terceiros
6. **Análise Preditiva** - ML para prever trends
7. **Benchmarks** - Comparar com mercado
8. **ERP Integration** - Conectar com sistemas de gestão
9. **Mobile App** - iOS/Android nativo
10. **Integrações CRM** - RD Station, HubSpot, Pipedrive

---

## 📞 Suporte e Contato

Para dúvidas sobre a implementação:
- Consulte a documentação em `ARCHITECTURE.md`
- Verifique o `TODO.md` para status das features
- Abra uma issue no repositório

---

## 📄 Licença

Copyright © 2026 Agência Racun. Todos os direitos reservados.

