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

// Base use case data (from the original analysis)
const BASE_USE_CASES = [
  { id: 'UC01', name: 'Autonomous Network Testing', annualBenefit: 3000000, implementationCost: 500000, annualOperatingCost: 150000, timeToValue: 6, successProbability: 85 },
  { id: 'UC02', name: 'Intelligent Incident Management', annualBenefit: 2500000, implementationCost: 450000, annualOperatingCost: 120000, timeToValue: 4, successProbability: 90 },
  { id: 'UC03', name: 'Predictive Network Maintenance', annualBenefit: 2000000, implementationCost: 600000, annualOperatingCost: 180000, timeToValue: 8, successProbability: 75 },
  { id: 'UC04', name: 'AI-Powered Customer Support', annualBenefit: 1800000, implementationCost: 400000, annualOperatingCost: 100000, timeToValue: 5, successProbability: 85 },
  { id: 'UC05', name: 'Network Capacity Optimization', annualBenefit: 1500000, implementationCost: 550000, annualOperatingCost: 140000, timeToValue: 7, successProbability: 80 },
  { id: 'UC06', name: 'Intelligent Document Processing', annualBenefit: 1200000, implementationCost: 350000, annualOperatingCost: 90000, timeToValue: 4, successProbability: 90 },
  { id: 'UC07', name: 'AI Code Review & Generation', annualBenefit: 1000000, implementationCost: 300000, annualOperatingCost: 80000, timeToValue: 3, successProbability: 85 },
  { id: 'UC08', name: 'Automated Compliance Monitoring', annualBenefit: 900000, implementationCost: 400000, annualOperatingCost: 110000, timeToValue: 6, successProbability: 80 },
  { id: 'UC09', name: 'Intelligent Resource Allocation', annualBenefit: 850000, implementationCost: 320000, annualOperatingCost: 85000, timeToValue: 5, successProbability: 85 },
  { id: 'UC10', name: 'AI-Driven Sales Intelligence', annualBenefit: 750000, implementationCost: 280000, annualOperatingCost: 75000, timeToValue: 4, successProbability: 80 },
  { id: 'UC11', name: 'Predictive Customer Churn', annualBenefit: 700000, implementationCost: 350000, annualOperatingCost: 95000, timeToValue: 6, successProbability: 75 },
  { id: 'UC12', name: 'Automated Report Generation', annualBenefit: 600000, implementationCost: 250000, annualOperatingCost: 60000, timeToValue: 3, successProbability: 90 },
  { id: 'UC13', name: 'AI Governance Framework', annualBenefit: 400000, implementationCost: 500000, annualOperatingCost: 150000, timeToValue: 12, successProbability: 70 },
  { id: 'UC14', name: 'AI Training & Enablement', annualBenefit: 350000, implementationCost: 400000, annualOperatingCost: 120000, timeToValue: 9, successProbability: 75 },
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
    // Adjust benefit for success probability and implementation speed
    const adjustedAnnualBenefit = uc.annualBenefit * (uc.successProbability / 100) * (params.implementationSpeed / 100);
    
    // Calculate year-by-year benefits
    const year1Benefit = uc.timeToValue <= 12 
      ? adjustedAnnualBenefit * ((12 - uc.timeToValue) / 12)
      : 0;
    const year2Benefit = adjustedAnnualBenefit;
    const year3Benefit = adjustedAnnualBenefit * (1 + params.growthFactor);
    const year4Benefit = adjustedAnnualBenefit * Math.pow(1 + params.growthFactor, 2);
    const year5Benefit = adjustedAnnualBenefit * Math.pow(1 + params.growthFactor, 3);
    
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
  
  // Calculate 3-year NPV
  const year1Total = useCaseResults.reduce((sum, uc) => {
    const baseUC = BASE_USE_CASES.find(b => b.id === uc.useCaseId)!;
    const timeToValue = baseUC.timeToValue;
    return sum + (timeToValue <= 12 ? uc.annualValue * ((12 - timeToValue) / 12) : 0);
  }, 0);
  const year2Total = totalAnnualValue;
  const year3Total = totalAnnualValue * (1 + params.growthFactor);
  
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
  
  const yearlyBenefits = [year1Total, year2Total, year3Total, 
    totalAnnualValue * Math.pow(1 + params.growthFactor, 2),
    totalAnnualValue * Math.pow(1 + params.growthFactor, 3)];
  
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
  
  // Calculate ROI
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
