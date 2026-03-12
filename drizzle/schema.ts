import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean, json, index, unique } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extended with multi-tenant support.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  clientId: int("clientId"),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "client"]).default("user").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
}, (table) => ({
  clientIdIdx: index("clientId_idx").on(table.clientId),
}));

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Clients table - Multi-tenant support
 */
export const clients = mysqlTable("clients", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  company: varchar("company", { length: 255 }),
  city: varchar("city", { length: 100 }),
  segment: varchar("segment", { length: 100 }),
  budget: decimal("budget", { precision: 12, scale: 2 }),
  status: mysqlEnum("status", ["lead", "prospect", "active", "inactive", "churned"]).default("lead").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  statusIdx: index("status_idx").on(table.status),
}));

export type Client = typeof clients.$inferSelect;
export type InsertClient = typeof clients.$inferInsert;

/**
 * Client Settings
 */
export const clientSettings = mysqlTable("clientSettings", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  reportFrequency: mysqlEnum("reportFrequency", ["weekly", "biweekly", "monthly"]).default("weekly").notNull(),
  reportDay: varchar("reportDay", { length: 10 }).default("sunday"),
  reportTime: varchar("reportTime", { length: 5 }).default("16:00"),
  timezone: varchar("timezone", { length: 50 }).default("America/Sao_Paulo"),
  notificationsEnabled: boolean("notificationsEnabled").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  clientIdIdx: index("clientId_idx").on(table.clientId),
}));

export type ClientSettings = typeof clientSettings.$inferSelect;
export type InsertClientSettings = typeof clientSettings.$inferInsert;

/**
 * Leads - CRM
 */
export const leads = mysqlTable("leads", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  company: varchar("company", { length: 255 }),
  origin: varchar("origin", { length: 100 }),
  channel: varchar("channel", { length: 100 }),
  campaign: varchar("campaign", { length: 255 }),
  product: varchar("product", { length: 255 }),
  potentialValue: decimal("potentialValue", { precision: 12, scale: 2 }),
  stage: mysqlEnum("stage", ["new", "qualified", "demo", "proposal", "negotiation", "converted", "lost", "reactivation"]).default("new").notNull(),
  owner: varchar("owner", { length: 255 }),
  notes: text("notes"),
  lastInteraction: timestamp("lastInteraction"),
  nextAction: varchar("nextAction", { length: 255 }),
  nextActionDate: timestamp("nextActionDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  clientIdIdx: index("clientId_idx").on(table.clientId),
  stageIdx: index("stage_idx").on(table.stage),
  emailIdx: index("email_idx").on(table.email),
}));

export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;

/**
 * Lead Activities - Timeline de interações
 */
export const leadActivities = mysqlTable("leadActivities", {
  id: int("id").autoincrement().primaryKey(),
  leadId: int("leadId").notNull(),
  clientId: int("clientId").notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  description: text("description"),
  createdBy: varchar("createdBy", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  leadIdIdx: index("leadId_idx").on(table.leadId),
  clientIdIdx: index("clientId_idx").on(table.clientId),
}));

export type LeadActivity = typeof leadActivities.$inferSelect;
export type InsertLeadActivity = typeof leadActivities.$inferInsert;

/**
 * Platform Connections - Integrações
 */
export const platformConnections = mysqlTable("platformConnections", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  platform: mysqlEnum("platform", ["meta", "google", "tiktok", "mercadolivre", "shopee", "amazon", "whatsapp", "google_calendar"]).notNull(),
  accountId: varchar("accountId", { length: 255 }).notNull(),
  accountName: varchar("accountName", { length: 255 }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  tokenExpiry: timestamp("tokenExpiry"),
  status: mysqlEnum("status", ["active", "inactive", "error", "expired"]).default("active").notNull(),
  lastSync: timestamp("lastSync"),
  syncError: text("syncError"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  clientIdIdx: index("clientId_idx").on(table.clientId),
  platformIdx: index("platform_idx").on(table.platform),
  uniqueConnection: unique("unique_connection").on(table.clientId, table.platform, table.accountId),
}));

