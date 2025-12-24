import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalculationResults } from '@/hooks/useHyperFormula';
import { useCases, horizonSummaries } from '@/lib/useCasesData';
import { formatMillions, formatPercent, getHorizonColor, getHorizonLabel } from '@/lib/utils';
import { Calendar, Clock, Target, TrendingUp } from 'lucide-react';

interface HorizonRoadmapProps {
  results: CalculationResults;
}

export default function HorizonRoadmap({ results }: HorizonRoadmapProps) {
  return (
    <div className="space-y-6">
      {/* Roadmap Overview */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Implementation Roadmap
          </CardTitle>
          <CardDescription>
            Phased approach to AI transformation across three horizons
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {horizonSummaries.map((horizon, index) => {
              const horizonUseCases = useCases.filter(uc => uc.horizon === horizon.horizon);
              const color = getHorizonColor(horizon.horizon);
              
              return (
                <div key={horizon.horizon} className="relative">
                  {/* Timeline connector */}
                  {index < horizonSummaries.length - 1 && (
                    <div 
                      className="absolute left-6 top-full h-8 w-0.5 bg-border"
                      style={{ top: '100%' }}
                    />
                  )}
                  
                  <div className="flex gap-6">
                    {/* Timeline dot */}
                    <div className="flex flex-col items-center">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shadow-lg"
                        style={{ backgroundColor: color }}
                      >
                        {horizon.horizon}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-8">
                      <div className="mb-4">
                        <h3 className="text-xl font-bold mb-1">{horizon.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {horizon.timeframe}
                          </span>
                          <span className="flex items-center gap-1">
                            <Target className="h-4 w-4" />
                            {horizon.useCaseCount} use cases
                          </span>
                          <span className="flex items-center gap-1">
                            <TrendingUp className="h-4 w-4" />
                            {formatMillions(horizon.annualValue)} annual value
                          </span>
                        </div>
                      </div>

                      {/* Horizon metrics */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="bg-muted/50 rounded-lg p-3">
                          <div className="text-xs text-muted-foreground mb-1">Avg TTV</div>
                          <div className="text-lg font-bold">{horizon.avgTTV.toFixed(1)} mo</div>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-3">
                          <div className="text-xs text-muted-foreground mb-1">Avg Effort</div>
                          <div className="text-lg font-bold">{horizon.avgEffort.toFixed(1)}/5</div>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-3">
                          <div className="text-xs text-muted-foreground mb-1">Success Rate</div>
                          <div className="text-lg font-bold">{formatPercent(horizon.avgProbability * 100, 0)}</div>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-3">
                          <div className="text-xs text-muted-foreground mb-1">Cost Reduction</div>
                          <div className="text-lg font-bold">{formatMillions(horizon.totalCostReduction, 1)}</div>
                        </div>
                      </div>

                      {/* Use cases in this horizon */}
                      <div className="space-y-3">
                        {horizonUseCases.map(uc => (
                          <Card 
                            key={uc.id} 
                            className="border-l-4"
                            style={{ borderLeftColor: color }}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-semibold">{uc.name}</h4>
                                    <Badge variant="outline" className="text-xs">
                                      Rank #{uc.rank}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground mb-2">{uc.description}</p>
                                  <div className="flex flex-wrap gap-4 text-xs">
                                    <span>
                                      <span className="text-muted-foreground">TTV:</span>{' '}
                                      <span className="font-medium">{uc.ttv} months</span>
                                    </span>
                                    <span>
                                      <span className="text-muted-foreground">Effort:</span>{' '}
                                      <span className="font-medium">{uc.effort}/5</span>
                                    </span>
                                    <span>
                                      <span className="text-muted-foreground">Success:</span>{' '}
                                      <span className="font-medium">{formatPercent(uc.probability * 100, 0)}</span>
                                    </span>
                                    <span>
                                      <span className="text-muted-foreground">KPI:</span>{' '}
                                      <span className="font-medium">{uc.improvement} {uc.primaryKPI}</span>
                                    </span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-xl font-bold">{formatMillions(uc.annualValue, 1)}</div>
                                  <div className="text-xs text-muted-foreground">Annual Value</div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Implementation Strategy */}
      <Card>
        <CardHeader>
          <CardTitle>Implementation Strategy</CardTitle>
          <CardDescription>Key principles for successful execution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-chart-1" />
                  Phase 1: Quick Wins (Months 1-3)
                </h4>
                <p className="text-sm text-muted-foreground">
                  Focus on high-impact, low-effort initiatives to build momentum and demonstrate value. 
                  Establish GPU infrastructure and governance frameworks.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-chart-2" />
                  Phase 2: Workforce Augmentation (Months 6-18)
                </h4>
                <p className="text-sm text-muted-foreground">
                  Deploy AI systems that augment human capabilities, particularly focusing on knowledge 
                  preservation and intelligent automation.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-chart-3" />
                  Phase 3: Strategic Transformation (Months 18+)
                </h4>
                <p className="text-sm text-muted-foreground">
                  Implement long-term, transformative initiatives that fundamentally change how the 
                  organization operates and creates value.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-chart-4" />
                  Continuous Enablement
                </h4>
                <p className="text-sm text-muted-foreground">
                  Maintain robust governance, configuration management, and infrastructure throughout 
                  all phases to ensure sustainable success.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
