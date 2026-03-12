CREATE TABLE `aiInsights` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`type` varchar(50) NOT NULL,
	`severity` enum('low','medium','high','critical') NOT NULL DEFAULT 'medium',
	`title` varchar(255) NOT NULL,
	`message` text NOT NULL,
	`recommendation` text,
	`dataSource` varchar(100),
	`period` varchar(50),
	`status` enum('new','acknowledged','resolved') NOT NULL DEFAULT 'new',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `aiInsights_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `auditLogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int,
	`userId` int,
	`action` varchar(100) NOT NULL,
	`entityType` varchar(100) NOT NULL,
	`entityId` int,
	`changes` json DEFAULT ('{}'),
	`ipAddress` varchar(45),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `auditLogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `campaignMetrics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`platform` varchar(50) NOT NULL,
	`campaignId` varchar(255) NOT NULL,
	`campaignName` varchar(255),
	`date` timestamp NOT NULL,
	`spend` decimal(12,2),
	`impressions` int,
	`clicks` int,
	`ctr` decimal(5,3),
	`cpc` decimal(10,2),
	`cpm` decimal(10,2),
	`conversions` int,
	`conversionValue` decimal(12,2),
	`cpa` decimal(10,2),
	`roas` decimal(5,2),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `campaignMetrics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `clientSettings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`reportFrequency` enum('weekly','biweekly','monthly') NOT NULL DEFAULT 'weekly',
	`reportDay` varchar(10) DEFAULT 'sunday',
	`reportTime` varchar(5) DEFAULT '16:00',
	`reportChannels` json DEFAULT ('["email"]'),
	`timezone` varchar(50) DEFAULT 'America/Sao_Paulo',
	`notificationsEnabled` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `clientSettings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `clients` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(20),
	`company` varchar(255),
	`city` varchar(100),
	`segment` varchar(100),
	`budget` decimal(12,2),
	`status` enum('lead','prospect','active','inactive','churned') NOT NULL DEFAULT 'lead',
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `clients_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `demoBookings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`leadId` int,
	`clientId` int,
	`name` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(20),
	`company` varchar(255),
	`scheduledAt` timestamp NOT NULL,
	`meetLink` varchar(500),
	`status` enum('scheduled','completed','cancelled','no_show') NOT NULL DEFAULT 'scheduled',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `demoBookings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `files` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`filename` varchar(255) NOT NULL,
	`fileUrl` varchar(500) NOT NULL,
	`fileSize` int,
	`mimeType` varchar(100),
	`category` varchar(100),
	`uploadedBy` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `files_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `leadActivities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`leadId` int NOT NULL,
	`clientId` int NOT NULL,
	`type` varchar(50) NOT NULL,
	`description` text,
	`createdBy` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `leadActivities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(320),
	`phone` varchar(20),
	`company` varchar(255),
	`origin` varchar(100),
	`channel` varchar(100),
	`campaign` varchar(255),
	`product` varchar(255),
	`potentialValue` decimal(12,2),
	`stage` enum('new','qualified','demo','proposal','negotiation','converted','lost','reactivation') NOT NULL DEFAULT 'new',
	`owner` varchar(255),
	`tags` json DEFAULT ('[]'),
	`notes` text,
	`lastInteraction` timestamp,
	`nextAction` varchar(255),
	`nextActionDate` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `leads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `marketplaceMetrics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`marketplace` varchar(50) NOT NULL,
	`date` timestamp NOT NULL,
	`orders` int,
	`sales` decimal(12,2),
	`revenue` decimal(12,2),
	`visits` int,
	`clicks` int,
	`conversion` decimal(5,3),
	`averageTicket` decimal(12,2),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `marketplaceMetrics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`relatedLeadId` int,
	`relatedRequestId` int,
	`type` enum('internal','visible') NOT NULL DEFAULT 'internal',
	`content` text NOT NULL,
	`createdBy` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `notes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `platformConnections` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`platform` enum('meta','google','tiktok','mercadolivre','shopee','amazon','whatsapp','google_calendar') NOT NULL,
	`accountId` varchar(255) NOT NULL,
	`accountName` varchar(255),
	`accessToken` text,
	`refreshToken` text,
	`tokenExpiry` timestamp,
	`status` enum('active','inactive','error','expired') NOT NULL DEFAULT 'active',
	`lastSync` timestamp,
	`syncError` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `platformConnections_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_connection` UNIQUE(`clientId`,`platform`,`accountId`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`sku` varchar(100) NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`category` varchar(100),
	`cost` decimal(12,2),
	`price` decimal(12,2),
	`marketplacePrice` json DEFAULT ('{}'),
	`margin` decimal(5,2),
	`stock` int,
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`type` enum('weekly','monthly') NOT NULL,
	`period` varchar(50) NOT NULL,
	`sentTo` json DEFAULT ('[]'),
	`channels` json DEFAULT ('["email"]'),
	`status` enum('pending','sent','failed') NOT NULL DEFAULT 'pending',
	`error` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`sentAt` timestamp,
	CONSTRAINT `reports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `requests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`type` varchar(100) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`status` enum('open','in_progress','waiting_approval','completed','rejected') NOT NULL DEFAULT 'open',
	`priority` enum('low','medium','high') NOT NULL DEFAULT 'medium',
	`createdBy` varchar(255),
	`assignedTo` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `requests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tasks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`status` enum('todo','in_progress','done','blocked') NOT NULL DEFAULT 'todo',
	`priority` enum('low','medium','high') NOT NULL DEFAULT 'medium',
	`assignedTo` varchar(255),
	`dueDate` timestamp,
	`relatedRequestId` int,
	`relatedLeadId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tasks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','admin','client') NOT NULL DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `users` ADD `clientId` int;--> statement-breakpoint
ALTER TABLE `users` ADD `phone` varchar(20);--> statement-breakpoint
ALTER TABLE `users` ADD `isActive` boolean DEFAULT true NOT NULL;--> statement-breakpoint
CREATE INDEX `clientId_idx` ON `aiInsights` (`clientId`);--> statement-breakpoint
CREATE INDEX `type_idx` ON `aiInsights` (`type`);--> statement-breakpoint
CREATE INDEX `severity_idx` ON `aiInsights` (`severity`);--> statement-breakpoint
CREATE INDEX `clientId_idx` ON `auditLogs` (`clientId`);--> statement-breakpoint
CREATE INDEX `userId_idx` ON `auditLogs` (`userId`);--> statement-breakpoint
CREATE INDEX `clientId_idx` ON `campaignMetrics` (`clientId`);--> statement-breakpoint
CREATE INDEX `date_idx` ON `campaignMetrics` (`date`);--> statement-breakpoint
CREATE INDEX `campaignId_idx` ON `campaignMetrics` (`campaignId`);--> statement-breakpoint
CREATE INDEX `clientId_idx` ON `clientSettings` (`clientId`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `clients` (`status`);--> statement-breakpoint
CREATE INDEX `email_idx` ON `demoBookings` (`email`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `demoBookings` (`status`);--> statement-breakpoint
CREATE INDEX `clientId_idx` ON `files` (`clientId`);--> statement-breakpoint
CREATE INDEX `leadId_idx` ON `leadActivities` (`leadId`);--> statement-breakpoint
CREATE INDEX `clientId_idx` ON `leadActivities` (`clientId`);--> statement-breakpoint
CREATE INDEX `clientId_idx` ON `leads` (`clientId`);--> statement-breakpoint
CREATE INDEX `stage_idx` ON `leads` (`stage`);--> statement-breakpoint
CREATE INDEX `email_idx` ON `leads` (`email`);--> statement-breakpoint
CREATE INDEX `clientId_idx` ON `marketplaceMetrics` (`clientId`);--> statement-breakpoint
CREATE INDEX `date_idx` ON `marketplaceMetrics` (`date`);--> statement-breakpoint
CREATE INDEX `clientId_idx` ON `notes` (`clientId`);--> statement-breakpoint
CREATE INDEX `clientId_idx` ON `platformConnections` (`clientId`);--> statement-breakpoint
CREATE INDEX `platform_idx` ON `platformConnections` (`platform`);--> statement-breakpoint
CREATE INDEX `clientId_idx` ON `products` (`clientId`);--> statement-breakpoint
CREATE INDEX `sku_idx` ON `products` (`sku`);--> statement-breakpoint
CREATE INDEX `clientId_idx` ON `reports` (`clientId`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `reports` (`status`);--> statement-breakpoint
CREATE INDEX `clientId_idx` ON `requests` (`clientId`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `requests` (`status`);--> statement-breakpoint
CREATE INDEX `clientId_idx` ON `tasks` (`clientId`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `tasks` (`status`);--> statement-breakpoint
CREATE INDEX `clientId_idx` ON `users` (`clientId`);