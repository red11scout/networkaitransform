import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useHyperFormula } from '@/hooks/useHyperFormula';
import { formatMillions, formatPercent } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Activity, TrendingDown, TrendingUp, AlertTriangle } from 'lucide-react';

export default function SensitivityAnalysis() {
  const { results: baseResults, isCalculating } = useHyperFormula();
  const [selectedVariable, setSelectedVariable] = useState<string>('discountRate');

  if (isCalculating || !baseResults) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="text-muted-foreground">Calculating sensitivity analysis...</div>
        </CardContent>
      </Card>
    );
  }

  // Define sensitivity variables and their ranges
  const variables = [
    {
      id: 'discountRate',
      name: 'Discount Rate',
      baseline: 10,
      unit: '%',
      range: [5, 7.5, 10, 12.5, 15, 17.5, 20],
      description: 'Cost of capital used to discount future cash flows'
    },
    {
      id: 'benefitsGrowth',
      name: 'Benefits Growth',
      baseline: 100,
      unit: '%',
      range: [50, 70, 85, 100, 115, 130, 150],
      description: 'Percentage of projected benefits actually realized'
    },
    {
      id: 'implementationCost',
      name: 'Implementation Cost',
      baseline: 100,
      unit: '%',
      range: [70, 80, 90, 100, 110, 120, 130],
      description: 'Actual vs. estimated implementation costs'
    },
    {
      id: 'timeToValue',
      name: 'Time to Value',
      baseline: 100,
      unit: '%',
      range: [70, 80, 90, 100, 110, 120, 130],
      description: 'Speed of implementation relative to baseline'
    },
    {
      id: 'successProbability',
      name: 'Success Probability',
      baseline: 100,
      unit: '%',
      range: [60, 70, 80, 90, 100],
      description: 'Probability of achieving projected outcomes'
    }
  ];

  // Calculate NPV sensitivity for each variable
  const calculateNPVSensitivity = (variableId: string, value: number) => {
    const baseNPV = baseResults.npv;
    let adjustedNPV = baseNPV;

    switch (variableId) {
      case 'discountRate': {
        // Recalculate NPV with new discount rate
        const rate = value / 100;
        adjustedNPV = 0;
        baseResults.fiveYearProjections.forEach((proj, index) => {
          const yearNum = index + 1;
          const discountFactor = 1 / Math.pow(1 + rate, yearNum);
          adjustedNPV += proj.netCashFlow * discountFactor;
        });
        break;
      }
      case 'benefitsGrowth': {
        const multiplier = value / 100;
        adjustedNPV = 0;
        baseResults.fiveYearProjections.forEach((proj, index) => {
          const yearNum = index + 1;
          const discountFactor = 1 / Math.pow(1.10, yearNum);
          const adjustedBenefits = proj.benefits * multiplier;
          const netCashFlow = adjustedBenefits - proj.investment;
          adjustedNPV += netCashFlow * discountFactor;
        });
        break;
      }
      case 'implementationCost': {
        const multiplier = value / 100;
        adjustedNPV = 0;
        baseResults.fiveYearProjections.forEach((proj, index) => {
          const yearNum = index + 1;
          const discountFactor = 1 / Math.pow(1.10, yearNum);
          const adjustedInvestment = proj.investment * multiplier;
          const netCashFlow = proj.benefits - adjustedInvestment;
          adjustedNPV += netCashFlow * discountFactor;
        });
        break;
      }
      case 'timeToValue': {
        // Faster TTV = benefits arrive sooner (higher NPV)
        // Slower TTV = benefits delayed (lower NPV)
        const speedFactor = 100 / value; // Inverse relationship
        adjustedNPV = baseNPV * (0.8 + 0.4 * speedFactor); // Simplified model
        break;
      }
      case 'successProbability': {
        const multiplier = value / 100;
        adjustedNPV = baseNPV * multiplier;
        break;
      }
    }

    return adjustedNPV;
  };

  // Calculate ROI sensitivity
  const calculateROISensitivity = (variableId: string, value: number) => {
    const baseROI = baseResults.roi;
    let adjustedROI = baseROI;

    switch (variableId) {
      case 'benefitsGrowth': {
        const multiplier = value / 100;
        const totalBenefits = baseResults.fiveYearProjections.reduce((sum, p) => sum + p.benefits, 0);
        const totalInvestment = baseResults.fiveYearProjections.reduce((sum, p) => sum + p.investment, 0);
        const adjustedBenefits = totalBenefits * multiplier;
        adjustedROI = ((adjustedBenefits - totalInvestment) / totalInvestment) * 100;
        break;
      }
      case 'implementationCost': {
        const multiplier = value / 100;
        const totalBenefits = baseResults.fiveYearProjections.reduce((sum, p) => sum + p.benefits, 0);
        const totalInvestment = baseResults.fiveYearProjections.reduce((sum, p) => sum + p.investment, 0);
        const adjustedInvestment = totalInvestment * multiplier;
        adjustedROI = ((totalBenefits - adjustedInvestment) / adjustedInvestment) * 100;
        break;
      }
      case 'successProbability': {
        const multiplier = value / 100;
        adjustedROI = baseROI * multiplier;
        break;
      }
      default:
        adjustedROI = baseROI;
    }

    return adjustedROI;
  };

  // Generate tornado chart data (NPV sensitivity)
  const tornadoData = variables.map(variable => {
    const lowValue = variable.range[0];
    const highValue = variable.range[variable.range.length - 1];
    
    const npvLow = calculateNPVSensitivity(variable.id, lowValue);
    const npvHigh = calculateNPVSensitivity(variable.id, highValue);
    
    const impactLow = ((npvLow - baseResults.npv) / baseResults.npv) * 100;
    const impactHigh = ((npvHigh - baseResults.npv) / baseResults.npv) * 100;
    
    return {
      variable: variable.name,
      impactLow,
      impactHigh,
      range: Math.abs(impactHigh - impactLow)
    };
  }).sort((a, b) => b.range - a.range); // Sort by impact range

  // Generate detailed sensitivity table for selected variable
  const selectedVar = variables.find(v => v.id === selectedVariable)!;
  const sensitivityTable = selectedVar.range.map(value => {
    const npv = calculateNPVSensitivity(selectedVariable, value);
    const roi = calculateROISensitivity(selectedVariable, value);
    const npvChange = ((npv - baseResults.npv) / baseResults.npv) * 100;
    const roiChange = roi - baseResults.roi;
    
    return {
      value,
      npv,
      npvChange,
      roi,
      roiChange,
      isBaseline: value === selectedVar.baseline
    };
  });

  // Risk assessment
  const worstCaseNPV = Math.min(...variables.flatMap(v => 
    v.range.map(val => calculateNPVSensitivity(v.id, val))
  ));
  const bestCaseNPV = Math.max(...variables.flatMap(v => 
    v.range.map(val => calculateNPVSensitivity(v.id, val))
  ));

  return (
    <div className="space-y-6">
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Sensitivity Analysis
          </CardTitle>
          <CardDescription>
            Understand how changes in key assumptions impact financial outcomes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-gradient-to-br from-chart-4/10 to-chart-4/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground">Base Case NPV</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatMillions(baseResults.npv)}</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-chart-5/10 to-chart-5/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground">Worst Case NPV</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatMillions(worstCaseNPV)}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {formatPercent(((worstCaseNPV - baseResults.npv) / baseResults.npv) * 100)} vs base
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-chart-1/10 to-chart-1/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground">Best Case NPV</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatMillions(bestCaseNPV)}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {formatPercent(((bestCaseNPV - baseResults.npv) / baseResults.npv) * 100)} vs base
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Tornado Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Tornado Chart - NPV Sensitivity</CardTitle>
          <CardDescription>
            Variables ranked by their impact on NPV (most impactful at top)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={tornadoData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis type="number" tickFormatter={(value) => `${value.toFixed(0)}%`} />
              <YAxis dataKey="variable" type="category" className="text-xs" />
              <Tooltip
                formatter={(value: number) => `${value.toFixed(1)}%`}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="impactLow" stackId="a" fill="#ef4444" name="Downside" />
              <Bar dataKey="impactHigh" stackId="a" fill="#10b981" name="Upside" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detailed Sensitivity Tables */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Sensitivity Analysis</CardTitle>
          <CardDescription>
            Explore how specific changes in each variable affect NPV and ROI
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedVariable} onValueChange={setSelectedVariable}>
            <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-6">
              {variables.map(variable => (
                <TabsTrigger key={variable.id} value={variable.id} className="text-xs">
                  {variable.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {variables.map(variable => (
              <TabsContent key={variable.id} value={variable.id} className="space-y-4">
                <div className="bg-muted/30 rounded-lg p-4 text-sm">
                  <strong>{variable.name}:</strong> {variable.description}
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">{variable.name}</th>
                        <th className="text-right py-3 px-4 font-medium">NPV</th>
                        <th className="text-right py-3 px-4 font-medium">NPV Change</th>
                        <th className="text-right py-3 px-4 font-medium">ROI</th>
                        <th className="text-right py-3 px-4 font-medium">ROI Change</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sensitivityTable.map((row, index) => (
                        <tr
                          key={index}
                          className={`border-b hover:bg-muted/50 ${row.isBaseline ? 'bg-primary/5 font-semibold' : ''}`}
                        >
                          <td className="py-3 px-4">
                            {row.value}{variable.unit}
                            {row.isBaseline && (
                              <span className="ml-2 text-xs text-primary">(Baseline)</span>
                            )}
                          </td>
                          <td className="text-right py-3 px-4">{formatMillions(row.npv)}</td>
                          <td className={`text-right py-3 px-4 ${row.npvChange >= 0 ? 'text-chart-4' : 'text-destructive'}`}>
                            {row.npvChange >= 0 ? '+' : ''}{formatPercent(row.npvChange)}
                          </td>
                          <td className="text-right py-3 px-4">{formatPercent(row.roi)}</td>
                          <td className={`text-right py-3 px-4 ${row.roiChange >= 0 ? 'text-chart-4' : 'text-destructive'}`}>
                            {row.roiChange >= 0 ? '+' : ''}{formatPercent(row.roiChange)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Risk Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            Risk Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-destructive" />
                  Key Downside Risks
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-destructive mt-1">•</span>
                    <span>
                      <strong>Benefits Growth:</strong> If actual benefits are only 50% of projections, 
                      NPV decreases by {formatPercent(((calculateNPVSensitivity('benefitsGrowth', 50) - baseResults.npv) / baseResults.npv) * 100)}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive mt-1">•</span>
                    <span>
                      <strong>Implementation Costs:</strong> A 30% cost overrun reduces NPV by 
                      {formatPercent(((calculateNPVSensitivity('implementationCost', 130) - baseResults.npv) / baseResults.npv) * 100)}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive mt-1">•</span>
                    <span>
                      <strong>Discount Rate:</strong> If cost of capital rises to 20%, NPV falls to 
                      {formatMillions(calculateNPVSensitivity('discountRate', 20))}
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-chart-4" />
                  Key Upside Opportunities
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-chart-4 mt-1">•</span>
                    <span>
                      <strong>Benefits Growth:</strong> If benefits exceed projections by 50%, 
                      NPV increases by {formatPercent(((calculateNPVSensitivity('benefitsGrowth', 150) - baseResults.npv) / baseResults.npv) * 100)}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-chart-4 mt-1">•</span>
                    <span>
                      <strong>Implementation Efficiency:</strong> A 30% reduction in costs increases NPV by 
                      {formatPercent(((calculateNPVSensitivity('implementationCost', 70) - baseResults.npv) / baseResults.npv) * 100)}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-chart-4 mt-1">•</span>
                    <span>
                      <strong>Favorable Financing:</strong> If cost of capital drops to 5%, NPV rises to 
                      {formatMillions(calculateNPVSensitivity('discountRate', 5))}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div className="text-sm">
                <strong className="text-amber-900 dark:text-amber-200">Recommendation:</strong>
                <p className="text-amber-800 dark:text-amber-300 mt-1">
                  The analysis shows that <strong>Benefits Growth</strong> and <strong>Implementation Costs</strong> have 
                  the largest impact on NPV. Focus on rigorous benefits tracking and cost control to maximize value realization. 
                  Consider phased rollouts to reduce implementation risk.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
