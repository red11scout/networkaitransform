import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';
import { formatCurrency, formatPercent } from '@/lib/utils';
import { 
  ArrowLeft,
  TrendingUp, 
  TrendingDown,
  Minus,
  DollarSign, 
  Calendar, 
  Percent,
  Loader2
} from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface ScenarioComparisonProps {
  scenarioIds: [number, number];
  onBack?: () => void;
}

export default function ScenarioComparison({ scenarioIds, onBack }: ScenarioComparisonProps) {
  const { data: comparisonData, isLoading } = trpc.scenarios.compare.useQuery({
    scenarioId1: scenarioIds[0],
    scenarioId2: scenarioIds[1],
  });
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 flex items-center justify-center h-96">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading comparison...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!comparisonData) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-destructive">Failed to load comparison data</p>
        </CardContent>
      </Card>
    );
  }
  
  const { scenario1, scenario2, deltas } = comparisonData;
  
  // Convert from database format
  const s1 = {
    ...scenario1,
    totalAnnualValue: scenario1.totalAnnualValue / 100,
    fiveYearNPV: scenario1.fiveYearNPV / 100,
    roi: scenario1.roi / 100,
  };
  
  const s2 = {
    ...scenario2,
    totalAnnualValue: scenario2.totalAnnualValue / 100,
    fiveYearNPV: scenario2.fiveYearNPV / 100,
    roi: scenario2.roi / 100,
  };
  
  const getDeltaIcon = (delta: number) => {
    if (delta > 0) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (delta < 0) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
  };
  
  const getDeltaBadge = (delta: number, isInverse: boolean = false) => {
    const isPositive = isInverse ? delta < 0 : delta > 0;
    return (
      <Badge variant={isPositive ? 'default' : 'destructive'} className="ml-2">
        {delta > 0 ? '+' : ''}{formatCurrency(delta)}
      </Badge>
    );
  };
  
  // Prepare radar chart data
  const radarData = [
    {
      metric: 'Annual Value',
      [s1.name]: (s1.totalAnnualValue / 15700000) * 100,
      [s2.name]: (s2.totalAnnualValue / 15700000) * 100,
    },
    {
      metric: '5Y NPV',
      [s1.name]: (s1.fiveYearNPV / 35000000) * 100,
      [s2.name]: (s2.fiveYearNPV / 35000000) * 100,
    },
    {
      metric: 'ROI',
      [s1.name]: (s1.roi / 500) * 100,
      [s2.name]: (s2.roi / 500) * 100,
    },
    {
      metric: 'Payback Speed',
      [s1.name]: ((60 - s1.paybackMonths) / 60) * 100,
      [s2.name]: ((60 - s2.paybackMonths) / 60) * 100,
    },
  ];
  
  // Prepare yearly comparison data
  const yearlyComparison = scenario1.results.yearlyBreakdown.map((year, idx) => ({
    year: year.year,
    [`${s1.name} Benefits`]: year.benefits,
    [`${s2.name} Benefits`]: scenario2.results.yearlyBreakdown[idx].benefits,
    [`${s1.name} NPV`]: year.discountedCashFlow,
    [`${s2.name} NPV`]: scenario2.results.yearlyBreakdown[idx].discountedCashFlow,
  }));
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        {onBack && (
          <Button variant="outline" size="icon" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
        )}
        <div className="flex-1">
          <h2 className="text-2xl md:text-3xl font-bold">Scenario Comparison</h2>
          <p className="text-muted-foreground mt-1">
            Side-by-side analysis of financial scenarios
          </p>
        </div>
      </div>
      
      {/* Scenario Headers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-xl">{s1.name}</CardTitle>
            {s1.description && <CardDescription>{s1.description}</CardDescription>}
          </CardHeader>
        </Card>
        <Card className="bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800">
          <CardHeader>
            <CardTitle className="text-xl">{s2.name}</CardTitle>
            {s2.description && <CardDescription>{s2.description}</CardDescription>}
          </CardHeader>
        </Card>
      </div>
      
      {/* Key Metrics Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Key Metrics Comparison</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="w-4 h-4" />
                <span>Total Annual Value</span>
              </div>
              <div className="space-y-1">
                <p className="text-lg font-bold text-blue-600">{formatCurrency(s1.totalAnnualValue)}</p>
                <p className="text-lg font-bold text-purple-600">{formatCurrency(s2.totalAnnualValue)}</p>
              </div>
              <div className="flex items-center">
                {getDeltaIcon(deltas.totalAnnualValue)}
                {getDeltaBadge(deltas.totalAnnualValue)}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="w-4 h-4" />
                <span>5-Year NPV</span>
              </div>
              <div className="space-y-1">
                <p className="text-lg font-bold text-blue-600">{formatCurrency(s1.fiveYearNPV)}</p>
                <p className="text-lg font-bold text-purple-600">{formatCurrency(s2.fiveYearNPV)}</p>
              </div>
              <div className="flex items-center">
                {getDeltaIcon(deltas.fiveYearNPV)}
                {getDeltaBadge(deltas.fiveYearNPV)}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Percent className="w-4 h-4" />
                <span>ROI</span>
              </div>
              <div className="space-y-1">
                <p className="text-lg font-bold text-blue-600">{formatPercent(s1.roi / 100)}</p>
                <p className="text-lg font-bold text-purple-600">{formatPercent(s2.roi / 100)}</p>
              </div>
              <div className="flex items-center">
                {getDeltaIcon(deltas.roi)}
                <Badge variant={deltas.roi > 0 ? 'default' : 'destructive'} className="ml-2">
                  {deltas.roi > 0 ? '+' : ''}{deltas.roi.toFixed(1)}pp
                </Badge>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Payback Period</span>
              </div>
              <div className="space-y-1">
                <p className="text-lg font-bold text-blue-600">{s1.paybackMonths} months</p>
                <p className="text-lg font-bold text-purple-600">{s2.paybackMonths} months</p>
              </div>
              <div className="flex items-center">
                {getDeltaIcon(-deltas.paybackMonths)}
                <Badge variant={deltas.paybackMonths < 0 ? 'default' : 'destructive'} className="ml-2">
                  {deltas.paybackMonths > 0 ? '+' : ''}{deltas.paybackMonths} months
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Parameters Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Parameter Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-sm text-muted-foreground">Financial Assumptions</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-sm mb-1">Discount Rate</p>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600 font-medium">{(s1.discountRate / 100).toFixed(1)}%</span>
                    <span className="text-muted-foreground">vs</span>
                    <span className="text-purple-600 font-medium">{(s2.discountRate / 100).toFixed(1)}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm mb-1">Growth Factor</p>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600 font-medium">{(s1.growthFactor / 100).toFixed(1)}%</span>
                    <span className="text-muted-foreground">vs</span>
                    <span className="text-purple-600 font-medium">{(s2.growthFactor / 100).toFixed(1)}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm mb-1">Implementation Speed</p>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600 font-medium">{s1.implementationSpeed}%</span>
                    <span className="text-muted-foreground">vs</span>
                    <span className="text-purple-600 font-medium">{s2.implementationSpeed}%</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-sm text-muted-foreground">Cost Multipliers</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-sm mb-1">Hardware Costs</p>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600 font-medium">{(s1.hardwareCostMultiplier / 100).toFixed(0)}%</span>
                    <span className="text-muted-foreground">vs</span>
                    <span className="text-purple-600 font-medium">{(s2.hardwareCostMultiplier / 100).toFixed(0)}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm mb-1">Software Costs</p>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600 font-medium">{(s1.softwareCostMultiplier / 100).toFixed(0)}%</span>
                    <span className="text-muted-foreground">vs</span>
                    <span className="text-purple-600 font-medium">{(s2.softwareCostMultiplier / 100).toFixed(0)}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm mb-1">Development Costs</p>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600 font-medium">{(s1.developmentCostMultiplier / 100).toFixed(0)}%</span>
                    <span className="text-muted-foreground">vs</span>
                    <span className="text-purple-600 font-medium">{(s2.developmentCostMultiplier / 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-4">Overall Performance</h4>
              <ResponsiveContainer width="100%" height={200}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} />
                  <Radar name={s1.name} dataKey={s1.name} stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                  <Radar name={s2.name} dataKey={s2.name} stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Yearly Benefits Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>5-Year Benefits Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={yearlyComparison}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" label={{ value: 'Year', position: 'insideBottom', offset: -5 }} />
              <YAxis label={{ value: 'Benefits ($M)', angle: -90, position: 'insideLeft' }} tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend />
              <Bar dataKey={`${s1.name} Benefits`} fill="#3b82f6" />
              <Bar dataKey={`${s2.name} Benefits`} fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      {/* NPV Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Discounted Cash Flow Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={yearlyComparison}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" label={{ value: 'Year', position: 'insideBottom', offset: -5 }} />
              <YAxis label={{ value: 'NPV ($M)', angle: -90, position: 'insideLeft' }} tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend />
              <Line type="monotone" dataKey={`${s1.name} NPV`} stroke="#3b82f6" strokeWidth={3} />
              <Line type="monotone" dataKey={`${s2.name} NPV`} stroke="#8b5cf6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
