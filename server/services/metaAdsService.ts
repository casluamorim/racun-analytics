import axios from "axios";

const META_API_VERSION = "v18.0";
const META_GRAPH_API_URL = `https://graph.instagram.com/${META_API_VERSION}`;

interface MetaAccessTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface MetaCampaign {
  id: string;
  name: string;
  status: "ACTIVE" | "PAUSED" | "DELETED" | "ARCHIVED";
  objective: string;
  daily_budget?: number;
  lifetime_budget?: number;
  start_time?: string;
  stop_time?: string;
}

interface MetaCampaignInsights {
  date_start: string;
  date_stop: string;
  spend: string;
  impressions: string;
  clicks: string;
  conversions: string;
  conversion_value: string;
  ctr: string;
  cpc: string;
  cpm: string;
  roas: string;
}

/**
 * Serviço de integração com Meta Ads API
 * Responsável por autenticação, sincronização de campanhas e métricas
 */
export class MetaAdsService {
  private accessToken: string;
  private adAccountId: string;

  constructor(accessToken: string, adAccountId: string) {
    this.accessToken = accessToken;
    this.adAccountId = adAccountId;
  }

  /**
   * Troca o authorization code por um access token permanente
   */
  static async exchangeCodeForToken(
    code: string,
    redirectUri: string,
    appId: string,
    appSecret: string
  ): Promise<MetaAccessTokenResponse> {
    try {
      const response = await axios.get(
        `${META_GRAPH_API_URL}/oauth/access_token`,
        {
          params: {
            client_id: appId,
            client_secret: appSecret,
            redirect_uri: redirectUri,
            code,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("[Meta] Erro ao trocar código por token:", error);
      throw new Error("Falha ao autenticar com Meta");
    }
  }

  /**
   * Obtém informações da conta do usuário
   */
  async getAdAccounts(): Promise<any[]> {
    try {
      const response = await axios.get(
        `${META_GRAPH_API_URL}/me/adaccounts`,
        {
          params: {
            access_token: this.accessToken,
            fields: "id,name,currency,account_status,business_name",
          },
        }
      );

      return response.data.data || [];
    } catch (error) {
      console.error("[Meta] Erro ao buscar contas de anúncios:", error);
      throw new Error("Falha ao buscar contas de anúncios");
    }
  }

  /**
   * Sincroniza todas as campanhas da conta
   */
  async syncCampaigns(): Promise<MetaCampaign[]> {
    try {
      const response = await axios.get(
        `${META_GRAPH_API_URL}/${this.adAccountId}/campaigns`,
        {
          params: {
            access_token: this.accessToken,
            fields: "id,name,status,objective,daily_budget,lifetime_budget,start_time,stop_time",
            limit: 100,
          },
        }
      );

      return response.data.data || [];
    } catch (error) {
      console.error("[Meta] Erro ao sincronizar campanhas:", error);
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
  ): Promise<MetaCampaignInsights[]> {
    try {
      const response = await axios.get(
        `${META_GRAPH_API_URL}/${campaignId}/insights`,
        {
          params: {
            access_token: this.accessToken,
            fields:
              "date_start,date_stop,spend,impressions,clicks,conversions,conversion_value,ctr,cpc,cpm,roas",
            time_range: JSON.stringify({
              since: startDate,
              until: endDate,
            }),
            time_increment: 1, // Daily
          },
        }
      );

      return response.data.data || [];
    } catch (error) {
      console.error("[Meta] Erro ao buscar métricas da campanha:", error);
      throw new Error("Falha ao buscar métricas");
    }
  }

  /**
   * Obtém métricas agregadas de todas as campanhas
   */
  async getAccountMetrics(
    startDate: string,
    endDate: string
  ): Promise<MetaCampaignInsights[]> {
    try {
      const response = await axios.get(
        `${META_GRAPH_API_URL}/${this.adAccountId}/insights`,
        {
          params: {
            access_token: this.accessToken,
            fields:
              "date_start,date_stop,spend,impressions,clicks,conversions,conversion_value,ctr,cpc,cpm,roas",
            time_range: JSON.stringify({
              since: startDate,
              until: endDate,
            }),
            time_increment: 1, // Daily
          },
        }
      );

      return response.data.data || [];
    } catch (error) {
      console.error("[Meta] Erro ao buscar métricas da conta:", error);
      throw new Error("Falha ao buscar métricas da conta");
    }
  }

  /**
   * Valida se o token ainda é válido
   */
  async validateToken(): Promise<boolean> {
    try {
      const response = await axios.get(
        `${META_GRAPH_API_URL}/debug_token`,
        {
          params: {
            input_token: this.accessToken,
            access_token: this.accessToken,
          },
        }
      );

      const data = response.data.data;
      return data.is_valid && !data.error;
    } catch (error) {
      console.error("[Meta] Erro ao validar token:", error);
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
}

export default MetaAdsService;
