import { getDb } from "./db";
import {
  integrationAccounts,
  metaCampaigns,
  metaMetrics,
  googleAdsCampaigns,
  googleAdsMetrics,
  googleAdsKeywords,
  integrationLogs,
  InsertIntegrationAccount,
  InsertMetaCampaign,
  InsertMetaMetric,
  InsertGoogleAdsCampaign,
  InsertGoogleAdsMetric,
  InsertGoogleAdsKeyword,
  InsertIntegrationLog,
} from "../drizzle/schema-integrations";
import { eq, and, gte } from "drizzle-orm";

/**
 * Integração com Meta Ads - Persistência de Dados
 */

/**
 * Salvar ou atualizar conta de integração do Meta
 */
export async function upsertMetaIntegrationAccount(
  data: InsertIntegrationAccount
): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[DB] Database not available");
    return;
  }

  try {
    await db
      .insert(integrationAccounts)
      .values(data)
      .onDuplicateKeyUpdate({
        set: {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          lastSyncAt: new Date(),
          status: data.status || "active",
        },
      });
  } catch (error) {
    console.error("[DB] Erro ao upsert conta Meta:", error);
    throw error;
  }
}

/**
 * Salvar campanhas do Meta
 */
export async function saveMetaCampaigns(
  campaigns: InsertMetaCampaign[]
): Promise<void> {
  const db = await getDb();
  if (!db || campaigns.length === 0) return;

  try {
    for (const campaign of campaigns) {
      await db
        .insert(metaCampaigns)
        .values(campaign)
        .onDuplicateKeyUpdate({
          set: {
            name: campaign.name,
            status: campaign.status,
            dailyBudget: campaign.dailyBudget,
            syncedAt: new Date(),
          },
        });
    }
  } catch (error) {
    console.error("[DB] Erro ao salvar campanhas Meta:", error);
    throw error;
  }
}

/**
 * Salvar métricas do Meta
 */
export async function saveMetaMetrics(
  metrics: InsertMetaMetric[]
): Promise<void> {
  const db = await getDb();
  if (!db || metrics.length === 0) return;

  try {
    for (const metric of metrics) {
      await db
        .insert(metaMetrics)
        .values(metric)
        .onDuplicateKeyUpdate({
          set: {
            spend: metric.spend,
            impressions: metric.impressions,
            clicks: metric.clicks,
            conversions: metric.conversions,
            conversionValue: metric.conversionValue,
            ctr: metric.ctr,
            cpc: metric.cpc,
            cpm: metric.cpm,
            roas: metric.roas,
          },
        });
    }
  } catch (error) {
    console.error("[DB] Erro ao salvar métricas Meta:", error);
    throw error;
  }
}

/**
 * Obter campanhas do Meta por conta
 */
export async function getMetaCampaignsByAccount(
  integrationAccountId: number
): Promise<any[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db
      .select()
      .from(metaCampaigns)
      .where(eq(metaCampaigns.integrationAccountId, integrationAccountId));
  } catch (error) {
    console.error("[DB] Erro ao obter campanhas Meta:", error);
    return [];
  }
}

/**
 * Obter métricas do Meta por período
 */
export async function getMetaMetricsByPeriod(
  metaCampaignId: number,
  startDate: Date,
  endDate: Date
): Promise<any[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db
      .select()
      .from(metaMetrics)
      .where(
        and(
          eq(metaMetrics.metaCampaignId, metaCampaignId),
          gte(metaMetrics.date, startDate),
          gte(metaMetrics.date, endDate)
        )
      );
  } catch (error) {
    console.error("[DB] Erro ao obter métricas Meta:", error);
    return [];
  }
}

/**
 * Integração com Google Ads - Persistência de Dados
 */

/**
 * Salvar campanhas do Google Ads
 */
export async function saveGoogleAdsCampaigns(
  campaigns: InsertGoogleAdsCampaign[]
): Promise<void> {
  const db = await getDb();
  if (!db || campaigns.length === 0) return;

  try {
    for (const campaign of campaigns) {
      await db
        .insert(googleAdsCampaigns)
        .values(campaign)
        .onDuplicateKeyUpdate({
          set: {
            name: campaign.name,
            status: campaign.status,
            budget: campaign.budget,
            syncedAt: new Date(),
          },
        });
    }
  } catch (error) {
    console.error("[DB] Erro ao salvar campanhas Google Ads:", error);
    throw error;
  }
}

/**
 * Salvar métricas do Google Ads
 */
