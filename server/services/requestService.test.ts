import { describe, it, expect, beforeAll, afterAll } from "vitest";
import * as requestService from "./requestService";

describe("Request Service", () => {
  let requestId: number;
  const clientId = 1;
  const userId = 1;

  it("should create a new request", async () => {
    const result = await requestService.createRequest({
      clientId,
      userId,
      type: "budget_adjustment",
      priority: "high",
      title: "Aumentar orçamento da campanha Meta",
      description: "Campanha está performando bem, precisa de mais orçamento",
      campaignId: "meta-123",
      campaignName: "Summer Sale 2026",
      currentBudget: 5000,
      requestedBudget: 10000,
      budgetCurrency: "BRL",
    });

    expect(result).toBeGreaterThan(0);
    requestId = result;
  });

  it("should get request by ID", async () => {
    const request = await requestService.getRequestById(requestId);
    expect(request).toBeDefined();
    expect(request.id).toBe(requestId);
    expect(request.title).toBe("Aumentar orçamento da campanha Meta");
    expect(request.requestStatus).toBe("pending");
  });

  it("should list requests by client", async () => {
    const requests = await requestService.getRequestsByClient(clientId);
    expect(Array.isArray(requests)).toBe(true);
    expect(requests.length).toBeGreaterThan(0);
  });

  it("should list pending requests", async () => {
    const requests = await requestService.getPendingRequests();
    expect(Array.isArray(requests)).toBe(true);
  });

  it("should approve a request", async () => {
    const result = await requestService.approveRequest({
      requestId,
      approvedBy: 2,
    });
    expect(result).toBe(true);

    const request = await requestService.getRequestById(requestId);
    expect(request.requestStatus).toBe("approved");
    expect(request.approvedBy).toBe(2);
  });

  it("should add a comment to request", async () => {
    const commentId = await requestService.addComment({
      requestId,
      userId,
      comment: "Ótima solicitação, vamos implementar",
      isInternal: false,
    });

    expect(commentId).toBeGreaterThan(0);
  });

  it("should get comments for request", async () => {
    const comments = await requestService.getComments(requestId);
    expect(Array.isArray(comments)).toBe(true);
    expect(comments.length).toBeGreaterThan(0);
  });

  it("should get audit logs for request", async () => {
    const logs = await requestService.getAuditLogs(requestId);
    expect(Array.isArray(logs)).toBe(true);
    expect(logs.length).toBeGreaterThan(0);
  });

  it("should get request statistics", async () => {
    const stats = await requestService.getRequestStats(clientId);
    expect(stats).toHaveProperty("total");
    expect(stats).toHaveProperty("pending");
    expect(stats).toHaveProperty("approved");
    expect(stats).toHaveProperty("rejected");
    expect(stats).toHaveProperty("completed");
  });

  it("should mark request as implemented", async () => {
    const result = await requestService.markAsImplemented(requestId, 2);
    expect(result).toBe(true);

    const request = await requestService.getRequestById(requestId);
    expect(request.requestStatus).toBe("completed");
  });

  it("should create a campaign change request", async () => {
    const result = await requestService.createRequest({
      clientId,
      userId,
      type: "campaign_change",
      priority: "medium",
      title: "Alterar público-alvo da campanha",
      description: "Expandir para nova faixa etária",
      campaignId: "google-456",
      campaignName: "Winter Campaign",
      currentValue: { ageRange: "25-35" },
      requestedValue: { ageRange: "25-45" },
    });

    expect(result).toBeGreaterThan(0);
  });

  it("should reject a request", async () => {
    const newRequestId = await requestService.createRequest({
      clientId,
      userId,
      type: "campaign_pause",
      priority: "low",
      title: "Pausar campanha",
      description: "Campanha com baixo desempenho",
      campaignId: "meta-789",
      campaignName: "Old Campaign",
    });

    const result = await requestService.rejectRequest({
      requestId: newRequestId,
      approvedBy: 2,
      rejectionReason: "Campanha ainda tem potencial, vamos otimizar primeiro",
    });

    expect(result).toBe(true);

    const request = await requestService.getRequestById(newRequestId);
    expect(request.requestStatus).toBe("rejected");
  });

  it("should cancel a request", async () => {
    const newRequestId = await requestService.createRequest({
      clientId,
      userId,
      type: "audience_change",
      priority: "medium",
      title: "Mudar público",
      description: "Teste de novo público",
      campaignId: "test-123",
    });

    const result = await requestService.cancelRequest(
      newRequestId,
      userId,
      "Mudança de estratégia"
    );

    expect(result).toBe(true);

    const request = await requestService.getRequestById(newRequestId);
    expect(request.requestStatus).toBe("cancelled");
  });
});
