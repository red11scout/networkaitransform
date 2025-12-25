import { describe, it, expect } from 'vitest';
import { calculateScenario, type ScenarioParams } from './scenarioCalculations';

describe('Scenario Calculations - Deterministic Tests', () => {
  const baseParameters: ScenarioParams = {
    discountRate: 0.10, // 10%
    growthFactor: 0.05, // 5%
    implementationSpeed: 100, // 100%
    hardwareCostMultiplier: 1.0, // 100%
    softwareCostMultiplier: 1.0, // 100%
    developmentCostMultiplier: 1.0, // 100%
  };

  it('should produce identical results for same inputs (determinism test)', () => {
    const result1 = calculateScenario(baseParameters);
    const result2 = calculateScenario(baseParameters);
    const result3 = calculateScenario(baseParameters);

    expect(result1.totalAnnualValue).toBe(result2.totalAnnualValue);
    expect(result2.totalAnnualValue).toBe(result3.totalAnnualValue);
    
    expect(result1.fiveYearNPV).toBe(result2.fiveYearNPV);
    expect(result2.fiveYearNPV).toBe(result3.fiveYearNPV);
    
    expect(result1.roi).toBe(result2.roi);
    expect(result2.roi).toBe(result3.roi);
    
    expect(result1.paybackMonths).toBe(result2.paybackMonths);
    expect(result2.paybackMonths).toBe(result3.paybackMonths);
  });

  it('should calculate base model correctly', () => {
    const result = calculateScenario(baseParameters);

    // Base model should match known values (in dollars)
    expect(result.totalAnnualValue).toBeGreaterThan(15000000); // > $15M
    expect(result.totalAnnualValue).toBeLessThan(16000000); // < $16M
    
    expect(result.fiveYearNPV).toBeGreaterThan(34000000); // > $34M
    expect(result.fiveYearNPV).toBeLessThan(36000000); // < $36M
    
    expect(result.roi).toBeGreaterThan(4.0); // > 400%
    expect(result.roi).toBeLessThan(5.0); // < 500%
    
    expect(result.paybackMonths).toBeGreaterThan(10);
    expect(result.paybackMonths).toBeLessThan(12);
  });

  it('should handle discount rate changes correctly', () => {
    const lowDiscount = calculateScenario({ ...baseParameters, discountRate: 0.05 }); // 5%
    const highDiscount = calculateScenario({ ...baseParameters, discountRate: 0.15 }); // 15%

    // Lower discount rate should result in higher NPV
    expect(lowDiscount.fiveYearNPV).toBeGreaterThan(highDiscount.fiveYearNPV);
    
    // Total annual value should not change with discount rate
    expect(lowDiscount.totalAnnualValue).toBe(highDiscount.totalAnnualValue);
  });

  it('should handle growth factor changes correctly', () => {
    const noGrowth = calculateScenario({ ...baseParameters, growthFactor: 0 });
    const highGrowth = calculateScenario({ ...baseParameters, growthFactor: 0.10 }); // 10%

    // Higher growth should result in higher 5-year NPV
    expect(highGrowth.fiveYearNPV).toBeGreaterThan(noGrowth.fiveYearNPV);
  });

  it('should handle implementation speed correctly', () => {
    const slowImpl = calculateScenario({ ...baseParameters, implementationSpeed: 50 }); // 50%
    const fastImpl = calculateScenario({ ...baseParameters, implementationSpeed: 100 }); // 100%

    // Faster implementation should result in shorter payback period
    expect(fastImpl.paybackMonths).toBeLessThan(slowImpl.paybackMonths);
  });

  it('should handle cost multipliers correctly', () => {
    const lowCost = calculateScenario({
      ...baseParameters,
      hardwareCostMultiplier: 0.5, // 50%
      softwareCostMultiplier: 0.5,
      developmentCostMultiplier: 0.5,
    });
    
    const highCost = calculateScenario({
      ...baseParameters,
      hardwareCostMultiplier: 1.5, // 150%
      softwareCostMultiplier: 1.5,
      developmentCostMultiplier: 1.5,
    });

    // Lower costs should result in higher ROI
    expect(lowCost.roi).toBeGreaterThan(highCost.roi);
    
    // Lower costs should result in shorter payback
    expect(lowCost.paybackMonths).toBeLessThan(highCost.paybackMonths);
  });

  it('should calculate yearly breakdown correctly', () => {
    const result = calculateScenario(baseParameters);

    expect(result.yearlyBreakdown).toHaveLength(5);
    
    // Check year sequence
    result.yearlyBreakdown.forEach((year, idx) => {
      expect(year.year).toBe(idx + 1);
    });

    // Benefits should grow with growth factor
    const year1Benefits = result.yearlyBreakdown[0].benefits;
    const year5Benefits = result.yearlyBreakdown[4].benefits;
    expect(year5Benefits).toBeGreaterThan(year1Benefits);

    // Cumulative NPV should be monotonically increasing
    for (let i = 1; i < result.yearlyBreakdown.length; i++) {
      expect(result.yearlyBreakdown[i].cumulativeNPV).toBeGreaterThan(
        result.yearlyBreakdown[i - 1].cumulativeNPV
      );
    }
  });

  it('should handle extreme parameters gracefully', () => {
    // Very low discount rate
    const extremeLowDiscount = calculateScenario({ ...baseParameters, discountRate: 0.01 }); // 1%
    expect(extremeLowDiscount.fiveYearNPV).toBeGreaterThan(0);
    expect(extremeLowDiscount.fiveYearNPV).toBeLessThan(100000000); // Sanity check

    // Very high discount rate
    const extremeHighDiscount = calculateScenario({ ...baseParameters, discountRate: 0.30 }); // 30%
    expect(extremeHighDiscount.fiveYearNPV).toBeGreaterThan(0);

    // Maximum everything
    const maxParams = calculateScenario({
      discountRate: 0.01, // 1%
      growthFactor: 0.20, // 20%
      implementationSpeed: 100, // 100%
      hardwareCostMultiplier: 0.5, // 50%
      softwareCostMultiplier: 0.5,
      developmentCostMultiplier: 0.5,
    });
    expect(maxParams.fiveYearNPV).toBeGreaterThan(0);
    expect(maxParams.roi).toBeGreaterThan(0);
  });

  it('should run 1000 determinism tests', () => {
    const results = [];
    
    // Run 1000 calculations with same parameters
    for (let i = 0; i < 1000; i++) {
      results.push(calculateScenario(baseParameters));
    }

    // All results should be identical
    const firstResult = results[0];
    results.forEach((result) => {
      expect(result.totalAnnualValue).toBe(firstResult.totalAnnualValue);
      expect(result.fiveYearNPV).toBe(firstResult.fiveYearNPV);
      expect(result.roi).toBe(firstResult.roi);
      expect(result.paybackMonths).toBe(firstResult.paybackMonths);
    });
  });

  it('should validate calculation consistency across parameter ranges', () => {
    const testCases = [
      { discountRate: 0.05, growthFactor: 0.03 },
      { discountRate: 0.10, growthFactor: 0.05 },
      { discountRate: 0.15, growthFactor: 0.07 },
      { discountRate: 0.20, growthFactor: 0.10 },
    ];

    testCases.forEach((testCase) => {
      const params = { ...baseParameters, ...testCase };
      const result1 = calculateScenario(params);
      const result2 = calculateScenario(params);
      
      // Each test case should be deterministic
      expect(result1.totalAnnualValue).toBe(result2.totalAnnualValue);
      expect(result1.fiveYearNPV).toBe(result2.fiveYearNPV);
      expect(result1.roi).toBe(result2.roi);
      expect(result1.paybackMonths).toBe(result2.paybackMonths);
      
      // Results should be reasonable
      expect(result1.totalAnnualValue).toBeGreaterThanOrEqual(0);
      expect(result1.paybackMonths).toBeGreaterThan(0);
      expect(result1.paybackMonths).toBeLessThan(120); // Less than 10 years
    });
  });
});

