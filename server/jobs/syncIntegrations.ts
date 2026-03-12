import { CronJob } from "cron";
import MetaAdsService from "../services/metaAdsService";
import GoogleAdsService from "../services/googleAdsService";
import { getDb } from "../db";
import { format } from "date-fns";

/**
 * Tipos de integração suportadas
 */
type IntegrationPlatform = "meta" | "google";

interface SyncResult {
  platform: IntegrationPlatform;
  accountId: string;
  campaignsCount: number;
  metricsCount: number;
  success: boolean;
  error?: string;
  duration: number;
  timestamp: Date;
}

/**
 * Classe para gerenciar sincronização de integrações
 */
export class IntegrationSyncManager {
  private syncResults: SyncResult[] = [];
  private isRunning = false;

  /**
   * Inicia o job scheduler para sincronizar integrações
   * Executa a cada 30 minutos
   */
  static startScheduler(): CronJob {
    console.log("[IntegrationSync] Iniciando scheduler de sincronização...");

    // Executa a cada 30 minutos (*/30 * * * *)
    const job = new CronJob("*/30 * * * *", async () => {
      const manager = new IntegrationSyncManager();
      await manager.syncAll();
    });

    job.start();
    console.log("[IntegrationSync] Scheduler iniciado com sucesso");

    return job;
  }

