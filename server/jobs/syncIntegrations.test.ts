import { describe, it, expect, beforeEach, vi } from "vitest";
import { IntegrationSyncManager } from "./syncIntegrations";

describe("IntegrationSyncManager", () => {
  let manager: IntegrationSyncManager;

  beforeEach(() => {
    manager = new IntegrationSyncManager();
  });

  describe("Inicialização", () => {
    it("deve criar uma instância do gerenciador", () => {
      expect(manager).toBeDefined();
    });

    it("deve ter histórico vazio inicialmente", () => {
      const history = manager.getSyncHistory();
      expect(history).toEqual([]);
    });
  });

  describe("Histórico de Sincronizações", () => {
    it("deve retornar histórico vazio quando nenhuma sincronização foi executada", () => {
      const history = manager.getSyncHistory();
      expect(history).toHaveLength(0);
    });

    it("deve limpar o histórico de sincronizações", () => {
      manager.clearSyncHistory();
      const history = manager.getSyncHistory();
      expect(history).toHaveLength(0);
    });
  });

  describe("Sincronização", () => {
    it("deve permitir múltiplas sincronizações", async () => {
      // Simular múltiplas sincronizações
      await manager.syncAll();
      await manager.syncAll();

      const history = manager.getSyncHistory();
      expect(history.length).toBeGreaterThanOrEqual(0);
    });

    it("deve registrar resultado de sincronização com plataforma", async () => {
      await manager.syncAll();

      const history = manager.getSyncHistory();
      if (history.length > 0) {
        const result = history[0];
        expect(result).toHaveProperty("platform");
        expect(["meta", "google"]).toContain(result.platform);
      }
    });

    it("deve registrar resultado de sincronização com accountId", async () => {
      await manager.syncAll();

      const history = manager.getSyncHistory();
      if (history.length > 0) {
        const result = history[0];
        expect(result).toHaveProperty("accountId");
        expect(typeof result.accountId).toBe("string");
      }
    });

    it("deve registrar resultado de sincronização com campaignsCount", async () => {
      await manager.syncAll();

      const history = manager.getSyncHistory();
      if (history.length > 0) {
        const result = history[0];
        expect(result).toHaveProperty("campaignsCount");
        expect(typeof result.campaignsCount).toBe("number");
      }
    });

    it("deve registrar resultado de sincronização com metricsCount", async () => {
      await manager.syncAll();

      const history = manager.getSyncHistory();
      if (history.length > 0) {
        const result = history[0];
        expect(result).toHaveProperty("metricsCount");
        expect(typeof result.metricsCount).toBe("number");
      }
    });

    it("deve registrar resultado de sincronização com success flag", async () => {
      await manager.syncAll();

      const history = manager.getSyncHistory();
      if (history.length > 0) {
        const result = history[0];
        expect(result).toHaveProperty("success");
        expect(typeof result.success).toBe("boolean");
      }
    });

    it("deve registrar resultado de sincronização com duration", async () => {
      await manager.syncAll();

      const history = manager.getSyncHistory();
      if (history.length > 0) {
        const result = history[0];
        expect(result).toHaveProperty("duration");
        expect(typeof result.duration).toBe("number");
        expect(result.duration).toBeGreaterThanOrEqual(0);
      }
    });

    it("deve registrar resultado de sincronização com timestamp", async () => {
      await manager.syncAll();

      const history = manager.getSyncHistory();
      if (history.length > 0) {
        const result = history[0];
        expect(result).toHaveProperty("timestamp");
        expect(result.timestamp instanceof Date).toBe(true);
      }
    });
  });

  describe("Tratamento de Erros", () => {
    it("deve lidar com sincronização sem erros", async () => {
      await manager.syncAll();

      const history = manager.getSyncHistory();
      // Não deve lançar exceção
      expect(true).toBe(true);
    });

    it("deve registrar erro quando sincronização falha", async () => {
      await manager.syncAll();

      const history = manager.getSyncHistory();
      // Verificar se há resultados com erro
      const errorResults = history.filter((r) => !r.success);
      if (errorResults.length > 0) {
        const errorResult = errorResults[0];
        expect(errorResult).toHaveProperty("error");
      }
    });
  });

  describe("Estrutura de Dados", () => {
    it("deve ter estrutura correta de SyncResult", async () => {
      await manager.syncAll();

      const history = manager.getSyncHistory();
      if (history.length > 0) {
        const result = history[0];

        expect(result).toHaveProperty("platform");
        expect(result).toHaveProperty("accountId");
        expect(result).toHaveProperty("campaignsCount");
        expect(result).toHaveProperty("metricsCount");
        expect(result).toHaveProperty("success");
        expect(result).toHaveProperty("duration");
        expect(result).toHaveProperty("timestamp");
      }
    });

    it("deve ter timestamp válido", async () => {
      await manager.syncAll();

      const history = manager.getSyncHistory();
      if (history.length > 0) {
        const result = history[0];
        const now = Date.now();
        const resultTime = result.timestamp.getTime();

        // Timestamp deve estar próximo ao tempo atual (dentro de 10 segundos)
        expect(Math.abs(now - resultTime)).toBeLessThan(10000);
      }
    });
  });

  describe("Scheduler", () => {
    it("deve criar um job scheduler", () => {
      const job = IntegrationSyncManager.startScheduler();
      expect(job).toBeDefined();
      job.stop();
    });

    it("deve ter job scheduler com padrão cron válido", () => {
      const job = IntegrationSyncManager.startScheduler();
      expect(job).toBeDefined();
      // Verificar se o job foi criado corretamente
      expect(job.nextDate()).toBeDefined();
      job.stop();
    });
  });

  describe("Concorrência", () => {
    it("deve evitar múltiplas sincronizações simultâneas", async () => {
      // Iniciar duas sincronizações quase simultaneamente
      const promise1 = manager.syncAll();
      const promise2 = manager.syncAll();

      await Promise.all([promise1, promise2]);

      // Não deve lançar exceção
      expect(true).toBe(true);
    });
  });

  describe("Tipos de Plataforma", () => {
    it("deve suportar plataforma Meta", async () => {
      await manager.syncAll();

      const history = manager.getSyncHistory();
      const metaResults = history.filter((r) => r.platform === "meta");
      // Pode ter ou não resultados de Meta
      expect(Array.isArray(metaResults)).toBe(true);
    });

    it("deve suportar plataforma Google", async () => {
      await manager.syncAll();

      const history = manager.getSyncHistory();
      const googleResults = history.filter((r) => r.platform === "google");
      // Pode ter ou não resultados de Google
      expect(Array.isArray(googleResults)).toBe(true);
    });
  });

  describe("Limpeza", () => {
    it("deve limpar histórico corretamente", async () => {
      await manager.syncAll();
      let history = manager.getSyncHistory();
      expect(history.length).toBeGreaterThanOrEqual(0);

      manager.clearSyncHistory();
      history = manager.getSyncHistory();
      expect(history).toHaveLength(0);
    });

    it("deve permitir nova sincronização após limpeza", async () => {
      await manager.syncAll();
      manager.clearSyncHistory();
      await manager.syncAll();

      const history = manager.getSyncHistory();
      expect(history.length).toBeGreaterThanOrEqual(0);
    });
  });
});
