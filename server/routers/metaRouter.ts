import { publicProcedure, router } from "../_core/trpc";
import { z } from "zod";
import MetaAdsService from "../services/metaAdsService";
import { TRPCError } from "@trpc/server";

/**
 * Router para gerenciar integrações com Meta Ads
 */
export const metaRouter = router({
  /**
   * Inicia o fluxo de autenticação OAuth com Meta
   * Retorna a URL de redirecionamento para o usuário
   */
  getAuthUrl: publicProcedure
    .input(
      z.object({
        clientId: z.number(),
        redirectUri: z.string().url(),
      })
    )
    .query(({ input }) => {
      const metaAppId = process.env.META_APP_ID;
      const metaAppSecret = process.env.META_APP_SECRET;

      if (!metaAppId || !metaAppSecret) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Credenciais do Meta não configuradas",
        });
      }

      const scope = [
        "ads_management",
        "ads_read",
        "business_management",
      ].join(",");

      const authUrl = new URL("https://www.facebook.com/v18.0/dialog/oauth");
      authUrl.searchParams.append("client_id", metaAppId);
      authUrl.searchParams.append("redirect_uri", input.redirectUri);
      authUrl.searchParams.append("scope", scope);
      authUrl.searchParams.append("state", JSON.stringify({ clientId: input.clientId }));
      authUrl.searchParams.append("response_type", "code");

      return {
        authUrl: authUrl.toString(),
      };
    }),

  /**
   * Processa o callback de autenticação OAuth
   * Troca o código por um access token
   */
  handleCallback: publicProcedure
    .input(
      z.object({
        code: z.string(),
        state: z.string(),
        redirectUri: z.string().url(),
      })
    )
    .mutation(async ({ input }) => {
      const metaAppId = process.env.META_APP_ID;
      const metaAppSecret = process.env.META_APP_SECRET;

      if (!metaAppId || !metaAppSecret) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Credenciais do Meta não configuradas",
        });
      }

      try {
        const state = JSON.parse(input.state);
        const clientId = state.clientId;

        // Troca o código por um access token
        const tokenResponse = await MetaAdsService.exchangeCodeForToken(
          input.code,
          input.redirectUri,
          metaAppId,
          metaAppSecret
        );

        // Obtém as contas de anúncios do usuário
        const metaService = new MetaAdsService(tokenResponse.access_token, "");
        const adAccounts = await metaService.getAdAccounts();

        return {
          success: true,
          accessToken: tokenResponse.access_token,
          adAccounts,
          clientId,
        };
      } catch (error) {
        console.error("[Meta] Erro ao processar callback:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Falha ao autenticar com Meta",
        });
      }
    }),

  /**
   * Obtém as contas de anúncios disponíveis
   */
  getAdAccounts: publicProcedure
    .input(
      z.object({
        accessToken: z.string(),
      })
    )
    .query(async ({ input }) => {
      try {
        const metaService = new MetaAdsService(input.accessToken, "");
        const adAccounts = await metaService.getAdAccounts();

        return {
          success: true,
          adAccounts,
        };
      } catch (error) {
        console.error("[Meta] Erro ao buscar contas:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Falha ao buscar contas de anúncios",
        });
      }
    }),

  /**
   * Sincroniza campanhas de uma conta
   */
  syncCampaigns: publicProcedure
    .input(
      z.object({
        accessToken: z.string(),
        adAccountId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const metaService = new MetaAdsService(
          input.accessToken,
          input.adAccountId
        );
        const campaigns = await metaService.syncCampaigns();

        return {
          success: true,
          campaignsCount: campaigns.length,
          campaigns,
        };
      } catch (error) {
        console.error("[Meta] Erro ao sincronizar campanhas:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Falha ao sincronizar campanhas",
        });
      }
    }),

  /**
   * Obtém métricas de uma campanha
   */
  getCampaignMetrics: publicProcedure
    .input(
      z.object({
        accessToken: z.string(),
        campaignId: z.string(),
        startDate: z.string(), // YYYY-MM-DD
        endDate: z.string(), // YYYY-MM-DD
      })
    )
    .query(async ({ input }) => {
      try {
        const metaService = new MetaAdsService(input.accessToken, "");
        const metrics = await metaService.getCampaignMetrics(
          input.campaignId,
          input.startDate,
          input.endDate
        );

        return {
          success: true,
          metrics,
        };
      } catch (error) {
        console.error("[Meta] Erro ao buscar métricas:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Falha ao buscar métricas da campanha",
        });
      }
    }),

  /**
   * Obtém métricas agregadas da conta
   */
  getAccountMetrics: publicProcedure
    .input(
      z.object({
        accessToken: z.string(),
        adAccountId: z.string(),
        startDate: z.string(), // YYYY-MM-DD
        endDate: z.string(), // YYYY-MM-DD
      })
    )
    .query(async ({ input }) => {
      try {
        const metaService = new MetaAdsService(
          input.accessToken,
          input.adAccountId
        );
        const metrics = await metaService.getAccountMetrics(
          input.startDate,
          input.endDate
        );

        return {
          success: true,
          metrics,
        };
      } catch (error) {
        console.error("[Meta] Erro ao buscar métricas da conta:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Falha ao buscar métricas da conta",
        });
      }
    }),

  /**
   * Valida se um token ainda é válido
   */
  validateToken: publicProcedure
    .input(
      z.object({
        accessToken: z.string(),
      })
    )
    .query(async ({ input }) => {
      try {
        const metaService = new MetaAdsService(input.accessToken, "");
        const isValid = await metaService.validateToken();

        return {
          success: true,
          isValid,
        };
      } catch (error) {
        console.error("[Meta] Erro ao validar token:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Falha ao validar token",
        });
      }
    }),
});
