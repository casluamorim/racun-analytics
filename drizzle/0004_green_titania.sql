CREATE TABLE `userClients` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`clientId` int NOT NULL,
	`role` enum('admin','manager','viewer') NOT NULL DEFAULT 'viewer',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `userClients_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
DROP INDEX `clientId_idx` ON `users`;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','admin') NOT NULL DEFAULT 'user';--> statement-breakpoint
CREATE INDEX `userClient_idx` ON `userClients` (`userId`,`clientId`);--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `clientId`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `phone`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `isActive`;