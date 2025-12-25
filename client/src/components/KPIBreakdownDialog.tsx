import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCases } from '@/lib/useCasesData';
import { getHorizonColor, getHorizonLabel } from '@/lib/utils';
import { TrendingUp, TrendingDown, Clock, Target } from 'lucide-react';

interface KPIBreakdownDialogProps {
  children: React.ReactNode;
}

export function KPIBreakdownDialog({ children }: KPIBreakdownDialogProps) {
  const [open, setOpen] = useState(false);

  // Collect all KPIs from use cases
  const allKPIs = useCases.map(uc => ({
    useCase: uc.name,
    horizon: uc.horizon,
    kpi: uc.primaryKPI,
    baseline: uc.baseline,
    target: uc.target,
    improvement: uc.improvement,
    direction: uc.improvementDirection,
    timeline: uc.timeline
  }));

  // Group by horizon
  const kpisByHorizon = {
    H1: allKPIs.filter(k => k.horizon === 'H1'),
    H2: allKPIs.filter(k => k.horizon === 'H2'),
    H3: allKPIs.filter(k => k.horizon === 'H3'),
    Enabler: allKPIs.filter(k => k.horizon === 'Enabler')
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">KPI Improvements Breakdown</DialogTitle>
          <DialogDescription>
            Detailed view of 14 primary KPIs across all AI transformation initiatives (one KPI per use case)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold">{allKPIs.length}</div>
              <div className="text-xs text-muted-foreground">Total KPIs</div>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold">{kpisByHorizon.H1.length}</div>
              <div className="text-xs text-muted-foreground">Horizon 1</div>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold">{kpisByHorizon.H2.length}</div>
              <div className="text-xs text-muted-foreground">Horizon 2</div>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold">{kpisByHorizon.H3.length + kpisByHorizon.Enabler.length}</div>
              <div className="text-xs text-muted-foreground">H3 + Enablers</div>
            </div>
          </div>

          {/* KPIs by Horizon */}
          {Object.entries(kpisByHorizon).map(([horizon, kpis]) => (
            kpis.length > 0 && (
              <div key={horizon}>
                <div className="flex items-center gap-2 mb-3">
                  <Badge 
                    className={`${getHorizonColor(horizon as any)} text-white`}
                  >
                    {getHorizonLabel(horizon as any)}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {kpis.length} KPI{kpis.length > 1 ? 's' : ''}
                  </span>
                </div>

                <div className="grid gap-3">
                  {kpis.map((kpi, index) => (
                    <Card key={`${horizon}-${index}`} className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm mb-1 truncate">
                            {kpi.useCase}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                            <Target className="h-3 w-3" />
                            <span>{kpi.kpi}</span>
                          </div>
                          <div className="flex items-center gap-4 text-xs">
                            <div>
                              <span className="text-muted-foreground">Baseline: </span>
                              <span className="font-medium">{kpi.baseline}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Target: </span>
                              <span className="font-medium">{kpi.target}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span className="text-muted-foreground">{kpi.timeline}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          {kpi.direction === 'increase' ? (
                            <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          )}
                          <span className={`text-lg font-bold ${
                            kpi.direction === 'increase' 
                              ? 'text-green-600 dark:text-green-400' 
                              : 'text-blue-600 dark:text-blue-400'
                          }`}>
                            {kpi.improvement}
                          </span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
