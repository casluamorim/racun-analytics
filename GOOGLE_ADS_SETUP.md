# Configuração da Integração Google Ads API

## Visão Geral

Este documento descreve como configurar a integração com Google Ads API para sincronizar campanhas de Search, Display, Shopping e Performance Max com suas métricas.

## Pré-requisitos

1. Conta Google Ads (ads.google.com)
2. Conta Google Cloud (console.cloud.google.com)
3. Acesso ao Google Ads API

## Passo 1: Criar Projeto no Google Cloud

1. Acesse [console.cloud.google.com](https://console.cloud.google.com)
2. Clique em "Selecionar um projeto" > "Novo projeto"
3. Preencha o nome do projeto (ex: "Racun Analytics")
4. Clique em "Criar"

## Passo 2: Ativar Google Ads API

1. No Google Cloud Console, acesse "APIs e Serviços" > "Biblioteca"
2. Procure por "Google Ads API"
3. Clique em "Google Ads API"
4. Clique em "Ativar"

## Passo 3: Criar Credenciais OAuth 2.0

1. Acesse "APIs e Serviços" > "Credenciais"
2. Clique em "Criar Credenciais" > "ID do cliente OAuth"
3. Se solicitado, configure a tela de consentimento OAuth primeiro:
   - Tipo de usuário: "Externo"
   - Preencha informações básicas do aplicativo
   - Adicione escopos: `https://www.googleapis.com/auth/adwords`
4. Tipo de aplicação: "Aplicação Web"
5. Preencha os detalhes:
   - Nome: "Racun Analytics"
   - URIs de redirecionamento autorizadas: `https://seu-dominio.com/api/integrations/google-ads/callback`
6. Clique em "Criar"
7. Copie o **Client ID** e **Client Secret**

## Passo 4: Obter Developer Token

1. Acesse [ads.google.com](https://ads.google.com)
2. Clique em "Ferramentas e Configurações" > "Configurações da conta"
3. Acesse "Configurações da conta" > "Acesso à API"
4. Copie o **Developer Token** (geralmente começa com números)

## Passo 5: Configurar Variáveis de Ambiente

Adicione as seguintes variáveis ao arquivo `.env`:

```env
# Google Ads Integration
GOOGLE_ADS_CLIENT_ID=seu_client_id_aqui
GOOGLE_ADS_CLIENT_SECRET=seu_client_secret_aqui
GOOGLE_ADS_DEVELOPER_TOKEN=seu_developer_token_aqui
```

## Passo 6: Implementar Fluxo de Autenticação

### Frontend - Iniciar Autenticação

```typescript
// Chamar o endpoint para obter a URL de autenticação
const response = await trpc.googleAds.getAuthUrl.query({
  clientId: 123,
  redirectUri: window.location.origin + '/portal/integrations/google-ads/callback'
});

// Redirecionar para o URL de autenticação do Google
window.location.href = response.authUrl;
```

### Backend - Processar Callback

```typescript
// Endpoint: /api/integrations/google-ads/callback
// Recebe: code, state
// Processa: Troca código por access token
const result = await trpc.googleAds.handleCallback.mutate({
  code: urlParams.get('code'),
  state: urlParams.get('state'),
  redirectUri: window.location.origin + '/portal/integrations/google-ads/callback'
});
```

## Passo 7: Sincronizar Campanhas

Após autenticação bem-sucedida:

```typescript
// Sincronizar campanhas
const campaigns = await trpc.googleAds.syncCampaigns.mutate({
  accessToken: result.accessToken,
  customerId: '1234567890' // Obtido do Google Ads
});
```

## Passo 8: Obter Métricas

```typescript
// Obter métricas de uma campanha
const metrics = await trpc.googleAds.getCampaignMetrics.query({
  accessToken: result.accessToken,
  customerId: '1234567890',
  campaignId: 'campaign_id',
  startDate: '2026-01-01',
  endDate: '2026-03-12'
});

// Ou obter métricas agregadas da conta
const accountMetrics = await trpc.googleAds.getAccountMetrics.query({
  accessToken: result.accessToken,
  customerId: '1234567890',
  startDate: '2026-01-01',
  endDate: '2026-03-12'
});
```

## Passo 9: Obter Palavras-chave

```typescript
// Obter palavras-chave de uma campanha
const keywords = await trpc.googleAds.getCampaignKeywords.query({
  accessToken: result.accessToken,
  customerId: '1234567890',
  campaignId: 'campaign_id'
});
```

## Estrutura de Dados

### Campanhas

```typescript
interface GoogleAdsCampaign {
  resourceName: string;
  id: string;
  name: string;
  status: "ENABLED" | "PAUSED" | "REMOVED" | "UNSPECIFIED";
  advertisingChannelType: string;
  budget?: {
    resourceName: string;
    amountMicros: string;
  };
  startDate?: string;
  endDate?: string;
}
```

### Métricas

```typescript
interface GoogleAdsMetrics {
  metrics: {
    impressions: string;
    clicks: string;
    costMicros: string;
    conversions: string;
    conversionValue: string;
    ctrPercent: string;
    averageCpc: string;
    averageCpm: string;
  };
  segments: {
    date: string;
  };
}
```

## Tipos de Campanha Suportados

- **Search**: Campanhas de busca com palavras-chave
- **Display**: Anúncios em rede de display
- **Shopping**: Anúncios de produtos e-commerce
- **Performance Max**: Campanhas multi-canal otimizadas
- **Video**: Anúncios em vídeo (YouTube)

## Sincronização Automática

Para sincronizar automaticamente a cada 30 minutos, configure um job:

```typescript
// server/jobs/syncGoogleAdsCampaigns.ts
import { CronJob } from 'cron';
import { GoogleAdsService } from '../services/googleAdsService';

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

Se o token expirar, use o refresh token para obter um novo:

```typescript
// Renovar access token
const newToken = await trpc.googleAds.refreshToken.mutate({
  refreshToken: refreshToken
});
```

### Limites de Taxa

Google Ads API tem limites de taxa. Implemente retry com backoff:

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

## Conversão de Micros

Google Ads API usa "micros" para valores monetários (1 unidade = 1.000.000 micros):

```typescript
// Converter micros para unidades padrão
const spend = GoogleAdsService.convertMicrosToUnits("5000000");
// Resultado: 5.00
```

## Testes

### Testar Autenticação

```bash
curl -X GET "https://seu-dominio.com/api/trpc/googleAds.getAuthUrl?input={\"clientId\":1,\"redirectUri\":\"http://localhost:3000/callback\"}"
```

### Testar Sincronização

```bash
curl -X POST "https://seu-dominio.com/api/trpc/googleAds.syncCampaigns" \
  -H "Content-Type: application/json" \
  -d '{"accessToken":"token_aqui","customerId":"1234567890"}'
```

## Troubleshooting

### Erro: "Invalid OAuth redirect URI"

- Verifique se a URL de redirecionamento está exatamente igual em:
  - Código da aplicação
  - Google Cloud Console
  - Variável de ambiente

### Erro: "Invalid access token"

- Token pode ter expirado
- Use `refreshToken` para obter um novo token
- Valide o token usando `validateToken`

### Erro: "User does not have permission"

- Verifique se o usuário tem acesso à conta Google Ads
- Verifique se o Developer Token está correto
- Certifique-se de que a API foi ativada no Google Cloud

### Erro: "Invalid developer token"

- Copie o Developer Token corretamente (sem espaços)
- Verifique se o token está associado à conta correta
- Aguarde 24 horas após criar um novo token

## Documentação Oficial

- [Google Ads API](https://developers.google.com/google-ads/api/docs/start)
- [Google Ads Query Language](https://developers.google.com/google-ads/api/docs/query/overview)
- [OAuth 2.0 for Google APIs](https://developers.google.com/identity/protocols/oauth2)
- [API Reference](https://developers.google.com/google-ads/api/reference/rpc)

## Próximos Passos

1. Implementar sincronização automática com job scheduler
2. Adicionar tratamento de refresh token
3. Implementar retry com backoff exponencial
4. Adicionar testes unitários
5. Configurar alertas para falhas de sincronização
6. Integrar com dashboard para exibir métricas
