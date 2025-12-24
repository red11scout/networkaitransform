import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTheme } from '@/contexts/ThemeContext';
import { useHyperFormula } from '@/hooks/useHyperFormula';
import { formatMillions, formatPercent, formatNumber } from '@/lib/utils';
import { 
  Moon, 
  Sun, 
  TrendingUp, 
  DollarSign, 
  Target, 
  Zap,
  BarChart3,
  Calendar,
  Calculator,
  Grid3x3
} from 'lucide-react';
import ExecutiveDashboard from '@/components/ExecutiveDashboard';
import UseCasesExplorer from '@/components/UseCasesExplorer';
import FinancialProjections from '@/components/FinancialProjections';
import HorizonRoadmap from '@/components/HorizonRoadmap';
import CalculationsView from '@/components/CalculationsView';

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

      {/* Main Content */}
      <main className="container py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">5-Year NPV</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatMillions(results.npv)}</div>
              <p className="text-xs text-muted-foreground mt-1">@ 10% discount rate</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-chart-4/10 to-chart-4/5 border-chart-4/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Return on Investment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatPercent(results.roi)}</div>
              <p className="text-xs text-muted-foreground mt-1">Over 5 years</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-chart-2/10 to-chart-2/5 border-chart-2/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Use Cases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">14</div>
              <p className="text-xs text-muted-foreground mt-1">Across 3 horizons</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-chart-5/10 to-chart-5/5 border-chart-5/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Payback Period</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">11 mo</div>
              <p className="text-xs text-muted-foreground mt-1">Rapid value delivery</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 h-auto gap-2 bg-muted/50 p-2">
            <TabsTrigger value="executive" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Executive</span>
            </TabsTrigger>
            <TabsTrigger value="usecases" className="flex items-center gap-2">
              <Grid3x3 className="h-4 w-4" />
              <span className="hidden sm:inline">Use Cases</span>
            </TabsTrigger>
            <TabsTrigger value="financial" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <span className="hidden sm:inline">Financial</span>
            </TabsTrigger>
            <TabsTrigger value="roadmap" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Roadmap</span>
            </TabsTrigger>
            <TabsTrigger value="calculations" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              <span className="hidden sm:inline">Calculations</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="executive" className="space-y-6">
            <ExecutiveDashboard results={results} />
          </TabsContent>

          <TabsContent value="usecases" className="space-y-6">
            <UseCasesExplorer results={results} />
          </TabsContent>

          <TabsContent value="financial" className="space-y-6">
            <FinancialProjections results={results} />
          </TabsContent>

          <TabsContent value="roadmap" className="space-y-6">
            <HorizonRoadmap results={results} />
          </TabsContent>

          <TabsContent value="calculations" className="space-y-6">
            <CalculationsView results={results} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30 mt-16">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <div>
              <p>Powered by <span className="font-semibold text-foreground">HyperFormula</span> calculation engine</p>
            </div>
            <div className="flex items-center gap-4">
              <span>14 AI Use Cases</span>
              <span>•</span>
              <span>$60.45M 5-Year Benefits</span>
              <span>•</span>
              <span>448.3% ROI</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
