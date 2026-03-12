# Guia de Implementação - Persistência de Dados

## Status Atual

✅ **Completo:**
- Serviços de integração (MetaAdsService, GoogleAdsService)
- Job Scheduler com sincronização a cada 30 minutos
- Schema Drizzle com tabelas de integrações
- Helpers de banco de dados (db-integrations.ts)
- Testes vitest (76/82 passando)
- Documentação completa

⏳ **Próximos Passos:**
1. Criar tabelas no banco de dados
2. Integrar persistência com job scheduler
3. Atualizar dashboard com dados reais
4. Implementar procedimentos tRPC para queries

---

## Passo 1: Criar Tabelas no Banco de Dados

Execute os seguintes comandos SQL para criar as tabelas de integração:

```sql
-- Integration Accounts
CREATE TABLE IF NOT EXISTS integrationAccounts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  clientId INT NOT NULL,
  platform ENUM('meta', 'google', 'tiktok', 'mercado_livre', 'shopee', 'amazon') NOT NULL,
  accountName VARCHAR(255) NOT NULL,
  accessToken TEXT NOT NULL,
  refreshToken TEXT,
  externalAccountId VARCHAR(255) NOT NULL,
  externalAccountName VARCHAR(255),
  status ENUM('active', 'inactive', 'error', 'expired') DEFAULT 'active' NOT NULL,
  lastSyncAt TIMESTAMP NULL,
  lastErrorAt TIMESTAMP NULL,
  lastErrorMessage TEXT,
  isActive BOOLEAN DEFAULT true NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  INDEX clientPlatform_idx (clientId, platform),
  INDEX status_idx (status)
);

-- Meta Campaigns
CREATE TABLE IF NOT EXISTS metaCampaigns (
  id INT PRIMARY KEY AUTO_INCREMENT,
  integrationAccountId INT NOT NULL,
  externalCampaignId VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  status ENUM('ACTIVE', 'PAUSED', 'DELETED', 'ARCHIVED') NOT NULL,
  objective VARCHAR(100),
  dailyBudget DECIMAL(12, 2),
  lifetimeBudget DECIMAL(12, 2),
  startDate TIMESTAMP NULL,
  endDate TIMESTAMP NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  syncedAt TIMESTAMP NULL,
  INDEX integrationAccount_idx (integrationAccountId),
  INDEX externalCampaignId_idx (externalCampaignId)
);

-- Meta Metrics
CREATE TABLE IF NOT EXISTS metaMetrics (
  id INT PRIMARY KEY AUTO_INCREMENT,
  metaCampaignId INT NOT NULL,
  date TIMESTAMP NOT NULL,
  spend DECIMAL(12, 2) NOT NULL,
  impressions INT NOT NULL,
  clicks INT NOT NULL,
  conversions DECIMAL(10, 2) NOT NULL,
  conversionValue DECIMAL(12, 2),
  ctr DECIMAL(5, 2),
  cpc DECIMAL(8, 2),
  cpm DECIMAL(8, 2),
  roas DECIMAL(5, 2),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  INDEX campaignDate_idx (metaCampaignId, date)
);

-- Google Ads Campaigns
CREATE TABLE IF NOT EXISTS googleAdsCampaigns (
  id INT PRIMARY KEY AUTO_INCREMENT,
  integrationAccountId INT NOT NULL,
  externalCampaignId VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  status ENUM('ENABLED', 'PAUSED', 'REMOVED', 'UNSPECIFIED') NOT NULL,
  advertisingChannelType VARCHAR(100),
  budget DECIMAL(12, 2),
  startDate TIMESTAMP NULL,
  endDate TIMESTAMP NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  syncedAt TIMESTAMP NULL,
  INDEX googleIntegrationAccount_idx (integrationAccountId),
  INDEX googleExternalCampaignId_idx (externalCampaignId)
);

-- Google Ads Metrics
CREATE TABLE IF NOT EXISTS googleAdsMetrics (
  id INT PRIMARY KEY AUTO_INCREMENT,
  googleAdsCampaignId INT NOT NULL,
  date TIMESTAMP NOT NULL,
  spend DECIMAL(12, 2) NOT NULL,
  impressions INT NOT NULL,
  clicks INT NOT NULL,
  conversions DECIMAL(10, 2) NOT NULL,
  conversionValue DECIMAL(12, 2),
  ctr DECIMAL(5, 2),
  cpc DECIMAL(8, 2),
  cpm DECIMAL(8, 2),
  roas DECIMAL(5, 2),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  INDEX googleCampaignDate_idx (googleAdsCampaignId, date)
);

-- Google Ads Keywords
CREATE TABLE IF NOT EXISTS googleAdsKeywords (
  id INT PRIMARY KEY AUTO_INCREMENT,
  googleAdsCampaignId INT NOT NULL,
  externalKeywordId VARCHAR(255) NOT NULL UNIQUE,
  text VARCHAR(255) NOT NULL,
  matchType ENUM('EXACT', 'PHRASE', 'BROAD', 'BROAD_MODIFIED') NOT NULL,
  status ENUM('ENABLED', 'PAUSED', 'REMOVED') NOT NULL,
  impressions INT DEFAULT 0,
  clicks INT DEFAULT 0,
  spend DECIMAL(12, 2) DEFAULT 0,
  conversions DECIMAL(10, 2) DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  INDEX googleKeywordsCampaign_idx (googleAdsCampaignId),
  INDEX googleExternalKeywordId_idx (externalKeywordId)
);

-- Integration Logs
CREATE TABLE IF NOT EXISTS integrationLogs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  integrationAccountId INT NOT NULL,
  action VARCHAR(100) NOT NULL,
  status ENUM('success', 'error', 'pending') NOT NULL,
  message TEXT,
  recordsProcessed INT DEFAULT 0,
  recordsFailed INT DEFAULT 0,
  startedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  completedAt TIMESTAMP NULL,
  INDEX integrationAccount_idx (integrationAccountId),
  INDEX status_idx (status)
);
```

