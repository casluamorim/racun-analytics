import PortalLayout from "@/components/PortalLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  RefreshCw,
  Loader2,
  TrendingUp,
  Activity,
} from "lucide-react";

interface SyncResult {
  platform: "meta" | "google";
  accountId: string;
  campaignsCount: number;
  metricsCount: number;
  success: boolean;
  error?: string;
  duration: number;
  timestamp: Date;
}

export default function SyncMonitor() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncHistory, setSyncHistory] = useState<SyncResult[]>([]);
  const [statistics, setStatistics] = useState<any>(null);
  const [lastSyncStatus, setLastSyncStatus] = useState<any>(null);

  // Simular carregamento de dados
  useEffect(() => {
    loadSyncData();
    // Atualizar a cada 5 minutos
    const interval = setInterval(loadSyncData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const loadSyncData = async () => {
    setIsLoading(true);
    try {
      // Em produção, chamar as APIs do tRPC
      // const history = await trpc.sync.getHistory.query();
      // const stats = await trpc.sync.getStatistics.query();
      // const lastSync = await trpc.sync.getLastSyncStatus.query();

      // Simular dados
      setTimeout(() => {
        setSyncHistory([
          {
            platform: "meta",
            accountId: "act_123456789",
            campaignsCount: 12,
            metricsCount: 84,
            success: true,
            duration: 2450,
            timestamp: new Date(Date.now() - 30 * 60 * 1000),
          },
          {
            platform: "google",
            accountId: "1234567890",
            campaignsCount: 8,
            metricsCount: 56,
            success: true,
            duration: 1890,
            timestamp: new Date(Date.now() - 30 * 60 * 1000),
          },
        ]);

        setStatistics({
          totalSyncs: 48,
          successRate: 95,
          totalCampaigns: 240,
          totalMetrics: 1680,
          averageDuration: 2170,
          platforms: {
            meta: { syncs: 24, success: 23, campaigns: 120, metrics: 840 },
            google: { syncs: 24, success: 23, campaigns: 120, metrics: 840 },
          },
        });

        setLastSyncStatus({
          lastSync: {
            platform: "google",
            accountId: "1234567890",
            campaignsCount: 8,
            metricsCount: 56,
            success: true,
            duration: 1890,
            timestamp: new Date(Date.now() - 30 * 60 * 1000),
          },
          allSuccessful: true,
          totalDuration: 4340,
          averageDuration: 2170,
        });

        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Erro ao carregar dados de sincronização:", error);
      setIsLoading(false);
    }
  };

  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
      // Em produção, chamar a API
      // await trpc.sync.syncNow.mutate();

      // Simular sincronização
      setTimeout(() => {
        setIsSyncing(false);
        loadSyncData();
      }, 3000);
    } catch (error) {
      console.error("Erro ao sincronizar:", error);
      setIsSyncing(false);
    }
  };

  if (isLoading && !statistics) {
    return (
      <PortalLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Monitor de Sincronização</h2>
            <p className="text-slate-400">
              Acompanhe a sincronização automática de Meta Ads e Google Ads
            </p>
          </div>
          <Button
            onClick={handleManualSync}
            disabled={isSyncing}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSyncing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sincronizando...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Sincronizar Agora
              </>
            )}
          </Button>
        </div>

        {/* Status da Última Sincronização */}
        {lastSyncStatus && (
          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Última Sincronização</h3>
              {lastSyncStatus.allSuccessful ? (
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">Sucesso</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-400">
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">Com Erros</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-700/30 rounded-lg p-4">
                <p className="text-slate-400 text-sm mb-1">Plataforma</p>
                <p className="text-white font-bold text-lg">
                  {lastSyncStatus.lastSync.platform === "meta" ? "Meta Ads" : "Google Ads"}
                </p>
              </div>
              <div className="bg-slate-700/30 rounded-lg p-4">
                <p className="text-slate-400 text-sm mb-1">Campanhas</p>
                <p className="text-white font-bold text-lg">
                  {lastSyncStatus.lastSync.campaignsCount}
                </p>
              </div>
              <div className="bg-slate-700/30 rounded-lg p-4">
                <p className="text-slate-400 text-sm mb-1">Métricas</p>
                <p className="text-white font-bold text-lg">
                  {lastSyncStatus.lastSync.metricsCount}
                </p>
              </div>
              <div className="bg-slate-700/30 rounded-lg p-4">
                <p className="text-slate-400 text-sm mb-1">Duração</p>
                <p className="text-white font-bold text-lg">
                  {lastSyncStatus.lastSync.duration}ms
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Estatísticas Gerais */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Taxa de Sucesso</p>
                  <p className="text-white font-bold text-2xl">{statistics.successRate}%</p>
                </div>
                <Activity className="w-8 h-8 text-green-400 opacity-50" />
              </div>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Total de Campanhas</p>
                  <p className="text-white font-bold text-2xl">
                    {statistics.totalCampaigns}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-400 opacity-50" />
              </div>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Total de Métricas</p>
                  <p className="text-white font-bold text-2xl">{statistics.totalMetrics}</p>
                </div>
                <Activity className="w-8 h-8 text-purple-400 opacity-50" />
              </div>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Duração Média</p>
                  <p className="text-white font-bold text-2xl">
                    {Math.round(statistics.averageDuration / 1000)}s
                  </p>
                </div>
                <Clock className="w-8 h-8 text-orange-400 opacity-50" />
              </div>
            </Card>
          </div>
        )}

        {/* Estatísticas por Plataforma */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Meta Ads */}
            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full" />
                Meta Ads
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Sincronizações</span>
                  <span className="text-white font-bold">
                    {statistics.platforms.meta.syncs}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Sucesso</span>
                  <span className="text-green-400 font-bold">
                    {statistics.platforms.meta.success}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Campanhas</span>
                  <span className="text-white font-bold">
                    {statistics.platforms.meta.campaigns}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Métricas</span>
                  <span className="text-white font-bold">
                    {statistics.platforms.meta.metrics}
                  </span>
                </div>
              </div>
            </Card>

            {/* Google Ads */}
            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                Google Ads
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Sincronizações</span>
                  <span className="text-white font-bold">
                    {statistics.platforms.google.syncs}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Sucesso</span>
                  <span className="text-green-400 font-bold">
                    {statistics.platforms.google.success}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Campanhas</span>
                  <span className="text-white font-bold">
                    {statistics.platforms.google.campaigns}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Métricas</span>
                  <span className="text-white font-bold">
                    {statistics.platforms.google.metrics}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Histórico de Sincronizações */}
        {syncHistory.length > 0 && (
          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Histórico Recente</h3>
            <div className="space-y-3">
              {syncHistory.map((sync, index) => (
                <div
                  key={index}
                  className="p-4 bg-slate-700/30 rounded-lg border border-slate-700 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    {sync.success ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-400" />
                    )}
                    <div>
                      <p className="text-white font-medium">
                        {sync.platform === "meta" ? "Meta Ads" : "Google Ads"} -{" "}
                        {sync.accountId}
                      </p>
                      <p className="text-sm text-slate-400">
                        {sync.campaignsCount} campanhas, {sync.metricsCount} métricas
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium">{sync.duration}ms</p>
                    <p className="text-sm text-slate-400">
                      {new Date(sync.timestamp).toLocaleTimeString("pt-BR")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Informações de Agendamento */}
        <Card className="bg-blue-500/10 border-blue-500/30 p-6">
          <h3 className="text-lg font-bold text-blue-400 mb-3">Agendamento Automático</h3>
          <div className="space-y-2 text-slate-300">
            <p>✓ Sincronização automática: A cada 30 minutos</p>
            <p>✓ Próxima sincronização: {new Date(Date.now() + 30 * 60 * 1000).toLocaleTimeString("pt-BR")}</p>
            <p>✓ Plataformas: Meta Ads e Google Ads</p>
            <p>✓ Período de dados: Últimos 7 dias</p>
            <p>✓ Retry automático: Sim (até 3 tentativas)</p>
          </div>
        </Card>
      </div>
    </PortalLayout>
  );
}
