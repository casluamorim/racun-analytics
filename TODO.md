# Racun Analytics - TODO List

## Fase 1: Fundação e Banco de Dados

### Banco de Dados e Schema
- [x] Criar schema completo em Drizzle (users, clients, leads, metrics, etc)
- [x] Configurar migrations
- [ ] Criar indexes para performance
- [ ] Implementar row-level security

### Autenticação Multi-tenant
- [ ] Implementar context com clientId
- [ ] Criar protectedClientProcedure
- [ ] Configurar isolamento de dados
- [ ] Implementar verificação de permissões

### Site Público
- [x] Criar landing page com hero section
- [x] Implementar página de recursos
- [x] Implementar página de soluções
- [x] Implementar página de contato
- [x] Implementar formulário de agendamento
- [x] Adicionar FAQ
- [x] Adicionar prova social (testimonials)
- [x] Implementar design responsivo

---

## Fase 2: Portal Privado - Dashboards

### Dashboard Executivo
- [x] Criar layout base do portal (PortalLayout com sidebar)
- [x] Implementar dashboard executivo com KPIs principais
- [x] Criar gráficos de investimento e conversões
- [x] Criar gráficos de ROAS
- [x] Implementar alertas principais (insights da IA)
- [x] Implementar últimas ações da IA
- [ ] Adicionar filtros por período

### Dashboard Técnico
- [ ] Criar dashboard técnico com visão completa
- [ ] Implementar filtros avançados (período, canal, campanha)
- [ ] Criar comparativos por período
- [ ] Criar comparativos por canal
- [ ] Implementar health score da conta
- [ ] Implementar diagnósticos detalhados
- [ ] Adicionar modo apresentação

### Módulos do Portal
- [x] Página de Integrações (status de conexões, sincronização manual)
- [x] Página de CRM com funil de vendas (novo, qualificado, demo, proposta, negociação)
- [x] Página de Relatórios (histórico e próximos relatórios)
- [x] Página de Configurações (perfil, relatórios, notificações, segurança)

---

## Fase 3: Integrações

### Central de Integrações
- [x] Criar página de integrações
- [ ] Implementar status de conexões (conectado, erro, desconectado)
- [ ] Criar botão de reconectar
- [ ] Implementar sincronização manual
- [ ] Criar logs de integração
- [ ] Implementar teste de conexão
- [ ] Adicionar histórico de sincronizações

### Meta Ads
- [x] Implementar OAuth com Meta (getAuthUrl, handleCallback)
- [x] Criar service para Meta Marketing API (MetaAdsService)
- [x] Buscar campanhas (syncCampaigns)
- [x] Buscar métricas (investimento, impressões, cliques, conversões, ROAS)
- [x] Criar testes de conexão (metaAdsService.test.ts)
- [ ] Implementar sincronização automática com job scheduler
- [ ] Integrar com banco de dados (salvar campanhas e métricas)
- [ ] Criar página de integração no portal (MetaIntegration.tsx)

### Google Ads
- [ ] Implementar OAuth com Google
- [ ] Criar service para Google Ads API
- [ ] Buscar campanhas
- [ ] Buscar palavras-chave
- [ ] Buscar performance
- [ ] Implementar sincronização automática

### TikTok Ads
- [ ] Implementar OAuth com TikTok
- [ ] Criar service para TikTok Ads API
- [ ] Buscar campanhas
- [ ] Buscar performance
- [ ] Implementar sincronização automática

### Mercado Livre
- [ ] Implementar OAuth com Mercado Livre
- [ ] Criar service para Mercado Livre API
- [ ] Buscar pedidos
- [ ] Buscar vendas
- [ ] Buscar faturamento
- [ ] Buscar reputação
- [ ] Implementar sincronização automática

### Shopee
- [ ] Implementar OAuth com Shopee
- [ ] Criar service para Shopee API
- [ ] Buscar pedidos
- [ ] Buscar vendas
- [ ] Buscar visitas
- [ ] Buscar conversão
- [ ] Implementar sincronização automática

### Amazon
- [ ] Implementar OAuth com Amazon
- [ ] Criar service para Amazon SP-API
- [ ] Buscar ASINs
- [ ] Buscar vendas
- [ ] Buscar reviews
- [ ] Implementar sincronização automática

---

## Fase 4: Módulo de Tráfego Pago

### Tráfego Pago - Dashboard
- [ ] Criar página de tráfego pago
- [ ] Implementar KPIs principais
- [ ] Criar gráfico de investimento por canal
- [ ] Criar gráfico de resultados
- [ ] Implementar tabela de campanhas
- [ ] Criar comparativo com período anterior
- [ ] Implementar top campanhas
- [ ] Implementar piores campanhas
- [ ] Adicionar alertas de performance

### Análise de Tráfego
- [ ] Implementar filtros por período
- [ ] Implementar filtros por plataforma
- [ ] Implementar filtros por campanha
- [ ] Criar comparativos entre canais
- [ ] Implementar análise de ROAS por canal

---

