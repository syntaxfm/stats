CREATE TABLE `scrapeItem` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`rank` integer NOT NULL,
	`showName` text DEFAULT 'Show Name Unable to be Scraped',
	`change` integer,
	`slug` text DEFAULT 'slug-unable-to-be-scraped' NOT NULL,
	`scrapeId` integer NOT NULL,
	`type` text NOT NULL,
	`date` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `scrapes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type` text NOT NULL,
	`date` text NOT NULL
);
