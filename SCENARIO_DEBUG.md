# Scenario Builder Debug Findings

## Current Status (After Ramp-up Removal)
- **Total Annual Value**: $15,700,000 ✅ (correct, was $14.61M)
- **5-Year NPV**: $41,532,352 (should be ~$35M)
- **ROI**: 3% ❌ (should be 448%)
- **Payback Period**: 4 months ❌ (should be 1-2 months)

## Year 3 Breakdown (from chart hover)
- Benefits: $15,700,000 ✅
- Costs: $2,782,000 (expected $3M)

## Issues to Fix
1. **Annual operating costs**: Showing $2.78M instead of $3M
   - Possible cause: Sum of individual use case operating costs ≠ $3M total
   
2. **ROI calculation**: Still showing 3% instead of 359-448%
   - Formula: `((totalBenefits - totalCosts) / totalCosts) * 100`
   - With $15.7M × 5 = $78.5M benefits and ~$17M costs, should be ~359%
   - 3% suggests formula might be: `(benefits - costs) / benefits` instead

3. **Payback period**: 4 months instead of 1-2 months
   - With $2.11M investment and $12.7M annual net cash flow
   - Should be: $2.11M / ($12.7M/12) = 2 months
   - 4 months suggests lower net cash flow being calculated

## Next Steps
1. Verify BASE_USE_CASES operating costs sum to $3M
2. Double-check ROI formula implementation
3. Verify payback calculation uses correct monthly net cash flow
