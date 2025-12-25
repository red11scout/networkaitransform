CREATE TABLE `scenarios` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`isBaseModel` int NOT NULL DEFAULT 0,
	`discountRate` int NOT NULL,
	`growthFactor` int NOT NULL,
	`implementationSpeed` int NOT NULL,
	`hardwareCostMultiplier` int NOT NULL,
	`softwareCostMultiplier` int NOT NULL,
	`developmentCostMultiplier` int NOT NULL,
	`totalAnnualValue` int NOT NULL,
	`fiveYearNPV` int NOT NULL,
	`roi` int NOT NULL,
	`paybackMonths` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `scenarios_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `useCaseOverrides` (
	`id` int AUTO_INCREMENT NOT NULL,
	`scenarioId` int NOT NULL,
	`useCaseId` varchar(64) NOT NULL,
	`annualBenefit` int,
	`implementationCost` int,
	`annualOperatingCost` int,
	`successProbability` int,
	`timeToValue` int,
	`kpiTargets` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `useCaseOverrides_id` PRIMARY KEY(`id`)
);
