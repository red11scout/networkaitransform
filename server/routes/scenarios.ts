import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  getUserScenarios,
  getScenarioById,
  createScenario,
  updateScenario,
  deleteScenario,
  getScenarioOverrides,
  upsertUseCaseOverride,
  deleteUseCaseOverride,
} from "../scenarioDb";
import {
  calculateScenario,
  validateCalculationDeterminism,
  getBaseModelParams,
  type ScenarioParams,
} from "../scenarioCalculations";

// Input validation schemas
const scenarioParamsSchema = z.object({
  discountRate: z.number().min(0).max(1),
  growthFactor: z.number().min(-0.5).max(1),
  implementationSpeed: z.number().min(0).max(100),
  hardwareCostMultiplier: z.number().min(0.1).max(10),
  softwareCostMultiplier: z.number().min(0.1).max(10),
  developmentCostMultiplier: z.number().min(0.1).max(10),
  useCaseOverrides: z.array(z.object({
    useCaseId: z.string(),
    annualBenefit: z.number().optional(),
    implementationCost: z.number().optional(),
    annualOperatingCost: z.number().optional(),
    successProbability: z.number().min(0).max(100).optional(),
    timeToValue: z.number().min(1).max(60).optional(),
  })).optional(),
});

const createScenarioSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  params: scenarioParamsSchema,
});

const updateScenarioSchema = z.object({
  id: z.number(),
  name: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  params: scenarioParamsSchema.optional(),
});

