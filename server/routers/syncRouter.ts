import { publicProcedure, router } from "../_core/trpc";
import { IntegrationSyncManager } from "../jobs/syncIntegrations";
import { TRPCError } from "@trpc/server";

/**
 * Router para gerenciar sincronizações de integrações
 */
export const syncRouter = router({
  /**
   * Executa uma sincronização manual de todas as integrações
   */
  syncNow: publicProcedure.mutation(async () => {
    try {
      const manager = new IntegrationSyncManager();
      await manager.syncAll();

      return {
        success: true,
        message: "Sincronização iniciada com sucesso",
      };
    } catch (error) {
      console.error("[Sync Router] Erro ao sincronizar:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Falha ao iniciar sincronização",
      });
    }
  }),

  /**
   * Obtém o histórico de sincronizações
   */
  getHistory: publicProcedure.query(() => {
    try {
      const manager = new IntegrationSyncManager();
      const history = manager.getSyncHistory();

      return {
        success: true,
        history,
        totalSyncs: history.length,
        successCount: history.filter((h) => h.success).length,
        errorCount: history.filter((h) => !h.success).length,
      };
    } catch (error) {
      console.error("[Sync Router] Erro ao obter histórico:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Falha ao obter histórico de sincronizações",
      });
    }
  }),

  /**
   * Obtém o status da última sincronização
   */
  getLastSyncStatus: publicProcedure.query(() => {
    try {
      const manager = new IntegrationSyncManager();
      const history = manager.getSyncHistory();

      if (history.length === 0) {
        return {
          success: true,
          lastSync: null,
          message: "Nenhuma sincronização realizada ainda",
        };
      }

      const lastSync = history[history.length - 1];
      const allSuccessful = history.every((h) => h.success);

      return {
        success: true,
        lastSync,
        allSuccessful,
        totalDuration: history.reduce((sum, h) => sum + h.duration, 0),
        averageDuration: Math.round(
          history.reduce((sum, h) => sum + h.duration, 0) / history.length
        ),
      };
    } catch (error) {
      console.error("[Sync Router] Erro ao obter status:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Falha ao obter status de sincronização",
      });
    }
  }),

  /**
   * Limpa o histórico de sincronizações
   */
  clearHistory: publicProcedure.mutation(() => {
    try {
      const manager = new IntegrationSyncManager();
      manager.clearSyncHistory();

      return {
        success: true,
        message: "Histórico de sincronizações limpo com sucesso",
      };
    } catch (error) {
      console.error("[Sync Router] Erro ao limpar histórico:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Falha ao limpar histórico",
      });
    }
  }),

  /**
   * Obtém estatísticas de sincronização
   */
  getStatistics: publicProcedure.query(() => {
    try {
      const manager = new IntegrationSyncManager();
      const history = manager.getSyncHistory();

      if (history.length === 0) {
        return {
          success: true,
          totalSyncs: 0,
          successRate: 0,
          totalCampaigns: 0,
          totalMetrics: 0,
          averageDuration: 0,
          platforms: {
            meta: { syncs: 0, success: 0, campaigns: 0, metrics: 0 },
            google: { syncs: 0, success: 0, campaigns: 0, metrics: 0 },
          },
        };
      }

      const totalSyncs = history.length;
      const successCount = history.filter((h) => h.success).length;
      const successRate = Math.round((successCount / totalSyncs) * 100);
      const totalCampaigns = history.reduce((sum, h) => sum + h.campaignsCount, 0);
      const totalMetrics = history.reduce((sum, h) => sum + h.metricsCount, 0);
      const averageDuration = Math.round(
        history.reduce((sum, h) => sum + h.duration, 0) / totalSyncs
      );

      // Estatísticas por plataforma
      const metaSyncs = history.filter((h) => h.platform === "meta");
      const googleSyncs = history.filter((h) => h.platform === "google");

      return {
        success: true,
        totalSyncs,
        successRate,
        totalCampaigns,
        totalMetrics,
        averageDuration,
        platforms: {
          meta: {
            syncs: metaSyncs.length,
            success: metaSyncs.filter((h) => h.success).length,
            campaigns: metaSyncs.reduce((sum, h) => sum + h.campaignsCount, 0),
            metrics: metaSyncs.reduce((sum, h) => sum + h.metricsCount, 0),
          },
          google: {
            syncs: googleSyncs.length,
            success: googleSyncs.filter((h) => h.success).length,
            campaigns: googleSyncs.reduce((sum, h) => sum + h.campaignsCount, 0),
            metrics: googleSyncs.reduce((sum, h) => sum + h.metricsCount, 0),
          },
        },
      };
    } catch (error) {
      console.error("[Sync Router] Erro ao obter estatísticas:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Falha ao obter estatísticas",
      });
    }
  }),
});
