import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import * as requestService from "../services/requestService";

type RequestType = "campaign_change" | "budget_adjustment" | "campaign_pause" | "campaign_resume" | "audience_change" | "creative_change" | "bid_change" | "other";
type RequestPriority = "low" | "medium" | "high" | "critical";
type RequestStatus = "pending" | "approved" | "rejected" | "cancelled" | "in_progress" | "completed";

export const requestRouter = router({
  /**
   * Criar nova solicitação
   */
  create: protectedProcedure
    .input(
      z.object({
        clientId: z.number(),
        type: z.enum([
          "campaign_change",
          "budget_adjustment",
          "campaign_pause",
          "campaign_resume",
          "audience_change",
          "creative_change",
          "bid_change",
          "other",
        ] as const),
        priority: z.enum(["low", "medium", "high", "critical"] as const),
        title: z.string().min(5).max(255),
        description: z.string().optional(),
        campaignId: z.string().optional(),
        campaignName: z.string().optional(),
        currentValue: z.record(z.string(), z.unknown()).optional(),
        requestedValue: z.record(z.string(), z.unknown()).optional(),
        estimatedImpact: z.string().optional(),
        currentBudget: z.number().optional(),
        requestedBudget: z.number().optional(),
        budgetCurrency: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const requestId = await requestService.createRequest({
        ...input,
        userId: ctx.user?.id || 0,
      });

      return {
        success: true,
        requestId,
      };
    }),

  /**
   * Obter solicitação por ID
   */
  getById: protectedProcedure
    .input(z.object({ requestId: z.number() }))
    .query(async ({ input }) => {
      const request = await requestService.getRequestById(input.requestId);
      return {
        success: !!request,
        request,
      };
    }),

  /**
   * Listar solicitações do cliente
   */
  listByClient: protectedProcedure
    .input(
      z.object({
        clientId: z.number(),
        status: z
          .enum(["pending", "approved", "rejected", "cancelled", "in_progress", "completed"] as const)
          .optional(),
        limit: z.number().default(50),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      const requests = await requestService.getRequestsByClient(
        input.clientId,
        input.status,
        input.limit,
        input.offset
      );

      return {
        success: true,
        requests,
        count: requests.length,
      };
    }),

  /**
   * Listar solicitações pendentes
   */
  listPending: protectedProcedure
    .input(
      z.object({
        limit: z.number().default(50),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      const requests = await requestService.getPendingRequests(input.limit, input.offset);

      return {
        success: true,
        requests,
        count: requests.length,
      };
    }),

  /**
   * Aprovar solicitação
   */
  approve: protectedProcedure
    .input(
      z.object({
        requestId: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const success = await requestService.approveRequest({
        requestId: input.requestId,
        approvedBy: ctx.user?.id || 0,
      });

      return {
        success,
      };
    }),

  /**
   * Rejeitar solicitação
   */
  reject: protectedProcedure
    .input(
      z.object({
        requestId: z.number(),
        rejectionReason: z.string().min(10),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const success = await requestService.rejectRequest({
        requestId: input.requestId,
        approvedBy: ctx.user?.id || 0,
        rejectionReason: input.rejectionReason,
      });

      return {
        success,
      };
    }),

  /**
   * Marcar como implementada
   */
  markAsImplemented: protectedProcedure
    .input(
      z.object({
        requestId: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const success = await requestService.markAsImplemented(
        input.requestId,
        ctx.user?.id || 0
      );

      return {
        success,
      };
    }),

  /**
   * Adicionar comentário
   */
  addComment: protectedProcedure
    .input(
      z.object({
        requestId: z.number(),
        comment: z.string().min(1).max(5000),
        isInternal: z.boolean().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const commentId = await requestService.addComment({
        requestId: input.requestId,
        userId: ctx.user?.id || 0,
        comment: input.comment,
        isInternal: input.isInternal,
      });

      return {
        success: true,
        commentId,
      };
    }),

  /**
   * Obter comentários
   */
  getComments: protectedProcedure
    .input(
      z.object({
        requestId: z.number(),
        includeInternal: z.boolean().optional(),
      })
    )
    .query(async ({ input }) => {
      const comments = await requestService.getComments(
        input.requestId,
        input.includeInternal
      );

      return {
        success: true,
        comments,
      };
    }),

  /**
   * Obter logs de auditoria
   */
  getAuditLogs: protectedProcedure
    .input(
      z.object({
        requestId: z.number(),
      })
    )
    .query(async ({ input }) => {
      const logs = await requestService.getAuditLogs(input.requestId);

      return {
        success: true,
        logs,
      };
    }),

  /**
   * Obter estatísticas
   */
  getStats: protectedProcedure
    .input(
      z.object({
        clientId: z.number(),
      })
    )
    .query(async ({ input }) => {
      const stats = await requestService.getRequestStats(input.clientId);

      return {
        success: true,
        stats,
      };
    }),

  /**
   * Cancelar solicitação
   */
  cancel: protectedProcedure
    .input(
      z.object({
        requestId: z.number(),
        reason: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const success = await requestService.cancelRequest(
        input.requestId,
        ctx.user?.id || 0,
        input.reason
      );

      return {
        success,
      };
    }),
});
