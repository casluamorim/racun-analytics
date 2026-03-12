import PortalLayout from "@/components/PortalLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AlertCircle, CheckCircle, Loader2, Zap } from "lucide-react";

export default function MetaIntegration() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      // Em produção, isso chamaria a API do Meta
      // Para demonstração, simulamos a conexão
      setTimeout(() => {
        setIsConnected(true);
        setAccounts([
          { id: "123456", name: "Minha Conta de Anúncios", currency: "BRL" },
          { id: "789012", name: "Conta Secundária", currency: "BRL" },
        ]);
        setIsConnecting(false);
      }, 2000);
    } catch (error) {
      console.error("Erro ao conectar:", error);
      setIsConnecting(false);
    }
  };

  const handleSelectAccount = async (accountId: string) => {
    setSelectedAccount(accountId);
    setIsSyncing(true);
    try {
      // Simula sincronização de campanhas
      setTimeout(() => {
        setCampaigns([
          {
            id: "camp1",
            name: "Campanha de Verão",
            status: "ACTIVE",
            objective: "CONVERSIONS",
            dailyBudget: 500,
          },
          {
            id: "camp2",
            name: "Promoção Black Friday",
            status: "PAUSED",
            objective: "LINK_CLICKS",
            dailyBudget: 1000,
          },
          {
            id: "camp3",
            name: "Brand Awareness",
            status: "ACTIVE",
            objective: "REACH",
            dailyBudget: 300,
          },
        ]);
        setIsSyncing(false);
      }, 2000);
    } catch (error) {
      console.error("Erro ao sincronizar campanhas:", error);
      setIsSyncing(false);
    }
  };

  return (
    <PortalLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Integração Meta Ads</h2>
          <p className="text-slate-400">Conecte sua conta de anúncios do Meta para sincronizar campanhas e métricas</p>
        </div>

        {!isConnected ? (
          <Card className="bg-slate-800/50 border-slate-700 p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Conectar Meta Ads</h3>
              <p className="text-slate-400 mb-6 max-w-md mx-auto">
                Sincronize suas campanhas, métricas de investimento e conversões automaticamente
              </p>
              <Button
                onClick={handleConnect}
                disabled={isConnecting}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Conectando...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Conectar Meta Ads
                  </>
                )}
              </Button>
            </div>
          </Card>
        ) : (
          <>
            {/* Status */}
            <Card className="bg-green-500/10 border-green-500/30 p-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <div>
                  <p className="text-green-400 font-medium">Conectado com sucesso</p>
                  <p className="text-sm text-slate-400">Sua conta Meta Ads está sincronizada</p>
                </div>
              </div>
            </Card>

            {/* Seleção de Conta */}
            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <h3 className="text-lg font-bold text-white mb-4">Selecione uma Conta de Anúncios</h3>
              <div className="space-y-3">
                {accounts.map((account) => (
                  <button
                    key={account.id}
                    onClick={() => handleSelectAccount(account.id)}
                    className={`w-full p-4 rounded-lg border-2 transition text-left ${
                      selectedAccount === account.id
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-slate-700 bg-slate-700/30 hover:border-slate-600"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">{account.name}</p>
                        <p className="text-sm text-slate-400">ID: {account.id}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-slate-300">{account.currency}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            {/* Campanhas */}
            {selectedAccount && (
              <Card className="bg-slate-800/50 border-slate-700 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-white">Campanhas Sincronizadas</h3>
                  <Button
                    onClick={() => handleSelectAccount(selectedAccount)}
                    disabled={isSyncing}
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    {isSyncing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sincronizando...
                      </>
                    ) : (
                      "Atualizar"
                    )}
                  </Button>
                </div>

                {isSyncing ? (
                  <div className="text-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-400 mx-auto mb-2" />
                    <p className="text-slate-400">Sincronizando campanhas...</p>
                  </div>
                ) : campaigns.length > 0 ? (
                  <div className="space-y-3">
                    {campaigns.map((campaign) => (
                      <div
                        key={campaign.id}
                        className="p-4 bg-slate-700/30 rounded-lg border border-slate-700 hover:border-slate-600 transition"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="text-white font-medium">{campaign.name}</p>
                            <p className="text-sm text-slate-400">{campaign.objective}</p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              campaign.status === "ACTIVE"
                                ? "bg-green-500/20 text-green-300"
                                : "bg-yellow-500/20 text-yellow-300"
                            }`}
                          >
                            {campaign.status === "ACTIVE" ? "Ativa" : "Pausada"}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                          <span>Orçamento diário: R$ {campaign.dailyBudget.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-slate-400">Nenhuma campanha encontrada</p>
                  </div>
                )}
              </Card>
            )}

            {/* Próximos Passos */}
            <Card className="bg-blue-500/10 border-blue-500/30 p-6">
              <h3 className="text-lg font-bold text-blue-400 mb-3">Próximos Passos</h3>
              <ul className="space-y-2 text-slate-300">
                <li>✓ Campanhas sincronizadas automaticamente a cada 30 minutos</li>
                <li>✓ Métricas de investimento, cliques, impressões e conversões</li>
                <li>✓ ROAS calculado automaticamente para cada campanha</li>
                <li>→ Acesse o Dashboard para visualizar as métricas</li>
              </ul>
            </Card>
          </>
        )}
      </div>
    </PortalLayout>
  );
}
