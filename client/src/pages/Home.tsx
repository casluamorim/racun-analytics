import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, BarChart3, Brain, CheckCircle, Zap, Users, TrendingUp, Smartphone } from "lucide-react";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="container max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">RA</span>
            </div>
            <span className="text-white font-bold text-lg">Racun Analytics</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/recursos" className="text-slate-300 hover:text-white transition">
              Recursos
            </Link>
            <Link href="/solucoes" className="text-slate-300 hover:text-white transition">
              Soluções
            </Link>
            <Link href="/agendar" className="text-slate-300 hover:text-white transition">
              Agendar Demo
            </Link>
            {isAuthenticated ? (
              <Link href="/portal/dashboard">
                <Button className="bg-blue-600 hover:bg-blue-700">Portal</Button>
              </Link>
            ) : (
              <a href={getLoginUrl()}>
                <Button className="bg-blue-600 hover:bg-blue-700">Entrar</Button>
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container max-w-6xl mx-auto px-4 py-20 text-center">
        <div className="space-y-6 mb-12">
          <div className="inline-block px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full">
            <span className="text-blue-400 text-sm font-medium">🚀 Plataforma Unificada de Crescimento</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
            Transforme dados em <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">crescimento</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Racun Analytics centraliza marketing, vendas, CRM e operações em uma única plataforma inteligente. Tome decisões baseadas em dados com IA de análise estratégica.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Link href="/agendar">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg flex items-center gap-2">
                Agendar Demonstração <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <a href={getLoginUrl()}>
              <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-800 px-8 py-6 text-lg">
                Acessar Portal
              </Button>
            </a>
          </div>
        </div>

        {/* Hero Image */}
        <div className="mt-16 rounded-lg border border-slate-700 bg-slate-900/50 p-8 backdrop-blur">
          <div className="aspect-video bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg flex items-center justify-center">
            <div className="text-slate-400">Dashboard Preview</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Tudo que você precisa para vender mais</h2>
          <p className="text-slate-300 text-lg">Uma plataforma completa que integra marketing, vendas e operações</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: BarChart3,
              title: "Dashboards Inteligentes",
              description: "Visualize métricas de marketing, vendas e marketplaces em tempo real com análises profundas"
            },
            {
              icon: Brain,
              title: "IA de Crescimento",
              description: "Receba recomendações estratégicas automáticas baseadas em análise de dados e padrões"
            },
            {
              icon: Users,
              title: "CRM Unificado",
              description: "Gerencie leads, funil de vendas e relacionamento com clientes em um único lugar"
            },
            {
              icon: Zap,
              title: "Integrações Automáticas",
              description: "Conecte Meta Ads, Google Ads, TikTok, Mercado Livre, Shopee e Amazon automaticamente"
            },
            {
              icon: TrendingUp,
              title: "Análise de Precificação",
              description: "Otimize margens, calcule preços ideais e simule cenários de desconto com IA"
            },
            {
              icon: Smartphone,
              title: "Relatórios Automáticos",
              description: "Receba relatórios semanais e mensais por e-mail, WhatsApp e PDF com insights da IA"
            }
          ].map((feature, i) => (
            <Card key={i} className="bg-slate-800/50 border-slate-700 p-6 hover:border-blue-500/50 transition">
              <feature.icon className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-slate-400">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="container max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Como funciona</h2>
          <p className="text-slate-300 text-lg">Três passos simples para começar</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: "1",
              title: "Conecte suas plataformas",
              description: "Integre Meta Ads, Google Ads, TikTok, Mercado Livre, Shopee e Amazon em minutos"
            },
            {
              step: "2",
              title: "Visualize seus dados",
              description: "Acesse dashboards completos com todas as suas métricas de marketing e vendas"
            },
            {
              step: "3",
              title: "Receba recomendações",
              description: "A IA analisa seus dados e sugere ações para aumentar vendas e margem"
            }
          ].map((item, i) => (
            <div key={i} className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mb-6">
                  <span className="text-white font-bold text-2xl">{item.step}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-slate-400">{item.description}</p>
              </div>
              {i < 2 && (
                <div className="hidden md:block absolute top-8 -right-4 text-slate-600">
                  <ArrowRight className="w-6 h-6" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container max-w-6xl mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-lg p-12">
          <h2 className="text-3xl font-bold text-white mb-8">Por que escolher Racun Analytics?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              "Centraliza tudo em um único lugar - sem mais planilhas",
              "IA que analisa seus dados e sugere ações estratégicas",
              "Integração automática com suas plataformas de marketing",
              "Relatórios inteligentes enviados automaticamente",
              "CRM unificado com funil de vendas completo",
              "Análise de margem e precificação com recomendações",
              "Aprovações e solicitações dentro da plataforma",
              "Suporte dedicado da Agência Racun"
            ].map((benefit, i) => (
              <div key={i} className="flex gap-3">
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-white">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container max-w-6xl mx-auto px-4 py-20 text-center">
        <h2 className="text-4xl font-bold text-white mb-6">Pronto para transformar seu crescimento?</h2>
        <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
          Agende uma demonstração gratuita e veja como Racun Analytics pode ajudar seu negócio a vender mais
        </p>
        <Link href="/agendar">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg">
            Agendar Demonstração Gratuita
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-12">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">RA</span>
                </div>
                <span className="text-white font-bold">Racun Analytics</span>
              </div>
              <p className="text-slate-400 text-sm">Plataforma unificada de crescimento, vendas e operações</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Produto</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href="/recursos" className="hover:text-white">Recursos</Link></li>
                <li><Link href="/solucoes" className="hover:text-white">Soluções</Link></li>
                <li><Link href="/agendar" className="hover:text-white">Agendar Demo</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Empresa</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white">Sobre</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><Link href="/contato" className="hover:text-white">Contato</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white">Privacidade</a></li>
                <li><a href="#" className="hover:text-white">Termos</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-slate-400 text-sm">
            <p>&copy; 2026 Agência Racun. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
