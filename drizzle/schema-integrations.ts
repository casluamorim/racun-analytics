import { int, varchar, text, timestamp, decimal, mysqlEnum, boolean, index } from "drizzle-orm/mysql-core";
import { mysqlTable } from "drizzle-orm/mysql-core";

/**
 * Integration Accounts - Armazena credenciais de integrações
 */
export const integrationAccounts = mysqlTable("integrationAccounts", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  platform: mysqlEnum("platform", ["meta", "google", "tiktok", "mercado_livre", "shopee", "amazon"]).notNull(),
  accountName: varchar("accountName", { length: 255 }).notNull(),
  accessToken: text("accessToken").notNull(),
  refreshToken: text("refreshToken"),
  externalAccountId: varchar("externalAccountId", { length: 255 }).notNull(),
  externalAccountName: varchar("externalAccountName", { length: 255 }),
  status: mysqlEnum("status", ["active", "inactive", "error", "expired"]).default("active").notNull(),
  lastSyncAt: timestamp("lastSyncAt"),
  lastErrorAt: timestamp("lastErrorAt"),
  lastErrorMessage: text("lastErrorMessage"),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  clientPlatformIdx: index("clientPlatform_idx").on(table.clientId, table.platform),
  statusIdx: index("status_idx").on(table.status),
}));

export type IntegrationAccount = typeof integrationAccounts.$inferSelect;
export type InsertIntegrationAccount = typeof integrationAccounts.$inferInsert;

/**
 * Meta Ads Campaigns - Campanhas sincronizadas do Meta
 */
