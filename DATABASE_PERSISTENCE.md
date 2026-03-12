# Persistência de Dados - Meta Ads e Google Ads

## Visão Geral

Este documento descreve como os dados de Meta Ads e Google Ads são persistidos no banco de dados para alimentar o dashboard em tempo real.

## Arquitetura de Persistência

### Fluxo de Dados

```
[Meta Ads API] → [MetaAdsService] → [Job Scheduler] → [DB Helpers] → [MySQL Database]
[Google Ads API] → [GoogleAdsService] → [Job Scheduler] → [DB Helpers] → [MySQL Database]
                                                                              ↓
                                                                    [Dashboard Queries]
```

## Tabelas de Banco de Dados

### 1. Integration Accounts
Armazena as contas de integração (Meta, Google, TikTok, etc)

```sql
CREATE TABLE integrationAccounts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  clientId INT NOT NULL,
  platform ENUM('meta', 'google', 'tiktok', 'mercado_livre', 'shopee', 'amazon'),
  accountName VARCHAR(255),
  accessToken TEXT,
  refreshToken TEXT,
  externalAccountId VARCHAR(255),
  status ENUM('active', 'inactive', 'error', 'expired'),
  lastSyncAt TIMESTAMP,
  lastErrorAt TIMESTAMP,
  lastErrorMessage TEXT,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW() ON UPDATE CURRENT_TIMESTAMP,
  INDEX (clientId, platform)
);
```

### 2. Meta Campaigns
Campanhas sincronizadas do Meta Ads

```sql
CREATE TABLE metaCampaigns (
  id INT PRIMARY KEY AUTO_INCREMENT,
  integrationAccountId INT NOT NULL,
  externalCampaignId VARCHAR(255) UNIQUE,
  name VARCHAR(255),
  status ENUM('ACTIVE', 'PAUSED', 'DELETED', 'ARCHIVED'),
  objective VARCHAR(100),
  dailyBudget DECIMAL(12, 2),
  lifetimeBudget DECIMAL(12, 2),
  startDate TIMESTAMP,
  endDate TIMESTAMP,
  syncedAt TIMESTAMP,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW() ON UPDATE CURRENT_TIMESTAMP,
  INDEX (integrationAccountId),
  INDEX (externalCampaignId)
);
```

### 3. Meta Metrics
Métricas diárias de campanhas Meta

```sql
CREATE TABLE metaMetrics (
  id INT PRIMARY KEY AUTO_INCREMENT,
  metaCampaignId INT NOT NULL,
  date TIMESTAMP NOT NULL,
  spend DECIMAL(12, 2),
  impressions INT,
  clicks INT,
  conversions DECIMAL(10, 2),
  conversionValue DECIMAL(12, 2),
  ctr DECIMAL(5, 2),
  cpc DECIMAL(8, 2),
  cpm DECIMAL(8, 2),
  roas DECIMAL(5, 2),
  createdAt TIMESTAMP DEFAULT NOW(),
  INDEX (metaCampaignId, date)
);
```

### 4. Google Ads Campaigns
Campanhas sincronizadas do Google Ads

```sql
CREATE TABLE googleAdsCampaigns (
  id INT PRIMARY KEY AUTO_INCREMENT,
  integrationAccountId INT NOT NULL,
  externalCampaignId VARCHAR(255) UNIQUE,
  name VARCHAR(255),
  status ENUM('ENABLED', 'PAUSED', 'REMOVED', 'UNSPECIFIED'),
  advertisingChannelType VARCHAR(100),
  budget DECIMAL(12, 2),
  startDate TIMESTAMP,
  endDate TIMESTAMP,
  syncedAt TIMESTAMP,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW() ON UPDATE CURRENT_TIMESTAMP,
  INDEX (integrationAccountId),
  INDEX (externalCampaignId)
);
```

### 5. Google Ads Metrics
Métricas diárias de campanhas Google

```sql
CREATE TABLE googleAdsMetrics (
  id INT PRIMARY KEY AUTO_INCREMENT,
  googleAdsCampaignId INT NOT NULL,
  date TIMESTAMP NOT NULL,
  spend DECIMAL(12, 2),
  impressions INT,
  clicks INT,
  conversions DECIMAL(10, 2),
  conversionValue DECIMAL(12, 2),
  ctr DECIMAL(5, 2),
  cpc DECIMAL(8, 2),
  cpm DECIMAL(8, 2),
  roas DECIMAL(5, 2),
  createdAt TIMESTAMP DEFAULT NOW(),
  INDEX (googleAdsCampaignId, date)
);
```

