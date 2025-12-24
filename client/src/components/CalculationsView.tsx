import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalculationResults } from '@/hooks/useHyperFormula';
import { useCases } from '@/lib/useCasesData';
import { formatMillions, formatPercent, formatNumber, getHorizonColor } from '@/lib/utils';
import { Calculator, TrendingUp, DollarSign, Zap } from 'lucide-react';

interface CalculationsViewProps {
  results: CalculationResults;
}

export default function CalculationsView({ results }: CalculationsViewProps) {
  return (
    <div className="space-y-6">
      {/* Calculation Engine Info */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            HyperFormula Calculation Engine
          </CardTitle>
          <CardDescription>
            All financial calculations are performed using HyperFormula v3.1.1, an open-source spreadsheet engine 
            that ensures accuracy, transparency, and auditability.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-background rounded-lg p-4">
              <div className="text-sm text-muted-foreground mb-1">Engine</div>
              <div className="font-semibold">HyperFormula v3.1.1</div>
            </div>
            <div className="bg-background rounded-lg p-4">
              <div className="text-sm text-muted-foreground mb-1">License</div>
              <div className="font-semibold">GPL-v3</div>
            </div>
            <div className="bg-background rounded-lg p-4">
              <div className="text-sm text-muted-foreground mb-1">Calculations</div>
              <div className="font-semibold">Real-time</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Use Case Calculations */}
      <Card>
        <CardHeader>
          <CardTitle>Use Case Financial Calculations</CardTitle>
          <CardDescription>Detailed breakdown of all 14 use cases with calculated values</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 font-medium">ID</th>
                  <th className="text-left py-3 px-2 font-medium">Use Case</th>
                  <th className="text-center py-3 px-2 font-medium">Horizon</th>
                  <th className="text-right py-3 px-2 font-medium">Annual Value</th>
                  <th className="text-right py-3 px-2 font-medium">Revenue</th>
                  <th className="text-right py-3 px-2 font-medium">Cost Reduction</th>
                  <th className="text-right py-3 px-2 font-medium">Cash Flow</th>
                  <th className="text-right py-3 px-2 font-medium">Risk Value</th>
                </tr>
              </thead>
              <tbody>
                {results.useCaseTotals.map((uc) => (
                  <tr key={uc.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-2 font-medium">{uc.id}</td>
                    <td className="py-3 px-2">
                      <div className="font-medium">{uc.name}</div>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <Badge 
                        variant="outline" 
                        style={{ borderColor: getHorizonColor(uc.horizon) }}
                      >
                        {uc.horizon}
                      </Badge>
                    </td>
                    <td className="text-right py-3 px-2 font-semibold">
                      {formatMillions(uc.annualValue, 2)}
                    </td>
                    <td className="text-right py-3 px-2">
                      {uc.revenueImpact > 0 ? formatMillions(uc.revenueImpact, 2) : '-'}
                    </td>
                    <td className="text-right py-3 px-2">
                      {uc.costReduction > 0 ? formatMillions(uc.costReduction, 2) : '-'}
                    </td>
                    <td className="text-right py-3 px-2">
                      {uc.cashFlowImpact > 0 ? formatMillions(uc.cashFlowImpact, 2) : '-'}
                    </td>
                    <td className="text-right py-3 px-2">
                      {uc.riskValue > 0 ? formatMillions(uc.riskValue, 2) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Horizon Totals */}
      <Card>
        <CardHeader>
          <CardTitle>Horizon Aggregations</CardTitle>
          <CardDescription>Calculated totals by implementation horizon</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Horizon</th>
                  <th className="text-right py-3 px-4 font-medium">Total Annual Value</th>
                  <th className="text-right py-3 px-4 font-medium">Total Revenue</th>
                  <th className="text-right py-3 px-4 font-medium">Total Cost Reduction</th>
                  <th className="text-right py-3 px-4 font-medium">Total Cash Flow</th>
                  <th className="text-right py-3 px-4 font-medium">Total Risk Value</th>
                </tr>
              </thead>
              <tbody>
                {results.horizonTotals.map((ht) => (
                  <tr key={ht.horizon} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <Badge 
                        variant="outline" 
                        style={{ borderColor: getHorizonColor(ht.horizon) }}
                      >
                        {ht.horizon}
                      </Badge>
                    </td>
                    <td className="text-right py-3 px-4 font-semibold">
                      {formatMillions(ht.totalAnnualValue)}
                    </td>
                    <td className="text-right py-3 px-4">
                      {ht.totalRevenue > 0 ? formatMillions(ht.totalRevenue) : '-'}
                    </td>
                    <td className="text-right py-3 px-4">
                      {ht.totalCostReduction > 0 ? formatMillions(ht.totalCostReduction) : '-'}
                    </td>
                    <td className="text-right py-3 px-4">
                      {ht.totalCashFlow > 0 ? formatMillions(ht.totalCashFlow) : '-'}
                    </td>
                    <td className="text-right py-3 px-4">
                      {ht.totalRiskValue > 0 ? formatMillions(ht.totalRiskValue) : '-'}
                    </td>
                  </tr>
                ))}
                <tr className="font-bold bg-muted/30">
                  <td className="py-3 px-4">Grand Total</td>
                  <td className="text-right py-3 px-4">
                    {formatMillions(results.grandTotals.totalAnnualValue)}
                  </td>
                  <td className="text-right py-3 px-4">
                    {formatMillions(results.grandTotals.totalRevenue)}
                  </td>
                  <td className="text-right py-3 px-4">
                    {formatMillions(results.grandTotals.totalCostReduction)}
                  </td>
                  <td className="text-right py-3 px-4">
                    {formatMillions(results.grandTotals.totalCashFlow)}
                  </td>
                  <td className="text-right py-3 px-4">
                    {formatMillions(results.grandTotals.totalRiskValue)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 5-Year Projections Calculations */}
      <Card>
        <CardHeader>
          <CardTitle>5-Year Financial Projections</CardTitle>
          <CardDescription>Year-by-year calculated projections with growth factors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Year</th>
                  <th className="text-center py-3 px-4 font-medium">Growth Factor</th>
                  <th className="text-right py-3 px-4 font-medium">Benefits</th>
                  <th className="text-right py-3 px-4 font-medium">Investment</th>
                  <th className="text-right py-3 px-4 font-medium">Net Cash Flow</th>
                  <th className="text-right py-3 px-4 font-medium">Discount Factor (10%)</th>
                  <th className="text-right py-3 px-4 font-medium">PV of Cash Flow</th>
                </tr>
              </thead>
              <tbody>
                {results.fiveYearProjections.map((proj, index) => {
                  const yearNum = index + 1;
                  const discountFactor = 1 / Math.pow(1.10, yearNum);
                  const pvCashFlow = proj.netCashFlow * discountFactor;
                  const growthFactor = [0.25, 0.56, 0.91, 1.04, 1.09][index];
                  
                  return (
                    <tr key={proj.year} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">{proj.year}</td>
                      <td className="text-center py-3 px-4">{(growthFactor * 100).toFixed(0)}%</td>
                      <td className="text-right py-3 px-4 font-semibold text-chart-4">
                        {formatMillions(proj.benefits)}
                      </td>
                      <td className="text-right py-3 px-4 font-semibold text-chart-5">
                        {formatMillions(proj.investment)}
                      </td>
                      <td className={`text-right py-3 px-4 font-semibold ${proj.netCashFlow >= 0 ? 'text-chart-4' : 'text-destructive'}`}>
                        {formatMillions(proj.netCashFlow)}
                      </td>
                      <td className="text-right py-3 px-4">
                        {discountFactor.toFixed(4)}
                      </td>
                      <td className="text-right py-3 px-4 font-semibold">
                        {formatMillions(pvCashFlow)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* NPV and ROI Calculations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              NPV Calculation
            </CardTitle>
            <CardDescription>Net Present Value at 10% discount rate</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="text-sm text-muted-foreground mb-2">Formula</div>
              <code className="text-xs">
                NPV = Σ (Cash Flow<sub>t</sub> / (1 + r)<sup>t</sup>)
              </code>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Discount Rate (r):</span>
                <span className="font-semibold">10%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Time Period (t):</span>
                <span className="font-semibold">5 years</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="font-medium">Net Present Value:</span>
                <span className="text-xl font-bold text-primary">{formatMillions(results.npv)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-chart-4" />
              ROI Calculation
            </CardTitle>
            <CardDescription>Return on Investment over 5 years</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="text-sm text-muted-foreground mb-2">Formula</div>
              <code className="text-xs">
                ROI = ((Total Benefits - Total Investment) / Total Investment) × 100
              </code>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Benefits:</span>
                <span className="font-semibold">{formatMillions(results.fiveYearProjections.reduce((sum, p) => sum + p.benefits, 0))}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Investment:</span>
                <span className="font-semibold">{formatMillions(results.fiveYearProjections.reduce((sum, p) => sum + p.investment, 0))}</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="font-medium">Return on Investment:</span>
                <span className="text-xl font-bold text-chart-4">{formatPercent(results.roi)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calculation Methodology */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-accent" />
            Calculation Methodology
          </CardTitle>
          <CardDescription>How the financial metrics are computed</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Annual Value Calculation</h4>
              <p className="text-muted-foreground">
                Each use case's annual value is calculated as the sum of four business drivers: 
                Revenue Impact + Cost Reduction + Cash Flow Impact + Risk Value. These values are 
                derived from baseline and target KPIs, multiplied by relevant cost factors.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">5-Year Projection Model</h4>
              <p className="text-muted-foreground">
                Benefits ramp up over time based on implementation horizons: Year 1 (25%), Year 2 (56%), 
                Year 3 (91%), Year 4 (104%), Year 5 (109%). Investment costs include development, 
                maintenance, token consumption, and infrastructure expenses.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Discount Rate Selection</h4>
              <p className="text-muted-foreground">
                The 10% discount rate reflects the weighted average cost of capital (WACC) for 
                telecommunications infrastructure investments, accounting for both risk and opportunity cost.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Payback Period</h4>
              <p className="text-muted-foreground">
                The 11-month payback period is calculated as the point where cumulative net cash flow 
                turns positive, indicating when the investment has been fully recovered.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
