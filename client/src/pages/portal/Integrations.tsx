import PortalLayout from "@/components/PortalLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, AlertCircle, Zap, RefreshCw } from "lucide-react";

const integrations = [
  {
    name: "Meta Ads",
    description: "Facebook e Instagram",
    status: "connected",
    lastSync: "2 minutos atrás",
    icon: "📱",
  },
  {
    name: "Google Ads",
    description: "Google Ads e Analytics",
    status: "connected",
    lastSync: "5 minutos atrás",
    icon: "🔍",
  },
  {
    name: "TikTok Ads",
    description: "TikTok Business",
    status: "error",
    lastSync: "Erro na última sincronização",
    icon: "🎵",
  },
  {
    name: "Mercado Livre",
    description: "Vendas e Métricas",
    status: "connected",
    lastSync: "1 minuto atrás",
    icon: "📦",
  },
  {
    name: "Shopee",
    description: "Vendas e Métricas",
    status: "connected",
    lastSync: "3 minutos atrás",
    icon: "🛍️",
  },
  {
    name: "Amazon",
    description: "Vendas e Métricas",
    status: "disconnected",
    lastSync: "Não conectado",
    icon: "🏪",
  },
  {
    name: "Google Calendar",
    description: "Agendamentos",
    status: "connected",
    lastSync: "Sincronizado",
    icon: "📅",
  },
  {
    name: "WhatsApp Business",
    description: "Mensagens e Contatos",
    status: "disconnected",
    lastSync: "Não conectado",
    icon: "💬",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "connected":
      return "bg-green-500/10 border-green-500/30 text-green-400";
    case "error":
      return "bg-red-500/10 border-red-500/30 text-red-400";
    case "disconnected":
      return "bg-slate-500/10 border-slate-500/30 text-slate-400";
    default:
      return "bg-slate-500/10 border-slate-500/30 text-slate-400";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "connected":
      return "Conectado";
    case "error":
      return "Erro";
    case "disconnected":
      return "Desconectado";
    default:
      return "Desconectado";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "connected":
      return <Check className="w-4 h-4" />;
    case "error":
      return <AlertCircle className="w-4 h-4" />;
    default:
      return <AlertCircle className="w-4 h-4" />;
  }
};

export default function Integrations() {
  return (
    <PortalLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Integrações</h2>
          <p className="text-slate-400">Conecte suas plataformas de marketing e vendas</p>
        </div>

        {/* Info Box */}
        <Card className="bg-blue-500/10 border-blue-500/30 p-6">
          <div className="flex gap-3">
            <Zap className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-white font-medium mb-1">Sincronização Automática</p>
              <p className="text-slate-300 text-sm">
                As métricas são sincronizadas automaticamente a cada 30 minutos. Você pode forçar uma sincronização manual a qualquer momento.
              </p>
            </div>
          </div>
        </Card>

        {/* Integrations Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {integrations.map((integration) => (
            <Card key={integration.name} className="bg-slate-800/50 border-slate-700 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{integration.icon}</span>
                  <div>
                    <h3 className="text-lg font-bold text-white">{integration.name}</h3>
                    <p className="text-sm text-slate-400">{integration.description}</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full border text-xs font-medium flex items-center gap-1 ${getStatusColor(integration.status)}`}>
                  {getStatusIcon(integration.status)}
                  {getStatusLabel(integration.status)}
                </div>
              </div>

              <div className="mb-4 text-sm text-slate-400">
                {integration.status === "error" ? (
                  <span className="text-red-400">⚠️ {integration.lastSync}</span>
                ) : (
                  <span>Última sincronização: {integration.lastSync}</span>
                )}
              </div>

              <div className="flex gap-2">
                {integration.status === "connected" ? (
                  <>
                    <Button
                      variant="outline"
                      className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700 text-sm"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Sincronizar Agora
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700 text-sm"
                    >
                      Configurar
                    </Button>
                  </>
                ) : integration.status === "error" ? (
                  <>
                    <Button className="flex-1 bg-red-600 hover:bg-red-700 text-sm">
                      Reconectar
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700 text-sm"
                    >
                      Detalhes
                    </Button>
                  </>
                ) : (
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-sm">
                    Conectar
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Coming Soon */}
        <Card className="bg-slate-800/50 border-slate-700 p-6">
          <h3 className="text-lg font-bold text-white mb-4">🚀 Em Breve</h3>
          <div className="grid md:grid-cols-3 gap-4 text-slate-400">
            <div>
              <p className="font-medium text-white mb-1">Integrações CRM</p>
              <p className="text-sm">RD Station, HubSpot, Pipedrive</p>
            </div>
            <div>
              <p className="font-medium text-white mb-1">ERP</p>
              <p className="text-sm">Integração com sistemas de gestão</p>
            </div>
            <div>
              <p className="font-medium text-white mb-1">Webhooks</p>
              <p className="text-sm">Notificações em tempo real</p>
            </div>
          </div>
        </Card>
      </div>
    </PortalLayout>
  );
}