### 6. Google Ads Keywords
Palavras-chave sincronizadas

```sql
CREATE TABLE googleAdsKeywords (
  id INT PRIMARY KEY AUTO_INCREMENT,
  googleAdsCampaignId INT NOT NULL,
  externalKeywordId VARCHAR(255) UNIQUE,
  text VARCHAR(255),
  matchType ENUM('EXACT', 'PHRASE', 'BROAD', 'BROAD_MODIFIED'),
  status ENUM('ENABLED', 'PAUSED', 'REMOVED'),
  impressions INT,
  clicks INT,
  spend DECIMAL(12, 2),
  conversions DECIMAL(10, 2),
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW() ON UPDATE CURRENT_TIMESTAMP,
  INDEX (googleAdsCampaignId),
  INDEX (externalKeywordId)
);
```

### 7. Integration Logs
Histórico de sincronizações

```sql
CREATE TABLE integrationLogs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  integrationAccountId INT NOT NULL,
  action VARCHAR(100),
  status ENUM('success', 'error', 'pending'),
  message TEXT,
  recordsProcessed INT,
  recordsFailed INT,
  startedAt TIMESTAMP,
  completedAt TIMESTAMP,
  INDEX (integrationAccountId, status)
);
```

## Helpers de Banco de Dados

O arquivo `server/db-integrations.ts` fornece funções para persistência:

### Meta Ads

```typescript
// Salvar campanhas
await saveMetaCampaigns([
  {
    integrationAccountId: 1,
    externalCampaignId: "act_123456789",
    name: "Campanha de Verão",
    status: "ACTIVE",
    objective: "CONVERSIONS",
    dailyBudget: 100.00,
    // ...
  }
]);

// Salvar métricas
await saveMetaMetrics([
  {
    metaCampaignId: 1,
    date: new Date("2026-03-12"),
    spend: 150.50,
    impressions: 5000,
    clicks: 250,
    conversions: 10,
    conversionValue: 500.00,
    ctr: 5.0,
    cpc: 0.60,
    cpm: 30.10,
    roas: 3.33,
  }
]);

// Obter campanhas por conta
const campaigns = await getMetaCampaignsByAccount(1);

// Obter métricas por período
const metrics = await getMetaMetricsByPeriod(
  1,
  new Date("2026-03-05"),
  new Date("2026-03-12")
);
```

### Google Ads

```typescript
// Salvar campanhas
await saveGoogleAdsCampaigns([
  {
    integrationAccountId: 2,
    externalCampaignId: "1234567890",
    name: "Campanha de Busca",
    status: "ENABLED",
    advertisingChannelType: "SEARCH",
    budget: 200.00,
    // ...
  }
]);

// Salvar métricas
await saveGoogleAdsMetrics([
  {
    googleAdsCampaignId: 1,
    date: new Date("2026-03-12"),
    spend: 200.00,
    impressions: 8000,
    clicks: 400,
    conversions: 20,
    conversionValue: 1000.00,
    ctr: 5.0,
    cpc: 0.50,
    cpm: 25.00,
    roas: 5.0,
  }
]);

// Salvar palavras-chave
await saveGoogleAdsKeywords([
  {
    googleAdsCampaignId: 1,
    externalKeywordId: "kw_123456",
    text: "sapatos online",
    matchType: "EXACT",
    status: "ENABLED",
    impressions: 500,
    clicks: 50,
    spend: 25.00,
    conversions: 2,
  }
]);

// Obter campanhas por conta
const campaigns = await getGoogleAdsCampaignsByAccount(2);

// Obter métricas por período
const metrics = await getGoogleAdsMetricsByPeriod(
  1,
  new Date("2026-03-05"),
  new Date("2026-03-12")
);
```

### Logs de Sincronização

```typescript
// Registrar log de sincronização
await logIntegrationSync({
  integrationAccountId: 1,
  action: "sync_campaigns_metrics",
  status: "success",
  message: "12 campanhas e 84 métricas sincronizadas",
  recordsProcessed: 96,
  recordsFailed: 0,
  startedAt: new Date(),
  completedAt: new Date(),
});

// Obter histórico
const history = await getSyncHistory(1, 50);

// Obter estatísticas
const stats = await getSyncStatistics(1);
// Retorna: { totalSyncs, successCount, errorCount, totalRecordsProcessed, totalRecordsFailed }
```