export const metaCampaigns = mysqlTable("metaCampaigns", {
  id: int("id").autoincrement().primaryKey(),
  integrationAccountId: int("integrationAccountId").notNull(),
  externalCampaignId: varchar("externalCampaignId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  status: mysqlEnum("status", ["ACTIVE", "PAUSED", "DELETED", "ARCHIVED"]).notNull(),
  objective: varchar("objective", { length: 100 }),
  dailyBudget: decimal("dailyBudget", { precision: 12, scale: 2 }),
  lifetimeBudget: decimal("lifetimeBudget", { precision: 12, scale: 2 }),
  startDate: timestamp("startDate"),
  endDate: timestamp("endDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  syncedAt: timestamp("syncedAt"),
}, (table) => ({
  integrationIdx: index("integrationAccount_idx").on(table.integrationAccountId),
  externalIdIdx: index("externalCampaignId_idx").on(table.externalCampaignId),
}));

export type MetaCampaign = typeof metaCampaigns.$inferSelect;
export type InsertMetaCampaign = typeof metaCampaigns.$inferInsert;

/**
 * Meta Ads Metrics - Métricas diárias de campanhas
 */
export const metaMetrics = mysqlTable("metaMetrics", {
  id: int("id").autoincrement().primaryKey(),
  metaCampaignId: int("metaCampaignId").notNull(),
  date: timestamp("date").notNull(),
  spend: decimal("spend", { precision: 12, scale: 2 }).notNull(),
  impressions: int("impressions").notNull(),
  clicks: int("clicks").notNull(),
  conversions: decimal("conversions", { precision: 10, scale: 2 }).notNull(),
  conversionValue: decimal("conversionValue", { precision: 12, scale: 2 }),
  ctr: decimal("ctr", { precision: 5, scale: 2 }), // Click-through rate
  cpc: decimal("cpc", { precision: 8, scale: 2 }), // Cost per click
  cpm: decimal("cpm", { precision: 8, scale: 2 }), // Cost per thousand impressions
  roas: decimal("roas", { precision: 5, scale: 2 }), // Return on ad spend
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  campaignDateIdx: index("campaignDate_idx").on(table.metaCampaignId, table.date),
}));

export type MetaMetric = typeof metaMetrics.$inferSelect;
export type InsertMetaMetric = typeof metaMetrics.$inferInsert;

/**
 * Google Ads Campaigns - Campanhas sincronizadas do Google Ads
 */
export const googleAdsCampaigns = mysqlTable("googleAdsCampaigns", {
  id: int("id").autoincrement().primaryKey(),
  integrationAccountId: int("integrationAccountId").notNull(),
  externalCampaignId: varchar("externalCampaignId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  status: mysqlEnum("status", ["ENABLED", "PAUSED", "REMOVED", "UNSPECIFIED"]).notNull(),
  advertisingChannelType: varchar("advertisingChannelType", { length: 100 }),
  budget: decimal("budget", { precision: 12, scale: 2 }),
  startDate: timestamp("startDate"),
  endDate: timestamp("endDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  syncedAt: timestamp("syncedAt"),
}, (table) => ({
  integrationIdx: index("googleIntegrationAccount_idx").on(table.integrationAccountId),
  externalIdIdx: index("googleExternalCampaignId_idx").on(table.externalCampaignId),
}));

export type GoogleAdsCampaign = typeof googleAdsCampaigns.$inferSelect;
export type InsertGoogleAdsCampaign = typeof googleAdsCampaigns.$inferInsert;

/**
 * Google Ads Metrics - Métricas diárias de campanhas
 */
export const googleAdsMetrics = mysqlTable("googleAdsMetrics", {
  id: int("id").autoincrement().primaryKey(),
  googleAdsCampaignId: int("googleAdsCampaignId").notNull(),
  date: timestamp("date").notNull(),
  spend: decimal("spend", { precision: 12, scale: 2 }).notNull(),
  impressions: int("impressions").notNull(),
  clicks: int("clicks").notNull(),
  conversions: decimal("conversions", { precision: 10, scale: 2 }).notNull(),
  conversionValue: decimal("conversionValue", { precision: 12, scale: 2 }),
  ctr: decimal("ctr", { precision: 5, scale: 2 }),
  cpc: decimal("cpc", { precision: 8, scale: 2 }),
  cpm: decimal("cpm", { precision: 8, scale: 2 }),
  roas: decimal("roas", { precision: 5, scale: 2 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  campaignDateIdx: index("googleCampaignDate_idx").on(table.googleAdsCampaignId, table.date),
}));

export type GoogleAdsMetric = typeof googleAdsMetrics.$inferSelect;
export type InsertGoogleAdsMetric = typeof googleAdsMetrics.$inferInsert;

/**
 * Google Ads Keywords - Palavras-chave sincronizadas
 */
export const googleAdsKeywords = mysqlTable("googleAdsKeywords", {
  id: int("id").autoincrement().primaryKey(),
  googleAdsCampaignId: int("googleAdsCampaignId").notNull(),
  externalKeywordId: varchar("externalKeywordId", { length: 255 }).notNull().unique(),
  text: varchar("text", { length: 255 }).notNull(),
  matchType: mysqlEnum("matchType", ["EXACT", "PHRASE", "BROAD", "BROAD_MODIFIED"]).notNull(),
  status: mysqlEnum("status", ["ENABLED", "PAUSED", "REMOVED"]).notNull(),
  impressions: int("impressions").default(0).notNull(),
  clicks: int("clicks").default(0).notNull(),
  spend: decimal("spend", { precision: 12, scale: 2 }).default("0").notNull(),
  conversions: decimal("conversions", { precision: 10, scale: 2 }).default("0").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  campaignIdx: index("googleKeywordsCampaign_idx").on(table.googleAdsCampaignId),
  externalIdIdx: index("googleExternalKeywordId_idx").on(table.externalKeywordId),
}));

export type GoogleAdsKeyword = typeof googleAdsKeywords.$inferSelect;
export type InsertGoogleAdsKeyword = typeof googleAdsKeywords.$inferInsert;

/**
 * Integration Logs - Histórico de sincronizações
 */
export const integrationLogs = mysqlTable("integrationLogs", {
  id: int("id").autoincrement().primaryKey(),
  integrationAccountId: int("integrationAccountId").notNull(),
  action: varchar("action", { length: 100 }).notNull(), // sync_campaigns, sync_metrics, etc
  status: mysqlEnum("status", ["success", "error", "pending"]).notNull(),
  message: text("message"),
  recordsProcessed: int("recordsProcessed").default(0),
  recordsFailed: int("recordsFailed").default(0),
  startedAt: timestamp("startedAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
}, (table) => ({
  integrationIdx: index("integrationAccount_idx").on(table.integrationAccountId),
  statusIdx: index("status_idx").on(table.status),
}));

export type IntegrationLog = typeof integrationLogs.$inferSelect;
export type InsertIntegrationLog = typeof integrationLogs.$inferInsert;
