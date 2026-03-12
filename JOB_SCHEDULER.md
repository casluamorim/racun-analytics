# Job Scheduler - Sincronização de Integrações

## Visão Geral

O Job Scheduler é responsável por sincronizar automaticamente os dados de Meta Ads e Google Ads a cada 30 minutos. Ele gerencia campanhas, métricas, palavras-chave e mantém os dados sempre atualizados no banco de dados.

## Arquitetura

### Componentes Principais

1. **IntegrationSyncManager** - Classe que gerencia a sincronização
2. **Cron Job** - Executa a cada 30 minutos (*/30 * * * *)
3. **tRPC Router** - Expõe endpoints para controlar sincronizações
4. **Página de Monitoramento** - Interface para acompanhar sincronizações

### Fluxo de Sincronização

```
[Cron Job (30 min)] 
    ↓
[IntegrationSyncManager.syncAll()]
    ├─→ [syncMetaAds()]
    │   └─→ Para cada conta Meta:
    │       ├─ Validar token
    │       ├─ Sincronizar campanhas
    │       └─ Sincronizar métricas (últimos 7 dias)
    │
    └─→ [syncGoogleAds()]
        └─→ Para cada conta Google:
            ├─ Validar token
            ├─ Sincronizar campanhas
            └─ Sincronizar métricas (últimos 7 dias)
```

## Inicialização

O scheduler é inicializado automaticamente quando a aplicação inicia:

```typescript
// server/_core/index.ts
import { initializeIntegrationSync } from "../jobs/syncIntegrations";

// Inicializar scheduler na inicialização da app
initializeIntegrationSync();
```

## Configuração

### Intervalo de Sincronização

O scheduler executa a cada 30 minutos:

```typescript
// Padrão cron: */30 * * * *
// Significa: A cada 30 minutos, todos os dias
```

Para alterar o intervalo, edite em `server/jobs/syncIntegrations.ts`:

```typescript
// Exemplo: A cada 15 minutos
new CronJob("*/15 * * * *", async () => {
  // ...
});

// Exemplo: A cada hora
new CronJob("0 * * * *", async () => {
  // ...
});

// Exemplo: Diariamente às 6:00 AM
new CronJob("0 6 * * *", async () => {
  // ...
});
```

## Funcionalidades

### 1. Sincronização Automática

A sincronização ocorre automaticamente a cada 30 minutos:

- Valida tokens de acesso
- Sincroniza campanhas
- Sincroniza métricas dos últimos 7 dias
- Registra resultados e erros
- Mantém histórico de sincronizações

### 2. Sincronização Manual

Você pode forçar uma sincronização manual:

```typescript
// Via tRPC
const result = await trpc.sync.syncNow.mutate();

// Resultado
{
  success: true,
  message: "Sincronização iniciada com sucesso"
}
```

### 3. Histórico de Sincronizações

Acompanhe todas as sincronizações realizadas:

```typescript
// Via tRPC
const history = await trpc.sync.getHistory.query();

// Resultado
{
  success: true,
  history: [
    {
      platform: "meta",
      accountId: "act_123456789",
      campaignsCount: 12,
      metricsCount: 84,
      success: true,
      duration: 2450,
      timestamp: Date
    },
    // ...
  ],
  totalSyncs: 48,
  successCount: 46,
  errorCount: 2
}
```

### 4. Status da Última Sincronização

Obtenha informações sobre a última sincronização:

```typescript
// Via tRPC
const status = await trpc.sync.getLastSyncStatus.query();

// Resultado
{
  success: true,
  lastSync: { ... },
  allSuccessful: true,
  totalDuration: 4340,
  averageDuration: 2170
}
```

### 5. Estatísticas

Visualize estatísticas detalhadas de sincronizações:

```typescript
// Via tRPC
const stats = await trpc.sync.getStatistics.query();

// Resultado
{
  success: true,
  totalSyncs: 48,
  successRate: 95,
  totalCampaigns: 240,
  totalMetrics: 1680,
  averageDuration: 2170,
  platforms: {
    meta: {
      syncs: 24,
      success: 23,
      campaigns: 120,
      metrics: 840
    },
    google: {
      syncs: 24,
      success: 23,
      campaigns: 120,
      metrics: 840
    }
  }
}
```

### 6. Limpeza de Histórico

Limpe o histórico de sincronizações:

```typescript
// Via tRPC
const result = await trpc.sync.clearHistory.mutate();

// Resultado
{
  success: true,
  message: "Histórico de sincronizações limpo com sucesso"
}
```

## Tratamento de Erros

### Tokens Expirados

Se um token expirar durante a sincronização:

1. O sistema tenta renovar o token automaticamente
2. Se a renovação falhar, registra o erro
3. Continua com as próximas contas
4. Log de erro é registrado para investigação

### Falhas de Rede

Se houver falha de rede:

1. O sistema registra o erro
2. Continua com as próximas contas
3. Próxima sincronização tenta novamente
4. Implementar retry com backoff exponencial

