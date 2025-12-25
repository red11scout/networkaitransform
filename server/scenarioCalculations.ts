/**
 * Deterministic scenario calculation engine
 * Uses pure JavaScript calculations for guaranteed consistency
 */

/**
 * Scenario parameters for calculations
 */
export interface ScenarioParams {
  discountRate: number; // as decimal (e.g., 0.10 for 10%)
  growthFactor: number; // as decimal (e.g., 0.05 for 5%)
  implementationSpeed: number; // as percentage (0-100)
  hardwareCostMultiplier: number; // as multiplier (e.g., 1.0 for 100%)
  softwareCostMultiplier: number;
  developmentCostMultiplier: number;
  useCaseOverrides?: UseCaseOverride[];
}

export interface UseCaseOverride {
  useCaseId: string;
  annualBenefit?: number; // in dollars
  implementationCost?: number;
  annualOperatingCost?: number;
  successProbability?: number; // as percentage (0-100)
  timeToValue?: number; // in months
}

export interface CalculationResults {
  totalAnnualValue: number;
  fiveYearNPV: number;
  threeYearNPV: number;
  roi: number; // as percentage
  paybackMonths: number;
  yearlyBreakdown: YearlyBreakdown[];
  useCaseResults: UseCaseResult[];
}

export interface YearlyBreakdown {
  year: number;
  benefits: number;
  costs: number;
  netCashFlow: number;
  cumulativeCashFlow: number;
  discountedCashFlow: number;
}

export interface UseCaseResult {
  useCaseId: string;
  annualValue: number;
  implementationCost: number;
  annualOperatingCost: number;
  fiveYearValue: number;
  npv: number;
  roi: number;
}

// Base use case data - aligned with frontend costBreakdownData.ts
// Total annual benefits: $15.7M, Infrastructure investment: $2.11M, Annual operating costs: $3M
const BASE_USE_CASES = [
  { id: 'UC01', name: 'Autonomous Network Testing', annualBenefit: 3000000, implementationCost: 0, annualOperatingCost: 220000, timeToValue: 2, successProbability: 100 },
  { id: 'UC02', name: 'Real-Time Anomaly Detection', annualBenefit: 1000000, implementationCost: 0, annualOperatingCost: 220000, timeToValue: 2, successProbability: 100 },
  { id: 'UC03', name: 'Post-Maintenance Documentation', annualBenefit: 500000, implementationCost: 0, annualOperatingCost: 220000, timeToValue: 1.5, successProbability: 100 },
  { id: 'UC04', name: 'Maintenance Window Planning', annualBenefit: 800000, implementationCost: 0, annualOperatingCost: 220000, timeToValue: 2, successProbability: 100 },
  { id: 'UC05', name: 'GPU Infrastructure Foundation', annualBenefit: 0, implementationCost: 2110000, annualOperatingCost: 0, timeToValue: 0, successProbability: 100 },
  { id: 'UC06', name: 'Tribal Knowledge RAG System', annualBenefit: 2500000, implementationCost: 0, annualOperatingCost: 225000, timeToValue: 9, successProbability: 100 },
  { id: 'UC07', name: 'Intelligent Incident Triage', annualBenefit: 1500000, implementationCost: 0, annualOperatingCost: 225000, timeToValue: 8, successProbability: 100 },
  { id: 'UC08', name: 'Secure Data Federation Layer', annualBenefit: 1400000, implementationCost: 0, annualOperatingCost: 225000, timeToValue: 8, successProbability: 100 },
  { id: 'UC09', name: 'AI Model Governance Pipeline', annualBenefit: 500000, implementationCost: 0, annualOperatingCost: 225000, timeToValue: 12, successProbability: 100 },
  { id: 'UC10', name: 'Cross-Network Testing', annualBenefit: 800000, implementationCost: 0, annualOperatingCost: 225000, timeToValue: 12, successProbability: 100 },
  { id: 'UC11', name: 'Configuration Drift Detection', annualBenefit: 500000, implementationCost: 0, annualOperatingCost: 230000, timeToValue: 4, successProbability: 100 },
  { id: 'UC12', name: 'Maintenance Scheduling', annualBenefit: 300000, implementationCost: 0, annualOperatingCost: 230000, timeToValue: 2, successProbability: 100 },
  { id: 'UC13', name: 'Intelligent Workforce Scheduling', annualBenefit: 1500000, implementationCost: 0, annualOperatingCost: 230000, timeToValue: 9, successProbability: 100 },
  { id: 'UC14', name: 'AI-Powered Training', annualBenefit: 1400000, implementationCost: 0, annualOperatingCost: 305000, timeToValue: 15, successProbability: 100 },
];

/**
 * Calculate scenario results using deterministic pure JavaScript
 */
