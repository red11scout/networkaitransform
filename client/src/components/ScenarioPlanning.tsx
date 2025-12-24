import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { useHyperFormula } from '@/hooks/useHyperFormula';
import { formatMillions, formatPercent } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Settings, RotateCcw, TrendingUp, AlertCircle } from 'lucide-react';

export default function ScenarioPlanning() {
  // Scenario parameters
  const [discountRate, setDiscountRate] = useState(10);
  const [growthFactor, setGrowthFactor] = useState(100); // Percentage of baseline
  const [successProbability, setSuccessProbability] = useState(100); // Percentage of baseline
  const [implementationSpeed, setImplementationSpeed] = useState(100); // Percentage of baseline TTV

  // Calculate adjusted results
  const { results: baseResults, isCalculating } = useHyperFormula();
  const [scenarioResults, setScenarioResults] = useState<typeof baseResults>(baseResults);

  // Don't render until calculations are complete
  if (isCalculating || !baseResults) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="text-muted-foreground">Calculating scenarios...</div>
        </CardContent>
      </Card>
    );
  }

  useEffect(() => {
    if (!baseResults) return;
    
    // Recalculate with adjusted parameters
    const adjusted = { ...baseResults };
    
    // Adjust annual values based on success probability
    const probabilityMultiplier = successProbability / 100;
    const growthMultiplier = growthFactor / 100;
    
    adjusted.grandTotals = {
      ...adjusted.grandTotals,
      totalAnnualValue: adjusted.grandTotals.totalAnnualValue * probabilityMultiplier * growthMultiplier,
      totalRevenue: adjusted.grandTotals.totalRevenue * probabilityMultiplier * growthMultiplier,
      totalCostReduction: adjusted.grandTotals.totalCostReduction * probabilityMultiplier * growthMultiplier,
      totalCashFlow: adjusted.grandTotals.totalCashFlow * probabilityMultiplier * growthMultiplier,
      totalRiskValue: adjusted.grandTotals.totalRiskValue * probabilityMultiplier * growthMultiplier
    };

    // Recalculate 5-year projections with new discount rate
    const adjustedProjections = adjusted.fiveYearProjections.map((proj, index) => {
      const yearNum = index + 1;
      const benefits = proj.benefits * probabilityMultiplier * growthMultiplier;
      const investment = proj.investment * (implementationSpeed / 100); // Faster implementation = higher initial cost
      const netCashFlow = benefits - investment;
      
      return {
        ...proj,
        benefits,
        investment,
        netCashFlow
      };
    });

    adjusted.fiveYearProjections = adjustedProjections;

    // Recalculate NPV with new discount rate
    let npv = 0;
    adjustedProjections.forEach((proj, index) => {
      const yearNum = index + 1;
      const discountFactor = 1 / Math.pow(1 + discountRate / 100, yearNum);
      npv += proj.netCashFlow * discountFactor;
    });
    adjusted.npv = npv;

    // Recalculate ROI
    const totalBenefits = adjustedProjections.reduce((sum, p) => sum + p.benefits, 0);
    const totalInvestment = adjustedProjections.reduce((sum, p) => sum + p.investment, 0);
    adjusted.roi = ((totalBenefits - totalInvestment) / totalInvestment) * 100;

    setScenarioResults(adjusted);
  }, [discountRate, growthFactor, successProbability, implementationSpeed, baseResults]);

  const resetToDefaults = () => {
    setDiscountRate(10);
    setGrowthFactor(100);
    setSuccessProbability(100);
    setImplementationSpeed(100);
  };

  // Compare baseline vs scenario
  if (!scenarioResults) return null;
  
  const comparisonData = [
    {
      metric: 'NPV',
      baseline: baseResults.npv / 1000000,
      scenario: scenarioResults.npv / 1000000
    },
    {
      metric: 'ROI',
      baseline: baseResults.roi,
      scenario: scenarioResults.roi
    },
    {
      metric: 'Annual Value',
      baseline: baseResults.grandTotals.totalAnnualValue / 1000000,
      scenario: scenarioResults.grandTotals.totalAnnualValue / 1000000
    }
  ];

  // 5-year comparison
  const yearlyComparison = baseResults.fiveYearProjections.map((base, index) => ({
    year: base.year,
    baselineNCF: base.netCashFlow / 1000000,
    scenarioNCF: scenarioResults.fiveYearProjections[index].netCashFlow / 1000000
  }));

  const isModified = discountRate !== 10 || growthFactor !== 100 || successProbability !== 100 || implementationSpeed !== 100;

  return (
    <div className="space-y-6">
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Scenario Planning Tool
          </CardTitle>
          <CardDescription>
            Adjust key assumptions and see real-time impact on financial projections using HyperFormula
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Controls */}
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="discount-rate">Discount Rate</Label>
                  <span className="text-sm font-semibold">{discountRate}%</span>
                </div>
                <Slider
                  id="discount-rate"
                  min={5}
                  max={20}
                  step={0.5}
                  value={[discountRate]}
                  onValueChange={(value) => setDiscountRate(value[0])}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Higher discount rates reduce the present value of future cash flows
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="growth-factor">Growth Factor</Label>
                  <span className="text-sm font-semibold">{growthFactor}%</span>
                </div>
                <Slider
                  id="growth-factor"
                  min={50}
                  max={150}
                  step={5}
                  value={[growthFactor]}
                  onValueChange={(value) => setGrowthFactor(value[0])}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Adjust expected benefits (100% = baseline, 150% = 50% higher benefits)
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="success-probability">Success Probability</Label>
                  <span className="text-sm font-semibold">{successProbability}%</span>
                </div>
                <Slider
                  id="success-probability"
                  min={50}
                  max={100}
                  step={5}
                  value={[successProbability]}
                  onValueChange={(value) => setSuccessProbability(value[0])}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Risk-adjusted probability of achieving projected benefits
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="implementation-speed">Implementation Speed</Label>
                  <span className="text-sm font-semibold">{implementationSpeed}%</span>
                </div>
                <Slider
                  id="implementation-speed"
                  min={50}
                  max={150}
                  step={10}
                  value={[implementationSpeed]}
                  onValueChange={(value) => setImplementationSpeed(value[0])}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Faster implementation increases upfront costs but accelerates benefits
                </p>
              </div>

              {isModified && (
                <Button onClick={resetToDefaults} variant="outline" className="w-full">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset to Baseline
                </Button>
              )}
            </div>

            {/* Results */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-muted-foreground">NPV</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatMillions(scenarioResults.npv)}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {scenarioResults.npv > baseResults.npv ? '+' : ''}
                      {formatMillions(scenarioResults.npv - baseResults.npv)} vs baseline
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-chart-4/10 to-chart-4/5">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-muted-foreground">ROI</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatPercent(scenarioResults.roi)}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {scenarioResults.roi > baseResults.roi ? '+' : ''}
                      {formatPercent(scenarioResults.roi - baseResults.roi)} vs baseline
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-chart-2/10 to-chart-2/5">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-muted-foreground">Annual Value</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatMillions(scenarioResults.grandTotals.totalAnnualValue)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {scenarioResults.grandTotals.totalAnnualValue > baseResults.grandTotals.totalAnnualValue ? '+' : ''}
                      {formatMillions(scenarioResults.grandTotals.totalAnnualValue - baseResults.grandTotals.totalAnnualValue)} vs baseline
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-chart-1/10 to-chart-1/5">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-muted-foreground">5Y Net Cash</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatMillions(scenarioResults.fiveYearProjections.reduce((sum, p) => sum + p.netCashFlow, 0))}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Total over 5 years
                    </div>
                  </CardContent>
                </Card>
              </div>

              {isModified && (
                <Card className="bg-amber-500/10 border-amber-500/30">
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
                      <div className="text-xs text-amber-900 dark:text-amber-200">
                        <strong>Scenario Active:</strong> Results are calculated with your adjusted assumptions. 
                        Reset to view baseline projections.
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comparison Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Baseline vs Scenario Comparison</CardTitle>
            <CardDescription>Key metrics comparison</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="metric" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="baseline" fill="hsl(var(--muted-foreground))" name="Baseline" radius={[8, 8, 0, 0]} />
                <Bar dataKey="scenario" fill="hsl(var(--primary))" name="Scenario" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5-Year Cash Flow Comparison</CardTitle>
            <CardDescription>Net cash flow over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={yearlyComparison}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="year" className="text-xs" />
                <YAxis className="text-xs" tickFormatter={(value) => `$${value}M`} />
                <Tooltip
                  formatter={(value: number) => `$${value.toFixed(2)}M`}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="baselineNCF"
                  stroke="hsl(var(--muted-foreground))"
                  strokeWidth={2}
                  name="Baseline"
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="scenarioNCF"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  name="Scenario"
                  dot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Scenario Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="font-semibold mb-2">Impact on NPV</div>
              <div className="text-muted-foreground">
                {scenarioResults.npv > baseResults.npv ? (
                  <span className="text-chart-4">
                    ↑ NPV increased by {formatMillions(scenarioResults.npv - baseResults.npv)} ({formatPercent(((scenarioResults.npv - baseResults.npv) / baseResults.npv) * 100)})
                  </span>
                ) : scenarioResults.npv < baseResults.npv ? (
                  <span className="text-destructive">
                    ↓ NPV decreased by {formatMillions(baseResults.npv - scenarioResults.npv)} ({formatPercent(((baseResults.npv - scenarioResults.npv) / baseResults.npv) * 100)})
                  </span>
                ) : (
                  <span>No change from baseline</span>
                )}
              </div>
            </div>

            <div>
              <div className="font-semibold mb-2">Impact on ROI</div>
              <div className="text-muted-foreground">
                {scenarioResults.roi > baseResults.roi ? (
                  <span className="text-chart-4">
                    ↑ ROI improved by {formatPercent(scenarioResults.roi - baseResults.roi)} points
                  </span>
                ) : scenarioResults.roi < baseResults.roi ? (
                  <span className="text-destructive">
                    ↓ ROI decreased by {formatPercent(baseResults.roi - scenarioResults.roi)} points
                  </span>
                ) : (
                  <span>No change from baseline</span>
                )}
              </div>
            </div>

            <div>
              <div className="font-semibold mb-2">Risk Assessment</div>
              <div className="text-muted-foreground">
                {successProbability < 80 ? (
                  <span className="text-amber-600">
                    ⚠ Higher risk scenario with {successProbability}% success probability
                  </span>
                ) : successProbability >= 95 ? (
                  <span className="text-chart-4">
                    ✓ Low risk scenario with {successProbability}% success probability
                  </span>
                ) : (
                  <span>
                    Moderate risk with {successProbability}% success probability
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