## Integração com Job Scheduler

O job scheduler (`server/jobs/syncIntegrations.ts`) deve ser atualizado para chamar os helpers de persistência:

```typescript
// Dentro de syncMetaAds()
const campaigns = await metaService.syncCampaigns();
const campaignsToSave = campaigns.map(c => ({
  integrationAccountId: accountId,
  externalCampaignId: c.id,
  name: c.name,
  status: c.status,
  // ... outros campos
}));
await saveMetaCampaigns(campaignsToSave);

// Dentro de syncGoogleAds()
const campaigns = await googleService.syncCampaigns();
const campaignsToSave = campaigns.map(c => ({
  integrationAccountId: accountId,
  externalCampaignId: c.id,
  name: c.name,
  status: c.status,
  // ... outros campos
}));
await saveGoogleAdsCampaigns(campaignsToSave);
```

## Queries para Dashboard

### KPI: Total de Investimento (últimos 7 dias)

```typescript
// Meta
const metaSpend = await db
  .select({ total: sql`SUM(spend)` })
  .from(metaMetrics)
  .where(
    and(
      gte(metaMetrics.date, sevenDaysAgo),
      lte(metaMetrics.date, today)
    )
  );

// Google
const googleSpend = await db
  .select({ total: sql`SUM(spend)` })
  .from(googleAdsMetrics)
  .where(
    and(
      gte(googleAdsMetrics.date, sevenDaysAgo),
      lte(googleAdsMetrics.date, today)
    )
  );

// Total
const totalSpend = (metaSpend[0]?.total || 0) + (googleSpend[0]?.total || 0);
```

### KPI: ROAS Médio

```typescript
const metaRoas = await db
  .select({ avg: sql`AVG(roas)` })
  .from(metaMetrics)
  .where(gte(metaMetrics.date, sevenDaysAgo));

const googleRoas = await db
  .select({ avg: sql`AVG(roas)` })
  .from(googleAdsMetrics)
  .where(gte(googleAdsMetrics.date, sevenDaysAgo));
```

### KPI: Conversões Totais

```typescript
const metaConversions = await db
  .select({ total: sql`SUM(conversions)` })
  .from(metaMetrics)
  .where(gte(metaMetrics.date, sevenDaysAgo));

const googleConversions = await db
  .select({ total: sql`SUM(conversions)` })
  .from(googleAdsMetrics)
  .where(gte(googleAdsMetrics.date, sevenDaysAgo));
```

### Gráfico: Investimento por Dia

```typescript
const dailySpend = await db
  .select({
    date: metaMetrics.date,
    spend: sql`SUM(spend)`,
  })
  .from(metaMetrics)
  .where(gte(metaMetrics.date, sevenDaysAgo))
  .groupBy(metaMetrics.date)
  .orderBy(metaMetrics.date);
```

### Gráfico: Performance por Campanha

```typescript
const campaignPerformance = await db
  .select({
    campaignName: metaCampaigns.name,
    spend: sql`SUM(${metaMetrics.spend})`,
    conversions: sql`SUM(${metaMetrics.conversions})`,
    roas: sql`AVG(${metaMetrics.roas})`,
  })
  .from(metaCampaigns)
  .leftJoin(metaMetrics, eq(metaCampaigns.id, metaMetrics.metaCampaignId))
  .where(gte(metaMetrics.date, sevenDaysAgo))
  .groupBy(metaCampaigns.id);
```

## Próximos Passos

1. **Atualizar Job Scheduler** - Integrar chamadas aos helpers de persistência
2. **Criar Procedimentos tRPC** - Expor queries do banco via API
3. **Atualizar Dashboard** - Usar dados reais do banco em vez de dados simulados
4. **Implementar Caching** - Usar Redis para cache de queries frequentes
5. **Adicionar Índices** - Otimizar performance de queries

## Troubleshooting

### Dados não aparecem no dashboard
1. Verificar se a sincronização está rodando (verificar logs)
2. Verificar se os dados foram salvos no banco (SELECT * FROM metaCampaigns)
3. Verificar se as queries do dashboard estão corretas

### Performance lenta
1. Adicionar índices nas colunas de filtro (date, integrationAccountId)
2. Implementar paginação nas queries
3. Usar caching para queries frequentes

### Erros de sincronização
1. Verificar logs em `integrationLogs`
2. Validar tokens de acesso
3. Verificar limites de taxa das APIs
