import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, BarChart3, Users, TrendingUp, Zap } from "lucide-react";
import { Link } from "wouter";

export default function Solutions() {
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
            <Link href="/recursos" className="text-slate-300 hover:text-white">Recursos</Link>
            <Link href="/solucoes" className="text-white font-medium">Soluções</Link>
            <Link href="/agendar" className="text-slate-300 hover:text-white">Agendar Demo</Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="container max-w-6xl mx-auto px-4 py-16">
        <h1 className="text-5xl font-bold text-white mb-6">Soluções por Desafio</h1>
        <p className="text-xl text-slate-300 max-w-3xl">
          Qualquer que seja seu desafio, Racun Analytics tem uma solução pronta
        </p>
      </section>

      {/* Solutions Grid */}
      <section className="container max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Solução 1 */}
          <Card className="bg-slate-800/50 border-slate-700 p-8">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-6">
              <TrendingUp className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Aumentar Vendas</h3>
            <p className="text-slate-300 mb-6">
              Identifique oportunidades de crescimento com IA que analisa seus dados de marketing e vendas
            </p>
            <ul className="space-y-3 text-slate-300 mb-8">
              <li>✓ Análise de qual tráfego pago vira venda real</li>
              <li>✓ Identificação de produtos com potencial de escala</li>
              <li>✓ Recomendações de alocação de orçamento</li>
              <li>✓ Detecção de leads de alta qualidade</li>
              <li>✓ Sugestões de follow-up automático</li>
            </ul>
            <Link href="/agendar">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">Ver Demo</Button>
            </Link>
          </Card>

          {/* Solução 2 */}
          <Card className="bg-slate-800/50 border-slate-700 p-8">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-6">
              <BarChart3 className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Reduzir CAC</h3>
            <p className="text-slate-300 mb-6">
              Otimize seu custo de aquisição com análise profunda de campanhas e canais
            </p>
            <ul className="space-y-3 text-slate-300 mb-8">
              <li>✓ Análise de CTR, CPC e CPM por campanha</li>
              <li>✓ Detecção de campanhas com baixo ROAS</li>
              <li>✓ Comparativo de performance entre canais</li>
              <li>✓ Alertas de gasto sem conversão</li>
              <li>✓ Recomendações de otimização de criativo</li>
            </ul>
            <Link href="/agendar">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">Ver Demo</Button>
            </Link>
          </Card>

          {/* Solução 3 */}
          <Card className="bg-slate-800/50 border-slate-700 p-8">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-6">
              <Zap className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Melhorar ROAS</h3>
            <p className="text-slate-300 mb-6">
              Maximize o retorno do seu investimento em publicidade com dados em tempo real
            </p>
            <ul className="space-y-3 text-slate-300 mb-8">
              <li>✓ Cruzamento de dados de anúncios com vendas reais</li>
              <li>✓ Identificação de campanhas de alto ROAS</li>
              <li>✓ Análise de conversão por canal</li>
              <li>✓ Recomendações de aumento de verba</li>
              <li>✓ Teste A/B automático com IA</li>
            </ul>
            <Link href="/agendar">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">Ver Demo</Button>
            </Link>
          </Card>

          {/* Solução 4 */}
          <Card className="bg-slate-800/50 border-slate-700 p-8">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-6">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Otimizar Margem</h3>
            <p className="text-slate-300 mb-6">
              Aumente sua lucratividade com análise de precificação e gestão de produtos
            </p>
            <ul className="space-y-3 text-slate-300 mb-8">
              <li>✓ Análise de margem por produto</li>
              <li>✓ Calculadora de preço ideal</li>
              <li>✓ Simulações de desconto máximo</li>
              <li>✓ Identificação de produtos com baixa margem</li>
              <li>✓ Recomendações de repricing</li>
            </ul>
            <Link href="/agendar">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">Ver Demo</Button>
            </Link>
          </Card>

          {/* Solução 5 */}
          <Card className="bg-slate-800/50 border-slate-700 p-8">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-6">
              <BarChart3 className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Centralizar Dados</h3>
            <p className="text-slate-300 mb-6">
              Tenha uma visão única de todo seu negócio sem planilhas
            </p>
            <ul className="space-y-3 text-slate-300 mb-8">
              <li>✓ Integração automática com todas as plataformas</li>
              <li>✓ Dashboard unificado com todos os dados</li>
              <li>✓ Sincronização em tempo real</li>
              <li>✓ Histórico completo de métricas</li>
              <li>✓ Relatórios automáticos semanais</li>
            </ul>
            <Link href="/agendar">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">Ver Demo</Button>
            </Link>
          </Card>

          {/* Solução 6 */}
          <Card className="bg-slate-800/50 border-slate-700 p-8">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-6">
              <TrendingUp className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Escalar Operações</h3>
            <p className="text-slate-300 mb-6">
              Automatize processos e escale seu negócio com eficiência
            </p>
            <ul className="space-y-3 text-slate-300 mb-8">
              <li>✓ Automações de CRM e follow-up</li>
              <li>✓ Sistema de aprovações dentro da plataforma</li>
              <li>✓ Gestão de tarefas e solicitações</li>
              <li>✓ Documentos e notas centralizadas</li>
              <li>✓ Timeline completa de ações</li>
            </ul>
            <Link href="/agendar">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">Ver Demo</Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* Comparison */}
      <section className="container max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-white mb-12 text-center">Antes vs Depois</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="bg-red-500/10 border-red-500/30 p-8">
            <h3 className="text-2xl font-bold text-red-400 mb-6">❌ Sem Racun Analytics</h3>
            <ul className="space-y-4 text-slate-300">
              <li>Dados espalhados em várias plataformas</li>
              <li>Planilhas manuais que ficam desatualizadas</li>
              <li>Dificuldade em tomar decisões rápidas</li>
              <li>Falta de visão do funil completo</li>
              <li>Relatórios manuais que consomem tempo</li>
              <li>Sem recomendações estratégicas</li>
              <li>Comunicação via WhatsApp solto</li>
              <li>Sem histórico centralizado</li>
            </ul>
          </Card>

          <Card className="bg-green-500/10 border-green-500/30 p-8">
            <h3 className="text-2xl font-bold text-green-400 mb-6">✅ Com Racun Analytics</h3>
            <ul className="space-y-4 text-slate-300">
              <li>Dados centralizados em um único lugar</li>
              <li>Sincronização automática em tempo real</li>
              <li>Decisões rápidas baseadas em dados</li>
              <li>Visão completa do funil de vendas</li>
              <li>Relatórios automáticos semanais</li>
              <li>IA que sugere ações estratégicas</li>
              <li>Comunicação estruturada na plataforma</li>
              <li>Histórico completo e auditável</li>
            </ul>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="container max-w-6xl mx-auto px-4 py-20 text-center">
        <h2 className="text-4xl font-bold text-white mb-6">Qual é seu desafio?</h2>
        <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
          Agende uma demonstração e mostre como Racun Analytics resolve seu problema específico
        </p>
        <Link href="/agendar">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg flex items-center gap-2 mx-auto">
            Agendar Demonstração <ArrowRight className="w-5 h-5" />
          </Button>
        </Link>
      </section>
    </div>
  );
}