export const scenariosRouter = router({
  /**
   * Get all scenarios for the current user
   */
  list: protectedProcedure.query(async ({ ctx }) => {
    const scenarios = await getUserScenarios(ctx.user.id);
    return scenarios;
  }),

  /**
   * Get a specific scenario by ID
   */
  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const scenario = await getScenarioById(input.id, ctx.user.id);
      if (!scenario) {
        throw new Error("Scenario not found");
      }
      
      // Get overrides
      const overrides = await getScenarioOverrides(input.id);
      
      return {
        ...scenario,
        overrides,
      };
    }),

  /**
   * Calculate results for given parameters (without saving)
   */
  calculate: protectedProcedure
    .input(scenarioParamsSchema)
    .mutation(async ({ input }) => {
      const results = calculateScenario(input);
      return results;
    }),

  /**
   * Get base model calculation results
   */
  getBaseModel: protectedProcedure.query(async () => {
    const params = getBaseModelParams();
    const results = calculateScenario(params);
    return {
      params,
      results,
    };
  }),

  /**
   * Create a new scenario
   */
  create: protectedProcedure
    .input(createScenarioSchema)
    .mutation(async ({ ctx, input }) => {
      // Calculate results
      const results = calculateScenario(input.params);
      
      // Convert to database format (store as integers)
      const scenarioData = {
        userId: ctx.user.id,
        name: input.name,
        description: input.description || null,
        isBaseModel: 0,
        discountRate: Math.round(input.params.discountRate * 10000), // basis points
        growthFactor: Math.round(input.params.growthFactor * 10000),
        implementationSpeed: Math.round(input.params.implementationSpeed),
        hardwareCostMultiplier: Math.round(input.params.hardwareCostMultiplier * 10000),
        softwareCostMultiplier: Math.round(input.params.softwareCostMultiplier * 10000),
        developmentCostMultiplier: Math.round(input.params.developmentCostMultiplier * 10000),
        totalAnnualValue: Math.round(results.totalAnnualValue * 100), // cents
        fiveYearNPV: Math.round(results.fiveYearNPV * 100),
        roi: Math.round(results.roi * 100), // basis points
        paybackMonths: results.paybackMonths,
      };
      
      const scenarioId = await createScenario(scenarioData);
      
      // Save use case overrides if any
      if (input.params.useCaseOverrides) {
        for (const override of input.params.useCaseOverrides) {
          await upsertUseCaseOverride({
            scenarioId,
            useCaseId: override.useCaseId,
            annualBenefit: override.annualBenefit ? Math.round(override.annualBenefit * 100) : null,
            implementationCost: override.implementationCost ? Math.round(override.implementationCost * 100) : null,
            annualOperatingCost: override.annualOperatingCost ? Math.round(override.annualOperatingCost * 100) : null,
            successProbability: override.successProbability || null,
            timeToValue: override.timeToValue || null,
            kpiTargets: null,
          });
        }
      }
      
      return { id: scenarioId };
    }),

  /**
   * Update an existing scenario
   */
  update: protectedProcedure
    .input(updateScenarioSchema)
    .mutation(async ({ ctx, input }) => {
      // Get existing scenario
      const existing = await getScenarioById(input.id, ctx.user.id);
      if (!existing) {
        throw new Error("Scenario not found");
      }
      
      let updates: any = {};
      
      if (input.name) {
        updates.name = input.name;
      }
      
      if (input.description !== undefined) {
        updates.description = input.description;
      }
      
      if (input.params) {
        // Recalculate results
        const results = calculateScenario(input.params);
        
        updates = {
          ...updates,
          discountRate: Math.round(input.params.discountRate * 10000),
          growthFactor: Math.round(input.params.growthFactor * 10000),
          implementationSpeed: Math.round(input.params.implementationSpeed),
          hardwareCostMultiplier: Math.round(input.params.hardwareCostMultiplier * 10000),
          softwareCostMultiplier: Math.round(input.params.softwareCostMultiplier * 10000),
          developmentCostMultiplier: Math.round(input.params.developmentCostMultiplier * 10000),
          totalAnnualValue: Math.round(results.totalAnnualValue * 100),
          fiveYearNPV: Math.round(results.fiveYearNPV * 100),
          roi: Math.round(results.roi * 100),
          paybackMonths: results.paybackMonths,
        };
        
        // Update use case overrides
        if (input.params.useCaseOverrides) {
          for (const override of input.params.useCaseOverrides) {
            await upsertUseCaseOverride({
              scenarioId: input.id,
              useCaseId: override.useCaseId,
              annualBenefit: override.annualBenefit ? Math.round(override.annualBenefit * 100) : null,
              implementationCost: override.implementationCost ? Math.round(override.implementationCost * 100) : null,
              annualOperatingCost: override.annualOperatingCost ? Math.round(override.annualOperatingCost * 100) : null,
              successProbability: override.successProbability || null,
              timeToValue: override.timeToValue || null,
              kpiTargets: null,
            });
          }
        }
      }
      
      await updateScenario(input.id, ctx.user.id, updates);
      return { success: true };
    }),

  /**
   * Delete a scenario
   */
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await deleteScenario(input.id, ctx.user.id);
      return { success: true };
    }),

  /**
   * Validate calculation determinism
   */
  validateDeterminism: protectedProcedure
    .input(scenarioParamsSchema)
    .mutation(async ({ input }) => {
      const isDeterministic = validateCalculationDeterminism(input, 1000);
      return { isDeterministic };
    }),

  /**
   * Compare two scenarios
   */
  compare: protectedProcedure
    .input(z.object({
      scenarioId1: z.number(),
      scenarioId2: z.number(),
    }))
    .query(async ({ ctx, input }) => {
      const scenario1 = await getScenarioById(input.scenarioId1, ctx.user.id);
      const scenario2 = await getScenarioById(input.scenarioId2, ctx.user.id);
      
      if (!scenario1 || !scenario2) {
        throw new Error("One or both scenarios not found");
      }
      
      // Convert from database format and recalculate
      const params1: ScenarioParams = {
        discountRate: scenario1.discountRate / 10000,
        growthFactor: scenario1.growthFactor / 10000,
        implementationSpeed: scenario1.implementationSpeed,
        hardwareCostMultiplier: scenario1.hardwareCostMultiplier / 10000,
        softwareCostMultiplier: scenario1.softwareCostMultiplier / 10000,
        developmentCostMultiplier: scenario1.developmentCostMultiplier / 10000,
      };
      
      const params2: ScenarioParams = {
        discountRate: scenario2.discountRate / 10000,
        growthFactor: scenario2.growthFactor / 10000,
        implementationSpeed: scenario2.implementationSpeed,
        hardwareCostMultiplier: scenario2.hardwareCostMultiplier / 10000,
        softwareCostMultiplier: scenario2.softwareCostMultiplier / 10000,
        developmentCostMultiplier: scenario2.developmentCostMultiplier / 10000,
      };
      
      const results1 = calculateScenario(params1);
      const results2 = calculateScenario(params2);
      
      return {
        scenario1: { ...scenario1, results: results1 },
        scenario2: { ...scenario2, results: results2 },
        deltas: {
          totalAnnualValue: results2.totalAnnualValue - results1.totalAnnualValue,
          fiveYearNPV: results2.fiveYearNPV - results1.fiveYearNPV,
          roi: results2.roi - results1.roi,
          paybackMonths: results2.paybackMonths - results1.paybackMonths,
        },
      };
    }),
});
