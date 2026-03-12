# Configuração da Integração Meta Ads API

## Visão Geral

Este documento descreve como configurar a integração com Meta Ads API para sincronizar campanhas e métricas automaticamente.

## Pré-requisitos

1. Conta Meta Business (facebook.com/business)
2. Conta Meta Developer (developers.facebook.com)
3. Aplicação Meta criada no Developer Portal

## Passo 1: Criar Aplicação no Meta Developer Portal

1. Acesse [developers.facebook.com](https://developers.facebook.com)
2. Clique em "Meus Apps" > "Criar Aplicação"
3. Selecione "Gerenciamento de Negócios" como tipo
4. Preencha os detalhes da aplicação
5. Adicione o produto "Marketing API"

## Passo 2: Configurar Credenciais

### Obter App ID e App Secret

1. No Developer Portal, acesse sua aplicação
2. Copie o **App ID** (encontrado em Configurações > Básico)
3. Copie o **App Secret** (encontrado em Configurações > Básico)

### Configurar Variáveis de Ambiente

Adicione as seguintes variáveis ao arquivo `.env`:

```env
# Meta Ads Integration
META_APP_ID=seu_app_id_aqui
META_APP_SECRET=seu_app_secret_aqui
META_REDIRECT_URI=https://seu-dominio.com/api/integrations/meta/callback
```

## Passo 3: Configurar URLs de Redirecionamento

1. No Developer Portal, acesse sua aplicação
2. Vá para "Configurações" > "Básico"
3. Adicione a URL de redirecionamento em "URLs de Redirecionamento OAuth Válidas":
   ```
   https://seu-dominio.com/api/integrations/meta/callback
   ```

## Passo 4: Solicitar Permissões

As seguintes permissões são necessárias:

- `ads_management` - Gerenciar campanhas de anúncios
- `ads_read` - Ler dados de campanhas
- `business_management` - Gerenciar contas de negócios

## Passo 5: Implementar Fluxo de Autenticação

### Frontend - Iniciar Autenticação

```typescript
// Chamar o endpoint para obter a URL de autenticação
const response = await trpc.meta.getAuthUrl.query({
  clientId: 123,
  redirectUri: window.location.origin + '/portal/integrations/meta/callback'
});

// Redirecionar para o URL de autenticação do Meta
window.location.href = response.authUrl;
```

### Backend - Processar Callback

```typescript
// Endpoint: /api/integrations/meta/callback
// Recebe: code, state
// Processa: Troca código por access token
const result = await trpc.meta.handleCallback.mutate({
  code: urlParams.get('code'),
  state: urlParams.get('state'),
  redirectUri: window.location.origin + '/portal/integrations/meta/callback'
});
```

## Passo 6: Sincronizar Campanhas

Após autenticação bem-sucedida:

```typescript
// Sincronizar campanhas
const campaigns = await trpc.meta.syncCampaigns.mutate({
  accessToken: result.accessToken,
  adAccountId: 'act_123456789' // Obtido do Meta
});
```

## Passo 7: Obter Métricas

```typescript
// Obter métricas de uma campanha
const metrics = await trpc.meta.getCampaignMetrics.query({
  accessToken: result.accessToken,
  campaignId: 'campaign_id',
  startDate: '2026-01-01',
  endDate: '2026-03-12'
});

// Ou obter métricas agregadas da conta
const accountMetrics = await trpc.meta.getAccountMetrics.query({
  accessToken: result.accessToken,
  adAccountId: 'act_123456789',
  startDate: '2026-01-01',
  endDate: '2026-03-12'
});
```

## Estrutura de Dados

### Campanhas

```typescript
interface MetaCampaign {
  id: string;
  name: string;
  status: "ACTIVE" | "PAUSED" | "DELETED" | "ARCHIVED";
  objective: string;
  daily_budget?: number;
  lifetime_budget?: number;
  start_time?: string;
  stop_time?: string;
}
```

### Métricas

```typescript
interface MetaCampaignInsights {
  date_start: string;
  date_stop: string;
  spend: string;
  impressions: string;
  clicks: string;
  conversions: string;
  conversion_value: string;
  ctr: string;        // Click-through rate
  cpc: string;        // Cost per click
  cpm: string;        // Cost per thousand impressions
  roas: string;       // Return on ad spend
}
```

## Sincronização Automática

Para sincronizar automaticamente a cada 30 minutos, configure um job:

```typescript
// server/jobs/syncMetaCampaigns.ts
import { CronJob } from 'cron';
import { MetaAdsService } from '../services/metaAdsService';

// Executar a cada 30 minutos
new CronJob('*/30 * * * *', async () => {
  // 1. Buscar todas as contas de integração ativas
  // 2. Para cada conta, sincronizar campanhas e métricas
  // 3. Armazenar dados no banco
  // 4. Registrar logs de sincronização
}).start();
```

## Tratamento de Erros

### Token Expirado

Se o token expirar, o serviço retornará um erro. Implemente refresh token:

```typescript
// Validar token
const isValid = await trpc.meta.validateToken.query({
  accessToken: token
});

if (!isValid) {
  // Solicitar nova autenticação
  // Ou usar refresh token se disponível
}
```

### Limites de Taxa

Meta Ads API tem limites de taxa. Implemente retry com backoff:

```typescript
const maxRetries = 3;
let retries = 0;

while (retries < maxRetries) {
  try {
    // Chamar API
    break;
  } catch (error) {
    if (error.status === 429) { // Rate limited
      retries++;
      await sleep(Math.pow(2, retries) * 1000); // Exponential backoff
    } else {
      throw error;
    }
  }
}
```

## Testes

### Testar Autenticação

```bash
curl -X GET "https://seu-dominio.com/api/trpc/meta.getAuthUrl?input={\"clientId\":1,\"redirectUri\":\"http://localhost:3000/callback\"}"
```

### Testar Sincronização

```bash
curl -X POST "https://seu-dominio.com/api/trpc/meta.syncCampaigns" \
  -H "Content-Type: application/json" \
  -d '{"accessToken":"token_aqui","adAccountId":"act_123456789"}'
```

## Troubleshooting

### Erro: "Invalid OAuth redirect URI"

- Verifique se a URL de redirecionamento está exatamente igual em:
  - Código da aplicação
  - Developer Portal
  - Variável de ambiente

### Erro: "Invalid access token"

- Token pode ter expirado
- Verifique se o token foi obtido corretamente
- Valide o token usando `validateToken`

### Erro: "User does not have permission"

- Verifique se o usuário tem permissão para acessar a conta de anúncios
- Verifique se as permissões foram concedidas durante o OAuth

## Documentação Oficial

- [Meta Marketing API](https://developers.facebook.com/docs/marketing-apis)
- [Ads Insights API](https://developers.facebook.com/docs/marketing-api/insights)
- [OAuth 2.0](https://developers.facebook.com/docs/facebook-login/manually-build-a-login-flow)

## Próximos Passos

1. Implementar sincronização automática com job scheduler
2. Adicionar tratamento de refresh token
3. Implementar retry com backoff exponencial
4. Adicionar testes unitários
5. Configurar alertas para falhas de sincronização
