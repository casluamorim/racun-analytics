import { describe, it, expect, beforeAll } from "vitest";
import MetaAdsService from "./metaAdsService";

describe("MetaAdsService", () => {
  describe("Cálculos de Métricas", () => {
    it("deve calcular ROAS corretamente", () => {
      const roas = MetaAdsService.calculateROAS(1000, 250);
      expect(roas).toBe(4);
    });

    it("deve retornar 0 quando spend é 0", () => {
      const roas = MetaAdsService.calculateROAS(1000, 0);
      expect(roas).toBe(0);
    });

    it("deve calcular CTR corretamente", () => {
      const ctr = MetaAdsService.calculateCTR(50, 1000);
      expect(ctr).toBe(5);
    });

    it("deve calcular CPC corretamente", () => {
      const cpc = MetaAdsService.calculateCPC(250, 50);
      expect(cpc).toBe(5);
    });

    it("deve calcular CPM corretamente", () => {
      const cpm = MetaAdsService.calculateCPM(250, 10000);
      expect(cpm).toBe(25);
    });

    it("deve retornar 0 para CTR quando impressões é 0", () => {
      const ctr = MetaAdsService.calculateCTR(50, 0);
      expect(ctr).toBe(0);
    });

    it("deve retornar 0 para CPC quando clicks é 0", () => {
      const cpc = MetaAdsService.calculateCPC(250, 0);
      expect(cpc).toBe(0);
    });

    it("deve retornar 0 para CPM quando impressões é 0", () => {
      const cpm = MetaAdsService.calculateCPM(250, 0);
      expect(cpm).toBe(0);
    });
  });

  describe("Validação de Configuração", () => {
    it("deve ter variáveis de ambiente configuradas", () => {
      const metaAppId = process.env.META_APP_ID;
      const metaAppSecret = process.env.META_APP_SECRET;

      // Verificar se as variáveis estão definidas
      // Em desenvolvimento, podem estar vazias, mas devem estar definidas
      expect(metaAppId).toBeDefined();
      expect(metaAppSecret).toBeDefined();
    });

    it("deve ter URL de redirecionamento configurada", () => {
      const redirectUri = process.env.META_REDIRECT_URI;
      expect(redirectUri).toBeDefined();
      expect(redirectUri).toMatch(/^https?:\/\//);
    });
  });

  describe("Instanciação do Serviço", () => {
    it("deve criar instância do serviço com token e account ID", () => {
      const service = new MetaAdsService("test_token", "act_123456");
      expect(service).toBeDefined();
    });

    it("deve criar instância sem account ID para operações de autenticação", () => {
      const service = new MetaAdsService("test_token", "");
      expect(service).toBeDefined();
    });
  });

  describe("Cálculos de Métricas - Casos Extremos", () => {
    it("deve lidar com valores decimais", () => {
      const roas = MetaAdsService.calculateROAS(1234.56, 567.89);
      expect(typeof roas).toBe("number");
      expect(roas).toBeGreaterThan(0);
    });

    it("deve lidar com valores muito grandes", () => {
      const roas = MetaAdsService.calculateROAS(1000000, 100000);
      expect(roas).toBe(10);
    });

    it("deve lidar com valores muito pequenos", () => {
      const cpc = MetaAdsService.calculateCPC(0.01, 1);
      expect(cpc).toBe(0.01);
    });
  });
});
