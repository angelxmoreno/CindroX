CREATE TABLE `queue_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`queue` varchar(255) NOT NULL,
	`jobId` varchar(255) NOT NULL,
	`event` varchar(255) NOT NULL,
	`details` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	`modified_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `queue_logs_id` PRIMARY KEY(`id`)
);