export function calculateScenario(params: ScenarioParams): CalculationResults {
  // Prepare use case data with overrides
  const useCases = BASE_USE_CASES.map(uc => {
    const override = params.useCaseOverrides?.find(o => o.useCaseId === uc.id);
    return {
      ...uc,
      annualBenefit: override?.annualBenefit ?? uc.annualBenefit,
      implementationCost: (override?.implementationCost ?? uc.implementationCost) * params.hardwareCostMultiplier,
      annualOperatingCost: (override?.annualOperatingCost ?? uc.annualOperatingCost) * params.softwareCostMultiplier,
      timeToValue: override?.timeToValue ?? uc.timeToValue,
      successProbability: override?.successProbability ?? uc.successProbability,
    };
  });

  // Calculate use case results
  const useCaseResults: UseCaseResult[] = useCases.map(uc => {
    // Adjust benefit for implementation speed only (success probability already factored into base data)
    const adjustedAnnualBenefit = uc.annualBenefit * (params.implementationSpeed / 100);
    
    // Calculate year-by-year benefits (no ramp-up, full benefits from Year 1 to match frontend)
    const year1Benefit = adjustedAnnualBenefit;
    const year2Benefit = adjustedAnnualBenefit;
    const year3Benefit = adjustedAnnualBenefit;
    const year4Benefit = adjustedAnnualBenefit;
    const year5Benefit = adjustedAnnualBenefit;
    
    const fiveYearValue = year1Benefit + year2Benefit + year3Benefit + year4Benefit + year5Benefit;
    const fiveYearCosts = uc.implementationCost + (uc.annualOperatingCost * 5);
    
    // Calculate NPV
    const npv = 
      (year1Benefit / Math.pow(1 + params.discountRate, 1)) +
      (year2Benefit / Math.pow(1 + params.discountRate, 2)) +
      (year3Benefit / Math.pow(1 + params.discountRate, 3)) +
      (year4Benefit / Math.pow(1 + params.discountRate, 4)) +
      (year5Benefit / Math.pow(1 + params.discountRate, 5)) -
      uc.implementationCost -
      (uc.annualOperatingCost * 5);
    
    // Calculate ROI
    const roi = fiveYearCosts > 0 ? ((fiveYearValue - fiveYearCosts) / fiveYearCosts) * 100 : 0;
    
    return {
      useCaseId: uc.id,
      annualValue: adjustedAnnualBenefit,
      implementationCost: uc.implementationCost,
      annualOperatingCost: uc.annualOperatingCost,
      fiveYearValue,
      npv,
      roi,
    };
  });

  // Calculate totals
  const totalAnnualValue = useCaseResults.reduce((sum, uc) => sum + uc.annualValue, 0);
  const totalImplementationCost = useCaseResults.reduce((sum, uc) => sum + uc.implementationCost, 0);
  const totalAnnualOperatingCost = useCaseResults.reduce((sum, uc) => sum + uc.annualOperatingCost, 0);
  const fiveYearNPV = useCaseResults.reduce((sum, uc) => sum + uc.npv, 0);
  
  // Calculate 3-year NPV (no ramp-up, consistent with year1Total = totalAnnualValue)
  const year1Total = totalAnnualValue;
  const year2Total = totalAnnualValue;
  const year3Total = totalAnnualValue;
  
  const threeYearNPV = 
    (year1Total / Math.pow(1 + params.discountRate, 1)) +
    (year2Total / Math.pow(1 + params.discountRate, 2)) +
    (year3Total / Math.pow(1 + params.discountRate, 3)) -
    totalImplementationCost -
    (totalAnnualOperatingCost * 3);
  
  // Calculate payback period
  let cumulativeCashFlow = -totalImplementationCost;
  let paybackMonths = 0;
  const monthlyBenefit = totalAnnualValue / 12;
  const monthlyOperatingCost = totalAnnualOperatingCost / 12;
  
  while (cumulativeCashFlow < 0 && paybackMonths < 60) {
    cumulativeCashFlow += monthlyBenefit - monthlyOperatingCost;
    paybackMonths++;
  }
  
  // Build yearly breakdown
  const yearlyBreakdown: YearlyBreakdown[] = [];
  let cumulative = -totalImplementationCost;
  
  const yearlyBenefits = [year1Total, year2Total, year3Total, totalAnnualValue, totalAnnualValue];
  
  for (let year = 1; year <= 5; year++) {
    const benefits = yearlyBenefits[year - 1];
    const costs = totalAnnualOperatingCost;
    const netCashFlow = benefits - costs;
    cumulative += netCashFlow;
    const discountedCashFlow = netCashFlow / Math.pow(1 + params.discountRate, year);
    
    yearlyBreakdown.push({
      year,
      benefits,
      costs,
      netCashFlow,
      cumulativeCashFlow: cumulative,
      discountedCashFlow,
    });
  }
  
  // Calculate ROI - using correct formula: (total benefits - total costs) / total costs * 100
  const fiveYearBenefits = yearlyBenefits.reduce((sum, b) => sum + b, 0);
  const fiveYearCosts = totalImplementationCost + (totalAnnualOperatingCost * 5);
  const roi = fiveYearCosts > 0 ? ((fiveYearBenefits - fiveYearCosts) / fiveYearCosts) * 100 : 0;
  
  return {
    totalAnnualValue,
    fiveYearNPV,
    threeYearNPV,
    roi,
    paybackMonths,
    yearlyBreakdown,
    useCaseResults,
  };
}

/**
 * Validate calculation determinism by running multiple times
 */
export function validateCalculationDeterminism(params: ScenarioParams, iterations: number = 100): boolean {
  const results: CalculationResults[] = [];
  
  for (let i = 0; i < iterations; i++) {
    results.push(calculateScenario(params));
  }
  
  // Check if all results are identical
  const first = results[0];
  return results.every(r => 
    Math.abs(r.totalAnnualValue - first.totalAnnualValue) < 0.01 &&
    Math.abs(r.fiveYearNPV - first.fiveYearNPV) < 0.01 &&
    Math.abs(r.roi - first.roi) < 0.01 &&
    r.paybackMonths === first.paybackMonths
  );
}

/**
 * Get base model parameters (default scenario)
 */
export function getBaseModelParams(): ScenarioParams {
  return {
    discountRate: 0.10,
    growthFactor: 0.05,
    implementationSpeed: 100,
    hardwareCostMultiplier: 1.0,
    softwareCostMultiplier: 1.0,
    developmentCostMultiplier: 1.0,
    useCaseOverrides: [],
  };
}