---

## Passo 2: Integrar Persistência com Job Scheduler

Atualize o arquivo `server/jobs/syncIntegrations.ts` para chamar os helpers de persistência:

```typescript
import {
  saveMetaCampaigns,
  saveMetaMetrics,
  saveGoogleAdsCampaigns,
  saveGoogleAdsMetrics,
  logIntegrationSync,
} from "../db-integrations";

// Dentro de syncMetaAds()
async syncMetaAds(): Promise<void> {
  try {
    const campaigns = await metaService.syncCampaigns();
    
    // Converter e salvar campanhas
    const campaignsToSave = campaigns.map(c => ({
      integrationAccountId: accountId,
      externalCampaignId: c.id,
      name: c.name,
      status: c.status,
      objective: c.objective,
      dailyBudget: c.daily_budget?.toString(),
      lifetimeBudget: c.lifetime_budget?.toString(),
      startDate: c.start_time ? new Date(c.start_time) : undefined,
      endDate: c.end_time ? new Date(c.end_time) : undefined,
    }));
    
    await saveMetaCampaigns(campaignsToSave);
    
    // Sincronizar métricas
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const today = new Date();
    const metrics = await metaService.getAccountMetrics(
      sevenDaysAgo.toISOString().split('T')[0],
      today.toISOString().split('T')[0]
    );
    
    // Converter e salvar métricas
    const metricsToSave = metrics.map(m => ({
      metaCampaignId: m.campaignId,
      date: new Date(m.date),
      spend: m.spend?.toString() || "0",
      impressions: m.impressions || 0,
      clicks: m.clicks || 0,
      conversions: m.conversions?.toString() || "0",
      conversionValue: m.conversionValue?.toString(),
      ctr: m.ctr?.toString(),
      cpc: m.cpc?.toString(),
      cpm: m.cpm?.toString(),
      roas: m.roas?.toString(),
    }));
    
    await saveMetaMetrics(metricsToSave);
    
    // Registrar log
    await logIntegrationSync({
      integrationAccountId: accountId,
      action: "sync_campaigns_metrics",
      status: "success",
      message: `${campaigns.length} campanhas e ${metrics.length} métricas sincronizadas`,
      recordsProcessed: campaigns.length + metrics.length,
      recordsFailed: 0,
      startedAt: new Date(syncStartTime),
      completedAt: new Date(),
    });
  } catch (error) {
    // Registrar erro
    await logIntegrationSync({
      integrationAccountId: accountId,
      action: "sync_campaigns_metrics",
      status: "error",
      message: error instanceof Error ? error.message : "Erro desconhecido",
      recordsProcessed: 0,
      recordsFailed: 0,
      startedAt: new Date(syncStartTime),
      completedAt: new Date(),
    });
  }
}

// Fazer o mesmo para Google Ads
```

---

## Passo 3: Criar Procedimentos tRPC para Queries

Crie um novo arquivo `server/routers/dashboardRouter.ts`:

