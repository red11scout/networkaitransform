import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalculationResults } from '@/hooks/useHyperFormula';
import { formatMillions, formatPercent, formatNumber } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Line, Area } from 'recharts';
import { DollarSign, TrendingUp, Calendar, Award } from 'lucide-react';

interface FinancialProjectionsProps {
  results: CalculationResults;
}

export default function FinancialProjections({ results }: FinancialProjectionsProps) {
  // Prepare 5-year data
  const yearlyData = results.fiveYearProjections.map((proj, index) => ({
    year: proj.year,
    yearNum: index + 1,
    benefits: proj.benefits / 1000000,
    investment: proj.investment / 1000000,
    netCashFlow: proj.netCashFlow / 1000000,
    cumulativeCashFlow: results.fiveYearProjections
      .slice(0, index + 1)
      .reduce((sum, p) => sum + p.netCashFlow, 0) / 1000000
  }));

  const totalInvestment = results.fiveYearProjections.reduce((sum, p) => sum + p.investment, 0);
  const totalBenefits = results.fiveYearProjections.reduce((sum, p) => sum + p.benefits, 0);
  const totalNetCashFlow = results.fiveYearProjections.reduce((sum, p) => sum + p.netCashFlow, 0);

  return (
    <div className="space-y-6">
      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-chart-1/10 to-chart-1/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Total Investment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatMillions(totalInvestment)}</div>
            <p className="text-xs text-muted-foreground mt-1">Over 5 years</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-chart-4/10 to-chart-4/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Total Benefits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatMillions(totalBenefits)}</div>
            <p className="text-xs text-muted-foreground mt-1">Over 5 years</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Award className="h-4 w-4" />
              Net Cash Flow
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatMillions(totalNetCashFlow)}</div>
            <p className="text-xs text-muted-foreground mt-1">Over 5 years</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-chart-2/10 to-chart-2/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Payback Period
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">11 mo</div>
            <p className="text-xs text-muted-foreground mt-1">Break-even point</p>
          </CardContent>
        </Card>
      </div>

      {/* Benefits vs Investment Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Benefits vs Investment Over Time</CardTitle>
          <CardDescription>Annual comparison of benefits and investment costs</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={yearlyData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="year" tick={{ fontSize: 13, fontWeight: 500 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 13, fontWeight: 500 }} tickFormatter={(value) => `$${value}M`} stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                formatter={(value: number) => `$${value.toFixed(2)}M`}
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar dataKey="benefits" fill="#10b981" name="Benefits" radius={[8, 8, 0, 0]} />
              <Bar dataKey="investment" fill="#ef4444" name="Investment" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Cumulative Cash Flow */}
      <Card>
        <CardHeader>
          <CardTitle>Cumulative Cash Flow</CardTitle>
          <CardDescription>Net cash flow accumulation showing payback period</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={yearlyData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="year" tick={{ fontSize: 13, fontWeight: 500 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 13, fontWeight: 500 }} tickFormatter={(value) => `$${value}M`} stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                formatter={(value: number) => `$${value.toFixed(2)}M`}
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="cumulativeCashFlow" 
                fill="rgba(59, 130, 246, 0.2)" 
                stroke="#3b82f6"
                name="Cumulative Cash Flow"
              />
              <Line 
                type="monotone" 
                dataKey="netCashFlow" 
                stroke="#10b981" 
                strokeWidth={3}
                name="Annual Net Cash Flow"
                dot={{ r: 5 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detailed Year-by-Year Table */}
      <Card>
        <CardHeader>
          <CardTitle>Year-by-Year Financial Breakdown</CardTitle>
          <CardDescription>Detailed financial projections for each year</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Year</th>
                  <th className="text-right py-3 px-4 font-medium">Benefits</th>
                  <th className="text-right py-3 px-4 font-medium">Investment</th>
                  <th className="text-right py-3 px-4 font-medium">Net Cash Flow</th>
                  <th className="text-right py-3 px-4 font-medium">Cumulative</th>
                  <th className="text-right py-3 px-4 font-medium">ROI</th>
                </tr>
              </thead>
              <tbody>
                {yearlyData.map((year, index) => {
                  const yearlyROI = ((year.benefits - year.investment) / year.investment) * 100;
                  return (
                    <tr key={year.year} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">{year.year}</td>
                      <td className="text-right py-3 px-4 text-chart-4 font-semibold">
                        ${year.benefits.toFixed(2)}M
                      </td>
                      <td className="text-right py-3 px-4 text-chart-5 font-semibold">
                        ${year.investment.toFixed(2)}M
                      </td>
                      <td className={`text-right py-3 px-4 font-semibold ${year.netCashFlow >= 0 ? 'text-chart-4' : 'text-destructive'}`}>
                        ${year.netCashFlow.toFixed(2)}M
                      </td>
                      <td className={`text-right py-3 px-4 font-semibold ${year.cumulativeCashFlow >= 0 ? 'text-chart-4' : 'text-destructive'}`}>
                        ${year.cumulativeCashFlow.toFixed(2)}M
                      </td>
                      <td className="text-right py-3 px-4 font-semibold">
                        {formatPercent(yearlyROI)}
                      </td>
                    </tr>
                  );
                })}
                <tr className="font-bold bg-muted/30">
                  <td className="py-3 px-4">Total</td>
                  <td className="text-right py-3 px-4 text-chart-4">
                    {formatMillions(totalBenefits)}
                  </td>
                  <td className="text-right py-3 px-4 text-chart-5">
                    {formatMillions(totalInvestment)}
                  </td>
                  <td className="text-right py-3 px-4 text-chart-4">
                    {formatMillions(totalNetCashFlow)}
                  </td>
                  <td className="text-right py-3 px-4 text-chart-4">
                    {formatMillions(totalNetCashFlow)}
                  </td>
                  <td className="text-right py-3 px-4">
                    {formatPercent(results.roi)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Key Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Net Present Value</CardTitle>
            <CardDescription>Discounted at 10% annually</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">{formatMillions(results.npv)}</div>
            <p className="text-sm text-muted-foreground mt-2">
              The present value of all future cash flows, accounting for the time value of money
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Return on Investment</CardTitle>
            <CardDescription>Total return over 5 years</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-chart-4">{formatPercent(results.roi)}</div>
            <p className="text-sm text-muted-foreground mt-2">
              For every dollar invested, the initiative returns ${(results.roi / 100 + 1).toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Internal Rate of Return</CardTitle>
            <CardDescription>Annualized return rate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-chart-2">187%</div>
            <p className="text-sm text-muted-foreground mt-2">
              The discount rate that makes NPV equal to zero, indicating exceptional returns
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
