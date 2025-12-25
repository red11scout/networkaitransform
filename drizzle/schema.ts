import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Scenarios table - stores user-created financial scenarios with custom parameters
 */
export const scenarios = mysqlTable("scenarios", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  isBaseModel: int("isBaseModel").default(0).notNull(), // 0 = false, 1 = true
  
  // Financial assumptions
  discountRate: int("discountRate").notNull(), // stored as basis points (e.g., 1000 = 10%)
  growthFactor: int("growthFactor").notNull(), // stored as basis points
  implementationSpeed: int("implementationSpeed").notNull(), // stored as percentage (0-100)
  
  // Cost assumptions
  hardwareCostMultiplier: int("hardwareCostMultiplier").notNull(), // stored as basis points (10000 = 1.0x)
  softwareCostMultiplier: int("softwareCostMultiplier").notNull(),
  developmentCostMultiplier: int("developmentCostMultiplier").notNull(),
  
  // Calculated results (stored for quick access)
  totalAnnualValue: int("totalAnnualValue").notNull(), // stored in cents
  fiveYearNPV: int("fiveYearNPV").notNull(), // stored in cents
  roi: int("roi").notNull(), // stored as basis points
  paybackMonths: int("paybackMonths").notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Scenario = typeof scenarios.$inferSelect;
export type InsertScenario = typeof scenarios.$inferInsert;

/**
 * Use case overrides - stores custom KPI and benefit values per scenario
 */
export const useCaseOverrides = mysqlTable("useCaseOverrides", {
  id: int("id").autoincrement().primaryKey(),
  scenarioId: int("scenarioId").notNull(),
  useCaseId: varchar("useCaseId", { length: 64 }).notNull(),
  
  // Override values (null means use default)
  annualBenefit: int("annualBenefit"), // stored in cents
  implementationCost: int("implementationCost"), // stored in cents
  annualOperatingCost: int("annualOperatingCost"), // stored in cents
  successProbability: int("successProbability"), // stored as percentage (0-100)
  timeToValue: int("timeToValue"), // stored in months
  
  // Custom KPI targets (stored as JSON)
  kpiTargets: text("kpiTargets"), // JSON string of KPI overrides
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UseCaseOverride = typeof useCaseOverrides.$inferSelect;
export type InsertUseCaseOverride = typeof useCaseOverrides.$inferInsert;