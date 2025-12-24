import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalculationResults } from '@/hooks/useHyperFormula';
import { formatMillions, formatPercent, getHorizonColor, getHorizonLabel } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { horizonSummaries } from '@/lib/useCasesData';
import { TrendingUp, Target, Clock, Award } from 'lucide-react';

interface ExecutiveDashboardProps {
  results: CalculationResults;
}

export default function ExecutiveDashboard({ results }: ExecutiveDashboardProps) {
  // Prepare horizon data for charts
  const horizonData = results.horizonTotals.map(ht => ({
    name: ht.horizon,
    value: ht.totalAnnualValue,
    revenue: ht.totalRevenue,
    cost: ht.totalCostReduction,
    risk: ht.totalRiskValue
  }));

  // Prepare 5-year projection data
  const projectionData = results.fiveYearProjections.map(proj => ({
    year: proj.year.replace('Year ', 'Y'),
    benefits: proj.benefits / 1000000,
    investment: proj.investment / 1000000,
    netCashFlow: proj.netCashFlow / 1000000
  }));

  // Business drivers breakdown with vibrant colors
  const driversData = [
    { name: 'Cost Reduction', value: results.grandTotals.totalCostReduction, color: '#06b6d4' }, // Cyan
    { name: 'Risk Value', value: results.grandTotals.totalRiskValue, color: '#f59e0b' }, // Amber
    { name: 'Revenue Impact', value: results.grandTotals.totalRevenue, color: '#10b981' }, // Emerald
    { name: 'Cash Flow', value: results.grandTotals.totalCashFlow, color: '#8b5cf6' } // Purple
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-6">
      {/* Executive Summary Card */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Award className="h-6 w-6 text-primary" />
            Executive Summary
          </CardTitle>
          <CardDescription>
            Comprehensive AI transformation delivering exceptional ROI and operational excellence
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                <span>Total Annual Value</span>
              </div>
              <div className="text-3xl font-bold">{formatMillions(results.grandTotals.totalAnnualValue)}</div>
              <p className="text-xs text-muted-foreground">Across 14 use cases</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Target className="h-4 w-4" />
                <span>Net Present Value</span>
              </div>
              <div className="text-3xl font-bold text-chart-4">{formatMillions(results.npv)}</div>
              <p className="text-xs text-muted-foreground">@ 10% discount rate</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                <span>Return on Investment</span>
              </div>
              <div className="text-3xl font-bold text-chart-4">{formatPercent(results.roi)}</div>
              <p className="text-xs text-muted-foreground">Over 5 years</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Payback Period</span>
              </div>
              <div className="text-3xl font-bold">11 mo</div>
              <p className="text-xs text-muted-foreground">Rapid value delivery</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Horizon Value Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Value by Horizon</CardTitle>
            <CardDescription>Annual value distribution across implementation horizons</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={horizonData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 13, fontWeight: 500 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis 
                  tick={{ fontSize: 13, fontWeight: 500 }}
                  tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`}
                  stroke="hsl(var(--muted-foreground))"
                />
                <Tooltip 
                  formatter={(value: number) => formatMillions(value)}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {horizonData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getHorizonColor(entry.name)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Business Drivers Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Value Drivers</CardTitle>
            <CardDescription>Financial impact by business driver category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={driversData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(props) => {
                    const { name, percent } = props;
                    return `${name} ${(percent * 100).toFixed(0)}%`;
                  }}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {driversData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => formatMillions(value)}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 5-Year Financial Projection */}
      <Card>
        <CardHeader>
          <CardTitle>5-Year Financial Projection</CardTitle>
          <CardDescription>Benefits, investment, and net cash flow over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={projectionData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="year" 
                tick={{ fontSize: 13, fontWeight: 500 }}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis 
                tick={{ fontSize: 13, fontWeight: 500 }}
                tickFormatter={(value) => `$${value.toFixed(0)}M`}
                stroke="hsl(var(--muted-foreground))"
              />
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
                dataKey="benefits" 
                stroke="#10b981" 
                strokeWidth={3}
                name="Benefits"
                dot={{ r: 5, fill: '#10b981' }}
              />
              <Line 
                type="monotone" 
                dataKey="investment" 
                stroke="#ef4444" 
                strokeWidth={3}
                name="Investment"
                dot={{ r: 5, fill: '#ef4444' }}
              />
              <Line 
                type="monotone" 
                dataKey="netCashFlow" 
                stroke="#3b82f6" 
                strokeWidth={3}
                name="Net Cash Flow"
                dot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Horizon Summaries */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {horizonSummaries.map((horizon) => (
          <Card key={horizon.horizon} className="border-l-4" style={{ borderLeftColor: getHorizonColor(horizon.horizon) }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">{horizon.name}</CardTitle>
              <CardDescription className="text-xs">{horizon.timeframe}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-2xl font-bold">{formatMillions(horizon.annualValue)}</div>
                <p className="text-xs text-muted-foreground">Annual Value</p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div className="font-semibold">{horizon.useCaseCount}</div>
                  <div className="text-muted-foreground">Use Cases</div>
                </div>
                <div>
                  <div className="font-semibold">{horizon.avgTTV.toFixed(1)} mo</div>
                  <div className="text-muted-foreground">Avg TTV</div>
                </div>
                <div>
                  <div className="font-semibold">{formatPercent(horizon.avgProbability * 100, 0)}</div>
                  <div className="text-muted-foreground">Success Rate</div>
                </div>
                <div>
                  <div className="font-semibold">{horizon.avgEffort.toFixed(1)}/5</div>
                  <div className="text-muted-foreground">Effort</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