## Fase 5: Módulo de Marketplaces e Vendas

### Marketplaces - Dashboard
- [ ] Criar página de marketplaces
- [ ] Implementar KPIs de vendas
- [ ] Criar gráfico de faturamento
- [ ] Criar gráfico de pedidos
- [ ] Implementar tabela de produtos mais vendidos
- [ ] Criar comparativo entre marketplaces
- [ ] Implementar análise de canal vs. faturamento

### Análise de Vendas
- [ ] Implementar cruzamento de dados de anúncios com vendas
- [ ] Criar análise de qual tráfego pago virou venda
- [ ] Implementar análise de qual canal gera mais faturamento
- [ ] Implementar análise de qual produto vende melhor por plataforma

---

## Fase 6: Módulo de Produtos e Precificação

### Gestão de Produtos
- [ ] Criar página de produtos
- [ ] Implementar cadastro de produtos
- [ ] Implementar sincronização de produtos
- [ ] Criar análise de margem
- [ ] Implementar análise de custo
- [ ] Criar análise de preço de venda
- [ ] Implementar análise de taxa de marketplace

### Calculadora de Precificação
- [ ] Criar calculadora de preço ideal
- [ ] Implementar cálculo de margem
- [ ] Implementar cálculo de lucro líquido
- [ ] Implementar cálculo de preço mínimo
- [ ] Adicionar alertas de risco
- [ ] Criar simulações de desconto
- [ ] Implementar recomendações de otimização

---

## Fase 7: CRM Unificado

### Gestão de Leads
- [x] Criar página de CRM
- [x] Implementar lista de leads
- [ ] Implementar kanban de funil
- [ ] Criar formulário de novo lead
- [ ] Implementar edição de lead
- [ ] Criar deduplicação por e-mail/telefone
- [ ] Implementar histórico de interações

### Funil de Vendas
- [x] Implementar etapas do funil (novo, qualificado, demo, proposta, negociação, convertido, perdido)
- [ ] Criar view kanban
- [x] Criar view lista
- [ ] Implementar drag-and-drop entre etapas
- [ ] Criar métricas do funil (conversão, tempo médio)
- [x] Implementar filtros avançados

### Automações de CRM
- [ ] Criar lead automaticamente de formulários
- [ ] Criar lead automaticamente de agendamentos
- [ ] Criar lead automaticamente de Meta Lead Ads
- [ ] Criar atividade automática em interações
- [ ] Implementar notificação de leads quentes
- [ ] Implementar sugestão de follow-up
- [ ] Implementar marcação de leads sem resposta

### Relacionamentos
- [ ] Relacionar lead com campanha de origem
- [ ] Relacionar lead com fonte de marketplace
- [ ] Relacionar lead com venda
- [ ] Relacionar lead com reunião agendada
- [ ] Relacionar lead com tarefa
- [ ] Relacionar lead com documentos

---

## Fase 8: Racun Growth AI

### Campaign AI Analyst
- [ ] Implementar análise de campanhas
- [ ] Detectar queda de CTR
- [ ] Detectar alta de CPC
- [ ] Detectar gasto sem conversão
- [ ] Gerar recomendações de otimização
- [ ] Sugerir testes de criativo

### Sales AI Analyst
- [ ] Implementar análise de vendas
- [ ] Detectar queda de conversão
- [ ] Detectar produtos com baixa performance
- [ ] Gerar recomendações de estratégia
- [ ] Sugerir ações comerciais

### Product & Pricing AI Advisor
- [ ] Implementar análise de produtos
- [ ] Detectar produtos com margem baixa
- [ ] Detectar produtos com potencial de escala
- [ ] Gerar recomendações de precificação
- [ ] Sugerir otimizações de portfólio

### CRM AI Assistant
- [ ] Implementar análise de leads
- [ ] Detectar funil travado
- [ ] Detectar oportunidades perdidas
- [ ] Gerar recomendações de follow-up
- [ ] Sugerir reativação de leads

### Growth Strategist AI
- [ ] Implementar análise cruzada de dados
- [ ] Gerar diagnóstico completo
- [ ] Gerar recomendações prioritizadas
- [ ] Criar resumo executivo
- [ ] Criar resumo técnico

### IA - Infraestrutura
- [ ] Criar tabela aiInsights
- [ ] Implementar job de análise automática
- [ ] Implementar botão de análise manual
- [ ] Criar página de insights
- [ ] Implementar histórico de análises
- [ ] Criar notificações de insights

---

## Fase 9: Sistema de Solicitações e Aprovações

### Solicitações
- [ ] Criar página de solicitações
- [ ] Implementar criação de solicitação
- [ ] Criar tipos de solicitação (alteração campanha, ajuste orçamento, mudança criativo, etc)
- [ ] Implementar resposta do admin
- [ ] Criar transformação em tarefa
- [ ] Implementar atribuição de status

### Aprovações
- [ ] Implementar sistema de aprovações
- [ ] Criar registro de aprovação com data e usuário
- [ ] Implementar notificação de aprovação
- [ ] Criar histórico de aprovações

