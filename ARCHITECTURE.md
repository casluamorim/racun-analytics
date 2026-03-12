# Racun Analytics - Arquitetura Completa da Plataforma

## 1. VISÃO DO PRODUTO

**Racun Analytics** é uma plataforma SaaS unificada que permite agências de marketing digital gerenciar o crescimento, vendas e operações comerciais dos seus clientes em um único ecossistema.

### Dois Pilares Principais

1. **Site Público da Racun** - Landing page premium com foco em conversão
2. **Portal Privado Multi-tenant** - Plataforma de gestão integrada para clientes

### Objetivos Principais

- Centralizar métricas de marketing (Meta, Google, TikTok)
- Unificar dados de vendas (Mercado Livre, Shopee, Amazon)
- Gerenciar CRM com leads, funil e oportunidades
- Fornecer IA de análise e recomendações estratégicas
- Automatizar relatórios e notificações
- Permitir aprovações e solicitações dentro da plataforma

---

## 2. ARQUITETURA TÉCNICA

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
- Redis (cache, jobs)
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

Deploy:
- Vercel (frontend)
- Railway/Render (backend)
- Supabase/Neon (database)
```

### Arquitetura Multi-tenant

```
Isolamento por Cliente:
- Cada cliente tem um ID único (clientId)
- Todas as queries filtram por clientId
- Dados de um cliente nunca são acessíveis a outro
- Permissões verificadas em cada procedure
- Row-level security no banco de dados
```

### Fluxo de Autenticação

```
1. Usuário acessa /app/login
2. Redireciona para Manus OAuth
3. Callback em /api/oauth/callback
4. Cria sessão com httpOnly cookie
5. Redireciona para /portal/dashboard
6. Cada request valida ctx.user
```

---

## 3. ESTRUTURA DE MÓDULOS

### Módulo 1: Site Público da Racun
- Landing page com hero section
- Página de recursos e benefícios
- Página de soluções
- Página de agendamento de demo
- Página de contato
- FAQ e prova social

### Módulo 2: Portal Privado - Dashboard Executivo
- Visão simplificada de KPIs
- Gráficos de investimento e resultado
- Alertas principais
- Últimas ações da IA

### Módulo 3: Portal Privado - Dashboard Técnico
- Visão completa de todas as métricas
- Filtros avançados (período, canal, campanha)
- Comparativos por período
- Health score da conta
- Diagnósticos detalhados

### Módulo 4: Central de Integrações
- Status de conexões
- Reconectar contas
- Sincronização manual
- Logs de integração
- Teste de conexão

### Módulo 5: Tráfego Pago
- Meta Ads (investimento, impressões, cliques, conversões, ROAS)
- Google Ads (campanhas, palavras-chave, performance)
- TikTok Ads (alcance, engajamento, conversão)
- Comparativos entre plataformas
- Top campanhas e alertas

### Módulo 6: Marketplaces e Vendas
- Mercado Livre (pedidos, vendas, faturamento, reputação)
- Shopee (pedidos, visitas, conversão, saldo)
- Amazon (ASINs, vendas, reviews)
- Cruzamento com dados de anúncios
- Análise de canal vs. faturamento real

### Módulo 7: Produtos e Precificação
- Cadastro e sincronização de produtos
- Análise de margem e custo
- Calculadora de precificação
- Simulações de preço e desconto
- Recomendações de otimização

### Módulo 8: CRM Unificado
- Gestão de leads (kanban, lista, filtros)
- Funil de vendas (novo, qualificado, demo, proposta, negociação, convertido, perdido)
- Histórico de interações
- Relacionamento com campanhas
- Automações de captura e follow-up
- Métricas do funil (conversão, tempo médio, origem)

### Módulo 9: Racun Growth AI
- **Campaign AI Analyst**: Análise de campanhas de tráfego
- **Sales AI Analyst**: Análise de vendas e canais
- **Product & Pricing AI Advisor**: Análise de produtos e margem
- **CRM AI Assistant**: Análise de leads e oportunidades
- **Growth Strategist AI**: Recomendações estratégicas cruzadas

### Módulo 10: Solicitações, Aprovações e Tarefas
- Cliente solicita alterações de campanha
- Admin responde e transforma em tarefa
- Sistema de aprovações com registro
- Timeline de ações

### Módulo 11: Relatórios e Notificações
- Relatório semanal automático (domingo 16:00)
- Relatório mensal em PDF
- Envio por WhatsApp, e-mail e PDF
- Histórico de envios
- Toggle por canal

### Módulo 12: Documentos, Notas e Timeline
- Notas internas (admin)
- Observações visíveis ao cliente
- Documentos e contratos
- Timeline de ações
- Histórico de integrações

---

## 4. ESTRUTURA DO BANCO DE DADOS

### Tabelas Principais

#### Autenticação e Usuários
- **users**: Usuários do sistema (admin/cliente)
- **clients**: Dados dos clientes
- **clientSettings**: Configurações por cliente
- **userRoles**: Papéis e permissões

#### CRM
- **leads**: Leads capturados
- **contacts**: Contatos/pessoas
- **companies**: Empresas
- **deals**: Oportunidades/negócios
- **leadActivities**: Histórico de interações
- **leadTags**: Tags para segmentação

#### Integrações
- **platformConnections**: Conexões com plataformas (Meta, Google, etc)
- **adAccounts**: Contas de anúncios
- **marketplaceAccounts**: Contas de marketplace

#### Métricas
- **campaignMetrics**: Métricas de campanhas de tráfego
- **marketplaceMetrics**: Métricas de vendas
- **productMetrics**: Métricas de produtos
- **crmMetrics**: Métricas do funil

#### Produtos
- **products**: Catálogo de produtos
- **productCosts**: Custos por produto
- **productPricing**: Precificação
- **pricingSimulations**: Simulações de preço

#### IA e Insights
- **aiInsights**: Insights gerados pela IA
- **aiRecommendations**: Recomendações estratégicas
- **aiAnalysisHistory**: Histórico de análises

#### Operação
- **requests**: Solicitações de clientes
- **approvals**: Aprovações de ações
- **tasks**: Tarefas internas
- **demoBookings**: Agendamentos de demonstração
- **reports**: Histórico de relatórios
- **notifications**: Notificações enviadas
- **notes**: Notas e observações
- **files**: Documentos e arquivos
- **auditLogs**: Log de auditoria
- **timelineEvents**: Timeline de eventos

---

## 5. FLUXOS PRINCIPAIS

### Fluxo de Onboarding do Cliente

```
1. Cliente faz login pela primeira vez
2. Sistema detecta novo cliente
3. Inicia wizard de onboarding:
   - Dados básicos do cliente
   - Conectar Meta Ads
   - Conectar Google Ads
   - Conectar TikTok Ads
   - Conectar Mercado Livre
   - Conectar Shopee
   - Conectar Amazon
   - Conectar CRM/WhatsApp
   - Configurar relatórios
   - Configurar metas
