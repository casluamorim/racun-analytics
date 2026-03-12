import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import * as dbPersistence from "../db-persistence";

export const persistenceRouter = router({
  /**
   * Meta Ads Persistence
   */
  saveMetaCampaigns: protectedProcedure
    .input(
      z.array(
        z.object({
          integrationAccountId: z.number(),
          externalCampaignId: z.string(),
          name: z.string(),
          status: z.string(),
          objective: z.string().optional(),
          dailyBudget: z.number().optional(),
          lifetimeBudget: z.number().optional(),
          startDate: z.date().optional(),
          endDate: z.date().optional(),
        })
      )
    )
    .mutation(async ({ input }) => {
      await dbPersistence.saveMetaCampaigns(input);
      return { success: true, count: input.length };
    }),

  saveMetaMetrics: protectedProcedure
    .input(
      z.array(
        z.object({
          metaCampaignId: z.number(),
          date: z.date(),
          spend: z.number(),
          impressions: z.number(),
          clicks: z.number(),
          conversions: z.number(),
          conversionValue: z.number().optional(),
          ctr: z.number().optional(),
          cpc: z.number().optional(),
          cpm: z.number().optional(),
          roas: z.number().optional(),
        })
      )
    )
    .mutation(async ({ input }) => {
      await dbPersistence.saveMetaMetrics(input);
      return { success: true, count: input.length };
    }),

  getMetaCampaigns: protectedProcedure
    .input(z.object({ integrationAccountId: z.number() }))
    .query(async ({ input }) => {
      return await dbPersistence.getMetaCampaignsByIntegration(input.integrationAccountId);
    }),

  getMetaMetrics: protectedProcedure
    .input(
      z.object({
        metaCampaignId: z.number(),
        startDate: z.date(),
        endDate: z.date(),
      })
    )
    .query(async ({ input }) => {
      return await dbPersistence.getMetaMetricsByDateRange(
        input.metaCampaignId,
        input.startDate,
        input.endDate
      );
    }),

  /**
   * Google Ads Persistence
   */
  saveGoogleAdsCampaigns: protectedProcedure
    .input(
      z.array(
        z.object({
          integrationAccountId: z.number(),
          externalCampaignId: z.string(),
          name: z.string(),
          status: z.string(),
          advertisingChannelType: z.string().optional(),
          budget: z.number().optional(),
          startDate: z.date().optional(),
          endDate: z.date().optional(),
        })
      )
    )
    .mutation(async ({ input }) => {
      await dbPersistence.saveGoogleAdsCampaigns(input);
      return { success: true, count: input.length };
    }),

  saveGoogleAdsMetrics: protectedProcedure
    .input(
      z.array(
        z.object({
          googleAdsCampaignId: z.number(),
          date: z.date(),
          spend: z.number(),
          impressions: z.number(),
          clicks: z.number(),
          conversions: z.number(),
          conversionValue: z.number().optional(),
          ctr: z.number().optional(),
          cpc: z.number().optional(),
          cpm: z.number().optional(),
          roas: z.number().optional(),
        })
      )
    )
    .mutation(async ({ input }) => {
      await dbPersistence.saveGoogleAdsMetrics(input);
      return { success: true, count: input.length };
    }),

  getGoogleAdsCampaigns: protectedProcedure
    .input(z.object({ integrationAccountId: z.number() }))
    .query(async ({ input }) => {
      return await dbPersistence.getGoogleAdsCampaignsByIntegration(input.integrationAccountId);
    }),

  getGoogleAdsMetrics: protectedProcedure
    .input(
      z.object({
        googleAdsCampaignId: z.number(),
        startDate: z.date(),
        endDate: z.date(),
      })
    )
    .query(async ({ input }) => {
      return await dbPersistence.getGoogleAdsMetricsByDateRange(
        input.googleAdsCampaignId,
        input.startDate,
        input.endDate
      );
    }),

  /**
   * Integration Account Management
   */
  saveIntegrationAccount: protectedProcedure
    .input(
      z.object({
        clientId: z.number(),
        platform: z.enum(['meta', 'google', 'tiktok', 'mercado_livre', 'shopee', 'amazon']),
        accountName: z.string(),
        accessToken: z.string(),
        refreshToken: z.string().optional(),
        externalAccountId: z.string(),
        externalAccountName: z.string().optional(),
        status: z.enum(['active', 'inactive', 'error', 'expired']).optional(),
      })
    )
    .mutation(async ({ input }) => {
      await dbPersistence.saveIntegrationAccount(input);
      return { success: true };
    }),

  getIntegrationAccount: protectedProcedure
    .input(
      z.object({
        clientId: z.number(),
        platform: z.string(),
      })
    )
    .query(async ({ input }) => {
      return await dbPersistence.getIntegrationAccount(input.clientId, input.platform);
    }),

  getIntegrationAccounts: protectedProcedure
    .input(z.object({ clientId: z.number() }))
    .query(async ({ input }) => {
      return await dbPersistence.getIntegrationAccountsByClient(input.clientId);
    }),

  updateIntegrationStatus: protectedProcedure
    .input(
      z.object({
        integrationAccountId: z.number(),
        status: z.enum(['active', 'inactive', 'error', 'expired']),
        errorMessage: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      await dbPersistence.updateIntegrationAccountStatus(
        input.integrationAccountId,
        input.status,
        input.errorMessage
      );
      return { success: true };
    }),

  /**
   * Integration Logs
   */
  logSync: protectedProcedure
    .input(
      z.object({
        integrationAccountId: z.number(),
        action: z.string(),
        status: z.enum(['success', 'error', 'pending']),
        message: z.string().optional(),
        recordsProcessed: z.number().optional(),
        recordsFailed: z.number().optional(),
        startedAt: z.date(),
        completedAt: z.date().optional(),
      })
    )
    .mutation(async ({ input }) => {
      await dbPersistence.logIntegrationSync(input);
      return { success: true };
    }),

  getLogs: protectedProcedure
    .input(
      z.object({
        integrationAccountId: z.number(),
        limit: z.number().optional(),
      })
    )
    .query(async ({ input }) => {
      return await dbPersistence.getIntegrationLogs(input.integrationAccountId, input.limit);
    }),

  /**
   * Dashboard Aggregation
   */
  getTotalSpend: protectedProcedure
    .input(
      z.object({
        clientId: z.number(),
        days: z.number().optional(),
      })
    )
    .query(async ({ input }) => {
      return await dbPersistence.getTotalSpend(input.clientId, input.days);
    }),

  getAverageRoas: protectedProcedure
    .input(
      z.object({
        clientId: z.number(),
        days: z.number().optional(),
      })
    )
    .query(async ({ input }) => {
      return await dbPersistence.getAverageRoas(input.clientId, input.days);
    }),

  getTotalConversions: protectedProcedure
    .input(
      z.object({
        clientId: z.number(),
        days: z.number().optional(),
      })
    )
    .query(async ({ input }) => {
      return await dbPersistence.getTotalConversions(input.clientId, input.days);
    }),

  getDailySpend: protectedProcedure
    .input(
      z.object({
        clientId: z.number(),
        days: z.number().optional(),
      })
    )
    .query(async ({ input }) => {
      return await dbPersistence.getDailySpend(input.clientId, input.days);
    }),

  getCampaignPerformance: protectedProcedure
    .input(
      z.object({
        clientId: z.number(),
        days: z.number().optional(),
      })
    )
    .query(async ({ input }) => {
      return await dbPersistence.getCampaignPerformance(input.clientId, input.days);
    }),
});
