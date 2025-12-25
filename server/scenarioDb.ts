import { eq, and, desc } from "drizzle-orm";
import { scenarios, useCaseOverrides, type InsertScenario, type InsertUseCaseOverride } from "../drizzle/schema";
import { getDb } from "./db";

/**
 * Get all scenarios for a user
 */
export async function getUserScenarios(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(scenarios)
    .where(eq(scenarios.userId, userId))
    .orderBy(desc(scenarios.updatedAt));
}

/**
 * Get a specific scenario by ID (with user ownership check)
 */
export async function getScenarioById(scenarioId: number, userId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db
    .select()
    .from(scenarios)
    .where(and(eq(scenarios.id, scenarioId), eq(scenarios.userId, userId)))
    .limit(1);
  
  return result[0] || null;
}

/**
 * Create a new scenario
 */
export async function createScenario(scenario: InsertScenario) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(scenarios).values(scenario);
  return result[0].insertId;
}

/**
 * Update an existing scenario
 */
export async function updateScenario(scenarioId: number, userId: number, updates: Partial<InsertScenario>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db
    .update(scenarios)
    .set({ ...updates, updatedAt: new Date() })
    .where(and(eq(scenarios.id, scenarioId), eq(scenarios.userId, userId)));
  
  return true;
}

/**
 * Delete a scenario
 */
export async function deleteScenario(scenarioId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Delete use case overrides first
  await db.delete(useCaseOverrides).where(eq(useCaseOverrides.scenarioId, scenarioId));
  
  // Delete scenario
  await db
    .delete(scenarios)
    .where(and(eq(scenarios.id, scenarioId), eq(scenarios.userId, userId)));
  
  return true;
}

/**
 * Get use case overrides for a scenario
 */
export async function getScenarioOverrides(scenarioId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(useCaseOverrides)
    .where(eq(useCaseOverrides.scenarioId, scenarioId));
}

/**
 * Upsert a use case override
 */
export async function upsertUseCaseOverride(override: InsertUseCaseOverride) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Check if override exists
  const existing = await db
    .select()
    .from(useCaseOverrides)
    .where(
      and(
        eq(useCaseOverrides.scenarioId, override.scenarioId),
        eq(useCaseOverrides.useCaseId, override.useCaseId)
      )
    )
    .limit(1);
  
  if (existing.length > 0) {
    // Update existing
    await db
      .update(useCaseOverrides)
      .set({ ...override, updatedAt: new Date() })
      .where(eq(useCaseOverrides.id, existing[0].id));
    return existing[0].id;
  } else {
    // Insert new
    const result = await db.insert(useCaseOverrides).values(override);
    return result[0].insertId;
  }
}

/**
 * Delete a use case override
 */
export async function deleteUseCaseOverride(scenarioId: number, useCaseId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db
    .delete(useCaseOverrides)
    .where(
      and(
        eq(useCaseOverrides.scenarioId, scenarioId),
        eq(useCaseOverrides.useCaseId, useCaseId)
      )
    );
  
  return true;
}