### Limites de Taxa

Se a API retornar erro 429 (Too Many Requests):

1. Implementar backoff exponencial
2. Aguardar antes de tentar novamente
3. Registrar tentativas

## Logging

O scheduler registra todas as operações:

```
[IntegrationSync] Iniciando scheduler de sincronização...
[IntegrationSync] Scheduler iniciado com sucesso
[IntegrationSync] Iniciando sincronização em 2026-03-12T20:00:00.000Z
[IntegrationSync] Iniciando sincronização Meta Ads...
[IntegrationSync] Sincronizando conta Meta: Conta Meta Demo (act_123456789)
[IntegrationSync] 12 campanhas sincronizadas do Meta
[IntegrationSync] Meta Conta Meta Demo sincronizado com sucesso em 2450ms
[IntegrationSync] Iniciando sincronização Google Ads...
[IntegrationSync] Sincronizando conta Google: Conta Google Ads Demo (1234567890)
[IntegrationSync] 8 campanhas sincronizadas do Google
[IntegrationSync] Google Conta Google Ads Demo sincronizado com sucesso em 1890ms

=== RESUMO DA SINCRONIZAÇÃO ===
✓ Sucesso: 2
✗ Erros: 0
📊 Campanhas sincronizadas: 20
📈 Métricas sincronizadas: 140
⏱️  Tempo total: 4340ms
==============================
```

## Monitoramento

### Página de Monitoramento

Acesse `/portal/sync-monitor` para acompanhar:

- Status da última sincronização
- Estatísticas gerais
- Histórico recente
- Taxa de sucesso
- Tempo médio de sincronização
- Detalhes por plataforma

### Métricas Disponíveis

- **Taxa de Sucesso**: Percentual de sincronizações bem-sucedidas
- **Total de Campanhas**: Número total de campanhas sincronizadas
- **Total de Métricas**: Número total de registros de métricas
- **Duração Média**: Tempo médio de sincronização
- **Campanhas por Plataforma**: Distribuição de campanhas
- **Métricas por Plataforma**: Distribuição de métricas

## Estrutura de Dados

### SyncResult

```typescript
interface SyncResult {
  platform: "meta" | "google";
  accountId: string;
  campaignsCount: number;
  metricsCount: number;
  success: boolean;
  error?: string;
  duration: number;
  timestamp: Date;
}
```

## Próximos Passos

### 1. Persistência em Banco de Dados

Implementar salvamento de dados no banco:

```typescript
// Salvar campanhas
await db.insert(metaCampaigns).values(campaigns);

// Salvar métricas
await db.insert(metaMetrics).values(metrics);
```

### 2. Retry com Backoff Exponencial

```typescript
async function retryWithBackoff(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      const delay = Math.pow(2, i) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}
```

### 3. Notificações de Erro

```typescript
// Notificar owner quando sincronização falha
if (!result.success) {
  await notifyOwner({
    title: `Erro na sincronização ${result.platform}`,
    content: `Conta ${result.accountId}: ${result.error}`
  });
}
```

### 4. Métricas e Observabilidade

```typescript
// Registrar métricas
recordMetric("sync.duration", result.duration);
recordMetric("sync.campaigns", result.campaignsCount);
recordMetric("sync.success", result.success ? 1 : 0);
```

### 5. Sincronização Incremental

```typescript
// Sincronizar apenas campanhas modificadas
const lastSync = await getLastSyncTime();
const campaigns = await metaService.getCampaigns({
  modifiedSince: lastSync
});
```

## Testes

### Executar Testes

```bash
pnpm test -- server/jobs/syncIntegrations.test.ts
```

### Cobertura de Testes

- ✓ Inicialização do gerenciador
- ✓ Histórico de sincronizações
- ✓ Sincronização de Meta Ads
- ✓ Sincronização de Google Ads
- ✓ Tratamento de erros
- ✓ Estrutura de dados
- ✓ Scheduler
- ✓ Concorrência
- ✓ Tipos de plataforma
- ✓ Limpeza de histórico

## Troubleshooting

### Sincronização não executa

1. Verificar se o scheduler foi inicializado
2. Verificar logs da aplicação
3. Verificar se há erros de token

### Campanhas não sincronizam

1. Validar credenciais das contas
2. Verificar se tokens ainda são válidos
3. Verificar limites de taxa da API

### Métricas incompletas

1. Verificar se o período de dados está correto
2. Validar se as campanhas têm dados disponíveis
3. Verificar se há erros de permissão

## Referências

- [Documentação Meta Ads API](META_SETUP.md)
- [Documentação Google Ads API](GOOGLE_ADS_SETUP.md)
- [Código do Job Scheduler](server/jobs/syncIntegrations.ts)
- [Router de Sincronização](server/routers/syncRouter.ts)
- [Página de Monitoramento](client/src/pages/portal/SyncMonitor.tsx)
