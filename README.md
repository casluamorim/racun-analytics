# Racun Analytics

**Plataforma Unificada de Crescimento, Vendas e Operações Comerciais**

Racun Analytics é uma plataforma SaaS enterprise-grade que centraliza marketing, vendas, CRM e operações em um único ecossistema inteligente, com IA de análise estratégica e integrações automáticas.

## 🎯 Visão do Produto

Racun Analytics permite que agências de marketing digital gerenciem o crescimento dos seus clientes sem depender de conversas soltas no WhatsApp. A plataforma une:

- **Marketing**: Meta Ads, Google Ads, TikTok Ads
- **Vendas**: Mercado Livre, Shopee, Amazon
- **CRM**: Gestão de leads com funil completo
- **Análise**: IA de crescimento com 5 analistas especializados
- **Operações**: Solicitações, aprovações, tarefas e documentos
- **Relatórios**: Automáticos por e-mail, WhatsApp e PDF

## ✨ Funcionalidades Principais

### Site Público Premium
- Landing page com hero section impactante
- Páginas de recursos e soluções
- Agendamento de demonstração
- Design responsivo em dark mode

### Portal Privado Multi-tenant
- Autenticação segura com isolamento total
- Dashboard executivo simplificado
- Dashboard técnico com filtros avançados
- Central de integrações com reconexão automática

### Integrações Automáticas
- **Meta Ads**: Campanhas, métricas, ROAS
- **Google Ads**: Performance, palavras-chave
- **TikTok Ads**: Alcance, engajamento
- **Mercado Livre**: Pedidos, vendas, reputação
- **Shopee**: Pedidos, visitas, conversão
- **Amazon**: ASINs, vendas, reviews

### CRM Unificado
- Gestão de leads com deduplicação
- Funil kanban e lista
- Histórico de interações
- Automações de captura e follow-up
- Métricas de conversão por canal

### Racun Growth AI
- **Campaign AI Analyst**: Análise de campanhas
- **Sales AI Analyst**: Análise de vendas
- **Product & Pricing AI Advisor**: Análise de produtos
- **CRM AI Assistant**: Análise de leads
- **Growth Strategist AI**: Recomendações estratégicas

### Módulos Adicionais
- Tráfego pago com análise de ROAS
- Marketplaces com cruzamento de dados
- Produtos com análise de margem
- Calculadora de precificação
- Solicitações e aprovações
- Relatórios automáticos semanais
- Documentos e timeline centralizada

## 🚀 Quick Start

### Pré-requisitos
- Node.js 18+
- pnpm
- MySQL/TiDB
- Redis (opcional)

### Instalação

```bash
# Clonar repositório
git clone <repository-url>
cd racun-analytics

# Instalar dependências
pnpm install

# Configurar variáveis de ambiente
cp .env.example .env

# Criar banco de dados
pnpm db:push

# Iniciar servidor de desenvolvimento
pnpm dev
```

### Acessar a Plataforma

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000
- **API**: http://localhost:3000/api/trpc

## 📁 Estrutura do Projeto

```
racun-analytics/
├── client/              # Frontend React
│   ├── src/
│   │   ├── pages/      # Páginas da aplicação
│   │   ├── components/ # Componentes reutilizáveis
│   │   ├── hooks/      # Custom hooks
│   │   └── lib/        # Utilitários
│   └── index.html
├── server/             # Backend Express + tRPC
│   ├── routers/        # Procedures tRPC
│   ├── services/       # Lógica de negócio
│   ├── jobs/           # Jobs assíncronos
│   └── db.ts           # Helpers de banco
├── drizzle/            # Schema do banco
│   ├── schema.ts       # Definição de tabelas
│   └── migrations/     # Migrações
├── shared/             # Código compartilhado
├── ARCHITECTURE.md     # Arquitetura completa
├── IMPLEMENTATION_GUIDE.md
└── TODO.md            # Lista de tarefas
```

## 🔐 Segurança

- ✅ Isolamento multi-tenant com clientId
- ✅ Autenticação via OAuth Manus
- ✅ Cookies httpOnly
- ✅ Controle de acesso por perfil
- ✅ Criptografia de tokens sensíveis
- ✅ Logs de auditoria completos
- ✅ Rate limiting em login
- ✅ Validação de entrada

## 📊 Banco de Dados

### Tabelas Principais

- `users` - Usuários do sistema
- `clients` - Dados dos clientes
- `leads` - Leads do CRM
- `platformConnections` - Integrações
- `campaignMetrics` - Métricas de tráfego
- `marketplaceMetrics` - Métricas de vendas
- `products` - Catálogo de produtos
- `aiInsights` - Insights da IA
- `requests` - Solicitações
- `tasks` - Tarefas
- `reports` - Relatórios
- `notes` - Notas e observações

## 🧪 Testes

```bash
# Rodar todos os testes
pnpm test

# Rodar em modo watch
pnpm test -- --watch

# Com cobertura
pnpm test -- --coverage
```

## 📈 Deploy

### Preparar para Deploy

```bash
# Build
pnpm build

# Verificar tipos
pnpm check

# Rodar testes
pnpm test
```

### Deploy para Produção

1. Criar checkpoint no Manus
2. Clicar em "Publish" na Management UI
3. Configurar domínio (opcional)

## 📚 Documentação

- **ARCHITECTURE.md** - Arquitetura completa da plataforma
- **IMPLEMENTATION_GUIDE.md** - Guia de implementação técnica
- **TODO.md** - Lista de tarefas e status
- **API Docs** - Documentação de endpoints tRPC

## 🎨 Design

- **Framework**: Tailwind CSS 4
- **Componentes**: shadcn/ui
- **Tema**: Dark mode premium
- **Responsividade**: Mobile-first

## 🔌 Integrações

### Meta Ads
```typescript
const campaigns = await metaAPI.getCampaigns(accountId);
const metrics = await metaAPI.getMetrics(campaignId, dateRange);
```

### Google Ads
```typescript
const campaigns = await googleAdsAPI.getCampaigns(customerId);
const performance = await googleAdsAPI.getPerformance(campaignId, dateRange);
```

### Mercado Livre
```typescript
const orders = await mercadoLivreAPI.getOrders(sellerId);
const sales = await mercadoLivreAPI.getSales(sellerId, dateRange);
```

## 🤖 IA de Crescimento

A plataforma inclui 5 analistas especializados:

1. **Campaign AI Analyst** - Analisa campanhas de tráfego pago
2. **Sales AI Analyst** - Analisa vendas e marketplaces
3. **Product & Pricing AI Advisor** - Analisa produtos e margem
4. **CRM AI Assistant** - Analisa leads e oportunidades
5. **Growth Strategist AI** - Recomendações estratégicas cruzadas

## 📞 Suporte

Para dúvidas ou sugestões:
- Consulte a documentação em `ARCHITECTURE.md`
- Verifique o status em `TODO.md`
- Abra uma issue no repositório

## 📄 Licença

Copyright © 2026 Agência Racun. Todos os direitos reservados.

## 🙏 Agradecimentos

Desenvolvido com ❤️ para a Agência Racun

---

**Racun Analytics** - Transforme dados em crescimento 🚀
