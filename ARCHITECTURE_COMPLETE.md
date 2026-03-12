# Racun Analytics - Arquitetura SaaS

## Visão Geral

Plataforma SaaS multi-tenant, escalável e modular construída com:
- **Frontend**: Next.js 19 + React + Tailwind CSS
- **Backend**: Express.js + tRPC
- **Banco de Dados**: PostgreSQL/MySQL + Drizzle ORM
- **Cache**: Redis
- **Jobs**: Cron + BullMQ
- **Autenticação**: OAuth + JWT

---

## Módulos Implementados

- ✅ Site público com landing page
- ✅ Portal privado multi-tenant
- ✅ Autenticação OAuth
- ✅ Integrações (Meta Ads, Google Ads)
- ✅ Job scheduler para sincronização
- ✅ Dashboard com KPIs em tempo real
- ✅ CRM com funil de vendas
- ✅ IA de análise estratégica
- ✅ Sistema de solicitações e aprovações
- ✅ Relatórios automáticos


---

## Arquitetura Multi-Tenant

### Isolamento por Cliente

```
┌─────────────────────────────────────────┐
│         Racun Analytics (SaaS)          │
├─────────────────────────────────────────┤
│  Cliente A  │  Cliente B  │  Cliente C  │
│  (Tenant 1) │  (Tenant 2) │  (Tenant 3) │
├─────────────────────────────────────────┤
│     Banco de Dados Compartilhado        │
│  (com isolamento por clientId)          │
└─────────────────────────────────────────┘
```

### Fluxo de Autenticação

1. Usuário faz login via OAuth (Manus)
2. Sistema cria sessão com JWT
3. Cada request inclui clientId (extraído do usuário)
4. Queries filtram automaticamente por clientId
5. Isolamento total garantido

---

## Banco de Dados

### Tabelas Core

```sql
-- Usuários
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  openId VARCHAR(255) UNIQUE,
  email VARCHAR(255),
  name VARCHAR(255),
  role ENUM('admin', 'user'),
  createdAt TIMESTAMP DEFAULT NOW()
);

-- Clientes (Tenants)
CREATE TABLE clients (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  name VARCHAR(255),
  status ENUM('active', 'inactive'),
  createdAt TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (userId) REFERENCES users(id)
);

-- Integrações
CREATE TABLE integrationAccounts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  clientId INT NOT NULL,
  platform ENUM('meta', 'google', 'tiktok'),
  accountName VARCHAR(255),
  accessToken TEXT,
  refreshToken TEXT,
  externalAccountId VARCHAR(255),
  status ENUM('active', 'inactive', 'error'),
  lastSyncAt TIMESTAMP,
  FOREIGN KEY (clientId) REFERENCES clients(id)
);
```

---

## Fluxo de Sincronização

### Job Scheduler (a cada 30 minutos)

```
┌──────────────────────────────────────┐
│    Cron Job (*/30 * * * *)           │
├──────────────────────────────────────┤
│  1. Buscar contas integradas         │
│  2. Para cada conta:                 │
│     a. Autenticar com API externa    │
│     b. Sincronizar campanhas         │
│     c. Sincronizar métricas          │
│     d. Salvar no banco               │
│     e. Registrar log                 │
│  3. Notificar usuário se erro        │
└──────────────────────────────────────┘
```

---

## Padrão de Integração

### Serviço de Integração (exemplo: Meta Ads)

```typescript
export class MetaAdsService {
  // 1. Autenticação OAuth
  static async getAuthUrl(clientId, clientSecret, redirectUri) { }
  static async handleCallback(code, clientId, clientSecret) { }
  
  // 2. Sincronização de Dados
  async syncCampaigns(): Promise<Campaign[]> { }
  async getCampaignMetrics(startDate, endDate): Promise<Metric[]> { }
  
  // 3. Persistência
  async saveCampaigns(campaigns) { }
  async saveMetrics(metrics) { }
}
```

### Procedimento tRPC

```typescript
export const metaRouter = router({
  getAuthUrl: publicProcedure
    .input(z.object({ redirectUri: z.string() }))
    .query(async ({ input }) => {
      return MetaAdsService.getAuthUrl(...);
    }),
  
  handleCallback: protectedProcedure
    .input(z.object({ code: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const token = await MetaAdsService.handleCallback(input.code);
      await saveIntegrationAccount(ctx.user.clientId, token);
      return { success: true };
    }),
});
```

---

## Dashboard em Tempo Real

### KPIs Principais

1. **Investimento Total** - Soma de gastos em todas as campanhas
2. **ROAS Médio** - Retorno sobre investimento em anúncios
3. **Conversões** - Total de conversões geradas
4. **Taxa de Conversão** - Conversões / Cliques
5. **CPC** - Custo por clique
6. **CTR** - Taxa de clique

### Queries Otimizadas

```typescript
// Buscar KPIs (com cache Redis)
const totalSpend = await db
  .select({ total: sql`SUM(spend)` })
  .from(metaMetrics)
  .where(gte(metaMetrics.date, sevenDaysAgo));
```

---

## Testes

### Estrutura de Testes (Vitest)

```
server/
├── services/
│   ├── metaAdsService.ts
│   └── metaAdsService.test.ts
├── routers/
│   ├── metaRouter.ts
│   └── metaRouter.test.ts
└── db-integrations.ts
    └── db-integrations.test.ts
```

### Exemplo de Teste

```typescript
describe('MetaAdsService', () => {
  it('deve sincronizar campanhas com sucesso', async () => {
    const service = new MetaAdsService(accessToken);
    const campaigns = await service.syncCampaigns();
    
    expect(campaigns).toHaveLength(5);
    expect(campaigns[0]).toHaveProperty('id');
    expect(campaigns[0]).toHaveProperty('name');
  });
});
```

---

## Segurança

### Isolamento Multi-Tenant

- ✅ Cada query filtra por `clientId`
- ✅ Tokens armazenados criptografados
- ✅ Sessões com expiração
- ✅ Rate limiting por cliente
- ✅ Logs de auditoria

### Proteção de Dados

- ✅ HTTPS obrigatório
- ✅ Senhas com hash bcrypt
- ✅ Tokens JWT com expiração
- ✅ Refresh tokens seguros
- ✅ CORS configurado

---

## Escalabilidade

### Horizontal Scaling

```
┌─────────────────┐
│   Load Balancer │
├─────────────────┤
│  Instance 1     │
│  Instance 2     │
│  Instance 3     │
└─────────────────┘
       ↓
   Shared DB
   Shared Redis
```

### Caching Strategy

- **Cache L1**: Redis (30 min)
- **Cache L2**: Browser (5 min)
- **Cache Invalidation**: On sync completion

---

## Deployment

### Ambiente de Produção

- **Frontend**: Vercel / Netlify
- **Backend**: Railway / Render / AWS
- **Database**: Managed PostgreSQL (Supabase / Railway)
- **Redis**: Managed Redis (Redis Cloud)
- **Monitoring**: Sentry / DataDog

### CI/CD Pipeline

```
Push → Tests → Build → Deploy → Monitor
```

---

## Roadmap

### MVP (Fase 1)
- ✅ Site público
- ✅ Portal privado
- ✅ Integrações (Meta, Google)
- ✅ Job scheduler
- ✅ Dashboard básico

### V2 (Fase 2)
- ⏳ CRM com funil kanban
- ⏳ IA de análise
- ⏳ Sistema de solicitações
- ⏳ Relatórios automáticos

### V3 (Fase 3)
- ⏳ Marketplace de integrações
- ⏳ API pública
- ⏳ White-label
- ⏳ Analytics avançado

