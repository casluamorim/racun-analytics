import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, BarChart3, Brain, Users, Zap, TrendingUp, Smartphone, Lock, Gauge } from "lucide-react";
import { Link } from "wouter";

export default function Resources() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md py-4">
        <div className="container max-w-6xl mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">RA</span>
            </div>
            <span className="text-white font-bold text-lg">Racun Analytics</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/recursos" className="text-white font-medium">Recursos</Link>
            <Link href="/solucoes" className="text-slate-300 hover:text-white">Soluções</Link>
            <Link href="/agendar" className="text-slate-300 hover:text-white">Agendar Demo</Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="container max-w-6xl mx-auto px-4 py-16">
        <h1 className="text-5xl font-bold text-white mb-6">Recursos Poderosos</h1>
        <p className="text-xl text-slate-300 max-w-3xl">
          Racun Analytics oferece um conjunto completo de ferramentas para gerenciar marketing, vendas e operações do seu negócio
        </p>
      </section>

      {/* Main Features */}
      <section className="container max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Dashboards */}
          <Card className="bg-slate-800/50 border-slate-700 p-8">
            <BarChart3 className="w-12 h-12 text-blue-400 mb-4" />
            <h3 className="text-2xl font-bold text-white mb-4">Dashboards Inteligentes</h3>
            <p className="text-slate-300 mb-6">
              Visualize todas as suas métricas em dashboards executivos e técnicos personalizáveis
            </p>
            <ul className="space-y-3 text-slate-300">
              <li className="flex gap-2">
                <span className="text-blue-400">✓</span> Dashboard executivo simplificado
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">✓</span> Dashboard técnico com filtros avançados
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">✓</span> Comparativos por período e canal
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">✓</span> Health score da conta em tempo real
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">✓</span> Modo apresentação para reuniões
              </li>
            </ul>
          </Card>

          {/* Integrações */}
          <Card className="bg-slate-800/50 border-slate-700 p-8">
            <Zap className="w-12 h-12 text-blue-400 mb-4" />
            <h3 className="text-2xl font-bold text-white mb-4">Integrações Automáticas</h3>
            <p className="text-slate-300 mb-6">
              Conecte suas plataformas de marketing e vendas com um clique
            </p>
            <ul className="space-y-3 text-slate-300">
              <li className="flex gap-2">
                <span className="text-blue-400">✓</span> Meta Ads (Facebook, Instagram)
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">✓</span> Google Ads e Google Analytics
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">✓</span> TikTok Ads
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">✓</span> Mercado Livre, Shopee e Amazon
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">✓</span> WhatsApp Business e Google Calendar
              </li>
            </ul>
          </Card>

          {/* CRM */}
          <Card className="bg-slate-800/50 border-slate-700 p-8">
            <Users className="w-12 h-12 text-blue-400 mb-4" />
            <h3 className="text-2xl font-bold text-white mb-4">CRM Unificado</h3>
            <p className="text-slate-300 mb-6">
              Gerencie leads e oportunidades com funil de vendas completo
            </p>
            <ul className="space-y-3 text-slate-300">
              <li className="flex gap-2">
                <span className="text-blue-400">✓</span> Gestão de leads com deduplicação
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">✓</span> Funil kanban e lista
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">✓</span> Histórico de interações
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">✓</span> Automações de captura e follow-up
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">✓</span> Métricas de conversão por canal
              </li>
            </ul>
          </Card>

          {/* IA */}
          <Card className="bg-slate-800/50 border-slate-700 p-8">
            <Brain className="w-12 h-12 text-blue-400 mb-4" />
            <h3 className="text-2xl font-bold text-white mb-4">Racun Growth AI</h3>
            <p className="text-slate-300 mb-6">
              IA que analisa seus dados e sugere ações estratégicas
            </p>
            <ul className="space-y-3 text-slate-300">
              <li className="flex gap-2">
                <span className="text-blue-400">✓</span> Campaign AI Analyst
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">✓</span> Sales AI Analyst
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">✓</span> Product & Pricing AI Advisor
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">✓</span> CRM AI Assistant
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">✓</span> Growth Strategist AI
              </li>
            </ul>
          </Card>

          {/* Tráfego Pago */}
          <Card className="bg-slate-800/50 border-slate-700 p-8">
            <TrendingUp className="w-12 h-12 text-blue-400 mb-4" />
            <h3 className="text-2xl font-bold text-white mb-4">Análise de Tráfego Pago</h3>
            <p className="text-slate-300 mb-6">
              Acompanhe performance de campanhas em tempo real
            </p>
            <ul className="space-y-3 text-slate-300">
              <li className="flex gap-2">
                <span className="text-blue-400">✓</span> Investimento por campanha
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">✓</span> CTR, CPC, CPM e ROAS
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">✓</span> Conversões e custo por ação
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">✓</span> Comparativos entre canais
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">✓</span> Alertas de performance
              </li>
            </ul>
          </Card>

          {/* Produtos */}
          <Card className="bg-slate-800/50 border-slate-700 p-8">
            <Gauge className="w-12 h-12 text-blue-400 mb-4" />
            <h3 className="text-2xl font-bold text-white mb-4">Gestão de Produtos</h3>
            <p className="text-slate-300 mb-6">
              Otimize preços e margens com IA
            </p>
            <ul className="space-y-3 text-slate-300">
              <li className="flex gap-2">
                <span className="text-blue-400">✓</span> Análise de margem e custo
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">✓</span> Calculadora de precificação
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">✓</span> Simulações de preço e desconto
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">✓</span> Recomendações de otimização
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">✓</span> Produtos com potencial de escala
              </li>
            </ul>
          </Card>

          {/* Relatórios */}
          <Card className="bg-slate-800/50 border-slate-700 p-8">
            <Smartphone className="w-12 h-12 text-blue-400 mb-4" />
            <h3 className="text-2xl font-bold text-white mb-4">Relatórios Automáticos</h3>
            <p className="text-slate-300 mb-6">
              Receba análises sem sair do seu celular
            </p>
            <ul className="space-y-3 text-slate-300">
              <li className="flex gap-2">
                <span className="text-blue-400">✓</span> Relatórios semanais automáticos
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">✓</span> Envio por e-mail e WhatsApp
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">✓</span> Resumo executivo e técnico
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">✓</span> Insights da IA inclusos
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">✓</span> PDF para compartilhar
              </li>
            </ul>
          </Card>

          {/* Segurança */}
          <Card className="bg-slate-800/50 border-slate-700 p-8">
            <Lock className="w-12 h-12 text-blue-400 mb-4" />
            <h3 className="text-2xl font-bold text-white mb-4">Segurança Enterprise</h3>
            <p className="text-slate-300 mb-6">
              Seus dados protegidos com os mais altos padrões
            </p>
            <ul className="space-y-3 text-slate-300">
              <li className="flex gap-2">
                <span className="text-blue-400">✓</span> Isolamento multi-tenant
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">✓</span> Criptografia end-to-end
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">✓</span> Controle de acesso por perfil
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">✓</span> Logs de auditoria completos
              </li>
              <li className="flex gap-2">
                <span className="text-blue-400">✓</span> Backups automáticos
              </li>
            </ul>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="container max-w-6xl mx-auto px-4 py-20 text-center">
        <h2 className="text-4xl font-bold text-white mb-6">Veja todos os recursos em ação</h2>
        <Link href="/agendar">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg flex items-center gap-2 mx-auto">
            Agendar Demonstração <ArrowRight className="w-5 h-5" />
          </Button>
        </Link>
      </section>
    </div>
  );
}
