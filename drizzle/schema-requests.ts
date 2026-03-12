import {
  int,
  varchar,
  text,
  timestamp,
  mysqlEnum,
  decimal,
  json,
  mysqlTable,
} from "drizzle-orm/mysql-core";

/**
 * Tipos de solicitação
 */
export const requestTypeEnum = mysqlEnum("requestType", [
  "campaign_change",
  "budget_adjustment",
  "campaign_pause",
  "campaign_resume",
  "audience_change",
  "creative_change",
  "bid_change",
  "other",
]);

/**
 * Estados de solicitação
 */
export const requestStatusEnum = mysqlEnum("requestStatus", [
  "pending",
  "approved",
  "rejected",
  "cancelled",
  "in_progress",
  "completed",
]);

/**
 * Prioridade de solicitação
 */
export const requestPriorityEnum = mysqlEnum("requestPriority", [
  "low",
  "medium",
  "high",
  "critical",
]);

/**
 * Tabela de solicitações
 */
export const requests = mysqlTable("requests", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  userId: int("userId").notNull(), // Quem solicitou
  type: requestTypeEnum.notNull(),
  status: requestStatusEnum.notNull().default("pending"),
  priority: requestPriorityEnum.notNull().default("medium"),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  campaignId: varchar("campaignId", { length: 255 }), // ID da campanha (Meta, Google, etc)
  campaignName: varchar("campaignName", { length: 255 }),
  
  // Dados da solicitação (JSON para flexibilidade)
  currentValue: json("currentValue"), // Valor atual
  requestedValue: json("requestedValue"), // Valor solicitado
  estimatedImpact: text("estimatedImpact"), // Impacto estimado
  
  // Orçamento específico
  currentBudget: decimal("currentBudget", { precision: 10, scale: 2 }),
  requestedBudget: decimal("requestedBudget", { precision: 10, scale: 2 }),
  budgetCurrency: varchar("budgetCurrency", { length: 3 }).default("BRL"),
  
  // Aprovação
  approvedBy: int("approvedBy"), // ID do aprovador
  approvedAt: timestamp("approvedAt"),
  rejectionReason: text("rejectionReason"),
  
  // Implementação
  implementedBy: int("implementedBy"), // ID de quem implementou
  implementedAt: timestamp("implementedAt"),
  
  // Timestamps
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/**
 * Tabela de comentários em solicitações
 */
export const requestComments = mysqlTable("requestComments", {
  id: int("id").autoincrement().primaryKey(),
  requestId: int("requestId").notNull(),
  userId: int("userId").notNull(),
  comment: text("comment").notNull(),
  isInternal: int("isInternal").default(0), // 0 = visible to client, 1 = internal only
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/**
 * Tabela de auditoria de solicitações
 */
export const requestAuditLogs = mysqlTable("requestAuditLogs", {
  id: int("id").autoincrement().primaryKey(),
  requestId: int("requestId").notNull(),
  userId: int("userId").notNull(),
  action: varchar("action", { length: 100 }).notNull(), // created, approved, rejected, implemented, etc
  oldStatus: varchar("oldStatus", { length: 50 }),
  newStatus: varchar("newStatus", { length: 50 }),
  changes: json("changes"), // Mudanças específicas
  reason: text("reason"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

/**
 * Tipos exportados
 */
export type Request = typeof requests.$inferSelect;
export type InsertRequest = typeof requests.$inferInsert;
export type RequestComment = typeof requestComments.$inferSelect;
export type InsertRequestComment = typeof requestComments.$inferInsert;
export type RequestAuditLog = typeof requestAuditLogs.$inferSelect;
export type InsertRequestAuditLog = typeof requestAuditLogs.$inferInsert;
