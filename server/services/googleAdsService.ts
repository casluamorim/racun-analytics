import axios from "axios";

const GOOGLE_ADS_API_VERSION = "v15";
const GOOGLE_ADS_API_URL = `https://googleads.googleapis.com/${GOOGLE_ADS_API_VERSION}`;

interface GoogleAccessTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
}

interface GoogleAdsCampaign {
  resourceName: string;
  id: string;
  name: string;
  status: "ENABLED" | "PAUSED" | "REMOVED" | "UNSPECIFIED";
  advertisingChannelType: string;
  budget?: {
    resourceName: string;
    amountMicros: string;
  };
  startDate?: string;
  endDate?: string;
}

interface GoogleAdsMetrics {
  metrics: {
    impressions: string;
    clicks: string;
    costMicros: string;
    conversions: string;
    conversionValue: string;
    ctrPercent: string;
    averageCpc: string;
    averageCpm: string;
  };
  segments: {
    date: string;
  };
}

/**
 * Serviço de integração com Google Ads API
 * Responsável por autenticação OAuth, sincronização de campanhas e métricas
 */
export class GoogleAdsService {
  private accessToken: string;
  private customerId: string;

  constructor(accessToken: string, customerId: string) {
    this.accessToken = accessToken;
    this.customerId = customerId;
  }

  /**
   * Troca o authorization code por um access token
   */
  static async exchangeCodeForToken(
    code: string,
    redirectUri: string,
    clientId: string,
    clientSecret: string
  ): Promise<GoogleAccessTokenResponse> {
    try {
      const response = await axios.post(
        "https://oauth2.googleapis.com/token",
        {
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: "authorization_code",
        }
      );

      return response.data;
    } catch (error) {
      console.error("[Google Ads] Erro ao trocar código por token:", error);
      throw new Error("Falha ao autenticar com Google Ads");
    }
  }

  /**
   * Renova o access token usando o refresh token
   */
  static async refreshAccessToken(
    refreshToken: string,
    clientId: string,
    clientSecret: string
  ): Promise<GoogleAccessTokenResponse> {
    try {
      const response = await axios.post(
        "https://oauth2.googleapis.com/token",
        {
          refresh_token: refreshToken,
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: "refresh_token",
        }
      );

      return response.data;
    } catch (error) {
      console.error("[Google Ads] Erro ao renovar token:", error);
      throw new Error("Falha ao renovar token de acesso");
    }
  }

  /**
   * Obtém a lista de contas de anúncios do usuário
   */
  async getCustomerAccounts(): Promise<any[]> {
    try {
      const response = await axios.get(
        `${GOOGLE_ADS_API_URL}/customers:listAccessibleCustomers`,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            "developer-token": process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
          },
        }
      );

