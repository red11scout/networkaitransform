import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTheme } from '@/contexts/ThemeContext';
import { useHyperFormula } from '@/hooks/useHyperFormula';
import { formatMillions, formatPercent } from '@/lib/utils';
import { 
  Moon, 
  Sun, 
  TrendingUp, 
  DollarSign, 
  Zap,
  BarChart3,
  Calendar,
  Calculator,
  Grid3x3,
  Settings,
  Activity
} from 'lucide-react';
import ExecutiveDashboard from '@/components/ExecutiveDashboard';
import UseCasesExplorer from '@/components/UseCasesExplorer';
import FinancialProjections from '@/components/FinancialProjections';
import HorizonRoadmap from '@/components/HorizonRoadmap';
import CalculationsView from '@/components/CalculationsView';
import PriorityMatrix from '@/components/PriorityMatrix';
import ScenarioPlanning from '@/components/ScenarioPlanning';
import SensitivityAnalysis from '@/components/SensitivityAnalysis';

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const { results, isCalculating } = useHyperFormula();
  const [activeTab, setActiveTab] = useState('executive');

  if (isCalculating || !results) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Calculating with HyperFormula...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Zap className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Verizon AI Transformation</h1>
              <p className="text-xs text-muted-foreground">Financial Impact Dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-primary" />
                <span className="font-semibold">{formatMillions(results.grandTotals.totalAnnualValue)}</span>
                <span className="text-muted-foreground">Annual Value</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-chart-4" />
                <span className="font-semibold">{formatPercent(results.roi)}</span>
                <span className="text-muted-foreground">ROI</span>
              </div>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Stats */}
      <div className="border-b bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5">
        <div className="container py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
              <CardContent className="pt-6">
                <div className="text-sm text-muted-foreground mb-1">5-Year NPV</div>
                <div className="text-3xl font-bold">{formatMillions(results.npv)}</div>
                <div className="text-xs text-muted-foreground mt-1">@ 10% discount rate</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
              <CardContent className="pt-6">
                <div className="text-sm text-muted-foreground mb-1">Return on Investment</div>
                <div className="text-3xl font-bold">{formatPercent(results.roi)}</div>
                <div className="text-xs text-muted-foreground mt-1">Over 5 years</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
              <CardContent className="pt-6">
                <div className="text-sm text-muted-foreground mb-1">Total Use Cases</div>
                <div className="text-3xl font-bold">14</div>
                <div className="text-xs text-muted-foreground mt-1">Across 3 horizons</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
              <CardContent className="pt-6">
                <div className="text-sm text-muted-foreground mb-1">Payback Period</div>
                <div className="text-3xl font-bold">11 mo</div>
                <div className="text-xs text-muted-foreground mt-1">Rapid value delivery</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="inline-flex h-auto flex-wrap gap-2 bg-transparent p-0">
            <TabsTrigger 
              value="executive" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Executive
            </TabsTrigger>
            <TabsTrigger 
              value="use-cases"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Grid3x3 className="h-4 w-4 mr-2" />
              Use Cases
            </TabsTrigger>
            <TabsTrigger 
              value="financial"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Financial
            </TabsTrigger>
            <TabsTrigger 
              value="roadmap"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Roadmap
            </TabsTrigger>
            <TabsTrigger 
              value="priority"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Grid3x3 className="h-4 w-4 mr-2" />
              Priority Matrix
            </TabsTrigger>
            <TabsTrigger 
              value="scenario"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Settings className="h-4 w-4 mr-2" />
              Scenarios
            </TabsTrigger>
            <TabsTrigger 
              value="sensitivity"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Activity className="h-4 w-4 mr-2" />
              Sensitivity
            </TabsTrigger>
            <TabsTrigger 
              value="calculations"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Calculator className="h-4 w-4 mr-2" />
              Calculations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="executive" className="mt-6 animate-fade-in">
            <ExecutiveDashboard results={results} />
          </TabsContent>

          <TabsContent value="use-cases" className="mt-6 animate-fade-in">
            <UseCasesExplorer results={results} />
          </TabsContent>

          <TabsContent value="financial" className="mt-6 animate-fade-in">
            <FinancialProjections results={results} />
          </TabsContent>

          <TabsContent value="roadmap" className="mt-6 animate-fade-in">
            <HorizonRoadmap results={results} />
          </TabsContent>

          <TabsContent value="priority" className="mt-6 animate-fade-in">
            <PriorityMatrix />
          </TabsContent>

          <TabsContent value="scenario" className="mt-6 animate-fade-in">
            <ScenarioPlanning />
          </TabsContent>

          <TabsContent value="sensitivity" className="mt-6 animate-fade-in">
            <SensitivityAnalysis />
          </TabsContent>

          <TabsContent value="calculations" className="mt-6 animate-fade-in">
            <CalculationsView results={results} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="border-t mt-12">
        <div className="container py-6 text-center text-sm text-muted-foreground">
          <p>Verizon AI Transformation Dashboard • Powered by HyperFormula v3.1.1</p>
        </div>
      </footer>
    </div>
  );
}
