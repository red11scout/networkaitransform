import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useHyperFormula } from '@/hooks/useHyperFormula';
import { FilterProvider } from '@/contexts/FilterContext';
import { ComparisonProvider } from '@/contexts/ComparisonContext';
import { useTheme } from '@/contexts/ThemeContext';
import { formatMillions, formatPercent } from '@/lib/utils';
import ExecutiveDashboard from '@/components/ExecutiveDashboard';
import UseCasesExplorer from '@/components/UseCasesExplorer';
import FinancialProjections from '@/components/FinancialProjections';
import HorizonRoadmap from '@/components/HorizonRoadmap';
import CalculationsView from '@/components/CalculationsView';
import PriorityMatrix from '@/components/PriorityMatrix';
import ScenarioPlanning from '@/components/ScenarioPlanning';
import SensitivityAnalysis from '@/components/SensitivityAnalysis';
import ComparisonView from '@/components/ComparisonView';
import BrandingSettings from '@/components/BrandingSettings';
import CostAnalysis from '@/components/CostAnalysis';
import FilterPanel from '@/components/FilterPanel';
import ProblemSolutionOverview from '@/components/ProblemSolutionOverview';
import { 
  BarChart3, 
  Grid3x3, 
  DollarSign, 
  Calendar, 
  Grid2x2, 
  Settings2, 
  TrendingUp, 
  Calculator, 
  GitCompare, 
  Palette,
  Lightbulb,
  Activity,
  Moon,
  Sun,
  Server,
  Zap
} from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('executive');
  const { results, isCalculating } = useHyperFormula();
  const { theme, toggleTheme } = useTheme();

  if (!results || isCalculating) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <FilterProvider>
      <ComparisonProvider>
        <div className="min-h-screen bg-background">
          {/* Header */}
          <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50 sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3 md:py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 md:gap-4">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg bg-primary flex items-center justify-center">
                      <Zap className="h-4 w-4 md:h-6 md:w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h1 className="text-lg md:text-2xl font-bold">Verizon AI Transformation</h1>
                      <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">Financial Impact Dashboard</p>
                    </div>
                  </div>
                  <img src="/images/verizon-logo.png" alt="Verizon" className="h-6 md:h-8 ml-2 md:ml-4" />
                </div>
                <div className="flex items-center gap-3 md:gap-6">
                  <div className="hidden lg:flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-primary" />
                      <span className="font-semibold">{formatMillions(results.grandTotals.totalAnnualValue)}</span>
                      <span className="text-muted-foreground">Annual Value</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-primary" />
                      <span className="font-semibold">{formatPercent(results.roi / 100)}</span>
                      <span className="text-muted-foreground">ROI</span>
                    </div>
                  </div>
                  <div className="lg:hidden flex items-center gap-2 text-xs">
                    <span className="font-semibold">{formatMillions(results.grandTotals.totalAnnualValue, 1)}</span>
                    <span className="text-muted-foreground">Value</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleTheme}
                    className="rounded-full h-8 w-8 md:h-10 md:w-10"
                  >
                    {theme === 'dark' ? <Sun className="h-4 w-4 md:h-5 md:w-5" /> : <Moon className="h-4 w-4 md:h-5 md:w-5" />}
                  </Button>
                </div>
              </div>
            </div>
          </header>

          {/* Key Metrics Bar */}
          <div className="border-b bg-muted/30">
            <div className="container mx-auto px-4 py-3 md:py-4">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-none">
                  <CardContent className="p-3 md:p-4">
                    <div className="text-xs md:text-sm text-muted-foreground">5-Year NPV</div>
                    <div className="text-xl md:text-2xl font-bold mt-1">{formatMillions(results.npv)}</div>
                    <div className="text-[10px] md:text-xs text-muted-foreground mt-1">@ 10% discount rate</div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 border-none">
                  <CardContent className="p-3 md:p-4">
                    <div className="text-xs md:text-sm text-muted-foreground">Return on Investment</div>
                    <div className="text-xl md:text-2xl font-bold mt-1">{formatPercent(results.roi / 100)}</div>
                    <div className="text-[10px] md:text-xs text-muted-foreground mt-1">Over 5 years</div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-none">
                  <CardContent className="p-3 md:p-4">
                    <div className="text-xs md:text-sm text-muted-foreground">Total Use Cases</div>
                    <div className="text-xl md:text-2xl font-bold mt-1">14</div>
                    <div className="text-[10px] md:text-xs text-muted-foreground mt-1">Across 3 horizons</div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 border-none">
                  <CardContent className="p-3 md:p-4">
                    <div className="text-xs md:text-sm text-muted-foreground">Payback Period</div>
                    <div className="text-xl md:text-2xl font-bold mt-1">11 mo</div>
                    <div className="text-[10px] md:text-xs text-muted-foreground mt-1">Rapid value delivery</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <main className="container mx-auto px-4 py-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="flex overflow-x-auto gap-1 md:gap-2 h-auto p-1 md:p-2 bg-muted/50 scrollbar-hide">
                <TabsTrigger value="executive" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Executive</span>
                </TabsTrigger>
                <TabsTrigger value="problems" className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  <span className="hidden sm:inline">Problems</span>
                </TabsTrigger>
                <TabsTrigger value="usecases" className="flex items-center gap-2">
                  <Grid3x3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Use Cases</span>
                </TabsTrigger>
                <TabsTrigger value="financial" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  <span className="hidden sm:inline">Financial</span>
                </TabsTrigger>
                <TabsTrigger value="costs" className="flex items-center gap-2">
                  <Server className="h-4 w-4" />
                  <span className="hidden sm:inline">Costs</span>
                </TabsTrigger>
                <TabsTrigger value="roadmap" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="hidden sm:inline">Roadmap</span>
                </TabsTrigger>
                <TabsTrigger value="matrix" className="flex items-center gap-2">
                  <Grid2x2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Priority Matrix</span>
                </TabsTrigger>
                <TabsTrigger value="scenarios" className="flex items-center gap-2">
                  <Settings2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Scenarios</span>
                </TabsTrigger>
                <TabsTrigger value="sensitivity" className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  <span className="hidden sm:inline">Sensitivity</span>
                </TabsTrigger>
                <TabsTrigger value="calculations" className="flex items-center gap-2">
                  <Calculator className="h-4 w-4" />
                  <span className="hidden sm:inline">Calculations</span>
                </TabsTrigger>
                <TabsTrigger value="comparison" className="flex items-center gap-2">
                  <GitCompare className="h-4 w-4" />
                  <span className="hidden sm:inline">Comparison</span>
                </TabsTrigger>
                <TabsTrigger value="branding" className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  <span className="hidden sm:inline">Branding</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="executive" className="space-y-6">
                {results && <ExecutiveDashboard results={results} />}
              </TabsContent>

              <TabsContent value="problems" className="space-y-6">
                <ProblemSolutionOverview />
              </TabsContent>

              <TabsContent value="usecases" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  <div className="lg:col-span-1">
                    <FilterPanel />
                  </div>
                  <div className="lg:col-span-3">
                    {results && <UseCasesExplorer results={results} />}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="financial" className="space-y-6">
                {results && <FinancialProjections results={results} />}
              </TabsContent>

              <TabsContent value="costs" className="space-y-6">
                <CostAnalysis />
              </TabsContent>

              <TabsContent value="roadmap" className="space-y-6">
                {results && <HorizonRoadmap results={results} />}
              </TabsContent>

              <TabsContent value="matrix" className="space-y-6">
                <PriorityMatrix />
              </TabsContent>

              <TabsContent value="scenarios" className="space-y-6">
                <ScenarioPlanning />
              </TabsContent>

              <TabsContent value="sensitivity" className="space-y-6">
                <SensitivityAnalysis />
              </TabsContent>

              <TabsContent value="calculations" className="space-y-6">
                {results && <CalculationsView results={results} />}
              </TabsContent>

              <TabsContent value="comparison" className="space-y-6">
                <ComparisonView />
              </TabsContent>

              <TabsContent value="branding" className="space-y-6">
                <BrandingSettings />
              </TabsContent>
            </Tabs>
          </main>

          {/* Footer */}
          <footer className="border-t mt-12 py-6 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <img src="/images/verizon-logo.png" alt="Verizon" className="h-5" />
                  <span>© 2024 Verizon. All rights reserved.</span>
                </div>
                <div>
                  <span>AI Transformation Financial Impact Dashboard</span>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </ComparisonProvider>
    </FilterProvider>
  );
}
