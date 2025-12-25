# Financial Metrics Audit Report

## Data Sources Identified

### 1. useHyperFormula Hook (`client/src/hooks/useHyperFormula.ts`)
**Purpose**: Primary calculation engine for dashboard
**Calculations**:
- ROI: `((totalBenefits - totalInvestment) / totalInvestment) * 100`
- Total Benefits: Sum of 5-year projections benefits
- Total Investment: Sum of 5-year projections investment
- NPV: Discounted cash flows at 10% discount rate
- Payback Period: Not calculated here

**5-Year Projections**:
```
Year 1: benefits = totalAnnualValue * 0.25, investment = 2,401,100
Year 2: benefits = totalAnnualValue * 0.56, investment = 2,633,100
Year 3: benefits = totalAnnualValue * 0.91, investment = 2,083,100
Year 4: benefits = totalAnnualValue * 1.04, investment = 1,973,100
Year 5: benefits = totalAnnualValue * 1.09, investment = 1,933,100
```

**Total Investment**: $11,023,500
**Total Benefits (assuming $15.7M annual)**: ~$60M
**ROI**: ((60M - 11M) / 11M) * 100 = **444.8%**

---

### 2. costBreakdownData.ts (`client/src/lib/costBreakdownData.ts`)
**Purpose**: Cost Analysis tab calculations
**Calculations**:
- ROI: `((totalBenefits - totalCosts) / totalCosts) * 100`
- Uses infrastructure costs + token costs
- Different growth assumptions (5% benefit growth, 3% cost reduction)
- Different investment structure

**5-Year Calculation**:
- Initial Investment (Year 0): One-time infrastructure costs
- Annual Recurring: Infrastructure + token costs (with 3% annual reduction)
- Benefits: Annual value with 5% growth
- ROI: Based on cumulative benefits vs cumulative costs

**Result**: **448.3% ROI**, **$34.87M NPV**, **11 months payback**

---

## Inconsistencies Found

### Issue 1: ROI Display in Header
**Location**: `client/src/pages/Home.tsx` line 94-95
**Current Code**: `{formatPercent(results.roi)}`
**Problem**: `results.roi` is already a percentage (e.g., 448), so `formatPercent()` divides by 100
**Result**: Shows "4%" instead of "448%"
**Fix**: Use `{formatPercent(results.roi / 100)}` OR change formatPercent logic

### Issue 2: Multiple ROI Calculation Methods
**Problem**: Two different calculation engines:
1. **useHyperFormula**: Simple 5-year projection with fixed investment schedule
2. **costBreakdownData**: Detailed infrastructure + operational costs with growth factors

**Values**:
- useHyperFormula ROI: ~445%
- costBreakdownData 5-Year ROI: 448.3%
- costBreakdownData 3-Year ROI: 216.8%

### Issue 3: Payback Period
**useHyperFormula**: Does NOT calculate payback period
**costBreakdownData**: Calculates payback period = 11 months

**Current Display**: Shows "11 mo" everywhere but source is only from costBreakdownData

### Issue 4: NPV Values
**useHyperFormula NPV**: Based on simple projections
**costBreakdownData NPV**: 
- 3-Year: $20.1M
- 5-Year: $34.87M

---

## Components Using Each Source

### Using useHyperFormula (results.roi):
- Home.tsx header (line 94) - **BROKEN** shows 4% instead of 448%
- Home.tsx metric card (line 146) - Correctly divides by 100
- ExecutiveDashboard.tsx (line 76)
- FinancialProjections.tsx (line 212, 242)
- CalculationsView.tsx (line 290)
- ScenarioPlanning.tsx (uses and modifies)
- SensitivityAnalysis.tsx (uses as baseline)
- OnboardingTour.tsx (line 62) - Shows "4.5% ROI" **INCORRECT**

### Using costBreakdownData (calculateROI):
- CostAnalysis.tsx - All ROI displays
- Shows both 3-year and 5-year ROI

---

## Recommendations

### Option 1: Use costBreakdownData as Single Source of Truth ✅ RECOMMENDED
**Pros**:
- More detailed and accurate calculations
- Includes actual infrastructure and operational costs
- Provides both 3-year and 5-year scenarios
- Calculates payback period

**Implementation**:
1. Add payback period to useHyperFormula results (import from costBreakdownData)
2. Ensure useHyperFormula ROI matches costBreakdownData 5-year ROI
3. Update all displays to use consistent formatting

---

## Target Values (Unified)

- **Annual Value**: $15.7M
- **5-Year ROI**: 448% (from costBreakdownData)
- **5-Year NPV**: $34.87M (from costBreakdownData)
- **Payback Period**: 11 months (from costBreakdownData)
- **Total Investment**: $11.02M (5-year cumulative)
- **Total Benefits**: $60M (5-year cumulative)
