import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalculationResults } from '@/hooks/useHyperFormula';
import { useCases } from '@/lib/useCasesData';
import { formatMillions, formatPercent, getHorizonColor } from '@/lib/utils';
import { Search, TrendingUp, TrendingDown, Clock, Zap, Target } from 'lucide-react';

interface UseCasesExplorerProps {
  results: CalculationResults;
}

export default function UseCasesExplorer({ results }: UseCasesExplorerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [horizonFilter, setHorizonFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('rank');

  // Filter and sort use cases
  let filteredCases = useCases.filter(uc => {
    const matchesSearch = uc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          uc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesHorizon = horizonFilter === 'all' || uc.horizon === horizonFilter;
    return matchesSearch && matchesHorizon;
  });

  // Sort use cases
  filteredCases = [...filteredCases].sort((a, b) => {
    switch (sortBy) {
      case 'rank':
        return a.rank - b.rank;
      case 'value':
        return b.annualValue - a.annualValue;
      case 'ttv':
        return a.ttv - b.ttv;
      case 'probability':
        return b.probability - a.probability;
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Explore Use Cases</CardTitle>
          <CardDescription>Filter and search through all 14 AI transformation initiatives</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search use cases..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={horizonFilter} onValueChange={setHorizonFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by horizon" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Horizons</SelectItem>
                <SelectItem value="H1">Horizon 1</SelectItem>
                <SelectItem value="H2">Horizon 2</SelectItem>
                <SelectItem value="H3">Horizon 3</SelectItem>
                <SelectItem value="Enabler">Enablers</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rank">Priority Rank</SelectItem>
                <SelectItem value="value">Annual Value</SelectItem>
                <SelectItem value="ttv">Time to Value</SelectItem>
                <SelectItem value="probability">Success Probability</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Use Cases Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCases.map((useCase) => (
          <Card 
            key={useCase.id} 
            className="border-l-4 hover:shadow-lg transition-shadow"
            style={{ borderLeftColor: getHorizonColor(useCase.horizon) }}
          >
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" style={{ borderColor: getHorizonColor(useCase.horizon) }}>
                      {useCase.horizon}
                    </Badge>
                    <Badge variant="secondary">Rank #{useCase.rank}</Badge>
                  </div>
                  <CardTitle className="text-lg">{useCase.name}</CardTitle>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{formatMillions(useCase.annualValue, 1)}</div>
                  <div className="text-xs text-muted-foreground">Annual Value</div>
                </div>
              </div>
              <CardDescription className="mt-2">{useCase.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* KPI Improvement */}
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{useCase.primaryKPI}</span>
                  <div className="flex items-center gap-1">
                    {useCase.improvementDirection === 'decrease' ? (
                      <TrendingDown className="h-4 w-4 text-chart-4" />
                    ) : (
                      <TrendingUp className="h-4 w-4 text-chart-4" />
                    )}
                    <span className="text-sm font-bold text-chart-4">{useCase.improvement}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Baseline: {useCase.baseline}</span>
                  <span>→</span>
                  <span>Target: {useCase.target}</span>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">TTV</span>
                  </div>
                  <div className="font-semibold">{useCase.ttv} mo</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Zap className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Effort</span>
                  </div>
                  <div className="font-semibold">{useCase.effort}/5</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Target className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Success</span>
                  </div>
                  <div className="font-semibold">{formatPercent(useCase.probability * 100, 0)}</div>
                </div>
              </div>

              {/* Business Drivers */}
              <div className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground">Value Breakdown</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {useCase.businessDrivers.cost > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cost Reduction:</span>
                      <span className="font-medium">{formatMillions(useCase.businessDrivers.cost, 1)}</span>
                    </div>
                  )}
                  {useCase.businessDrivers.revenue > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Revenue:</span>
                      <span className="font-medium">{formatMillions(useCase.businessDrivers.revenue, 1)}</span>
                    </div>
                  )}
                  {useCase.businessDrivers.risk > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Risk Value:</span>
                      <span className="font-medium">{formatMillions(useCase.businessDrivers.risk, 1)}</span>
                    </div>
                  )}
                  {useCase.businessDrivers.cashFlow > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cash Flow:</span>
                      <span className="font-medium">{formatMillions(useCase.businessDrivers.cashFlow, 1)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Investment */}
              <div className="pt-3 border-t flex justify-between text-xs">
                <div>
                  <span className="text-muted-foreground">Dev Cost: </span>
                  <span className="font-medium">{formatMillions(useCase.developmentCost, 1)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">5Y Maint: </span>
                  <span className="font-medium">{formatMillions(useCase.maintenanceCost5Year, 1)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCases.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No use cases found matching your filters.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
