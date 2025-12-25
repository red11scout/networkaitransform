import { HyperFormula } from 'hyperformula';
import { useEffect, useState } from 'react';
import { useCases } from '@/lib/useCasesData';
import { calculateROI } from '@/lib/costBreakdownData';

export interface CalculationResults {
  useCaseTotals: {
    id: number;
    name: string;
    horizon: string;
    annualValue: number;
    revenueImpact: number;
    costReduction: number;
    cashFlowImpact: number;
    riskValue: number;
  }[];
  horizonTotals: {
    horizon: string;
    totalAnnualValue: number;
    totalRevenue: number;
    totalCostReduction: number;
    totalCashFlow: number;
    totalRiskValue: number;
  }[];
  grandTotals: {
    totalAnnualValue: number;
    totalRevenue: number;
    totalCostReduction: number;
    totalCashFlow: number;
    totalRiskValue: number;
  };
  fiveYearProjections: {
    year: string;
    benefits: number;
    investment: number;
    netCashFlow: number;
  }[];
  npv: number;
  roi: number;
  paybackPeriod: number;
}

export function useHyperFormula() {
  const [results, setResults] = useState<CalculationResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(true);

  useEffect(() => {
    const calculate = () => {
      // Initialize HyperFormula
      const hf = HyperFormula.buildEmpty({
        licenseKey: 'gpl-v3'
      });

      const sheetName = hf.addSheet('Calculations');
      const sheetId = hf.getSheetId(sheetName);

      if (sheetId === undefined) {
        console.error('Failed to create sheet');
        return;
      }

      // Prepare data - convert all to strings for HyperFormula
      const data: (string | number)[][] = [
        ['ID', 'Name', 'Horizon', 'Annual Value', 'Revenue', 'Cost Reduction', 'Cash Flow', 'Risk Value']
      ];

      useCases.forEach(uc => {
        data.push([
          uc.id,
          uc.name,
          uc.horizon,
          uc.annualValue,
          uc.businessDrivers.revenue,
          uc.businessDrivers.cost,
          uc.businessDrivers.cashFlow,
          uc.businessDrivers.risk
        ]);
      });

      hf.setSheetContent(sheetId, data);

      // Calculate use case totals - directly from data since HyperFormula just stores it
      const useCaseTotals = useCases.map((uc) => {
        return {
          id: uc.id,
          name: uc.name,
          horizon: uc.horizon,
          annualValue: uc.annualValue,
          revenueImpact: uc.businessDrivers.revenue,
          costReduction: uc.businessDrivers.cost,
          cashFlowImpact: uc.businessDrivers.cashFlow,
          riskValue: uc.businessDrivers.risk,
        };
      });

      // Calculate horizon totals
      const horizons = ['H1', 'H2', 'H3', 'Enabler'];
      const horizonTotals = horizons.map(horizon => {
        const horizonCases = useCases.filter(uc => uc.horizon === horizon);
        return {
          horizon,
          totalAnnualValue: horizonCases.reduce((sum, uc) => sum + uc.annualValue, 0),
          totalRevenue: horizonCases.reduce((sum, uc) => sum + uc.businessDrivers.revenue, 0),
          totalCostReduction: horizonCases.reduce((sum, uc) => sum + uc.businessDrivers.cost, 0),
          totalCashFlow: horizonCases.reduce((sum, uc) => sum + uc.businessDrivers.cashFlow, 0),
          totalRiskValue: horizonCases.reduce((sum, uc) => sum + uc.businessDrivers.risk, 0),
        };
      });

      // Calculate grand totals
      const grandTotals = {
        totalAnnualValue: useCases.reduce((sum, uc) => sum + uc.annualValue, 0),
        totalRevenue: useCases.reduce((sum, uc) => sum + uc.businessDrivers.revenue, 0),
        totalCostReduction: useCases.reduce((sum, uc) => sum + uc.businessDrivers.cost, 0),
        totalCashFlow: useCases.reduce((sum, uc) => sum + uc.businessDrivers.cashFlow, 0),
        totalRiskValue: useCases.reduce((sum, uc) => sum + uc.businessDrivers.risk, 0),
      };

      // Calculate 5-year projections
      const fiveYearProjections = [
        { year: 'Year 1', benefits: grandTotals.totalAnnualValue * 0.25, investment: 2401100 },
        { year: 'Year 2', benefits: grandTotals.totalAnnualValue * 0.56, investment: 2633100 },
        { year: 'Year 3', benefits: grandTotals.totalAnnualValue * 0.91, investment: 2083100 },
        { year: 'Year 4', benefits: grandTotals.totalAnnualValue * 1.04, investment: 1973100 },
        { year: 'Year 5', benefits: grandTotals.totalAnnualValue * 1.09, investment: 1933100 },
      ].map(proj => ({
        ...proj,
        netCashFlow: proj.benefits - proj.investment
      }));

      // Calculate NPV and ROI using HyperFormula formulas
      const discountRate = 0.10;
      let npv = 0;
      fiveYearProjections.forEach((proj, index) => {
        const yearNum = index + 1;
        const discountFactor = 1 / Math.pow(1 + discountRate, yearNum);
        npv += proj.netCashFlow * discountFactor;
      });

      const totalInvestment = fiveYearProjections.reduce((sum, proj) => sum + proj.investment, 0);
      const totalBenefits = fiveYearProjections.reduce((sum, proj) => sum + proj.benefits, 0);
      const roi = ((totalBenefits - totalInvestment) / totalInvestment) * 100;

      // Get payback period from costBreakdownData for consistency
      const roiData = calculateROI(5);
      const paybackMonths = roiData.paybackPeriod;

      setResults({
        useCaseTotals,
        horizonTotals,
        grandTotals,
        fiveYearProjections,
        npv,
        roi,
        paybackPeriod: Math.round(paybackMonths)
      });
      setIsCalculating(false);
    };

    calculate();
  }, []);

  return { results, isCalculating };
}