```typescript
import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { metaCampaigns, metaMetrics, googleAdsCampaigns, googleAdsMetrics } from "../../drizzle/schema-integrations";
import { sql, gte, lte, and } from "drizzle-orm";

export const dashboardRouter = router({
  // KPI: Total de Investimento (últimos 7 dias)
  getTotalSpend: protectedProcedure
    .input(z.object({ days: z.number().default(7) }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return { meta: 0, google: 0, total: 0 };

      const daysAgo = new Date(Date.now() - (input?.days || 7) * 24 * 60 * 60 * 1000);

      try {
        const metaSpend = await db
          .select({ total: sql`SUM(spend)` })
          .from(metaMetrics)
          .where(gte(metaMetrics.date, daysAgo));

        const googleSpend = await db
          .select({ total: sql`SUM(spend)` })
          .from(googleAdsMetrics)
          .where(gte(googleAdsMetrics.date, daysAgo));

        const metaTotal = parseFloat(metaSpend[0]?.total || 0);
        const googleTotal = parseFloat(googleSpend[0]?.total || 0);

        return {
          meta: metaTotal,
          google: googleTotal,
          total: metaTotal + googleTotal,
        };
      } catch (error) {
        console.error("[Dashboard] Erro ao buscar investimento total:", error);
        return { meta: 0, google: 0, total: 0 };
      }
    }),

  // KPI: ROAS Médio
  getAverageRoas: protectedProcedure
    .input(z.object({ days: z.number().default(7) }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return { meta: 0, google: 0, combined: 0 };

      const daysAgo = new Date(Date.now() - (input?.days || 7) * 24 * 60 * 60 * 1000);

      try {
        const metaRoas = await db
          .select({ avg: sql`AVG(roas)` })
          .from(metaMetrics)
          .where(gte(metaMetrics.date, daysAgo));

        const googleRoas = await db
          .select({ avg: sql`AVG(roas)` })
          .from(googleAdsMetrics)
          .where(gte(googleAdsMetrics.date, daysAgo));

        const metaAvg = parseFloat(metaRoas[0]?.avg || 0);
        const googleAvg = parseFloat(googleRoas[0]?.avg || 0);

        return {
          meta: metaAvg,
          google: googleAvg,
          combined: (metaAvg + googleAvg) / 2,
        };
      } catch (error) {
        console.error("[Dashboard] Erro ao buscar ROAS médio:", error);
        return { meta: 0, google: 0, combined: 0 };
      }
    }),

  // KPI: Total de Conversões
  getTotalConversions: protectedProcedure
    .input(z.object({ days: z.number().default(7) }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return { meta: 0, google: 0, total: 0 };

      const daysAgo = new Date(Date.now() - (input?.days || 7) * 24 * 60 * 60 * 1000);

      try {
        const metaConversions = await db
          .select({ total: sql`SUM(conversions)` })
          .from(metaMetrics)
          .where(gte(metaMetrics.date, daysAgo));

        const googleConversions = await db
          .select({ total: sql`SUM(conversions)` })
          .from(googleAdsMetrics)
          .where(gte(googleAdsMetrics.date, daysAgo));

        const metaTotal = parseFloat(metaConversions[0]?.total || 0);
        const googleTotal = parseFloat(googleConversions[0]?.total || 0);

        return {
          meta: metaTotal,
          google: googleTotal,
          total: metaTotal + googleTotal,
        };
      } catch (error) {
        console.error("[Dashboard] Erro ao buscar conversões totais:", error);
        return { meta: 0, google: 0, total: 0 };
      }
    }),

  // Gráfico: Investimento por Dia
  getDailySpend: protectedProcedure
    .input(z.object({ days: z.number().default(7) }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      const daysAgo = new Date(Date.now() - (input?.days || 7) * 24 * 60 * 60 * 1000);

      try {
        const data = await db
          .select({
            date: metaMetrics.date,
            spend: sql`SUM(${metaMetrics.spend})`,
          })
          .from(metaMetrics)
          .where(gte(metaMetrics.date, daysAgo))
          .groupBy(metaMetrics.date)
          .orderBy(metaMetrics.date);

        return data.map(d => ({
          date: d.date,
          spend: parseFloat(d.spend || 0),
        }));
      } catch (error) {
        console.error("[Dashboard] Erro ao buscar investimento diário:", error);
        return [];
      }
    }),

  // Gráfico: Performance por Campanha
  getCampaignPerformance: protectedProcedure
    .input(z.object({ days: z.number().default(7) }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      const daysAgo = new Date(Date.now() - (input?.days || 7) * 24 * 60 * 60 * 1000);

      try {
        const data = await db
          .select({
            campaignName: metaCampaigns.name,
            spend: sql`SUM(${metaMetrics.spend})`,
            conversions: sql`SUM(${metaMetrics.conversions})`,
            roas: sql`AVG(${metaMetrics.roas})`,
          })
          .from(metaCampaigns)
          .leftJoin(metaMetrics, sql`${metaCampaigns.id} = ${metaMetrics.metaCampaignId}`)
          .where(gte(metaMetrics.date, daysAgo))
          .groupBy(metaCampaigns.id);

        return data.map(d => ({
          campaignName: d.campaignName,
          spend: parseFloat(d.spend || 0),
          conversions: parseFloat(d.conversions || 0),
          roas: parseFloat(d.roas || 0),
        }));
      } catch (error) {
        console.error("[Dashboard] Erro ao buscar performance por campanha:", error);
        return [];
      }
    }),
});
```

