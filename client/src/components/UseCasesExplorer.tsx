import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalculationResults } from '@/hooks/useHyperFormula';
import { useFilteredUseCases } from '@/hooks/useFilteredUseCases';
import { useComparison } from '@/contexts/ComparisonContext';
import { formatMillions, formatPercent, getHorizonColor } from '@/lib/utils';
import { Search, TrendingUp, TrendingDown, Clock, Zap, Target, Plus, Check } from 'lucide-react';

interface UseCasesExplorerProps {
  results: CalculationResults;
}

export default function UseCasesExplorer({ results }: UseCasesExplorerProps) {
  const [sortBy, setSortBy] = useState<string>('rank');
  const { filteredUseCases, totalCount, filteredCount, isFiltered } = useFilteredUseCases();
  const { addUseCase, removeUseCase, isSelected, canAddMore } = useComparison();

  // Sort use cases
  const sortedCases = [...filteredUseCases].sort((a, b) => {
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

  const handleToggleComparison = (useCase: any) => {
    if (isSelected(useCase.id)) {
      removeUseCase(useCase.id);
    } else if (canAddMore) {
      addUseCase(useCase);
    }
  };

  return (
    <div className="space-y-6">
      {/* Sort and Results Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Use Cases Explorer</CardTitle>
              <CardDescription>
                {isFiltered ? (
                  <span>Showing {filteredCount} of {totalCount} use cases</span>
                ) : (
                  <span>Showing all {totalCount} use cases</span>
                )}
              </CardDescription>
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[200px]">
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
        </CardHeader>
      </Card>

      {/* Use Cases Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sortedCases.map((useCase) => (
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
              <div className="pt-3 border-t flex justify-between items-center">
                <div className="flex gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground">Dev Cost: </span>
                    <span className="font-medium">{formatMillions(useCase.developmentCost, 1)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">5Y Maint: </span>
                    <span className="font-medium">{formatMillions(useCase.maintenanceCost5Year, 1)}</span>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant={isSelected(useCase.id) ? "default" : "outline"}
                  onClick={() => handleToggleComparison(useCase)}
                  disabled={!canAddMore && !isSelected(useCase.id)}
                >
                  {isSelected(useCase.id) ? (
                    <><Check className="h-3 w-3 mr-1" /> Added</>
                  ) : (
                    <><Plus className="h-3 w-3 mr-1" /> Compare</>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {sortedCases.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No use cases found matching your filters.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