      return response.data.resourceNames || [];
    } catch (error) {
      console.error("[Google Ads] Erro ao buscar contas:", error);
      throw new Error("Falha ao buscar contas de anúncios");
    }
  }

  /**
   * Sincroniza todas as campanhas da conta
   */
  async syncCampaigns(): Promise<GoogleAdsCampaign[]> {
    try {
      const query = `
        SELECT
          campaign.id,
          campaign.name,
          campaign.status,
          campaign.advertising_channel_type,
          campaign.budget,
          campaign.start_date,
          campaign.end_date
        FROM campaign
        WHERE campaign.status != REMOVED
        ORDER BY campaign.id DESC
      `;

      const response = await axios.post(
        `${GOOGLE_ADS_API_URL}/customers/${this.customerId}/googleAds:search`,
        { query },
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            "developer-token": process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
            "google-ads-api-version": GOOGLE_ADS_API_VERSION,
          },
        }
      );

      return response.data.results || [];
    } catch (error) {
      console.error("[Google Ads] Erro ao sincronizar campanhas:", error);
      throw new Error("Falha ao sincronizar campanhas");
    }
  }

  /**
   * Obtém métricas de uma campanha para um período específico
   */
  async getCampaignMetrics(
    campaignId: string,
    startDate: string,
    endDate: string
  ): Promise<GoogleAdsMetrics[]> {
    try {
      const query = `
        SELECT
          campaign.id,
          campaign.name,
          segments.date,
          metrics.impressions,
          metrics.clicks,
          metrics.cost_micros,
          metrics.conversions,
          metrics.conversion_value,
          metrics.ctr,
          metrics.average_cpc,
          metrics.average_cpm
        FROM campaign
        WHERE campaign.id = '${campaignId}'
          AND segments.date >= '${startDate}'
          AND segments.date <= '${endDate}'
        ORDER BY segments.date DESC
      `;

      const response = await axios.post(
        `${GOOGLE_ADS_API_URL}/customers/${this.customerId}/googleAds:search`,
        { query },
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            "developer-token": process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
            "google-ads-api-version": GOOGLE_ADS_API_VERSION,
          },
        }
      );

      return response.data.results || [];
    } catch (error) {
      console.error("[Google Ads] Erro ao buscar métricas da campanha:", error);
      throw new Error("Falha ao buscar métricas");
    }
  }

  /**
   * Obtém métricas agregadas de todas as campanhas
   */
  async getAccountMetrics(
    startDate: string,
    endDate: string
  ): Promise<GoogleAdsMetrics[]> {
    try {
      const query = `
        SELECT
          segments.date,
          metrics.impressions,
          metrics.clicks,
          metrics.cost_micros,
          metrics.conversions,
          metrics.conversion_value,
          metrics.ctr,
          metrics.average_cpc,
          metrics.average_cpm
        FROM campaign
        WHERE segments.date >= '${startDate}'
          AND segments.date <= '${endDate}'
        ORDER BY segments.date DESC
      `;

      const response = await axios.post(
        `${GOOGLE_ADS_API_URL}/customers/${this.customerId}/googleAds:search`,
        { query },
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            "developer-token": process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
            "google-ads-api-version": GOOGLE_ADS_API_VERSION,
          },
        }
      );

      return response.data.results || [];
    } catch (error) {
      console.error("[Google Ads] Erro ao buscar métricas da conta:", error);
      throw new Error("Falha ao buscar métricas da conta");
    }
  }

  /**
   * Obtém palavras-chave de uma campanha
   */
  async getCampaignKeywords(campaignId: string): Promise<any[]> {
    try {
      const query = `
        SELECT
          ad_group_criterion.criterion_id,
          ad_group_criterion.keyword.text,
          ad_group_criterion.keyword.match_type,
          ad_group_criterion.status,
          metrics.impressions,
          metrics.clicks,
          metrics.cost_micros,
          metrics.conversions
        FROM ad_group_criterion
        WHERE campaign.id = '${campaignId}'
          AND ad_group_criterion.type = KEYWORD
        ORDER BY metrics.impressions DESC
      `;

      const response = await axios.post(
        `${GOOGLE_ADS_API_URL}/customers/${this.customerId}/googleAds:search`,
        { query },
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            "developer-token": process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
            "google-ads-api-version": GOOGLE_ADS_API_VERSION,
          },
        }
      );

      return response.data.results || [];
    } catch (error) {
      console.error("[Google Ads] Erro ao buscar palavras-chave:", error);
      throw new Error("Falha ao buscar palavras-chave");
    }
  }

  /**
   * Valida se o token ainda é válido
   */
  async validateToken(): Promise<boolean> {
    try {
      const response = await axios.get(
        `${GOOGLE_ADS_API_URL}/customers/${this.customerId}`,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            "developer-token": process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
          },
        }
      );

      return !!response.data;
    } catch (error) {
      console.error("[Google Ads] Erro ao validar token:", error);
      return false;
    }
  }

  /**
   * Calcula ROAS (Return on Ad Spend) a partir das métricas
   */
  static calculateROAS(conversionValue: number, spend: number): number {
    if (spend === 0) return 0;
    return Number((conversionValue / spend).toFixed(2));
  }

  /**
   * Calcula CTR (Click-through Rate)
   */
  static calculateCTR(clicks: number, impressions: number): number {
    if (impressions === 0) return 0;
    return Number(((clicks / impressions) * 100).toFixed(2));
  }

  /**
   * Calcula CPC (Cost per Click)
   */
  static calculateCPC(spend: number, clicks: number): number {
    if (clicks === 0) return 0;
    return Number((spend / clicks).toFixed(2));
  }

  /**
   * Calcula CPM (Cost per Thousand Impressions)
   */
  static calculateCPM(spend: number, impressions: number): number {
    if (impressions === 0) return 0;
    return Number((spend / (impressions / 1000)).toFixed(2));
  }

  /**
   * Converte micros para unidade padrão (Google Ads usa micros para valores monetários)
   */
  static convertMicrosToUnits(micros: string): number {
    return Number((parseInt(micros) / 1000000).toFixed(2));
  }
}

export default GoogleAdsService;
