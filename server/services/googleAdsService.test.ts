import { describe, it, expect, beforeAll } from "vitest";
import GoogleAdsService from "./googleAdsService";

describe("GoogleAdsService", () => {
  describe("Cálculos de Métricas", () => {
    it("deve calcular ROAS corretamente", () => {
      const roas = GoogleAdsService.calculateROAS(5000, 1000);
      expect(roas).toBe(5);
    });

    it("deve retornar 0 quando spend é 0", () => {
      const roas = GoogleAdsService.calculateROAS(5000, 0);
      expect(roas).toBe(0);
    });

    it("deve calcular CTR corretamente", () => {
      const ctr = GoogleAdsService.calculateCTR(100, 2000);
      expect(ctr).toBe(5);
    });

    it("deve calcular CPC corretamente", () => {
      const cpc = GoogleAdsService.calculateCPC(500, 100);
      expect(cpc).toBe(5);
    });

    it("deve calcular CPM corretamente", () => {
      const cpm = GoogleAdsService.calculateCPM(500, 20000);
      expect(cpm).toBe(25);
    });

    it("deve retornar 0 para CTR quando impressões é 0", () => {
      const ctr = GoogleAdsService.calculateCTR(100, 0);
      expect(ctr).toBe(0);
    });

    it("deve retornar 0 para CPC quando clicks é 0", () => {
      const cpc = GoogleAdsService.calculateCPC(500, 0);
      expect(cpc).toBe(0);
    });

    it("deve retornar 0 para CPM quando impressões é 0", () => {
      const cpm = GoogleAdsService.calculateCPM(500, 0);
      expect(cpm).toBe(0);
    });
  });

  describe("Conversão de Micros", () => {
    it("deve converter micros para unidades corretamente", () => {
      const value = GoogleAdsService.convertMicrosToUnits("1000000");
      expect(value).toBe(1);
    });

    it("deve converter valores grandes de micros", () => {
      const value = GoogleAdsService.convertMicrosToUnits("5000000000");
      expect(value).toBe(5000);
    });

    it("deve converter valores pequenos de micros", () => {
      const value = GoogleAdsService.convertMicrosToUnits("500000");
      expect(value).toBe(0.5);
    });

    it("deve converter zero micros", () => {
      const value = GoogleAdsService.convertMicrosToUnits("0");
      expect(value).toBe(0);
    });
  });

  describe("Validação de Configuração", () => {
    it("deve ter variáveis de ambiente configuradas", () => {
      const googleClientId = process.env.GOOGLE_ADS_CLIENT_ID;
      const googleClientSecret = process.env.GOOGLE_ADS_CLIENT_SECRET;

      // Verificar se as variáveis estão definidas
      // Em desenvolvimento, podem estar vazias, mas devem estar definidas
      expect(googleClientId).toBeDefined();
      expect(googleClientSecret).toBeDefined();
    });

    it("deve ter developer token configurado", () => {
      const developerToken = process.env.GOOGLE_ADS_DEVELOPER_TOKEN;
      expect(developerToken).toBeDefined();
    });
  });

  describe("Instanciação do Serviço", () => {
    it("deve criar instância do serviço com token e customer ID", () => {
      const service = new GoogleAdsService("test_token", "1234567890");
      expect(service).toBeDefined();
    });

    it("deve criar instância sem customer ID para operações de autenticação", () => {
      const service = new GoogleAdsService("test_token", "");
      expect(service).toBeDefined();
    });
  });

  describe("Cálculos de Métricas - Casos Extremos", () => {
    it("deve lidar com valores decimais", () => {
      const roas = GoogleAdsService.calculateROAS(1234.56, 567.89);
      expect(typeof roas).toBe("number");
      expect(roas).toBeGreaterThan(0);
    });

    it("deve lidar com valores muito grandes", () => {
      const roas = GoogleAdsService.calculateROAS(10000000, 1000000);
      expect(roas).toBe(10);
    });

    it("deve lidar com valores muito pequenos", () => {
      const cpc = GoogleAdsService.calculateCPC(0.01, 1);
      expect(cpc).toBe(0.01);
    });

    it("deve arredondar corretamente para 2 casas decimais", () => {
      const roas = GoogleAdsService.calculateROAS(1000.456, 200);
      expect(roas).toBe(5.00);
    });
  });

  describe("Comparação com Meta Ads", () => {
    it("deve usar o mesmo padrão de cálculo de ROAS", () => {
      const googleROAS = GoogleAdsService.calculateROAS(1000, 250);
      const expectedROAS = 4;
      expect(googleROAS).toBe(expectedROAS);
    });

    it("deve usar o mesmo padrão de cálculo de CTR", () => {
      const googleCTR = GoogleAdsService.calculateCTR(50, 1000);
      const expectedCTR = 5;
      expect(googleCTR).toBe(expectedCTR);
    });

    it("deve usar o mesmo padrão de cálculo de CPC", () => {
      const googleCPC = GoogleAdsService.calculateCPC(250, 50);
      const expectedCPC = 5;
      expect(googleCPC).toBe(expectedCPC);
    });
  });
});
