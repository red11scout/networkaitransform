import { useState } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
import CostAnalysis from '@/components/CostAnalysis';
import FilterPanel from '@/components/FilterPanel';
import ProblemSolutionOverview from '@/components/ProblemSolutionOverview';
import ScenarioBuilder from '@/components/ScenarioBuilder';
import SavedScenarios from '@/components/SavedScenarios';
import ScenarioComparison from '@/components/ScenarioComparison';
import { OnboardingTour } from '@/components/OnboardingTour';
import { ContextualTooltip, tooltips } from '@/components/ContextualTooltip';
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
  Lightbulb,
  Activity,
  Moon,
  Sun,
  Server,
  Zap,
  HelpCircle,
  Layers,
  Target
} from 'lucide-react';

export default function Home() {
  const { user, loading, error, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [analysisSubTab, setAnalysisSubTab] = useState('usecases');
  const [planningSubTab, setPlanningSubTab] = useState('roadmap');
  const [scenariosSubTab, setScenariosSubTab] = useState('builder');
  const [comparisonScenarios, setComparisonScenarios] = useState<[number, number] | null>(null);
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
                    <img src="/images/blueally-icon.png" alt="BlueAlly" className="h-8 w-8 md:h-10 md:w-10" />
                    <div>
                      <h1 className="text-lg md:text-2xl font-bold">BlueAlly AI Transformation</h1>
                      <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">Financial Impact Dashboard</p>
                    </div>
                  </div>
                  <img src="/images/blueally-logo.png" alt="BlueAlly" className="h-6 md:h-8 ml-2 md:ml-4" />
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
                  <OnboardingTour />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleTheme}
                    className="rounded-full"
                    aria-label="Toggle theme"
                  >
                    {theme === 'dark' ? (
                      <Sun className="h-5 w-5" />
                    ) : (
                      <Moon className="h-5 w-5" />
                    )}
                  </Button>
                  {isAuthenticated && (
                    <Button variant="outline" size="sm" onClick={logout}>
                      Sign Out
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Key Metrics Bar */}
          <div className="border-b bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5">
            <div className="container mx-auto px-4 py-4 md:py-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
                <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/20">
                  <CardContent className="p-3 md:p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs md:text-sm text-muted-foreground">Annual Value</p>
                        <p className="text-xl md:text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                          {formatMillions(results.grandTotals.totalAnnualValue)}
                        </p>
                      </div>
                      <DollarSign className="h-6 w-6 md:h-8 md:w-8 text-emerald-500 opacity-50" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
                  <CardContent className="p-3 md:p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs md:text-sm text-muted-foreground">5-Year ROI</p>
                        <p className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {formatPercent(results.roi / 100)}
                        </p>
                      </div>
                      <TrendingUp className="h-6 w-6 md:h-8 md:w-8 text-blue-500 opacity-50" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
                  <CardContent className="p-3 md:p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs md:text-sm text-muted-foreground">Use Cases</p>
                        <p className="text-xl md:text-2xl font-bold text-purple-600 dark:text-purple-400">
                          14
                        </p>
                      </div>
                      <Grid3x3 className="h-6 w-6 md:h-8 md:w-8 text-purple-500 opacity-50" />
                    </div>
                  </CardContent>
                </Card>


              </div>
            </div>
          </div>

          {/* Main Content */}
          <main className="container mx-auto px-4 py-6 md:py-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              {/* Main Navigation - 5 Core Sections */}
              <TabsList className="w-full justify-start overflow-x-auto flex-nowrap bg-muted/50 p-1 rounded-lg">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  <span>Overview</span>
                </TabsTrigger>
                <TabsTrigger value="analysis" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span>Analysis</span>
                </TabsTrigger>
                <TabsTrigger value="planning" className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  <span>Planning</span>
                </TabsTrigger>
                <TabsTrigger value="scenarios" className="flex items-center gap-2">
                  <Layers className="h-4 w-4" />
                  <span>Scenarios</span>
                </TabsTrigger>
                <TabsTrigger value="insights" className="flex items-center gap-2">
                  <HelpCircle className="h-4 w-4" />
                  <span>Insights</span>
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Executive Overview</CardTitle>
                    <CardDescription>
                      Comprehensive summary of AI transformation opportunities and financial impact
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ExecutiveDashboard results={results} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Problem-Solution Mapping</CardTitle>
                    <CardDescription>
                      Business challenges paired with AI solutions and expected improvements
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ProblemSolutionOverview />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Analysis Tab with Nested Navigation */}
              <TabsContent value="analysis" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Financial Analysis</CardTitle>
                    <CardDescription>
                      Detailed financial metrics, use case analysis, and cost breakdowns
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs value={analysisSubTab} onValueChange={setAnalysisSubTab}>
                      <TabsList className="w-full justify-start mb-6">
                        <TabsTrigger value="usecases">Use Cases</TabsTrigger>
                        <TabsTrigger value="financial">Financial Projections</TabsTrigger>
                        <TabsTrigger value="costs">Cost Breakdown</TabsTrigger>
                      </TabsList>

                      <TabsContent value="usecases">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                          <div className="lg:col-span-1">
                            <FilterPanel />
                          </div>
                          <div className="lg:col-span-3">
                            <UseCasesExplorer results={results} />
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="financial">
                        <FinancialProjections results={results} />
                      </TabsContent>

                      <TabsContent value="costs">
                        <CostAnalysis />
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Planning Tab with Nested Navigation */}
              <TabsContent value="planning" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Implementation Planning</CardTitle>
                    <CardDescription>
                      Roadmap, prioritization, and sensitivity analysis for strategic planning
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs value={planningSubTab} onValueChange={setPlanningSubTab}>
                      <TabsList className="w-full justify-start mb-6">
                        <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
                        <TabsTrigger value="matrix">Priority Matrix</TabsTrigger>
                        <TabsTrigger value="sensitivity">Sensitivity Analysis</TabsTrigger>
                      </TabsList>

                      <TabsContent value="roadmap">
                        <HorizonRoadmap results={results} />
                      </TabsContent>

                      <TabsContent value="matrix">
                        <PriorityMatrix />
                      </TabsContent>

                      <TabsContent value="sensitivity">
                        <SensitivityAnalysis />
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Scenarios Tab with Nested Navigation */}
              <TabsContent value="scenarios" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Scenario Management</CardTitle>
                    <CardDescription>
                      Create, save, and compare custom financial scenarios
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs value={scenariosSubTab} onValueChange={setScenariosSubTab}>
                      <TabsList className="w-full justify-start mb-6">
                        <TabsTrigger value="builder">Builder</TabsTrigger>
                        <TabsTrigger value="saved">Saved Scenarios</TabsTrigger>
                        <TabsTrigger value="comparison">Comparison</TabsTrigger>
                      </TabsList>

                      <TabsContent value="builder">
                        {isAuthenticated ? (
                          <ScenarioBuilder onSave={() => setScenariosSubTab('saved')} />
                        ) : (
                          <div className="text-center space-y-4 py-12">
                            <p className="text-lg font-medium">Sign in to create scenarios</p>
                            <p className="text-muted-foreground">Save and manage custom financial scenarios</p>
                            <Button onClick={() => window.location.href = '/api/auth/login'}>Sign In</Button>
                          </div>
                        )}
                      </TabsContent>

                      <TabsContent value="saved">
                        {isAuthenticated ? (
                          comparisonScenarios ? (
                            <ScenarioComparison 
                              scenarioIds={comparisonScenarios} 
                              onBack={() => setComparisonScenarios(null)} 
                            />
                          ) : (
                            <SavedScenarios onCompare={(ids) => setComparisonScenarios(ids)} />
                          )
                        ) : (
                          <div className="text-center space-y-4 py-12">
                            <p className="text-lg font-medium">Sign in to view saved scenarios</p>
                            <p className="text-muted-foreground">Access your saved financial scenarios</p>
                            <Button onClick={() => window.location.href = '/api/auth/login'}>Sign In</Button>
                          </div>
                        )}
                      </TabsContent>

                      <TabsContent value="comparison">
                        <ComparisonView />
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Insights Tab */}
              <TabsContent value="insights" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Calculation Transparency</CardTitle>
                    <CardDescription>
                      Detailed view of all financial calculations and methodology
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CalculationsView results={results} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>How to Use This Dashboard</CardTitle>
                    <CardDescription>
                      Quick guide to navigating and utilizing all features
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Lightbulb className="h-4 w-4 text-primary" />
                          Overview
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Start here for executive summary and problem-solution mapping. Perfect for stakeholder presentations.
                        </p>
                      </div>

                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <BarChart3 className="h-4 w-4 text-primary" />
                          Analysis
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Deep dive into use cases, financial projections, and cost breakdowns. Filter and compare different scenarios.
                        </p>
                      </div>

                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Target className="h-4 w-4 text-primary" />
                          Planning
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Visualize implementation roadmap, prioritize use cases, and run sensitivity analysis on key variables.
                        </p>
                      </div>

                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Layers className="h-4 w-4 text-primary" />
                          Scenarios
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Create custom scenarios by adjusting assumptions, save them for later, and compare multiple scenarios side-by-side.
                        </p>
                      </div>
                    </div>

                    <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                      <h4 className="font-semibold mb-2">💡 Pro Tips</h4>
                      <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                        <li>Use filters in Analysis → Use Cases to focus on specific horizons or value ranges</li>
                        <li>Drag use cases in the Priority Matrix to explore different prioritization strategies</li>
                        <li>Create multiple scenarios to model optimistic, realistic, and conservative cases</li>
                        <li>Export data for presentations using the export buttons throughout the dashboard</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>

          {/* Footer */}
          <footer className="border-t mt-12 py-6 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <img src="/images/blueally-icon.png" alt="BlueAlly" className="h-5" />
                  <span>© 2024 BlueAlly. All rights reserved.</span>
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