export type PlatformConnection = typeof platformConnections.$inferSelect;
export type InsertPlatformConnection = typeof platformConnections.$inferInsert;

/**
 * Campaign Metrics - Tráfego Pago
 */
export const campaignMetrics = mysqlTable("campaignMetrics", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  platform: varchar("platform", { length: 50 }).notNull(),
  campaignId: varchar("campaignId", { length: 255 }).notNull(),
  campaignName: varchar("campaignName", { length: 255 }),
  date: timestamp("date").notNull(),
  spend: decimal("spend", { precision: 12, scale: 2 }),
  impressions: int("impressions"),
  clicks: int("clicks"),
  ctr: decimal("ctr", { precision: 5, scale: 3 }),
  cpc: decimal("cpc", { precision: 10, scale: 2 }),
  cpm: decimal("cpm", { precision: 10, scale: 2 }),
  conversions: int("conversions"),
  conversionValue: decimal("conversionValue", { precision: 12, scale: 2 }),
  cpa: decimal("cpa", { precision: 10, scale: 2 }),
  roas: decimal("roas", { precision: 5, scale: 2 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  clientIdIdx: index("clientId_idx").on(table.clientId),
  dateIdx: index("date_idx").on(table.date),
  campaignIdIdx: index("campaignId_idx").on(table.campaignId),
}));

export type CampaignMetric = typeof campaignMetrics.$inferSelect;
export type InsertCampaignMetric = typeof campaignMetrics.$inferInsert;

/**
 * Marketplace Metrics - Vendas
 */
export const marketplaceMetrics = mysqlTable("marketplaceMetrics", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  marketplace: varchar("marketplace", { length: 50 }).notNull(),
  date: timestamp("date").notNull(),
  orders: int("orders"),
  sales: decimal("sales", { precision: 12, scale: 2 }),
  revenue: decimal("revenue", { precision: 12, scale: 2 }),
  visits: int("visits"),
  clicks: int("clicks"),
  conversion: decimal("conversion", { precision: 5, scale: 3 }),
  averageTicket: decimal("averageTicket", { precision: 12, scale: 2 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  clientIdIdx: index("clientId_idx").on(table.clientId),
  dateIdx: index("date_idx").on(table.date),
}));

export type MarketplaceMetric = typeof marketplaceMetrics.$inferSelect;
export type InsertMarketplaceMetric = typeof marketplaceMetrics.$inferInsert;

/**
 * Products - Catálogo
 */
export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  sku: varchar("sku", { length: 100 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }),
  cost: decimal("cost", { precision: 12, scale: 2 }),
  price: decimal("price", { precision: 12, scale: 2 }),
  margin: decimal("margin", { precision: 5, scale: 2 }),
  stock: int("stock"),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  clientIdIdx: index("clientId_idx").on(table.clientId),
  skuIdx: index("sku_idx").on(table.sku),
}));

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

/**
 * AI Insights - Análises da IA
 */
export const aiInsights = mysqlTable("aiInsights", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  severity: mysqlEnum("severity", ["low", "medium", "high", "critical"]).default("medium").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  recommendation: text("recommendation"),
  dataSource: varchar("dataSource", { length: 100 }),
  period: varchar("period", { length: 50 }),
  status: mysqlEnum("status", ["new", "acknowledged", "resolved"]).default("new").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  clientIdIdx: index("clientId_idx").on(table.clientId),
  typeIdx: index("type_idx").on(table.type),
  severityIdx: index("severity_idx").on(table.severity),
}));

export type AIInsight = typeof aiInsights.$inferSelect;
export type InsertAIInsight = typeof aiInsights.$inferInsert;

/**
 * Requests - Solicitações de clientes
 */