4. Sistema puxa dados iniciais de cada plataforma
5. Preenche dashboards automaticamente
6. Libera acesso ao portal
```

### Fluxo de Sincronização de Dados

```
1. Job diário (BullMQ) dispara sincronização
2. Para cada cliente com integrações ativas:
   - Puxa dados de Meta Ads API
   - Puxa dados de Google Ads API
   - Puxa dados de TikTok Ads API
   - Puxa dados de Mercado Livre API
   - Puxa dados de Shopee API
   - Puxa dados de Amazon SP-API
3. Processa e normaliza dados
4. Salva em banco de dados
5. Atualiza cache Redis
6. Registra última sincronização
7. Notifica se houver erros
```

### Fluxo de Análise de IA

```
1. Job diário dispara análise (ou manual via botão)
2. Coleta dados do cliente (últimos 30 dias)
3. Passa para cada AI Analyst:
   - Campaign AI: Analisa campanhas
   - Sales AI: Analisa vendas
   - Product AI: Analisa produtos
   - CRM AI: Analisa leads
4. Growth Strategist cruza insights
5. Gera recomendações prioritizadas
6. Salva em aiInsights
7. Notifica admin e cliente
```

### Fluxo de Relatório Automático

```
1. Job semanal (domingo 16:00)
2. Coleta dados da semana
3. Gera resumo executivo
4. Inclui insights da IA
5. Cria PDF
6. Envia por e-mail
7. Envia por WhatsApp (se configurado)
8. Registra em reportLogs
```

---

## 6. ENDPOINTS PRINCIPAIS (tRPC)

### Autenticação
```
auth.me - GET usuário atual
auth.logout - POST logout
auth.loginUrl - GET URL de login
```

### Clientes (Admin)
```
clients.list - GET lista de clientes
clients.get - GET dados do cliente
clients.create - POST criar cliente
clients.update - PATCH atualizar cliente
clients.settings - GET/POST configurações
```

### Dashboards
```
dashboard.executive - GET dashboard executivo
dashboard.technical - GET dashboard técnico
dashboard.metrics - GET métricas por período
dashboard.healthScore - GET health score
```

### Integrações
```
integrations.list - GET integrações do cliente
integrations.connect - POST conectar plataforma
integrations.reconnect - POST reconectar
integrations.test - POST testar conexão
integrations.sync - POST sincronizar manual
integrations.logs - GET logs de sincronização
```

### Tráfego Pago
```
traffic.campaigns - GET campanhas
traffic.performance - GET performance por período
traffic.comparison - GET comparativo entre canais
traffic.alerts - GET alertas
```

### Marketplaces
```
marketplaces.orders - GET pedidos
marketplaces.sales - GET vendas
marketplaces.products - GET produtos mais vendidos
marketplaces.comparison - GET comparativo de canais
```

### Produtos
```
products.list - GET produtos
products.get - GET detalhes do produto
products.pricing - GET/POST precificação
products.simulate - POST simular preço
products.margins - GET análise de margem
```

### CRM
```
crm.leads.list - GET leads
crm.leads.get - GET detalhes do lead
crm.leads.create - POST criar lead
crm.leads.update - PATCH atualizar lead
crm.leads.move - POST mover no funil
crm.funnel - GET métricas do funil
crm.activities - GET atividades
crm.conversion - GET taxa de conversão
```

### IA
```
ai.insights - GET insights gerados
ai.analyze - POST analisar agora
ai.recommendations - GET recomendações
ai.history - GET histórico de análises
```

### Solicitações
```
requests.list - GET solicitações
requests.create - POST criar solicitação
requests.respond - POST responder
requests.approve - POST aprovar
requests.tasks - GET tarefas relacionadas
```

### Relatórios
```
reports.send - POST enviar relatório manual
reports.history - GET histórico
reports.settings - GET/POST configurações
reports.preview - GET prévia do relatório
```

---

## 7. ESTRUTURA DE PASTAS

```
racun-analytics/
├── client/
│   ├── public/
│   │   ├── favicon.ico
│   │   └── robots.txt
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx (landing page)
│   │   │   ├── Resources.tsx
│   │   │   ├── Solutions.tsx
│   │   │   ├── Schedule.tsx (agendamento)
│   │   │   ├── Contact.tsx
│   │   │   ├── portal/
│   │   │   │   ├── Dashboard.tsx (executivo)
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
│   │   │   ├── ui/ (shadcn/ui)
│   │   │   ├── DashboardLayout.tsx
│   │   │   ├── Navigation.tsx
│   │   │   ├── Charts/
│   │   │   │   ├── InvestmentChart.tsx
│   │   │   │   ├── SalesChart.tsx
│   │   │   │   └── ConversionChart.tsx
│   │   │   ├── CRM/
│   │   │   │   ├── FunnelKanban.tsx
│   │   │   │   ├── LeadsList.tsx
│   │   │   │   └── LeadDetail.tsx
│   │   │   ├── AI/
│   │   │   │   ├── InsightCard.tsx
│   │   │   │   ├── RecommendationCard.tsx
│   │   │   │   └── AIAnalysis.tsx
│   │   │   └── Integrations/
│   │   │       ├── ConnectionCard.tsx
│   │   │       ├── ConnectWizard.tsx
│   │   │       └── SyncStatus.tsx
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useClient.ts
│   │   │   └── useMetrics.ts
│   │   ├── contexts/
│   │   │   ├── AuthContext.tsx
│   │   │   ├── ClientContext.tsx
│   │   │   └── ThemeContext.tsx
│   │   ├── lib/
│   │   │   ├── trpc.ts
│   │   │   ├── utils.ts
│   │   │   └── api.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   └── index.html
├── server/
│   ├── routers/
│   │   ├── index.ts
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
│   │   │   ├── meta.ts
│   │   │   ├── google.ts
│   │   │   ├── tiktok.ts
│   │   │   ├── mercadolivre.ts
│   │   │   ├── shopee.ts
│   │   │   └── amazon.ts
│   │   ├── ai/
│   │   │   ├── campaignAnalyst.ts
│   │   │   ├── salesAnalyst.ts
│   │   │   ├── productAnalyst.ts
│   │   │   ├── crmAnalyst.ts
│   │   │   └── growthStrategist.ts
│   │   ├── reports/
│   │   │   ├── generator.ts
│   │   │   ├── emailSender.ts
│   │   │   └── whatsappSender.ts
│   │   ├── crm.ts
│   │   ├── sync.ts
│   │   └── cache.ts
│   ├── jobs/
│   │   ├── syncMetrics.ts
│   │   ├── analyzeAI.ts
│   │   ├── sendReports.ts
│   │   └── cleanupOldData.ts
│   ├── db.ts
│   ├── routers.ts
│   └── _core/
│       ├── index.ts
│       ├── context.ts
│       ├── trpc.ts
│       ├── env.ts
│       ├── oauth.ts
│       ├── cookies.ts
│       ├── llm.ts
│       ├── storage.ts
│       └── notification.ts
├── drizzle/
│   ├── schema.ts
│   └── migrations/
├── shared/
│   ├── const.ts
│   ├── types.ts
│   └── utils.ts
├── storage/
│   └── index.ts
├── .env.example
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── vite.config.ts
├── drizzle.config.ts
├── ARCHITECTURE.md
├── TODO.md
└── README.md
```

---

## 8. SEGURANÇA MULTI-TENANT

### Isolamento de Dados

```typescript
// Todas as queries devem filtrar por clientId
const getClientMetrics = async (clientId: string, userId: string) => {
  // 1. Verificar que o usuário pertence ao cliente
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId)
  });
  
  if (user?.clientId !== clientId) {
    throw new Error('Unauthorized');
  }
  
  // 2. Buscar dados apenas deste cliente
  return db.query.metrics.findMany({
    where: eq(metrics.clientId, clientId)
  });
};
```

### Controle de Acesso

```typescript
// Procedure protegido com verificação de cliente
export const protectedClientProcedure = protectedProcedure.use(
  async ({ ctx, next, input }) => {
    const clientId = input.clientId;
    
    // Verificar que o usuário pertence a este cliente
    if (ctx.user.clientId !== clientId) {
      throw new TRPCError({ code: 'FORBIDDEN' });
    }
    
    return next({ ctx: { ...ctx, clientId } });
  }
);
```

### Permissões por Perfil

```typescript
// Admin pode ver tudo
// Cliente pode ver apenas seus dados
// Gestor pode ver dados de seus clientes

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN' });
  }
  return next({ ctx });
});

const clientProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'client') {
    throw new TRPCError({ code: 'FORBIDDEN' });
  }
  return next({ ctx });
});
```

---

## 9. PERFORMANCE E CACHE

### Estratégia de Cache

```
- Métricas: Cache por 15 minutos
- Leads: Cache por 5 minutos
- Configurações: Cache por 1 hora
- Insights da IA: Cache por 24 horas
```

### Sincronização Assíncrona

```
- Jobs rodam a cada 6 horas
- Fila BullMQ para processamento
- Retry com backoff exponencial
- Notificação de erros ao admin
```

---

## 10. MVP vs VERSÃO 2

### MVP (Fase 1)
- Site público com landing page
- Autenticação multi-tenant
- Dashboard executivo básico
- Integração com Meta Ads
- Integração com Mercado Livre
- CRM básico com leads
- Relatórios simples por e-mail
- IA básica com recomendações

### Versão 2 (Fase 2)
- Dashboard técnico completo
- Integração com Google Ads
- Integração com TikTok Ads
- Integração com Shopee
- Integração com Amazon
- CRM avançado com funil completo
- Módulo de produtos e precificação
- IA avançada com 5 analistas
- Sistema de aprovações
- Relatórios com WhatsApp
- Agendamento de demonstrações

---

## 11. ROADMAP TÉCNICO

### Semana 1-2: Fundação
- [ ] Banco de dados completo
- [ ] Autenticação multi-tenant
- [ ] Site público básico
- [ ] Dashboard executivo

### Semana 3-4: Integrações
- [ ] Meta Ads API
- [ ] Mercado Livre API
- [ ] Sincronização de dados
- [ ] Cache Redis

### Semana 5-6: CRM e IA
- [ ] CRM básico
- [ ] IA com recomendações
- [ ] Relatórios automáticos

### Semana 7-8: Refinamento
- [ ] Testes
- [ ] Otimizações
- [ ] Deploy
- [ ] Documentação

---

## 12. EXEMPLO DE .ENV

```env
# Database
DATABASE_URL=mysql://user:password@host:3306/racun_analytics

