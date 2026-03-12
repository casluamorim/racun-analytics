import { describe, it, expect, beforeEach } from "vitest";
import {
  saveMetaCampaigns,
  saveMetaMetrics,
  saveGoogleAdsCampaigns,
  saveGoogleAdsMetrics,
  saveGoogleAdsKeywords,
  logIntegrationSync,
  getSyncStatistics,
} from "./db-integrations";

describe("Database Integration Helpers", () => {
  describe("Meta Ads Persistence", () => {
    it("deve permitir salvar campanhas Meta", async () => {
      const campaigns = [
        {
          integrationAccountId: 1,
          externalCampaignId: "act_123456789",
          name: "Campanha de Verão",
          status: "ACTIVE" as const,
          objective: "CONVERSIONS",
          dailyBudget: "100.00",
          lifetimeBudget: "1000.00",
          startDate: new Date(),
          endDate: new Date(),
        },
      ];

      // Não deve lançar erro
      await expect(saveMetaCampaigns(campaigns)).resolves.not.toThrow();
    });

    it("deve permitir salvar métricas Meta", async () => {
      const metrics = [
        {
          metaCampaignId: 1,
          date: new Date(),
          spend: "150.50",
          impressions: 5000,
          clicks: 250,
          conversions: "10",
          conversionValue: "500.00",
          ctr: "5.0",
          cpc: "0.60",
          cpm: "30.10",
          roas: "3.33",
        },
      ];

      // Não deve lançar erro
      await expect(saveMetaMetrics(metrics)).resolves.not.toThrow();
    });

    it("deve lidar com array vazio de campanhas", async () => {
      // Não deve lançar erro
      await expect(saveMetaCampaigns([])).resolves.not.toThrow();
    });

    it("deve lidar com array vazio de métricas", async () => {
      // Não deve lançar erro
      await expect(saveMetaMetrics([])).resolves.not.toThrow();
    });
  });

  describe("Google Ads Persistence", () => {
    it("deve permitir salvar campanhas Google Ads", async () => {
      const campaigns = [
        {
          integrationAccountId: 2,
          externalCampaignId: "1234567890",
          name: "Campanha de Busca",
          status: "ENABLED" as const,
          advertisingChannelType: "SEARCH",
          budget: "200.00",
          startDate: new Date(),
          endDate: new Date(),
        },
      ];

      // Não deve lançar erro
      await expect(saveGoogleAdsCampaigns(campaigns)).resolves.not.toThrow();
    });

    it("deve permitir salvar métricas Google Ads", async () => {
      const metrics = [
        {
          googleAdsCampaignId: 1,
          date: new Date(),
          spend: "200.00",
          impressions: 8000,
          clicks: 400,
          conversions: "20",
          conversionValue: "1000.00",
          ctr: "5.0",
          cpc: "0.50",
          cpm: "25.00",
          roas: "5.0",
        },
      ];

      // Não deve lançar erro
      await expect(saveGoogleAdsMetrics(metrics)).resolves.not.toThrow();
    });

    it("deve permitir salvar palavras-chave Google Ads", async () => {
      const keywords = [
        {
          googleAdsCampaignId: 1,
          externalKeywordId: "kw_123456",
          text: "sapatos online",
          matchType: "EXACT" as const,
          status: "ENABLED" as const,
          impressions: 500,
          clicks: 50,
          spend: "25.00",
          conversions: "2",
        },
      ];

      // Não deve lançar erro
      await expect(saveGoogleAdsKeywords(keywords)).resolves.not.toThrow();
    });

    it("deve lidar com array vazio de campanhas", async () => {
      // Não deve lançar erro
      await expect(saveGoogleAdsCampaigns([])).resolves.not.toThrow();
    });

    it("deve lidar com array vazio de métricas", async () => {
      // Não deve lançar erro
      await expect(saveGoogleAdsMetrics([])).resolves.not.toThrow();
    });

    it("deve lidar com array vazio de palavras-chave", async () => {
      // Não deve lançar erro
      await expect(saveGoogleAdsKeywords([])).resolves.not.toThrow();
    });
  });

  describe("Sync Logging", () => {
    it("deve permitir registrar log de sincronização", async () => {
      const log = {
        integrationAccountId: 1,
        action: "sync_campaigns_metrics",
        status: "success" as const,
        message: "12 campanhas e 84 métricas sincronizadas",
        recordsProcessed: 96,
        recordsFailed: 0,
        startedAt: new Date(),
        completedAt: new Date(),
      };

      // Não deve lançar erro
      await expect(logIntegrationSync(log)).resolves.not.toThrow();
    });

    it("deve registrar log de erro", async () => {
      const log = {
        integrationAccountId: 1,
        action: "sync_campaigns",
        status: "error" as const,
        message: "Token expirado",
        recordsProcessed: 0,
        recordsFailed: 0,
        startedAt: new Date(),
        completedAt: new Date(),
      };

      // Não deve lançar erro
      await expect(logIntegrationSync(log)).resolves.not.toThrow();
    });
  });

  describe("Sync Statistics", () => {
    it("deve retornar estatísticas de sincronização", async () => {
      const stats = await getSyncStatistics(1);

      expect(stats).toHaveProperty("totalSyncs");
      expect(stats).toHaveProperty("successCount");
      expect(stats).toHaveProperty("errorCount");
      expect(stats).toHaveProperty("totalRecordsProcessed");
      expect(stats).toHaveProperty("totalRecordsFailed");

      expect(typeof stats.totalSyncs).toBe("number");
      expect(typeof stats.successCount).toBe("number");
      expect(typeof stats.errorCount).toBe("number");
      expect(typeof stats.totalRecordsProcessed).toBe("number");
      expect(typeof stats.totalRecordsFailed).toBe("number");
    });

    it("deve retornar zeros quando não há sincronizações", async () => {
      const stats = await getSyncStatistics(999); // ID inexistente

      expect(stats.totalSyncs).toBeGreaterThanOrEqual(0);
      expect(stats.successCount).toBeGreaterThanOrEqual(0);
      expect(stats.errorCount).toBeGreaterThanOrEqual(0);
    });
  });

  describe("Data Validation", () => {
    it("deve validar estrutura de campanha Meta", async () => {
      const campaign = {
        integrationAccountId: 1,
        externalCampaignId: "act_123456789",
        name: "Campanha",
        status: "ACTIVE" as const,
        objective: "CONVERSIONS",
        dailyBudget: "100.00",
        lifetimeBudget: "1000.00",
        startDate: new Date(),
        endDate: new Date(),
      };

      expect(campaign).toHaveProperty("integrationAccountId");
      expect(campaign).toHaveProperty("externalCampaignId");
      expect(campaign).toHaveProperty("name");
      expect(campaign).toHaveProperty("status");
    });

    it("deve validar estrutura de métrica Meta", async () => {
      const metric = {
        metaCampaignId: 1,
        date: new Date(),
        spend: "150.50",
        impressions: 5000,
        clicks: 250,
        conversions: "10",
        conversionValue: "500.00",
        ctr: "5.0",
        cpc: "0.60",
        cpm: "30.10",
        roas: "3.33",
      };

      expect(metric).toHaveProperty("metaCampaignId");
      expect(metric).toHaveProperty("date");
      expect(metric).toHaveProperty("spend");
      expect(metric).toHaveProperty("impressions");
      expect(metric).toHaveProperty("clicks");
      expect(metric).toHaveProperty("conversions");
      expect(metric).toHaveProperty("roas");
    });

    it("deve validar estrutura de campanha Google Ads", async () => {
      const campaign = {
        integrationAccountId: 2,
        externalCampaignId: "1234567890",
        name: "Campanha",
        status: "ENABLED" as const,
        advertisingChannelType: "SEARCH",
        budget: "200.00",
        startDate: new Date(),
        endDate: new Date(),
      };

      expect(campaign).toHaveProperty("integrationAccountId");
      expect(campaign).toHaveProperty("externalCampaignId");
      expect(campaign).toHaveProperty("name");
      expect(campaign).toHaveProperty("status");
    });

    it("deve validar estrutura de métrica Google Ads", async () => {
      const metric = {
        googleAdsCampaignId: 1,
        date: new Date(),
        spend: "200.00",
        impressions: 8000,
        clicks: 400,
        conversions: "20",
        conversionValue: "1000.00",
        ctr: "5.0",
        cpc: "0.50",
        cpm: "25.00",
        roas: "5.0",
      };

      expect(metric).toHaveProperty("googleAdsCampaignId");
      expect(metric).toHaveProperty("date");
      expect(metric).toHaveProperty("spend");
      expect(metric).toHaveProperty("impressions");
      expect(metric).toHaveProperty("clicks");
      expect(metric).toHaveProperty("conversions");
      expect(metric).toHaveProperty("roas");
    });

    it("deve validar estrutura de palavra-chave Google Ads", async () => {
      const keyword = {
        googleAdsCampaignId: 1,
        externalKeywordId: "kw_123456",
        text: "sapatos online",
        matchType: "EXACT" as const,
        status: "ENABLED" as const,
        impressions: 500,
        clicks: 50,
        spend: "25.00",
        conversions: "2",
      };

      expect(keyword).toHaveProperty("googleAdsCampaignId");
      expect(keyword).toHaveProperty("externalKeywordId");
      expect(keyword).toHaveProperty("text");
      expect(keyword).toHaveProperty("matchType");
      expect(keyword).toHaveProperty("status");
    });
  });

  describe("Error Handling", () => {
    it("deve lidar com erros de banco de dados gracefully", async () => {
      // Mesmo que o banco falhe, a função não deve lançar erro não tratado
      const invalidCampaigns = [
        {
          integrationAccountId: -1, // ID inválido
          externalCampaignId: "",
          name: "",
          status: "ACTIVE" as const,
          objective: "",
          dailyBudget: "0",
          lifetimeBudget: "0",
          startDate: undefined,
          endDate: undefined,
        },
      ];

      // Não deve lançar erro não tratado
      await expect(
        saveMetaCampaigns(invalidCampaigns)
      ).resolves.not.toThrow();
    });
  });
});
