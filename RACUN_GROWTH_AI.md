# Racun Growth AI - 5 Analistas Especializados

## Visão Geral

O **Racun Growth AI** é um sistema inteligente que gera diagnósticos automáticos baseados em dados de Meta Ads, Google Ads, CRM e Marketplaces. O sistema é composto por **5 analistas especializados** que trabalham em conjunto para fornecer insights estratégicos e recomendações acionáveis.

---

## 5 Analistas Especializados

### 1️⃣ **Campaign AI** - Análise de Campanhas de Tráfego Pago

**Responsabilidades:**
- Analisar performance de campanhas Meta Ads e Google Ads
- Identificar problemas (baixo ROAS, alto CPC, baixo CTR)
- Comparar performance entre plataformas
- Recomendar otimizações de campanha

**Dados de Entrada:**
- Investimento (spend)
- Impressões
- Cliques
- Conversões
- ROAS (Return on Ad Spend)
- CTR (Click-Through Rate)
- CPC (Cost Per Click)
- CPM (Cost Per Thousand Impressions)

**Saída:**
- Análise de performance de cada plataforma
- Identificação de gargalos
- 3-5 recomendações prioritizadas
- Alertas críticos

---

### 2️⃣ **Sales AI** - Análise de Vendas e Funil

**Responsabilidades:**
- Analisar saúde do funil de vendas
- Identificar gargalos no processo de conversão
- Analisar taxa de conversão
- Recomendar melhorias no funil

**Dados de Entrada:**
- Total de leads
- Leads convertidos
- Taxa de conversão
- Ciclo de vendas médio (dias)
- Leads no funil

**Saída:**
- Análise de saúde do funil
- Identificação de gargalos
- Recomendações de melhoria
- Alertas sobre funil travado

---

### 3️⃣ **Product & Pricing AI** - Análise de Produtos e Precificação

**Responsabilidades:**
- Analisar saúde do portfólio de produtos
- Identificar produtos com baixa margem
- Analisar oportunidades de precificação
- Recomendar ajustes de preço

**Dados de Entrada:**
- Total de produtos
- Margem média
- Produtos com margem baixa
- Produto melhor (top performer)
- Produto pior (bottom performer)

**Saída:**
- Análise de portfólio
- Identificação de produtos em risco
- Recomendações de precificação
- Alertas sobre produtos obsoletos

---

### 4️⃣ **CRM AI** - Análise de CRM e Qualidade de Leads

**Responsabilidades:**
- Analisar qualidade de leads
- Identificar leads em risco
- Analisar perfil de cliente ideal
- Recomendar segmentação e follow-up

**Dados de Entrada:**
- Total de leads
- Leads convertidos
- Taxa de conversão
- Ciclo de vendas médio
- Leads no funil

**Saída:**
- Análise de qualidade de leads
- Identificação de oportunidades perdidas
- Recomendações de segmentação
- Alertas sobre leads em risco

---

### 5️⃣ **Growth Strategist** - Consolidação e Estratégia

**Responsabilidades:**
- Consolidar insights de todos os 4 analistas
- Fazer análise cruzada de dados
- Identificar oportunidades de crescimento rápido
- Gerar roadmap de 30 dias

**Entrada:**
- Análises dos 4 analistas anteriores

**Saída:**
- Resumo executivo consolidado
- Análise cruzada (como campanhas impactam vendas, etc)
- Oportunidades de crescimento rápido
- 5-7 recomendações prioritizadas
- Roadmap de 30 dias
- Alertas críticos

---

## Arquitetura Técnica

### Arquivo Principal: `server/services/racunGrowthAI.ts`

```typescript
// Interface de entrada
export interface AIAnalysisRequest {
  clientId: number;
  metaMetrics?: { /* métricas do Meta */ };
  googleMetrics?: { /* métricas do Google */ };
  crmMetrics?: { /* métricas do CRM */ };
  productMetrics?: { /* métricas de produtos */ };
}

// Interface de saída
export interface AIAnalysis {
  timestamp: Date;
  analyst: 'campaign' | 'sales' | 'product' | 'crm' | 'strategist';
  title: string;
  summary: string;
  insights: string[];
  recommendations: {
    action: string;
    impact: 'high' | 'medium' | 'low';
    effort: 'low' | 'medium' | 'high';
  }[];
  alerts: {
    type: 'warning' | 'critical' | 'info';
    message: string;
  }[];
}
```

### Funções Principais

```typescript
// Análises individuais
analyzeCampaigns(data: AIAnalysisRequest): Promise<AIAnalysis>
analyzeSales(data: AIAnalysisRequest): Promise<AIAnalysis>
analyzeProducts(data: AIAnalysisRequest): Promise<AIAnalysis>
analyzeCRM(data: AIAnalysisRequest): Promise<AIAnalysis>

// Consolidação
generateGrowthStrategy(
  analyses: AIAnalysis[],
  data: AIAnalysisRequest
): Promise<AIAnalysis>

// Execução completa
runCompleteAnalysis(data: AIAnalysisRequest): Promise<AIAnalysis[]>
```

---

## Integração com tRPC

### Router: `server/routers/aiRouter.ts`

```typescript
export const aiRouter = router({
  // Análise completa (5 analistas)
  runCompleteAnalysis: protectedProcedure
    .input(AIAnalysisRequestSchema)
    .mutation(async ({ input }) => { /* ... */ }),

  // Análises individuais
  analyzeCampaigns: protectedProcedure.mutation(/* ... */),
  analyzeSales: protectedProcedure.mutation(/* ... */),
  analyzeProducts: protectedProcedure.mutation(/* ... */),
  analyzeCRM: protectedProcedure.mutation(/* ... */),
});
```

