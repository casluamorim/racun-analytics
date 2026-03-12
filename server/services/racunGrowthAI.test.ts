import { describe, it, expect, beforeEach, vi } from "vitest";
import * as racunAI from "./racunGrowthAI";

describe("Racun Growth AI - 5 Analistas Especializados", () => {
  const mockAnalysisRequest: racunAI.AIAnalysisRequest = {
    clientId: 1,
    metaMetrics: {
      spend: 5000,
      impressions: 100000,
      clicks: 5000,
      conversions: 250,
      roas: 2.5,
      ctr: 5.0,
      cpc: 1.0,
      cpm: 50,
    },
    googleMetrics: {
      spend: 3000,
      impressions: 80000,
      clicks: 4000,
      conversions: 200,
      roas: 3.0,
      ctr: 5.0,
      cpc: 0.75,
      cpm: 37.5,
    },
    crmMetrics: {
      totalLeads: 450,
      convertedLeads: 45,
      conversionRate: 10,
      averageCycleTime: 15,
      leadsInFunnel: 200,
    },
    productMetrics: {
      totalProducts: 50,
      averageMargin: 35,
      lowMarginProducts: 5,
      topProduct: "Produto A",
      bottomProduct: "Produto Z",
    },
  };

  describe("Campaign AI", () => {
    it("should analyze campaigns and return structured analysis", async () => {
      const analysis = await racunAI.analyzeCampaigns(mockAnalysisRequest);

      expect(analysis).toBeDefined();
      expect(analysis.analyst).toBe("campaign");
      expect(analysis.title).toBeDefined();
      expect(analysis.summary).toBeDefined();
      expect(Array.isArray(analysis.insights)).toBe(true);
      expect(Array.isArray(analysis.recommendations)).toBe(true);
      expect(Array.isArray(analysis.alerts)).toBe(true);
      expect(analysis.timestamp).toBeInstanceOf(Date);
    });

    it("should have recommendations with impact and effort", async () => {
      const analysis = await racunAI.analyzeCampaigns(mockAnalysisRequest);

      if (analysis.recommendations.length > 0) {
        const rec = analysis.recommendations[0];
        expect(rec).toHaveProperty("action");
        expect(rec).toHaveProperty("impact");
        expect(rec).toHaveProperty("effort");
        expect(["high", "medium", "low"]).toContain(rec.impact);
        expect(["high", "medium", "low"]).toContain(rec.effort);
      }
    });

    it("should have alerts with type and message", async () => {
      const analysis = await racunAI.analyzeCampaigns(mockAnalysisRequest);

      if (analysis.alerts.length > 0) {
        const alert = analysis.alerts[0];
        expect(alert).toHaveProperty("type");
        expect(alert).toHaveProperty("message");
        expect(["warning", "critical", "info"]).toContain(alert.type);
      }
    });
  });

  describe("Sales AI", () => {
    it("should analyze sales and return structured analysis", async () => {
      const analysis = await racunAI.analyzeSales(mockAnalysisRequest);

      expect(analysis).toBeDefined();
      expect(analysis.analyst).toBe("sales");
      expect(analysis.title).toBeDefined();
      expect(analysis.summary).toBeDefined();
      expect(Array.isArray(analysis.insights)).toBe(true);
      expect(Array.isArray(analysis.recommendations)).toBe(true);
      expect(Array.isArray(analysis.alerts)).toBe(true);
    });

    it("should focus on conversion rate and funnel analysis", async () => {
      const analysis = await racunAI.analyzeSales(mockAnalysisRequest);

      expect(analysis.summary.toLowerCase()).toMatch(/convers|funil|venda|lead/);
    });
  });

  describe("Product & Pricing AI", () => {
    it("should analyze products and return structured analysis", async () => {
      const analysis = await racunAI.analyzeProducts(mockAnalysisRequest);

      expect(analysis).toBeDefined();
      expect(analysis.analyst).toBe("product");
      expect(analysis.title).toBeDefined();
      expect(analysis.summary).toBeDefined();
      expect(Array.isArray(analysis.insights)).toBe(true);
      expect(Array.isArray(analysis.recommendations)).toBe(true);
      expect(Array.isArray(analysis.alerts)).toBe(true);
    });

    it("should focus on margin and pricing analysis", async () => {
      const analysis = await racunAI.analyzeProducts(mockAnalysisRequest);

      expect(analysis.summary.toLowerCase()).toMatch(/margem|preço|produto|portfólio/);
    });
  });

  describe("CRM AI", () => {
    it("should analyze CRM and return structured analysis", async () => {
      const analysis = await racunAI.analyzeCRM(mockAnalysisRequest);

      expect(analysis).toBeDefined();
      expect(analysis.analyst).toBe("crm");
      expect(analysis.title).toBeDefined();
      expect(analysis.summary).toBeDefined();
      expect(Array.isArray(analysis.insights)).toBe(true);
      expect(Array.isArray(analysis.recommendations)).toBe(true);
      expect(Array.isArray(analysis.alerts)).toBe(true);
    });

    it("should focus on lead quality and funnel analysis", async () => {
      const analysis = await racunAI.analyzeCRM(mockAnalysisRequest);

      expect(analysis.summary.toLowerCase()).toMatch(/lead|crm|funil|qualidade/);
    });
  });

  describe("Growth Strategist", () => {
    it("should consolidate analyses and generate strategy", async () => {
      const campaignAnalysis = await racunAI.analyzeCampaigns(mockAnalysisRequest);
      const salesAnalysis = await racunAI.analyzeSales(mockAnalysisRequest);
      const productAnalysis = await racunAI.analyzeProducts(mockAnalysisRequest);
      const crmAnalysis = await racunAI.analyzeCRM(mockAnalysisRequest);

      const strategy = await racunAI.generateGrowthStrategy(
        [campaignAnalysis, salesAnalysis, productAnalysis, crmAnalysis],
        mockAnalysisRequest
      );

      expect(strategy).toBeDefined();
      expect(strategy.analyst).toBe("strategist");
      expect(strategy.title).toBeDefined();
      expect(strategy.summary).toBeDefined();
      expect(Array.isArray(strategy.insights)).toBe(true);
      expect(Array.isArray(strategy.recommendations)).toBe(true);
      expect(Array.isArray(strategy.alerts)).toBe(true);
    });

    it("should prioritize recommendations by impact", async () => {
      const campaignAnalysis = await racunAI.analyzeCampaigns(mockAnalysisRequest);
      const salesAnalysis = await racunAI.analyzeSales(mockAnalysisRequest);
      const productAnalysis = await racunAI.analyzeProducts(mockAnalysisRequest);
      const crmAnalysis = await racunAI.analyzeCRM(mockAnalysisRequest);

      const strategy = await racunAI.generateGrowthStrategy(
        [campaignAnalysis, salesAnalysis, productAnalysis, crmAnalysis],
        mockAnalysisRequest
      );

      // Check if high impact recommendations come before low impact
      const highImpactIndex = strategy.recommendations.findIndex((r) => r.impact === "high");
      const lowImpactIndex = strategy.recommendations.findIndex((r) => r.impact === "low");

      if (highImpactIndex !== -1 && lowImpactIndex !== -1) {
        expect(highImpactIndex).toBeLessThanOrEqual(lowImpactIndex);
      }
    });
  });

  describe("Complete Analysis", () => {
    it("should run complete analysis with all 5 analysts", async () => {
      const analyses = await racunAI.runCompleteAnalysis(mockAnalysisRequest);

      expect(Array.isArray(analyses)).toBe(true);
      expect(analyses.length).toBe(5);

      const analysts = analyses.map((a) => a.analyst);
      expect(analysts).toContain("campaign");
      expect(analysts).toContain("sales");
      expect(analysts).toContain("product");
      expect(analysts).toContain("crm");
      expect(analysts).toContain("strategist");
    });

    it("should return analyses in correct order", async () => {
      const analyses = await racunAI.runCompleteAnalysis(mockAnalysisRequest);

      expect(analyses[0].analyst).toBe("campaign");
      expect(analyses[1].analyst).toBe("sales");
      expect(analyses[2].analyst).toBe("product");
      expect(analyses[3].analyst).toBe("crm");
      expect(analyses[4].analyst).toBe("strategist");
    });

    it("should have all analyses with valid structure", async () => {
      const analyses = await racunAI.runCompleteAnalysis(mockAnalysisRequest);

      for (const analysis of analyses) {
        expect(analysis.title).toBeDefined();
        expect(analysis.summary).toBeDefined();
        expect(Array.isArray(analysis.insights)).toBe(true);
        expect(Array.isArray(analysis.recommendations)).toBe(true);
        expect(Array.isArray(analysis.alerts)).toBe(true);
        expect(analysis.timestamp).toBeInstanceOf(Date);
      }
    });
  });

  describe("Error Handling", () => {
    it("should handle missing metrics gracefully", async () => {
      const minimalRequest: racunAI.AIAnalysisRequest = {
        clientId: 1,
      };

      const analysis = await racunAI.analyzeCampaigns(minimalRequest);

      expect(analysis).toBeDefined();
      expect(analysis.analyst).toBe("campaign");
      expect(analysis.title).toBeDefined();
    });

    it("should handle zero metrics", async () => {
      const zeroMetricsRequest: racunAI.AIAnalysisRequest = {
        clientId: 1,
        metaMetrics: {
          spend: 0,
          impressions: 0,
          clicks: 0,
          conversions: 0,
          roas: 0,
          ctr: 0,
          cpc: 0,
          cpm: 0,
        },
      };

      const analysis = await racunAI.analyzeCampaigns(zeroMetricsRequest);

      expect(analysis).toBeDefined();
      expect(analysis.alerts.length).toBeGreaterThan(0);
    });
  });

  describe("Analysis Quality", () => {
    it("should generate insights that are actionable", async () => {
      const analysis = await racunAI.analyzeCampaigns(mockAnalysisRequest);

      expect(analysis.insights.length).toBeGreaterThan(0);
      for (const insight of analysis.insights) {
        expect(insight.length).toBeGreaterThan(10);
        expect(typeof insight).toBe("string");
      }
    });

    it("should generate recommendations with clear actions", async () => {
      const analysis = await racunAI.analyzeCampaigns(mockAnalysisRequest);

      expect(analysis.recommendations.length).toBeGreaterThan(0);
      for (const rec of analysis.recommendations) {
        expect(rec.action.length).toBeGreaterThan(10);
        expect(["high", "medium", "low"]).toContain(rec.impact);
        expect(["high", "medium", "low"]).toContain(rec.effort);
      }
    });
  });
});
