ALTER TABLE `auditLogs` MODIFY COLUMN `changes` json;--> statement-breakpoint
ALTER TABLE `clientSettings` MODIFY COLUMN `reportChannels` json;--> statement-breakpoint
ALTER TABLE `leads` MODIFY COLUMN `tags` json;--> statement-breakpoint
ALTER TABLE `products` MODIFY COLUMN `marketplacePrice` json;--> statement-breakpoint
ALTER TABLE `reports` MODIFY COLUMN `sentTo` json;--> statement-breakpoint
ALTER TABLE `reports` MODIFY COLUMN `channels` json;