# Redis
REDIS_URL=redis://localhost:6379

# OAuth
VITE_APP_ID=your-manus-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://login.manus.im
JWT_SECRET=your-jwt-secret

# API Keys
META_API_KEY=your-meta-api-key
GOOGLE_API_KEY=your-google-api-key
TIKTOK_API_KEY=your-tiktok-api-key
MERCADOLIVRE_API_KEY=your-ml-api-key
SHOPEE_API_KEY=your-shopee-api-key
AMAZON_API_KEY=your-amazon-api-key

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-email-password

# WhatsApp
WHATSAPP_API_KEY=your-whatsapp-api-key
WHATSAPP_PHONE_ID=your-phone-id

# Google Calendar
GOOGLE_CALENDAR_ID=your-calendar-id
GOOGLE_CALENDAR_KEY=your-calendar-key

# LLM
OPENAI_API_KEY=your-openai-api-key

# Storage
S3_BUCKET=racun-analytics
S3_REGION=us-east-1
S3_ACCESS_KEY=your-access-key
S3_SECRET_KEY=your-secret-key

# App
NODE_ENV=production
PORT=3000
VITE_API_URL=https://api.racun.com
```

---

## 13. MELHORIAS ESTRATÉGICAS EXTRAS

1. **White-label**: Permitir que agências parceiras usem a plataforma com sua marca
2. **API Pública**: Expor endpoints para integrações de terceiros
3. **Webhooks**: Notificações em tempo real para eventos importantes
4. **Automações Avançadas**: Criar workflows customizados
5. **Marketplace de Apps**: Permitir que desenvolvedores criem extensões
6. **Análise Preditiva**: Usar ML para prever trends e oportunidades
7. **Comparativos com Benchmarks**: Mostrar performance vs. mercado
8. **Sugestões de Otimização Automáticas**: IA que sugere ações específicas
9. **Integração com ERP**: Conectar com sistemas de gestão empresarial
10. **Mobile App**: Aplicativo nativo para iOS/Android

---

## Próximos Passos

1. Criar schema do banco de dados em Drizzle
2. Implementar autenticação multi-tenant
3. Construir site público
4. Desenvolver dashboard executivo
5. Integrar APIs de tráfego pago
6. Implementar CRM
7. Adicionar IA
8. Criar sistema de relatórios

