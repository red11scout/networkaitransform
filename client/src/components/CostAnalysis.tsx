import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  calculateInfrastructureCosts,
  calculateTokenCosts,
  calculateROI,
  hpeInfrastructure,
  nvidiaInfrastructure,
  softwareCosts,
  operationalCosts,
  developmentCosts,
  useCaseCostBreakdown,
  tokenConsumption,
  totalMonthlyTokens
} from '@/lib/costBreakdownData';
import { PaybackTooltip } from '@/components/PaybackTooltip';
import { formatMillions, formatCurrency, formatPercent, formatNumber } from '@/lib/utils';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  DollarSign,
  Cpu,
  Zap,
  TrendingUp,
  Server,
  Database,
  Activity,
  Target,
  Clock,
  Award
} from 'lucide-react';

export default function CostAnalysis() {
  const infraCosts = calculateInfrastructureCosts();
  const tokenCosts = calculateTokenCosts();
  const roi3Year = calculateROI(3);
  const roi5Year = calculateROI(5);

  // Prepare data for charts
  const hardwareBreakdown = [
    { name: 'HPE Servers', value: infraCosts.hpeTotal, color: '#3b82f6' },
    { name: 'NVIDIA GPUs', value: infraCosts.nvidiaTotal, color: '#10b981' },
    { name: 'Development', value: infraCosts.developmentTotal, color: '#8b5cf6' }
  ];

  const annualCostBreakdown = [
    { name: 'Software', value: infraCosts.softwareTotal, color: '#06b6d4' },
    { name: 'Operations', value: infraCosts.operationalTotal, color: '#f59e0b' },
    { name: 'Token Usage', value: tokenCosts.annualTokenCost, color: '#ec4899' }
  ];

  const roiComparison = [
    {
      period: '3-Year',
      roi: roi3Year.roi,
      npv: roi3Year.npv,
      netProfit: roi3Year.netProfit,
      payback: roi3Year.paybackPeriod
    },
    {
      period: '5-Year',
      roi: roi5Year.roi,
      npv: roi5Year.npv,
      netProfit: roi5Year.netProfit,
      payback: roi5Year.paybackPeriod
    }
  ];

  // Top 5 use cases by token consumption
  const topTokenConsumers = useCaseCostBreakdown
    .sort((a, b) => b.monthlyTokens - a.monthlyTokens)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Executive Cost Summary */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl flex items-center gap-2">
            <DollarSign className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            Cost & Investment Analysis
          </CardTitle>
          <CardDescription className="text-sm">
            Comprehensive breakdown of infrastructure, operational costs, and ROI projections
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Server className="h-4 w-4" />
                <span>Total Infrastructure</span>
              </div>
              <div className="text-2xl md:text-3xl font-bold">{formatMillions(infraCosts.totalHardware)}</div>
              <p className="text-xs text-muted-foreground">One-time investment</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Activity className="h-4 w-4" />
                <span>Annual Recurring</span>
              </div>
              <div className="text-2xl md:text-3xl font-bold">{formatMillions(infraCosts.totalAnnualRecurring)}</div>
              <p className="text-xs text-muted-foreground">Software + Operations</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Zap className="h-4 w-4" />
                <span>Token Costs</span>
              </div>
              <div className="text-2xl md:text-3xl font-bold">{formatMillions(tokenCosts.annualTokenCost)}</div>
              <p className="text-xs text-muted-foreground">{formatNumber(totalMonthlyTokens / 1000000)}M tokens/month</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Target className="h-4 w-4" />
                <span>5-Year ROI</span>
              </div>
              <div className="text-2xl md:text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                {formatPercent(roi5Year.roi / 100)}
              </div>
              <p className="text-xs text-muted-foreground">{formatMillions(roi5Year.npv)} NPV</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Tabs */}
      <Tabs defaultValue="infrastructure" className="space-y-4">
        <TabsList className="flex flex-wrap gap-1 md:gap-2 h-auto p-1 md:p-2 bg-muted/50">
          <TabsTrigger value="infrastructure" className="text-xs md:text-sm">
            <Server className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
            Infrastructure
          </TabsTrigger>
          <TabsTrigger value="tokens" className="text-xs md:text-sm">
            <Zap className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
            Token Usage
          </TabsTrigger>
          <TabsTrigger value="roi" className="text-xs md:text-sm">
            <TrendingUp className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
            ROI Analysis
          </TabsTrigger>
          <TabsTrigger value="usecase" className="text-xs md:text-sm">
            <Database className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
            Use Case Costs
          </TabsTrigger>
        </TabsList>

        {/* Infrastructure Tab */}
        <TabsContent value="infrastructure" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {/* Hardware Breakdown Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base md:text-lg">Initial Investment Breakdown</CardTitle>
                <CardDescription className="text-sm">One-time capital expenditure</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250} className="md:h-[300px]">
                  <PieChart>
                    <Pie
                      data={hardwareBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {hardwareBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Annual Costs Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base md:text-lg">Annual Recurring Costs</CardTitle>
                <CardDescription className="text-sm">Ongoing operational expenses</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250} className="md:h-[300px]">
                  <PieChart>
                    <Pie
                      data={annualCostBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {annualCostBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* HPE Infrastructure Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base md:text-lg flex items-center gap-2">
                <Server className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                HPE Infrastructure Components
              </CardTitle>
              <CardDescription className="text-sm">Enterprise-grade server and storage infrastructure</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-2 md:px-4 font-semibold">Component</th>
                      <th className="text-left py-2 px-2 md:px-4 font-semibold hidden md:table-cell">Specifications</th>
                      <th className="text-center py-2 px-2 md:px-4 font-semibold">Qty</th>
                      <th className="text-right py-2 px-2 md:px-4 font-semibold">Unit Cost</th>
                      <th className="text-right py-2 px-2 md:px-4 font-semibold">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(hpeInfrastructure).map(([key, item]) => (
                      <tr key={key} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-2 md:px-4">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-muted-foreground md:hidden">{item.specs}</div>
                        </td>
                        <td className="py-3 px-2 md:px-4 text-muted-foreground text-xs hidden md:table-cell">{item.specs}</td>
                        <td className="py-3 px-2 md:px-4 text-center">{item.quantity}</td>
                        <td className="py-3 px-2 md:px-4 text-right">{formatCurrency(item.unitCost)}</td>
                        <td className="py-3 px-2 md:px-4 text-right font-semibold">{formatCurrency(item.totalCost)}</td>
                      </tr>
                    ))}
                    <tr className="bg-muted/30 font-bold">
                      <td colSpan={4} className="py-3 px-2 md:px-4 text-right">HPE Total:</td>
                      <td className="py-3 px-2 md:px-4 text-right text-blue-600 dark:text-blue-400">
                        {formatCurrency(infraCosts.hpeTotal)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* NVIDIA GPU Infrastructure Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base md:text-lg flex items-center gap-2">
                <Cpu className="h-4 w-4 md:h-5 md:w-5 text-emerald-600" />
                NVIDIA GPU Infrastructure
              </CardTitle>
              <CardDescription className="text-sm">High-performance AI acceleration hardware</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-2 md:px-4 font-semibold">GPU Model</th>
                      <th className="text-left py-2 px-2 md:px-4 font-semibold hidden md:table-cell">Performance</th>
                      <th className="text-center py-2 px-2 md:px-4 font-semibold">Qty</th>
                      <th className="text-right py-2 px-2 md:px-4 font-semibold">Unit Cost</th>
                      <th className="text-right py-2 px-2 md:px-4 font-semibold">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(nvidiaInfrastructure).map(([key, item]) => (
                      <tr key={key} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-2 md:px-4">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {'memory' in item ? item.memory : 'specs' in item ? item.specs : ''}
                          </div>
                        </td>
                        <td className="py-3 px-2 md:px-4 text-muted-foreground text-xs hidden md:table-cell">
                          {'performance' in item ? item.performance : 'specs' in item ? item.specs : ''}
                        </td>
                        <td className="py-3 px-2 md:px-4 text-center">{item.quantity}</td>
                        <td className="py-3 px-2 md:px-4 text-right">{formatCurrency(item.unitCost)}</td>
                        <td className="py-3 px-2 md:px-4 text-right font-semibold">{formatCurrency(item.totalCost)}</td>
                      </tr>
                    ))}
                    <tr className="bg-muted/30 font-bold">
                      <td colSpan={4} className="py-3 px-2 md:px-4 text-right">NVIDIA Total:</td>
                      <td className="py-3 px-2 md:px-4 text-right text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(infraCosts.nvidiaTotal)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Software & Operational Costs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base md:text-lg">Software & Licensing (Annual)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(softwareCosts).map(([key, item]) => (
                    <div key={key} className="flex justify-between items-start pb-3 border-b last:border-0">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{item.name}</div>
                        <div className="text-xs text-muted-foreground">{item.description}</div>
                      </div>
                      <div className="font-semibold text-sm ml-4">{formatCurrency(item.annualCost)}</div>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-2 font-bold">
                    <span>Total Software:</span>
                    <span className="text-blue-600 dark:text-blue-400">{formatCurrency(infraCosts.softwareTotal)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base md:text-lg">Operational Costs (Annual)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(operationalCosts).map(([key, item]) => (
                    <div key={key} className="flex justify-between items-start pb-3 border-b last:border-0">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{item.name}</div>
                        <div className="text-xs text-muted-foreground">{item.description}</div>
                      </div>
                      <div className="font-semibold text-sm ml-4">{formatCurrency(item.annualCost)}</div>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-2 font-bold">
                    <span>Total Operations:</span>
                    <span className="text-emerald-600 dark:text-emerald-400">{formatCurrency(infraCosts.operationalTotal)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Token Usage Tab */}
        <TabsContent value="tokens" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  <div>
                    <div className="text-2xl md:text-3xl font-bold">{formatNumber(totalMonthlyTokens / 1000000)}M</div>
                    <div className="text-sm text-muted-foreground">Tokens / Month</div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Total monthly token consumption across all use cases
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-950 dark:to-pink-900 border-pink-200 dark:border-pink-800">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center gap-3 mb-2">
                  <DollarSign className="h-8 w-8 text-pink-600 dark:text-pink-400" />
                  <div>
                    <div className="text-2xl md:text-3xl font-bold">{formatCurrency(tokenCosts.monthlyTokenCost)}</div>
                    <div className="text-sm text-muted-foreground">Cost / Month</div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {formatCurrency(tokenCosts.annualTokenCost)} annually
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-950 dark:to-cyan-900 border-cyan-200 dark:border-cyan-800">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Activity className="h-8 w-8 text-cyan-600 dark:text-cyan-400" />
                  <div>
                    <div className="text-2xl md:text-3xl font-bold">
                      ${tokenCosts.avgCostPerMillionTokens.toFixed(2)}
                    </div>
                    <div className="text-sm text-muted-foreground">Avg / 1M Tokens</div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Blended rate across GPT-4 and GPT-3.5
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Top Token Consumers */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base md:text-lg">Top 5 Use Cases by Token Consumption</CardTitle>
              <CardDescription className="text-sm">Highest monthly token usage</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250} className="md:h-[300px]">
                <BarChart data={topTokenConsumers}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    tick={{ fontSize: 11, fontWeight: 500 }}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis
                    tick={{ fontSize: 13, fontWeight: 500 }}
                    tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <Tooltip
                    formatter={(value: number) => [`${(value / 1000000).toFixed(1)}M tokens`, 'Monthly Usage']}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="monthlyTokens" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Token Consumption Details Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base md:text-lg">Detailed Token Consumption by Use Case</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-2 md:px-4 font-semibold">Use Case</th>
                      <th className="text-right py-2 px-2 md:px-4 font-semibold">Monthly Tokens</th>
                      <th className="text-right py-2 px-2 md:px-4 font-semibold hidden md:table-cell">Requests/Month</th>
                      <th className="text-center py-2 px-2 md:px-4 font-semibold hidden md:table-cell">Model</th>
                      <th className="text-right py-2 px-2 md:px-4 font-semibold">Monthly Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(tokenConsumption).map(([name, data]) => (
                      <tr key={name} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-2 md:px-4 font-medium">{name}</td>
                        <td className="py-3 px-2 md:px-4 text-right">
                          {formatNumber(data.monthlyTokens / 1000000)}M
                        </td>
                        <td className="py-3 px-2 md:px-4 text-right hidden md:table-cell">
                          {formatNumber(data.requestsPerMonth)}
                        </td>
                        <td className="py-3 px-2 md:px-4 text-center hidden md:table-cell">
                          <Badge variant="outline">{data.modelType}</Badge>
                        </td>
                        <td className="py-3 px-2 md:px-4 text-right font-semibold">
                          {formatCurrency((data.monthlyTokens / 1000000) * data.costPerMillionTokens)}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-muted/30 font-bold">
                      <td colSpan={4} className="py-3 px-2 md:px-4 text-right">Total Monthly:</td>
                      <td className="py-3 px-2 md:px-4 text-right text-purple-600 dark:text-purple-400">
                        {formatCurrency(tokenCosts.monthlyTokenCost)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ROI Analysis Tab */}
        <TabsContent value="roi" className="space-y-6">
          {/* ROI Comparison Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {/* 3-Year ROI */}
            <Card className="border-2 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                  <Award className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
                  3-Year ROI Analysis
                </CardTitle>
                <CardDescription className="text-sm">Short-term investment returns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Initial Investment</div>
                      <div className="text-xl md:text-2xl font-bold">{formatMillions(roi3Year.initialInvestment)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Total Benefits</div>
                      <div className="text-xl md:text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        {formatMillions(roi3Year.totalBenefits)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Net Profit</div>
                      <div className="text-xl md:text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        {formatMillions(roi3Year.netProfit)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">ROI</div>
                      <div className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {formatPercent(roi3Year.roi / 100)}
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Net Present Value (10% discount)</span>
                      <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {formatMillions(roi3Year.npv)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        Payback Period
                        <PaybackTooltip paybackMonths={roi3Year.paybackPeriod} />
                      </span>
                      <span className="text-lg font-bold">{roi3Year.paybackPeriod} months</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 5-Year ROI */}
            <Card className="border-2 border-emerald-200 dark:border-emerald-800">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 md:h-6 md:w-6 text-emerald-600" />
                  5-Year ROI Analysis
                </CardTitle>
                <CardDescription className="text-sm">Long-term investment returns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Initial Investment</div>
                      <div className="text-xl md:text-2xl font-bold">{formatMillions(roi5Year.initialInvestment)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Total Benefits</div>
                      <div className="text-xl md:text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        {formatMillions(roi5Year.totalBenefits)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Net Profit</div>
                      <div className="text-xl md:text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        {formatMillions(roi5Year.netProfit)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">ROI</div>
                      <div className="text-xl md:text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        {formatPercent(roi5Year.roi / 100)}
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Net Present Value (10% discount)</span>
                      <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                        {formatMillions(roi5Year.npv)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        Payback Period
                        <PaybackTooltip paybackMonths={roi5Year.paybackPeriod} />
                      </span>
                      <span className="text-lg font-bold">{roi5Year.paybackPeriod} months</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Year-by-Year Projections */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base md:text-lg">5-Year Cash Flow Projection</CardTitle>
              <CardDescription className="text-sm">Annual benefits, costs, and cumulative returns</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300} className="md:h-[400px]">
                <LineChart data={roi5Year.yearlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="year"
                    tick={{ fontSize: 13, fontWeight: 500 }}
                    stroke="hsl(var(--muted-foreground))"
                    label={{ value: 'Year', position: 'insideBottom', offset: -5 }}
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
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="benefits"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="Annual Benefits"
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="costs"
                    stroke="#ef4444"
                    strokeWidth={2}
                    name="Annual Costs"
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="cumulativeCashFlow"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    name="Cumulative Cash Flow"
                    dot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Detailed Year-by-Year Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base md:text-lg">Detailed 5-Year Financial Projection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-2 md:px-4 font-semibold">Year</th>
                      <th className="text-right py-2 px-2 md:px-4 font-semibold">Benefits</th>
                      <th className="text-right py-2 px-2 md:px-4 font-semibold">Costs</th>
                      <th className="text-right py-2 px-2 md:px-4 font-semibold">Net Cash Flow</th>
                      <th className="text-right py-2 px-2 md:px-4 font-semibold">Cumulative</th>
                      <th className="text-right py-2 px-2 md:px-4 font-semibold hidden md:table-cell">Discounted CF</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b bg-muted/30">
                      <td className="py-3 px-2 md:px-4 font-semibold">Year 0</td>
                      <td className="py-3 px-2 md:px-4 text-right">—</td>
                      <td className="py-3 px-2 md:px-4 text-right text-red-600 dark:text-red-400">
                        {formatMillions(roi5Year.initialInvestment)}
                      </td>
                      <td className="py-3 px-2 md:px-4 text-right text-red-600 dark:text-red-400">
                        ({formatMillions(roi5Year.initialInvestment)})
                      </td>
                      <td className="py-3 px-2 md:px-4 text-right text-red-600 dark:text-red-400">
                        ({formatMillions(roi5Year.initialInvestment)})
                      </td>
                      <td className="py-3 px-2 md:px-4 text-right text-red-600 dark:text-red-400 hidden md:table-cell">
                        ({formatMillions(roi5Year.initialInvestment)})
                      </td>
                    </tr>
                    {roi5Year.yearlyData.map((yearData) => (
                      <tr key={yearData.year} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-2 md:px-4 font-semibold">Year {yearData.year}</td>
                        <td className="py-3 px-2 md:px-4 text-right text-emerald-600 dark:text-emerald-400">
                          {formatMillions(yearData.benefits)}
                        </td>
                        <td className="py-3 px-2 md:px-4 text-right text-red-600 dark:text-red-400">
                          {formatMillions(yearData.costs)}
                        </td>
                        <td className="py-3 px-2 md:px-4 text-right font-semibold">
                          {formatMillions(yearData.netCashFlow)}
                        </td>
                        <td className="py-3 px-2 md:px-4 text-right font-semibold">
                          {formatMillions(yearData.cumulativeCashFlow)}
                        </td>
                        <td className="py-3 px-2 md:px-4 text-right hidden md:table-cell">
                          {formatMillions(yearData.discountedCashFlow)}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-muted/30 font-bold">
                      <td className="py-3 px-2 md:px-4">Total</td>
                      <td className="py-3 px-2 md:px-4 text-right text-emerald-600 dark:text-emerald-400">
                        {formatMillions(roi5Year.totalBenefits)}
                      </td>
                      <td className="py-3 px-2 md:px-4 text-right text-red-600 dark:text-red-400">
                        {formatMillions(roi5Year.totalCosts)}
                      </td>
                      <td className="py-3 px-2 md:px-4 text-right text-blue-600 dark:text-blue-400">
                        {formatMillions(roi5Year.netProfit)}
                      </td>
                      <td colSpan={2} className="py-3 px-2 md:px-4 text-right">
                        <span className="text-muted-foreground mr-2">NPV:</span>
                        <span className="text-emerald-600 dark:text-emerald-400">{formatMillions(roi5Year.npv)}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Use Case Costs Tab */}
        <TabsContent value="usecase" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base md:text-lg">Cost Breakdown by Use Case</CardTitle>
              <CardDescription className="text-sm">
                Infrastructure allocation based on token consumption percentage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-2 md:px-4 font-semibold">Use Case</th>
                      <th className="text-right py-2 px-2 md:px-4 font-semibold hidden md:table-cell">Token %</th>
                      <th className="text-right py-2 px-2 md:px-4 font-semibold">Annual Token Cost</th>
                      <th className="text-right py-2 px-2 md:px-4 font-semibold hidden lg:table-cell">Infrastructure</th>
                      <th className="text-right py-2 px-2 md:px-4 font-semibold">Total Cost</th>
                      <th className="text-right py-2 px-2 md:px-4 font-semibold">Annual Value</th>
                      <th className="text-right py-2 px-2 md:px-4 font-semibold">Net Value</th>
                      <th className="text-right py-2 px-2 md:px-4 font-semibold hidden lg:table-cell">ROI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {useCaseCostBreakdown.map((uc) => (
                      <tr key={uc.name} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-2 md:px-4 font-medium">{uc.name}</td>
                        <td className="py-3 px-2 md:px-4 text-right hidden md:table-cell">
                          {uc.tokenPercentage.toFixed(1)}%
                        </td>
                        <td className="py-3 px-2 md:px-4 text-right">
                          {formatCurrency(uc.annualTokenCost)}
                        </td>
                        <td className="py-3 px-2 md:px-4 text-right hidden lg:table-cell">
                          {formatCurrency(uc.infrastructureAllocation)}
                        </td>
                        <td className="py-3 px-2 md:px-4 text-right font-semibold">
                          {formatCurrency(uc.totalAnnualCost)}
                        </td>
                        <td className="py-3 px-2 md:px-4 text-right text-emerald-600 dark:text-emerald-400">
                          {formatCurrency(uc.annualValue)}
                        </td>
                        <td className="py-3 px-2 md:px-4 text-right font-semibold">
                          {formatCurrency(uc.netAnnualValue)}
                        </td>
                        <td className="py-3 px-2 md:px-4 text-right hidden lg:table-cell">
                          <Badge variant={uc.roi > 200 ? 'default' : 'secondary'}>
                            {formatPercent(uc.roi / 100)}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