### Tarefas
- [ ] Criar página de tarefas
- [ ] Implementar criação de tarefa
- [ ] Implementar atribuição de tarefa
- [ ] Implementar marcação de conclusão
- [ ] Criar histórico de tarefas

---

## Fase 10: Relatórios e Notificações

### Relatórios Automáticos
- [x] Criar página de relatórios
- [ ] Criar job de relatório semanal (domingo 16:00)
- [ ] Implementar geração de relatório
- [ ] Criar conteúdo: resumo geral
- [ ] Criar conteúdo: resumo por canal
- [ ] Criar conteúdo: resumo por marketplace
- [ ] Criar conteúdo: top campanhas
- [ ] Criar conteúdo: top produtos
- [ ] Criar conteúdo: alertas
- [ ] Criar conteúdo: insights da IA
- [ ] Criar conteúdo: próximos passos

### Envio de Relatórios
- [ ] Implementar envio por e-mail
- [ ] Implementar envio por WhatsApp
- [ ] Implementar geração de PDF
- [ ] Implementar envio de teste
- [ ] Criar histórico de envios
- [ ] Implementar toggle por canal
- [ ] Implementar status de falha

### Relatório Mensal
- [ ] Criar geração de relatório mensal
- [ ] Implementar PDF mais completo
- [ ] Adicionar análises mais detalhadas
- [ ] Implementar comparativo com mês anterior

---

## Fase 11: Documentos, Notas e Timeline

### Documentos e Notas
- [ ] Criar página de documentos
- [ ] Implementar upload de documentos
- [ ] Implementar notas internas (admin only)
- [ ] Implementar observações visíveis ao cliente
- [ ] Criar gestão de contratos
- [ ] Implementar gestão de anexos

### Timeline
- [ ] Criar timeline de ações
- [ ] Implementar histórico de integrações
- [ ] Implementar histórico de relatórios
- [ ] Implementar histórico de alterações
- [ ] Implementar histórico de interações do CRM
- [ ] Criar visualização de timeline

---

## Fase 12: Onboarding e Configurações

### Onboarding do Cliente
- [ ] Criar wizard de onboarding
- [ ] Etapa 1: Dados do cliente
- [ ] Etapa 2: Conectar Meta Ads
- [ ] Etapa 3: Conectar Google Ads
- [ ] Etapa 4: Conectar TikTok Ads
- [ ] Etapa 5: Conectar Mercado Livre
- [ ] Etapa 6: Conectar Shopee
- [ ] Etapa 7: Conectar Amazon
- [ ] Etapa 8: Conectar CRM/WhatsApp
- [ ] Etapa 9: Configurar relatórios
- [ ] Etapa 10: Configurar metas
- [ ] Implementar sincronização inicial de dados

### Configurações do Cliente
- [x] Criar página de configurações
- [ ] Implementar edição de dados básicos
- [ ] Implementar toggle de relatórios
- [ ] Implementar configuração de metas
- [ ] Implementar configuração de notificações
- [ ] Implementar configuração de permissões

### Painel Admin
- [ ] Criar painel admin
- [ ] Implementar gestão de clientes
- [ ] Implementar visualização de métricas de clientes
- [ ] Implementar análise de clientes com IA
- [ ] Implementar gestão de leads
- [ ] Implementar gestão de relatórios

---

## Fase 13: Testes e Otimizações

### Testes
- [ ] Escrever testes unitários
- [ ] Escrever testes de integração
- [ ] Testar fluxos de autenticação
- [ ] Testar isolamento multi-tenant
- [ ] Testar sincronização de dados
- [ ] Testar geração de IA
- [ ] Testar envio de relatórios

### Otimizações
- [ ] Implementar cache Redis
- [ ] Otimizar queries do banco
- [ ] Implementar paginação
- [ ] Otimizar imagens
- [ ] Implementar lazy loading
- [ ] Otimizar bundle size

### Performance
- [ ] Testar performance de dashboards
- [ ] Testar performance de CRM
- [ ] Testar performance de sincronização
- [ ] Implementar monitoramento
- [ ] Configurar alertas

---

## Fase 14: Deploy e Documentação

### Deploy
- [ ] Configurar CI/CD
- [ ] Deploy de staging
- [ ] Deploy de produção
- [ ] Configurar domínio
- [ ] Configurar SSL
- [ ] Configurar backups

### Documentação
- [ ] Documentar API
- [ ] Documentar fluxos
- [ ] Documentar configurações
- [ ] Criar guia do usuário
- [ ] Criar guia do admin
- [ ] Criar guia de desenvolvimento

---

## Melhorias Futuras

- [ ] White-label
- [ ] API Pública
- [ ] Webhooks
- [ ] Automações Avançadas
- [ ] Marketplace de Apps
- [ ] Análise Preditiva
- [ ] Comparativos com Benchmarks
- [ ] Integração com ERP
- [ ] Mobile App
- [ ] Integração com RD Station
- [ ] Integração com HubSpot
- [ ] Integração com Pipedrive