export async function saveGoogleAdsMetrics(
  metrics: InsertGoogleAdsMetric[]
): Promise<void> {
  const db = await getDb();
  if (!db || metrics.length === 0) return;

  try {
    for (const metric of metrics) {
      await db
        .insert(googleAdsMetrics)
        .values(metric)
        .onDuplicateKeyUpdate({
          set: {
            spend: metric.spend,
            impressions: metric.impressions,
            clicks: metric.clicks,
            conversions: metric.conversions,
            conversionValue: metric.conversionValue,
            ctr: metric.ctr,
            cpc: metric.cpc,
            cpm: metric.cpm,
            roas: metric.roas,
          },
        });
    }
  } catch (error) {
    console.error("[DB] Erro ao salvar métricas Google Ads:", error);
    throw error;
  }
}

/**
 * Salvar palavras-chave do Google Ads
 */
export async function saveGoogleAdsKeywords(
  keywords: InsertGoogleAdsKeyword[]
): Promise<void> {
  const db = await getDb();
  if (!db || keywords.length === 0) return;

  try {
    for (const keyword of keywords) {
      await db
        .insert(googleAdsKeywords)
        .values(keyword)
        .onDuplicateKeyUpdate({
          set: {
            text: keyword.text,
            status: keyword.status,
            impressions: keyword.impressions,
            clicks: keyword.clicks,
            spend: keyword.spend,
            conversions: keyword.conversions,
          },
        });
    }
  } catch (error) {
    console.error("[DB] Erro ao salvar palavras-chave Google Ads:", error);
    throw error;
  }
}

/**
 * Obter campanhas do Google Ads por conta
 */
export async function getGoogleAdsCampaignsByAccount(
  integrationAccountId: number
): Promise<any[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db
      .select()
      .from(googleAdsCampaigns)
      .where(eq(googleAdsCampaigns.integrationAccountId, integrationAccountId));
  } catch (error) {
    console.error("[DB] Erro ao obter campanhas Google Ads:", error);
    return [];
  }
}

/**
 * Obter métricas do Google Ads por período
 */
export async function getGoogleAdsMetricsByPeriod(
  googleAdsCampaignId: number,
  startDate: Date,
  endDate: Date
): Promise<any[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db
      .select()
      .from(googleAdsMetrics)
      .where(
        and(
          eq(googleAdsMetrics.googleAdsCampaignId, googleAdsCampaignId),
          gte(googleAdsMetrics.date, startDate),
          gte(googleAdsMetrics.date, endDate)
        )
      );
  } catch (error) {
    console.error("[DB] Erro ao obter métricas Google Ads:", error);
    return [];
  }
}

/**
 * Logs de Sincronização
 */

/**
 * Registrar log de sincronização
 */
export async function logIntegrationSync(
  data: InsertIntegrationLog
): Promise<void> {
  const db = await getDb();
  if (!db) return;

  try {
    await db.insert(integrationLogs).values(data);
  } catch (error) {
    console.error("[DB] Erro ao registrar log de sincronização:", error);
  }
}

/**
 * Obter histórico de sincronizações
 */
export async function getSyncHistory(
  integrationAccountId: number,
  limit: number = 50
): Promise<any[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db
      .select()
      .from(integrationLogs)
      .where(eq(integrationLogs.integrationAccountId, integrationAccountId))
      .orderBy((table) => table.id)
      .limit(limit);
  } catch (error) {
    console.error("[DB] Erro ao obter histórico de sincronizações:", error);
    return [];
  }
}

/**
 * Obter estatísticas de sincronização
 */
export async function getSyncStatistics(
  integrationAccountId: number
): Promise<{
  totalSyncs: number;
  successCount: number;
  errorCount: number;
  totalRecordsProcessed: number;
  totalRecordsFailed: number;
}> {
  const db = await getDb();
  if (!db) {
    return {
      totalSyncs: 0,
      successCount: 0,
      errorCount: 0,
      totalRecordsProcessed: 0,
      totalRecordsFailed: 0,
    };
  }

  try {
    const logs = await db
      .select()
      .from(integrationLogs)
      .where(eq(integrationLogs.integrationAccountId, integrationAccountId));

    const successCount = logs.filter((l) => l.status === "success").length;
    const errorCount = logs.filter((l) => l.status === "error").length;
    const totalRecordsProcessed = logs.reduce(
      (sum, l) => sum + (l.recordsProcessed || 0),
      0
    );
    const totalRecordsFailed = logs.reduce(
      (sum, l) => sum + (l.recordsFailed || 0),
      0
    );

    return {
      totalSyncs: logs.length,
      successCount,
      errorCount,
      totalRecordsProcessed,
      totalRecordsFailed,
    };
  } catch (error) {
    console.error("[DB] Erro ao obter estatísticas de sincronização:", error);
    return {
      totalSyncs: 0,
      successCount: 0,
      errorCount: 0,
      totalRecordsProcessed: 0,
      totalRecordsFailed: 0,
    };
  }
}