export const requests = mysqlTable("requests", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  type: varchar("type", { length: 100 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  status: mysqlEnum("status", ["open", "in_progress", "waiting_approval", "completed", "rejected"]).default("open").notNull(),
  priority: mysqlEnum("priority", ["low", "medium", "high"]).default("medium").notNull(),
  createdBy: varchar("createdBy", { length: 255 }),
  assignedTo: varchar("assignedTo", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  clientIdIdx: index("clientId_idx").on(table.clientId),
  statusIdx: index("status_idx").on(table.status),
}));

export type Request = typeof requests.$inferSelect;
export type InsertRequest = typeof requests.$inferInsert;

/**
 * Tasks - Tarefas internas
 */
export const tasks = mysqlTable("tasks", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  status: mysqlEnum("status", ["todo", "in_progress", "done", "blocked"]).default("todo").notNull(),
  priority: mysqlEnum("priority", ["low", "medium", "high"]).default("medium").notNull(),
  assignedTo: varchar("assignedTo", { length: 255 }),
  dueDate: timestamp("dueDate"),
  relatedRequestId: int("relatedRequestId"),
  relatedLeadId: int("relatedLeadId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  clientIdIdx: index("clientId_idx").on(table.clientId),
  statusIdx: index("status_idx").on(table.status),
}));

export type Task = typeof tasks.$inferSelect;
export type InsertTask = typeof tasks.$inferInsert;

/**
 * Demo Bookings - Agendamentos de demonstração
 */
export const demoBookings = mysqlTable("demoBookings", {
  id: int("id").autoincrement().primaryKey(),
  leadId: int("leadId"),
  clientId: int("clientId"),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  company: varchar("company", { length: 255 }),
  scheduledAt: timestamp("scheduledAt").notNull(),
  meetLink: varchar("meetLink", { length: 500 }),
  status: mysqlEnum("status", ["scheduled", "completed", "cancelled", "no_show"]).default("scheduled").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  emailIdx: index("email_idx").on(table.email),
  statusIdx: index("status_idx").on(table.status),
}));

export type DemoBooking = typeof demoBookings.$inferSelect;
export type InsertDemoBooking = typeof demoBookings.$inferInsert;

/**
 * Reports - Histórico de relatórios
 */
export const reports = mysqlTable("reports", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  type: mysqlEnum("type", ["weekly", "monthly"]).notNull(),
  period: varchar("period", { length: 50 }).notNull(),
  status: mysqlEnum("status", ["pending", "sent", "failed"]).default("pending").notNull(),
  error: text("error"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  sentAt: timestamp("sentAt"),
}, (table) => ({
  clientIdIdx: index("clientId_idx").on(table.clientId),
  statusIdx: index("status_idx").on(table.status),
}));

export type Report = typeof reports.$inferSelect;
export type InsertReport = typeof reports.$inferInsert;

/**
 * Notes - Notas e observações
 */
export const notes = mysqlTable("notes", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  relatedLeadId: int("relatedLeadId"),
  relatedRequestId: int("relatedRequestId"),
  type: mysqlEnum("type", ["internal", "visible"]).default("internal").notNull(),
  content: text("content").notNull(),
  createdBy: varchar("createdBy", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  clientIdIdx: index("clientId_idx").on(table.clientId),
}));

export type Note = typeof notes.$inferSelect;
export type InsertNote = typeof notes.$inferInsert;

/**
 * Files - Documentos e arquivos
 */
export const files = mysqlTable("files", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  filename: varchar("filename", { length: 255 }).notNull(),
  fileUrl: varchar("fileUrl", { length: 500 }).notNull(),
  fileSize: int("fileSize"),
  mimeType: varchar("mimeType", { length: 100 }),
  category: varchar("category", { length: 100 }),
  uploadedBy: varchar("uploadedBy", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  clientIdIdx: index("clientId_idx").on(table.clientId),
}));

export type File = typeof files.$inferSelect;
export type InsertFile = typeof files.$inferInsert;

/**
 * Audit Logs - Log de auditoria
 */
export const auditLogs = mysqlTable("auditLogs", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId"),
  userId: int("userId"),
  action: varchar("action", { length: 100 }).notNull(),
  entityType: varchar("entityType", { length: 100 }).notNull(),
  entityId: int("entityId"),
  ipAddress: varchar("ipAddress", { length: 45 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  clientIdIdx: index("clientId_idx").on(table.clientId),
  userIdIdx: index("userId_idx").on(table.userId),
}));

export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = typeof auditLogs.$inferInsert;