### Uso no Frontend

```typescript
// Executar análise completa
const mutation = trpc.ai.runCompleteAnalysis.useMutation();

mutation.mutate({
  clientId: 1,
  metaMetrics: { /* ... */ },
  googleMetrics: { /* ... */ },
  crmMetrics: { /* ... */ },
  productMetrics: { /* ... */ },
});
```

---

## Página de Dashboard: `client/src/pages/portal/AIInsights.tsx`

A página de insights da IA exibe:

1. **Botão de Análise** - Executar análise completa com todos os 5 analistas
2. **Tabs por Analista** - Navegar entre os 5 analistas
3. **Resumo Executivo** - Título, resumo e timestamp
4. **Insights Principais** - Lista de insights gerados
5. **Alertas** - Alertas críticos, warnings e info
6. **Recomendações** - Ações prioritizadas por impacto e esforço

---

## Fluxo de Execução

```
1. Cliente clica em "Executar Análise Completa"
   ↓
2. Frontend envia AIAnalysisRequest para tRPC
   ↓
3. Backend executa 4 análises em paralelo:
   - Campaign AI
   - Sales AI
   - Product AI
   - CRM AI
   ↓
4. Growth Strategist consolida as 4 análises
   ↓
5. Retorna array com 5 AIAnalysis
   ↓
6. Frontend exibe resultados em tabs
```

---

## Testes

### Arquivo: `server/services/racunGrowthAI.test.ts`

Cobertura de testes:

- ✅ Campaign AI - Análise de campanhas
- ✅ Sales AI - Análise de vendas
- ✅ Product AI - Análise de produtos
- ✅ CRM AI - Análise de CRM
- ✅ Growth Strategist - Consolidação
- ✅ Complete Analysis - Execução completa
- ✅ Error Handling - Tratamento de erros
- ✅ Analysis Quality - Qualidade dos resultados

**Executar testes:**
```bash
pnpm test racunGrowthAI.test.ts
```

---

## Integração com LLM

O sistema usa a API LLM do Manus para gerar análises. Cada analista:

1. Recebe dados estruturados
2. Cria um prompt específico
3. Chama `invokeLLM()` com `response_format` JSON Schema
4. Parseia a resposta estruturada
5. Retorna `AIAnalysis` tipada

**Benefícios:**
- ✅ Respostas estruturadas e tipadas
- ✅ Sem necessidade de parsing manual
- ✅ Validação automática de schema
- ✅ Fácil de testar e validar

---

## Próximos Passos

### MVP (Atual)
- [x] 5 Analistas especializados
- [x] Análises individuais
- [x] Consolidação com Growth Strategist
- [x] Integração com tRPC
- [x] Página de dashboard
- [x] Testes vitest

### Versão 2
- [ ] Persistência de análises no banco
- [ ] Histórico de análises
- [ ] Comparação entre análises
- [ ] Agendamento de análises automáticas
- [ ] Notificações de alertas críticos
- [ ] Exportação de relatórios PDF

### Versão 3
- [ ] Análise de TikTok Ads
- [ ] Análise de Marketplaces (Mercado Livre, Shopee)
- [ ] Análise de Email Marketing
- [ ] Análise de SEO
- [ ] Análise de Redes Sociais Orgânicas

---

## Exemplos de Uso

### Exemplo 1: Análise Completa

```typescript
const analyses = await runCompleteAnalysis({
  clientId: 1,
  metaMetrics: {
    spend: 5000,
    impressions: 100000,
    clicks: 5000,
    conversions: 250,
    roas: 2.5,
    ctr: 5.0,
    cpc: 1.0,
    cpm: 50,
  },
  googleMetrics: {
    spend: 3000,
    impressions: 80000,
    clicks: 4000,
    conversions: 200,
    roas: 3.0,
    ctr: 5.0,
    cpc: 0.75,
    cpm: 37.5,
  },
  crmMetrics: {
    totalLeads: 450,
    convertedLeads: 45,
    conversionRate: 10,
    averageCycleTime: 15,
    leadsInFunnel: 200,
  },
  productMetrics: {
    totalProducts: 50,
    averageMargin: 35,
    lowMarginProducts: 5,
    topProduct: "Produto A",
    bottomProduct: "Produto Z",
  },
});

// analyses[0] = Campaign AI
// analyses[1] = Sales AI
// analyses[2] = Product AI
// analyses[3] = CRM AI
// analyses[4] = Growth Strategist
```

### Exemplo 2: Análise Individual

```typescript
const analysis = await analyzeCampaigns({
  clientId: 1,
  metaMetrics: { /* ... */ },
  googleMetrics: { /* ... */ },
});

console.log(analysis.title);
console.log(analysis.summary);
console.log(analysis.insights);
console.log(analysis.recommendations);
console.log(analysis.alerts);
```

---

## Troubleshooting

### Erro: "Property 'ai' does not exist on type"

**Causa:** TypeScript cache não foi atualizado
**Solução:** Reiniciar o servidor
```bash
webdev_restart_server
```

### Erro: "LLM API Error"

**Causa:** Credenciais da API não configuradas
**Solução:** Verificar `BUILT_IN_FORGE_API_KEY` e `BUILT_IN_FORGE_API_URL`

### Análises muito lentas

**Causa:** Chamadas sequenciais ao LLM
**Solução:** Usar `Promise.all()` para paralelizar (já implementado)

---

## Conclusão

O **Racun Growth AI** fornece uma camada inteligente de análise que transforma dados brutos em insights estratégicos e recomendações acionáveis. Os 5 analistas especializados trabalham em conjunto para fornecer uma visão 360° do crescimento do cliente.