describe('Scenario Calculations - Edge Cases', () => {
  it('should handle zero costs correctly', () => {
    const zeroCosts = calculateScenario({
      discountRate: 0.10,
      growthFactor: 0.05,
      implementationSpeed: 100,
      hardwareCostMultiplier: 0,
      softwareCostMultiplier: 0,
      developmentCostMultiplier: 0,
    });

    // With zero costs, ROI should be very high
    expect(zeroCosts.roi).toBeGreaterThan(10); // > 1000%
    expect(zeroCosts.paybackMonths).toBe(0); // Immediate payback
  });

  it('should handle maximum costs correctly', () => {
    const maxCosts = calculateScenario({
      discountRate: 0.10,
      growthFactor: 0.05,
      implementationSpeed: 100,
      hardwareCostMultiplier: 5.0, // 500%
      softwareCostMultiplier: 5.0,
      developmentCostMultiplier: 5.0,
    });

    // With very high costs, ROI should be lower
    expect(maxCosts.roi).toBeLessThan(1.0); // < 100%
    expect(maxCosts.paybackMonths).toBeGreaterThan(24); // > 2 years
  });

  it('should handle fractional results correctly', () => {
    const result = calculateScenario({
      discountRate: 0.1234, // 12.34%
      growthFactor: 0.0567, // 5.67%
      implementationSpeed: 87,
      hardwareCostMultiplier: 1.1234,
      softwareCostMultiplier: 0.9876,
      developmentCostMultiplier: 1.0543,
    });

    // Results should be reasonable numbers
    expect(result.totalAnnualValue).toBeGreaterThan(0);
    expect(result.fiveYearNPV).toBeGreaterThan(0);
    expect(result.roi).toBeGreaterThan(0);
    expect(result.paybackMonths).toBeGreaterThan(0);
  });
});