  /**
   * Sincroniza todas as integrações ativas
   */
  async syncAll(): Promise<void> {
    if (this.isRunning) {
      console.log("[IntegrationSync] Sincronização já em andamento, pulando execução");
      return;
    }

    this.isRunning = true;
    const startTime = Date.now();

    try {
      console.log(`[IntegrationSync] Iniciando sincronização em ${new Date().toISOString()}`);

      // Sincronizar Meta Ads
      await this.syncMetaAds();

      // Sincronizar Google Ads
      await this.syncGoogleAds();

      const duration = Date.now() - startTime;
      console.log(
        `[IntegrationSync] Sincronização concluída em ${duration}ms. Total de contas: ${this.syncResults.length}`
      );

      // Log de resumo
      this.logSyncSummary();
    } catch (error) {
      console.error("[IntegrationSync] Erro durante sincronização:", error);
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Sincroniza todas as contas Meta Ads
   */
  private async syncMetaAds(): Promise<void> {
    console.log("[IntegrationSync] Iniciando sincronização Meta Ads...");

    try {
      // Em produção, buscar do banco de dados
      // const integrations = await db.select().from(integrationAccounts)
      //   .where(eq(integrationAccounts.platform, 'meta'))
      //   .where(eq(integrationAccounts.isActive, true));

      // Para demonstração, simular uma conta
      const mockAccounts = [
        {
          id: 1,
          platform: "meta" as const,
          accessToken: "mock_token_meta",
          externalAccountId: "act_123456789",
          accountName: "Conta Meta Demo",
        },
      ];

      for (const account of mockAccounts) {
        await this.syncMetaAccount(account);
      }
    } catch (error) {
      console.error("[IntegrationSync] Erro ao sincronizar Meta Ads:", error);
    }
  }

  /**
   * Sincroniza uma conta Meta específica
   */
  private async syncMetaAccount(account: any): Promise<void> {
    const startTime = Date.now();

    try {
      console.log(
        `[IntegrationSync] Sincronizando conta Meta: ${account.accountName} (${account.externalAccountId})`
      );

      const metaService = new MetaAdsService(
        account.accessToken,
        account.externalAccountId
      );

      // Validar token
      const isValid = await metaService.validateToken();
      if (!isValid) {
        throw new Error("Token inválido ou expirado");
      }

      // Sincronizar campanhas
      const campaigns = await metaService.syncCampaigns();
      console.log(
        `[IntegrationSync] ${campaigns.length} campanhas sincronizadas do Meta`
      );

      // Sincronizar métricas dos últimos 7 dias
      const endDate = format(new Date(), "yyyy-MM-dd");
      const startDate = format(
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        "yyyy-MM-dd"
      );

      let metricsCount = 0;

      for (const campaign of campaigns) {
        try {
          const metrics = await metaService.getCampaignMetrics(
            campaign.id,
            startDate,
            endDate
          );

          metricsCount += metrics.length;

          // Em produção, salvar métricas no banco
          // await db.insert(metaMetrics).values(
          //   metrics.map(m => ({
          //     metaCampaignId: campaign.id,
          //     date: new Date(m.date_start),
          //     spend: parseFloat(m.spend),
          //     ...
          //   }))
          // );
        } catch (error) {
          console.warn(
            `[IntegrationSync] Erro ao sincronizar métricas da campanha ${campaign.id}:`,
            error
          );
        }
      }

      const duration = Date.now() - startTime;

      this.syncResults.push({
        platform: "meta",
        accountId: account.externalAccountId,
        campaignsCount: campaigns.length,
        metricsCount,
        success: true,
        duration,
        timestamp: new Date(),
      });

      console.log(
        `[IntegrationSync] Meta ${account.accountName} sincronizado com sucesso em ${duration}ms`
      );
    } catch (error) {
      const duration = Date.now() - startTime;

      this.syncResults.push({
        platform: "meta",
        accountId: account.externalAccountId,
        campaignsCount: 0,
        metricsCount: 0,
        success: false,
        error: error instanceof Error ? error.message : String(error),
        duration,
        timestamp: new Date(),
      });

      console.error(
        `[IntegrationSync] Erro ao sincronizar Meta ${account.accountName}:`,
        error
      );
    }
  }

  /**
   * Sincroniza todas as contas Google Ads
   */
  private async syncGoogleAds(): Promise<void> {
    console.log("[IntegrationSync] Iniciando sincronização Google Ads...");

    try {
      // Em produção, buscar do banco de dados
      // const integrations = await db.select().from(integrationAccounts)
      //   .where(eq(integrationAccounts.platform, 'google'))
      //   .where(eq(integrationAccounts.isActive, true));

      // Para demonstração, simular uma conta
      const mockAccounts = [
        {
          id: 2,
          platform: "google" as const,
          accessToken: "mock_token_google",
          externalAccountId: "1234567890",
          accountName: "Conta Google Ads Demo",
        },
      ];

      for (const account of mockAccounts) {
        await this.syncGoogleAccount(account);
      }
    } catch (error) {
      console.error("[IntegrationSync] Erro ao sincronizar Google Ads:", error);
    }
  }

  /**
   * Sincroniza uma conta Google Ads específica
   */
  private async syncGoogleAccount(account: any): Promise<void> {
    const startTime = Date.now();

    try {
      console.log(
        `[IntegrationSync] Sincronizando conta Google: ${account.accountName} (${account.externalAccountId})`
      );

      const googleService = new GoogleAdsService(
        account.accessToken,
        account.externalAccountId
      );

      // Validar token
      const isValid = await googleService.validateToken();
      if (!isValid) {
        throw new Error("Token inválido ou expirado");
      }

      // Sincronizar campanhas
      const campaigns = await googleService.syncCampaigns();
      console.log(
        `[IntegrationSync] ${campaigns.length} campanhas sincronizadas do Google`
      );

      // Sincronizar métricas dos últimos 7 dias
      const endDate = format(new Date(), "yyyy-MM-dd");
      const startDate = format(
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        "yyyy-MM-dd"
      );

      let metricsCount = 0;

      for (const campaign of campaigns) {
        try {
          const metrics = await googleService.getCampaignMetrics(
            campaign.id,
            startDate,
            endDate
          );

          metricsCount += metrics.length;

          // Em produção, salvar métricas no banco
          // await db.insert(googleAdsMetrics).values(
          //   metrics.map(m => ({
          //     googleAdsCampaignId: campaign.id,
          //     date: new Date(m.segments.date),
          //     spend: GoogleAdsService.convertMicrosToUnits(m.metrics.costMicros),
          //     ...
          //   }))
          // );
        } catch (error) {
          console.warn(
            `[IntegrationSync] Erro ao sincronizar métricas da campanha ${campaign.id}:`,
            error
          );
        }
      }

      const duration = Date.now() - startTime;

      this.syncResults.push({
        platform: "google",
        accountId: account.externalAccountId,
        campaignsCount: campaigns.length,
        metricsCount,
        success: true,
        duration,
        timestamp: new Date(),
      });

      console.log(
        `[IntegrationSync] Google ${account.accountName} sincronizado com sucesso em ${duration}ms`
      );
    } catch (error) {
      const duration = Date.now() - startTime;

      this.syncResults.push({
        platform: "google",
        accountId: account.externalAccountId,
        campaignsCount: 0,
        metricsCount: 0,
        success: false,
        error: error instanceof Error ? error.message : String(error),
        duration,
        timestamp: new Date(),
      });

      console.error(
        `[IntegrationSync] Erro ao sincronizar Google ${account.accountName}:`,
        error
      );
    }
  }

  /**
   * Log de resumo da sincronização
   */
  private logSyncSummary(): void {
    const successCount = this.syncResults.filter((r) => r.success).length;
    const errorCount = this.syncResults.filter((r) => !r.success).length;
    const totalCampaigns = this.syncResults.reduce((sum, r) => sum + r.campaignsCount, 0);
    const totalMetrics = this.syncResults.reduce((sum, r) => sum + r.metricsCount, 0);
    const totalDuration = this.syncResults.reduce((sum, r) => sum + r.duration, 0);

    console.log("\n=== RESUMO DA SINCRONIZAÇÃO ===");
    console.log(`✓ Sucesso: ${successCount}`);
    console.log(`✗ Erros: ${errorCount}`);
    console.log(`📊 Campanhas sincronizadas: ${totalCampaigns}`);
    console.log(`📈 Métricas sincronizadas: ${totalMetrics}`);
    console.log(`⏱️  Tempo total: ${totalDuration}ms`);
    console.log("==============================\n");

    // Log detalhado de cada conta
    this.syncResults.forEach((result) => {
      const status = result.success ? "✓" : "✗";
      console.log(
        `${status} ${result.platform.toUpperCase()} - ${result.accountId}: ${result.campaignsCount} campanhas, ${result.metricsCount} métricas (${result.duration}ms)`
      );
    });
  }

  /**
   * Obtém o histórico de sincronizações
   */
  getSyncHistory(): SyncResult[] {
    return this.syncResults;
  }

  /**
   * Limpa o histórico de sincronizações
   */
  clearSyncHistory(): void {
    this.syncResults = [];
  }
}

/**
 * Inicializa o scheduler na inicialização da aplicação
 */
export function initializeIntegrationSync(): void {
  try {
    IntegrationSyncManager.startScheduler();
  } catch (error) {
    console.error("[IntegrationSync] Erro ao inicializar scheduler:", error);
  }
}
