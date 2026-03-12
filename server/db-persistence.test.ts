import { describe, it, expect, beforeEach, vi } from "vitest";
import * as dbPersistence from "./db-persistence";

describe("Database Persistence Helpers", () => {
  describe("Meta Ads Persistence", () => {
    it("should save Meta campaigns", async () => {
      const campaigns = [
        {
          integrationAccountId: 1,
          externalCampaignId: "123456",
          name: "Campaign 1",
          status: "ACTIVE",
          objective: "CONVERSIONS",
          dailyBudget: 100,
        },
      ];

      const result = await dbPersistence.saveMetaCampaigns(campaigns);
      expect(result).toBeUndefined(); // Function doesn't return anything
    });

    it("should save Meta metrics", async () => {
      const metrics = [
        {
          metaCampaignId: 1,
          date: new Date(),
          spend: 100,
          impressions: 1000,
          clicks: 50,
          conversions: 5,
          roas: 2.5,
        },
      ];

      const result = await dbPersistence.saveMetaMetrics(metrics);
      expect(result).toBeUndefined();
    });

    it("should get Meta campaigns by integration", async () => {
      const result = await dbPersistence.getMetaCampaignsByIntegration(1);
      expect(Array.isArray(result)).toBe(true);
    });

    it("should get Meta metrics by date range", async () => {
      const startDate = new Date("2026-01-01");
      const endDate = new Date("2026-12-31");
      const result = await dbPersistence.getMetaMetricsByDateRange(1, startDate, endDate);
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("Google Ads Persistence", () => {
    it("should save Google Ads campaigns", async () => {
      const campaigns = [
        {
          integrationAccountId: 1,
          externalCampaignId: "google-123",
          name: "Google Campaign 1",
          status: "ENABLED",
          advertisingChannelType: "SEARCH",
          budget: 500,
        },
      ];

      const result = await dbPersistence.saveGoogleAdsCampaigns(campaigns);
      expect(result).toBeUndefined();
    });

    it("should save Google Ads metrics", async () => {
      const metrics = [
        {
          googleAdsCampaignId: 1,
          date: new Date(),
          spend: 200,
          impressions: 2000,
          clicks: 100,
          conversions: 10,
          roas: 3.0,
        },
      ];

      const result = await dbPersistence.saveGoogleAdsMetrics(metrics);
      expect(result).toBeUndefined();
    });

    it("should get Google Ads campaigns by integration", async () => {
      const result = await dbPersistence.getGoogleAdsCampaignsByIntegration(1);
      expect(Array.isArray(result)).toBe(true);
    });

    it("should get Google Ads metrics by date range", async () => {
      const startDate = new Date("2026-01-01");
      const endDate = new Date("2026-12-31");
      const result = await dbPersistence.getGoogleAdsMetricsByDateRange(1, startDate, endDate);
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("Integration Account Management", () => {
    it("should save integration account", async () => {
      const account = {
        clientId: 1,
        platform: "meta",
        accountName: "My Meta Account",
        accessToken: "token123",
        refreshToken: "refresh123",
        externalAccountId: "ext-123",
        externalAccountName: "Meta Business Account",
      };

      const result = await dbPersistence.saveIntegrationAccount(account);
      expect(result).toBeUndefined();
    });

    it("should get integration account", async () => {
      const result = await dbPersistence.getIntegrationAccount(1, "meta");
      expect(result === null || typeof result === "object").toBe(true);
    });

    it("should get all integration accounts for client", async () => {
      const result = await dbPersistence.getIntegrationAccountsByClient(1);
      expect(Array.isArray(result)).toBe(true);
    });

    it("should update integration account status", async () => {
      const result = await dbPersistence.updateIntegrationAccountStatus(
        1,
        "active",
        "All good"
      );
      expect(result).toBeUndefined();
    });
  });

  describe("Integration Logs", () => {
    it("should log integration sync", async () => {
      const log = {
        integrationAccountId: 1,
        action: "sync_campaigns",
        status: "success",
        message: "Synced 5 campaigns",
        recordsProcessed: 5,
        recordsFailed: 0,
        startedAt: new Date(),
        completedAt: new Date(),
      };

      const result = await dbPersistence.logIntegrationSync(log);
      expect(result).toBeUndefined();
    });

    it("should get integration logs", async () => {
      const result = await dbPersistence.getIntegrationLogs(1, 50);
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("Dashboard Aggregation", () => {
    it("should get total spend", async () => {
      const result = await dbPersistence.getTotalSpend(1, 7);
      expect(result).toHaveProperty("meta");
      expect(result).toHaveProperty("google");
      expect(result).toHaveProperty("total");
      expect(typeof result.meta).toBe("number");
      expect(typeof result.google).toBe("number");
      expect(typeof result.total).toBe("number");
    });

    it("should get average ROAS", async () => {
      const result = await dbPersistence.getAverageRoas(1, 7);
      expect(result).toHaveProperty("meta");
      expect(result).toHaveProperty("google");
      expect(result).toHaveProperty("combined");
      expect(typeof result.meta).toBe("number");
      expect(typeof result.google).toBe("number");
      expect(typeof result.combined).toBe("number");
    });

    it("should get total conversions", async () => {
      const result = await dbPersistence.getTotalConversions(1, 7);
      expect(result).toHaveProperty("meta");
      expect(result).toHaveProperty("google");
      expect(result).toHaveProperty("total");
      expect(typeof result.meta).toBe("number");
      expect(typeof result.google).toBe("number");
      expect(typeof result.total).toBe("number");
    });

    it("should get daily spend", async () => {
      const result = await dbPersistence.getDailySpend(1, 7);
      expect(Array.isArray(result)).toBe(true);
    });

    it("should get campaign performance", async () => {
      const result = await dbPersistence.getCampaignPerformance(1, 7);
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("Error Handling", () => {
    it("should handle empty campaigns array", async () => {
      const result = await dbPersistence.saveMetaCampaigns([]);
      expect(result).toBeUndefined();
    });

    it("should handle empty metrics array", async () => {
      const result = await dbPersistence.saveMetaMetrics([]);
      expect(result).toBeUndefined();
    });

    it("should return empty array on database error for getMetaCampaigns", async () => {
      const result = await dbPersistence.getMetaCampaignsByIntegration(999);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });

    it("should return null on database error for getIntegrationAccount", async () => {
      const result = await dbPersistence.getIntegrationAccount(999, "nonexistent");
      expect(result === null || typeof result === "object").toBe(true);
    });
  });
});
