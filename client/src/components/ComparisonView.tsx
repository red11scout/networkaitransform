import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useComparison } from '@/contexts/ComparisonContext';
import { formatMillions, formatPercent, formatNumber, getHorizonColor, getHorizonLabel } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { X, TrendingUp, Clock, Target, DollarSign } from 'lucide-react';

export default function ComparisonView() {
  const { selectedUseCases, removeUseCase, clearSelection } = useComparison();

  if (selectedUseCases.length === 0) {
    return (
      <Card className="border-2 border-dashed border-muted">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="text-center space-y-4">
            <div className="text-6xl">📊</div>
            <h3 className="text-2xl font-bold">No Use Cases Selected</h3>
            <p className="text-muted-foreground max-w-md">
              Select up to 4 use cases from the Analysis section to compare them side-by-side with synchronized charts and detailed metrics.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Prepare comparison data
  const comparisonData = selectedUseCases.map(uc => ({
    name: uc.name.length > 20 ? uc.name.substring(0, 20) + '...' : uc.name,
    fullName: uc.name,
    value: uc.annualValue / 1000000,
    ttv: uc.ttv,
    effort: uc.effort,
    probability: uc.probability * 100,
    score: uc.priorityScore
  }));

  // Radar chart data for multi-dimensional comparison
  const radarData = [
    {
      metric: 'Value',
      ...Object.fromEntries(selectedUseCases.map((uc, i) => [`uc${i}`, (uc.annualValue / 5000000) * 100]))
    },
    {
      metric: 'Speed',
      ...Object.fromEntries(selectedUseCases.map((uc, i) => [`uc${i}`, (5 - uc.ttv) * 20]))
    },
    {
      metric: 'Ease',
      ...Object.fromEntries(selectedUseCases.map((uc, i) => [`uc${i}`, (5 - uc.effort) * 20]))
    },
    {
      metric: 'Probability',
      ...Object.fromEntries(selectedUseCases.map((uc, i) => [`uc${i}`, uc.probability * 100]))
    },
    {
      metric: 'Priority',
      ...Object.fromEntries(selectedUseCases.map((uc, i) => [`uc${i}`, uc.priorityScore]))
    }
  ];

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Use Case Comparison</CardTitle>
              <CardDescription>
                Comparing {selectedUseCases.length} use case{selectedUseCases.length > 1 ? 's' : ''} side-by-side
              </CardDescription>
            </div>
            <Button variant="outline" onClick={clearSelection}>
              <X className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Selected Use Cases Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {selectedUseCases.map((uc, index) => (
          <Card key={uc.id} className="border-l-4" style={{ borderLeftColor: colors[index] }}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <Badge variant="outline" style={{ borderColor: getHorizonColor(uc.horizon) }}>
                  {uc.horizon}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => removeUseCase(uc.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <CardTitle className="text-base mt-2">{uc.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Annual Value</span>
                <span className="font-bold">{formatMillions(uc.annualValue)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Priority Score</span>
                <span className="font-bold">{uc.priorityScore.toFixed(1)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Rank</span>
                <span className="font-bold">#{uc.rank}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Value Comparison Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Annual Value Comparison</CardTitle>
          <CardDescription>Side-by-side comparison of annual financial value</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fontWeight: 500 }} />
              <YAxis tick={{ fontSize: 12, fontWeight: 500 }} tickFormatter={(value) => `$${value}M`} />
              <Tooltip
                formatter={(value: number) => `$${value.toFixed(2)}M`}
                labelFormatter={(label) => comparisonData.find(d => d.name === label)?.fullName || label}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="value" name="Annual Value" radius={[8, 8, 0, 0]}>
                {comparisonData.map((entry, index) => (
                  <rect key={`cell-${index}`} fill={colors[index]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Multi-Dimensional Radar Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Multi-Dimensional Comparison</CardTitle>
          <CardDescription>Radar chart showing relative performance across key dimensions</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 13, fontWeight: 500 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              {selectedUseCases.map((uc, index) => (
                <Radar
                  key={uc.id}
                  name={uc.name.length > 25 ? uc.name.substring(0, 25) + '...' : uc.name}
                  dataKey={`uc${index}`}
                  stroke={colors[index]}
                  fill={colors[index]}
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              ))}
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detailed Metrics Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Metrics Comparison</CardTitle>
          <CardDescription>Comprehensive side-by-side comparison of all key metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Metric</th>
                  {selectedUseCases.map((uc, index) => (
                    <th key={uc.id} className="text-right py-3 px-4 font-medium" style={{ color: colors[index] }}>
                      {uc.name.length > 20 ? uc.name.substring(0, 20) + '...' : uc.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4 font-medium">Horizon</td>
                  {selectedUseCases.map(uc => (
                    <td key={uc.id} className="text-right py-3 px-4">
                      <Badge variant="outline" style={{ borderColor: getHorizonColor(uc.horizon) }}>
                        {uc.horizon}
                      </Badge>
                    </td>
                  ))}
                </tr>
                <tr className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4 font-medium">Annual Value</td>
                  {selectedUseCases.map(uc => (
                    <td key={uc.id} className="text-right py-3 px-4 font-semibold">
                      {formatMillions(uc.annualValue)}
                    </td>
                  ))}
                </tr>
                <tr className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4 font-medium">Time to Value</td>
                  {selectedUseCases.map(uc => (
                    <td key={uc.id} className="text-right py-3 px-4">
                      {uc.ttv} months
                    </td>
                  ))}
                </tr>
                <tr className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4 font-medium">Implementation Effort</td>
                  {selectedUseCases.map(uc => (
                    <td key={uc.id} className="text-right py-3 px-4">
                      {uc.effort}/5
                    </td>
                  ))}
                </tr>
                <tr className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4 font-medium">Success Probability</td>
                  {selectedUseCases.map(uc => (
                    <td key={uc.id} className="text-right py-3 px-4">
                      {formatPercent(uc.probability * 100)}
                    </td>
                  ))}
                </tr>
                <tr className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4 font-medium">Priority Score</td>
                  {selectedUseCases.map(uc => (
                    <td key={uc.id} className="text-right py-3 px-4 font-semibold">
                      {uc.priorityScore.toFixed(1)}
                    </td>
                  ))}
                </tr>
                <tr className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4 font-medium">Rank</td>
                  {selectedUseCases.map(uc => (
                    <td key={uc.id} className="text-right py-3 px-4 font-semibold">
                      #{uc.rank}
                    </td>
                  ))}
                </tr>
                <tr className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4 font-medium">Complexity</td>
                  {selectedUseCases.map(uc => (
                    <td key={uc.id} className="text-right py-3 px-4">
                      {uc.complexity}
                    </td>
                  ))}
                </tr>
                <tr className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4 font-medium">Development Cost</td>
                  {selectedUseCases.map(uc => (
                    <td key={uc.id} className="text-right py-3 px-4">
                      {formatMillions(uc.developmentCost)}
                    </td>
                  ))}
                </tr>
                <tr className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4 font-medium">Annual Token Cost</td>
                  {selectedUseCases.map(uc => (
                    <td key={uc.id} className="text-right py-3 px-4">
                      {formatMillions(uc.annualTokenCost)}
                    </td>
                  ))}
                </tr>
                <tr className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4 font-medium">Monthly Tokens</td>
                  {selectedUseCases.map(uc => (
                    <td key={uc.id} className="text-right py-3 px-4">
                      {formatNumber(uc.monthlyTokens)}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Delta Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Value Spread
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatMillions(Math.max(...selectedUseCases.map(uc => uc.annualValue)) - Math.min(...selectedUseCases.map(uc => uc.annualValue)))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Difference between highest and lowest value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Average Time to Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(selectedUseCases.reduce((sum, uc) => sum + uc.ttv, 0) / selectedUseCases.length).toFixed(1)} mo
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Mean implementation timeline
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Target className="h-4 w-4" />
              Average Priority Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(selectedUseCases.reduce((sum, uc) => sum + uc.priorityScore, 0) / selectedUseCases.length).toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Mean weighted priority score
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