Depois adicione ao `server/routers.ts`:

```typescript
import { dashboardRouter } from "./routers/dashboardRouter";

export const appRouter = router({
  // ... outros routers
  dashboard: dashboardRouter,
});
```

---

## Passo 4: Atualizar Dashboard com Dados Reais

Atualize `client/src/pages/portal/Dashboard.tsx` para usar os dados do banco:

```typescript
import { trpc } from "@/lib/trpc";

export default function Dashboard() {
  const { data: totalSpend } = trpc.dashboard.getTotalSpend.useQuery();
  const { data: avgRoas } = trpc.dashboard.getAverageRoas.useQuery();
  const { data: totalConversions } = trpc.dashboard.getTotalConversions.useQuery();
  const { data: dailySpend } = trpc.dashboard.getDailySpend.useQuery();
  const { data: campaignPerformance } = trpc.dashboard.getCampaignPerformance.useQuery();

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard
          title="Investimento Total"
          value={`R$ ${(totalSpend?.total || 0).toFixed(2)}`}
          subtitle="Últimos 7 dias"
        />
        <KPICard
          title="ROAS Médio"
          value={`${(avgRoas?.combined || 0).toFixed(2)}x`}
          subtitle="Últimos 7 dias"
        />
        <KPICard
          title="Conversões"
          value={Math.floor(totalConversions?.total || 0).toString()}
          subtitle="Últimos 7 dias"
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Investimento por Dia"
          data={dailySpend || []}
        />
        <ChartCard
          title="Performance por Campanha"
          data={campaignPerformance || []}
        />
      </div>
    </div>
  );
}
```

---

## Passo 5: Testar a Implementação

1. **Criar tabelas no banco:**
   ```bash
   # Usar o Management UI do Manus para executar os comandos SQL
   ```

2. **Executar testes:**
   ```bash
   pnpm test -- db-integrations
   ```

3. **Verificar sincronização:**
   - Acessar o portal
   - Ir para "Integrações"
   - Conectar Meta Ads e Google Ads
   - Aguardar 30 minutos (ou forçar sincronização)
   - Verificar se os dados aparecem no dashboard

4. **Monitorar logs:**
   ```bash
   # Ver histórico de sincronizações
   SELECT * FROM integrationLogs ORDER BY startedAt DESC LIMIT 10;
   ```

---

## Troubleshooting

### Dados não aparecem no dashboard
1. Verificar se as tabelas foram criadas:
   ```sql
   SHOW TABLES LIKE '%meta%';
   SHOW TABLES LIKE '%google%';
   ```

2. Verificar se os dados foram sincronizados:
   ```sql
   SELECT COUNT(*) FROM metaCampaigns;
   SELECT COUNT(*) FROM metaMetrics;
   ```

3. Verificar logs de sincronização:
   ```sql
   SELECT * FROM integrationLogs WHERE status = 'error' ORDER BY startedAt DESC;
   ```

### Performance lenta
1. Verificar índices:
   ```sql
   SHOW INDEX FROM metaMetrics;
   SHOW INDEX FROM googleAdsMetrics;
   ```

2. Adicionar índices se necessário:
   ```sql
   ALTER TABLE metaMetrics ADD INDEX idx_date (date);
   ALTER TABLE googleAdsMetrics ADD INDEX idx_date (date);
   ```

3. Implementar paginação nas queries

---

## Próximos Passos

1. ✅ Implementar persistência de dados
2. ⏳ Criar dashboard com dados reais
3. ⏳ Implementar CRM com funil kanban
4. ⏳ Criar Racun Growth AI
5. ⏳ Implementar sistema de solicitações e aprovações
6. ⏳ Criar relatórios automáticos
