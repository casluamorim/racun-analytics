import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import * as racunAI from "../services/racunGrowthAI";

export const aiRouter = router({
  /**
   * Executar análise completa com todos os 5 analistas
   */
  runCompleteAnalysis: protectedProcedure
    .input(
      z.object({
        clientId: z.number(),
        metaMetrics: z
          .object({
            spend: z.number(),
            impressions: z.number(),
            clicks: z.number(),
            conversions: z.number(),
            roas: z.number(),
            ctr: z.number(),
            cpc: z.number(),
            cpm: z.number(),
          })
          .optional(),
        googleMetrics: z
          .object({
            spend: z.number(),
            impressions: z.number(),
            clicks: z.number(),
            conversions: z.number(),
            roas: z.number(),
            ctr: z.number(),
            cpc: z.number(),
            cpm: z.number(),
          })
          .optional(),
        crmMetrics: z
          .object({
            totalLeads: z.number(),
            convertedLeads: z.number(),
            conversionRate: z.number(),
            averageCycleTime: z.number(),
            leadsInFunnel: z.number(),
          })
          .optional(),
        productMetrics: z
          .object({
            totalProducts: z.number(),
            averageMargin: z.number(),
            lowMarginProducts: z.number(),
            topProduct: z.string().optional(),
            bottomProduct: z.string().optional(),
          })
          .optional(),
      })
    )
    .mutation(async ({ input }) => {
      const analyses = await racunAI.runCompleteAnalysis(input);
      return {
        success: true,
        analyses: analyses.map((a) => ({
          analyst: a.analyst,
          title: a.title,
          summary: a.summary,
          insights: a.insights,
          recommendations: a.recommendations,
          alerts: a.alerts,
          timestamp: a.timestamp.toISOString(),
        })),
      };
    }),

  /**
   * Análise de Campanhas
   */
  analyzeCampaigns: protectedProcedure
    .input(
      z.object({
        clientId: z.number(),
        metaMetrics: z
          .object({
            spend: z.number(),
            impressions: z.number(),
            clicks: z.number(),
            conversions: z.number(),
            roas: z.number(),
            ctr: z.number(),
            cpc: z.number(),
            cpm: z.number(),
          })
          .optional(),
        googleMetrics: z
          .object({
            spend: z.number(),
            impressions: z.number(),
            clicks: z.number(),
            conversions: z.number(),
            roas: z.number(),
            ctr: z.number(),
            cpc: z.number(),
            cpm: z.number(),
          })
          .optional(),
      })
    )
    .mutation(async ({ input }) => {
      const analysis = await racunAI.analyzeCampaigns(input);
      return {
        success: true,
        analysis: {
          analyst: analysis.analyst,
          title: analysis.title,
          summary: analysis.summary,
          insights: analysis.insights,
          recommendations: analysis.recommendations,
          alerts: analysis.alerts,
          timestamp: analysis.timestamp.toISOString(),
        },
      };
    }),

  /**
   * Análise de Vendas
   */
  analyzeSales: protectedProcedure
    .input(
      z.object({
        clientId: z.number(),
        crmMetrics: z
          .object({
            totalLeads: z.number(),
            convertedLeads: z.number(),
            conversionRate: z.number(),
            averageCycleTime: z.number(),
            leadsInFunnel: z.number(),
          })
          .optional(),
      })
    )
    .mutation(async ({ input }) => {
      const analysis = await racunAI.analyzeSales(input);
      return {
        success: true,
        analysis: {
          analyst: analysis.analyst,
          title: analysis.title,
          summary: analysis.summary,
          insights: analysis.insights,
          recommendations: analysis.recommendations,
          alerts: analysis.alerts,
          timestamp: analysis.timestamp.toISOString(),
        },
      };
    }),

  /**
   * Análise de Produtos
   */
  analyzeProducts: protectedProcedure
    .input(
      z.object({
        clientId: z.number(),
        productMetrics: z
          .object({
            totalProducts: z.number(),
            averageMargin: z.number(),
            lowMarginProducts: z.number(),
            topProduct: z.string().optional(),
            bottomProduct: z.string().optional(),
          })
          .optional(),
      })
    )
    .mutation(async ({ input }) => {
      const analysis = await racunAI.analyzeProducts(input);
      return {
        success: true,
        analysis: {
          analyst: analysis.analyst,
          title: analysis.title,
          summary: analysis.summary,
          insights: analysis.insights,
          recommendations: analysis.recommendations,
          alerts: analysis.alerts,
          timestamp: analysis.timestamp.toISOString(),
        },
      };
    }),

  /**
   * Análise de CRM
   */
  analyzeCRM: protectedProcedure
    .input(
      z.object({
        clientId: z.number(),
        crmMetrics: z
          .object({
            totalLeads: z.number(),
            convertedLeads: z.number(),
            conversionRate: z.number(),
            averageCycleTime: z.number(),
            leadsInFunnel: z.number(),
          })
          .optional(),
      })
    )
    .mutation(async ({ input }) => {
      const analysis = await racunAI.analyzeCRM(input);
      return {
        success: true,
        analysis: {
          analyst: analysis.analyst,
          title: analysis.title,
          summary: analysis.summary,
          insights: analysis.insights,
          recommendations: analysis.recommendations,
          alerts: analysis.alerts,
          timestamp: analysis.timestamp.toISOString(),
        },
      };
    }),
});
