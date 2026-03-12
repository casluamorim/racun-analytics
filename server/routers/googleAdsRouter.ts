import { publicProcedure, router } from "../_core/trpc";
import { z } from "zod";
import GoogleAdsService from "../services/googleAdsService";
import { TRPCError } from "@trpc/server";

/**
 * Router para gerenciar integrações com Google Ads
 */
export const googleAdsRouter = router({
  /**
   * Inicia o fluxo de autenticação OAuth com Google
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
      const googleClientId = process.env.GOOGLE_ADS_CLIENT_ID;

      if (!googleClientId) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Credenciais do Google Ads não configuradas",
        });
      }

      const scope = [
        "https://www.googleapis.com/auth/adwords",
      ].join(" ");

      const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
      authUrl.searchParams.append("client_id", googleClientId);
      authUrl.searchParams.append("redirect_uri", input.redirectUri);
      authUrl.searchParams.append("scope", scope);
      authUrl.searchParams.append("state", JSON.stringify({ clientId: input.clientId }));
      authUrl.searchParams.append("response_type", "code");
      authUrl.searchParams.append("access_type", "offline");
      authUrl.searchParams.append("prompt", "consent");

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
      const googleClientId = process.env.GOOGLE_ADS_CLIENT_ID;
      const googleClientSecret = process.env.GOOGLE_ADS_CLIENT_SECRET;

      if (!googleClientId || !googleClientSecret) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Credenciais do Google Ads não configuradas",
        });
      }

      try {
        const state = JSON.parse(input.state);
        const clientId = state.clientId;

        // Troca o código por um access token
        const tokenResponse = await GoogleAdsService.exchangeCodeForToken(
          input.code,
          input.redirectUri,
          googleClientId,
          googleClientSecret
        );

        return {
          success: true,
          accessToken: tokenResponse.access_token,
          refreshToken: tokenResponse.refresh_token,
          expiresIn: tokenResponse.expires_in,
          clientId,
        };
      } catch (error) {
        console.error("[Google Ads] Erro ao processar callback:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Falha ao autenticar com Google Ads",
        });
      }
    }),

  /**
   * Obtém as contas de anúncios disponíveis
   */
  getCustomerAccounts: publicProcedure
    .input(
      z.object({
        accessToken: z.string(),
      })
    )
    .query(async ({ input }) => {
      try {
        const googleAdsService = new GoogleAdsService(input.accessToken, "");
        const accounts = await googleAdsService.getCustomerAccounts();

        return {
          success: true,
          accounts,
        };
      } catch (error) {
        console.error("[Google Ads] Erro ao buscar contas:", error);
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
        customerId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const googleAdsService = new GoogleAdsService(
          input.accessToken,
          input.customerId
        );
        const campaigns = await googleAdsService.syncCampaigns();

        return {
          success: true,
          campaignsCount: campaigns.length,
          campaigns,
        };
      } catch (error) {
        console.error("[Google Ads] Erro ao sincronizar campanhas:", error);
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
        customerId: z.string(),
        campaignId: z.string(),
        startDate: z.string(), // YYYY-MM-DD
        endDate: z.string(), // YYYY-MM-DD
      })
    )
    .query(async ({ input }) => {
      try {
        const googleAdsService = new GoogleAdsService(
          input.accessToken,
          input.customerId
        );
        const metrics = await googleAdsService.getCampaignMetrics(
          input.campaignId,
          input.startDate,
          input.endDate
        );

        return {
          success: true,
          metrics,
        };
      } catch (error) {
        console.error("[Google Ads] Erro ao buscar métricas:", error);
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
        customerId: z.string(),
        startDate: z.string(), // YYYY-MM-DD
        endDate: z.string(), // YYYY-MM-DD
      })
    )
    .query(async ({ input }) => {
      try {
        const googleAdsService = new GoogleAdsService(
          input.accessToken,
          input.customerId
        );
        const metrics = await googleAdsService.getAccountMetrics(
          input.startDate,
          input.endDate
        );

        return {
          success: true,
          metrics,
        };
      } catch (error) {
        console.error("[Google Ads] Erro ao buscar métricas da conta:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Falha ao buscar métricas da conta",
        });
      }
    }),

  /**
   * Obtém palavras-chave de uma campanha
   */
  getCampaignKeywords: publicProcedure
    .input(
      z.object({
        accessToken: z.string(),
        customerId: z.string(),
        campaignId: z.string(),
      })
    )
    .query(async ({ input }) => {
      try {
        const googleAdsService = new GoogleAdsService(
          input.accessToken,
          input.customerId
        );
        const keywords = await googleAdsService.getCampaignKeywords(
          input.campaignId
        );

        return {
          success: true,
          keywords,
        };
      } catch (error) {
        console.error("[Google Ads] Erro ao buscar palavras-chave:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Falha ao buscar palavras-chave",
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
        customerId: z.string(),
      })
    )
    .query(async ({ input }) => {
      try {
        const googleAdsService = new GoogleAdsService(
          input.accessToken,
          input.customerId
        );
        const isValid = await googleAdsService.validateToken();

        return {
          success: true,
          isValid,
        };
      } catch (error) {
        console.error("[Google Ads] Erro ao validar token:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Falha ao validar token",
        });
      }
    }),

  /**
   * Renova o access token usando o refresh token
   */
  refreshToken: publicProcedure
    .input(
      z.object({
        refreshToken: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const googleClientId = process.env.GOOGLE_ADS_CLIENT_ID;
      const googleClientSecret = process.env.GOOGLE_ADS_CLIENT_SECRET;

      if (!googleClientId || !googleClientSecret) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Credenciais do Google Ads não configuradas",
        });
      }

      try {
        const tokenResponse = await GoogleAdsService.refreshAccessToken(
          input.refreshToken,
          googleClientId,
          googleClientSecret
        );

        return {
          success: true,
          accessToken: tokenResponse.access_token,
          expiresIn: tokenResponse.expires_in,
        };
      } catch (error) {
        console.error("[Google Ads] Erro ao renovar token:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Falha ao renovar token",
        });
      }
    }),
});
