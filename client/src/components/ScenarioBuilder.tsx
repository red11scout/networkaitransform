import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';
import { formatCurrency, formatPercent, formatMillions } from '@/lib/utils';
import { 
  Save, 
  RefreshCw, 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  Percent,
  Settings,
  Zap,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ScenarioBuilderProps {
  onSave?: (scenarioId: number) => void;
}

export default function ScenarioBuilder({ onSave }: ScenarioBuilderProps) {
  const [scenarioName, setScenarioName] = useState('');
  const [scenarioDescription, setScenarioDescription] = useState('');
  
  // Financial assumptions
  const [discountRate, setDiscountRate] = useState(10);
  const [growthFactor, setGrowthFactor] = useState(5);
  const [implementationSpeed, setImplementationSpeed] = useState(100);
  
  // Cost multipliers
  const [hardwareCostMultiplier, setHardwareCostMultiplier] = useState(100);
  const [softwareCostMultiplier, setSoftwareCostMultiplier] = useState(100);
  const [developmentCostMultiplier, setDevelopmentCostMultiplier] = useState(100);
  
  // Calculation results
  const [calculationResults, setCalculationResults] = useState<any>(null);
  const [baselineResults, setBaselineResults] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isDeterministic, setIsDeterministic] = useState<boolean | null>(null);
  
  // tRPC mutations
  const calculateMutation = trpc.scenarios.calculate.useMutation();
  const createMutation = trpc.scenarios.create.useMutation();
  const validateMutation = trpc.scenarios.validateDeterminism.useMutation();
  const baseModelQuery = trpc.scenarios.getBaseModel.useQuery();
  
  // Load baseline on mount
  useEffect(() => {
    if (baseModelQuery.data) {
      setBaselineResults(baseModelQuery.data.results);
    }
  }, [baseModelQuery.data]);
  
  // Auto-calculate when parameters change
  useEffect(() => {
    const timer = setTimeout(() => {
      handleCalculate();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [discountRate, growthFactor, implementationSpeed, hardwareCostMultiplier, softwareCostMultiplier, developmentCostMultiplier]);
  
  const handleCalculate = async () => {
    setIsCalculating(true);
    try {
      const params = {
        discountRate: discountRate / 100,
        growthFactor: growthFactor / 100,
        implementationSpeed,
        hardwareCostMultiplier: hardwareCostMultiplier / 100,
        softwareCostMultiplier: softwareCostMultiplier / 100,
        developmentCostMultiplier: developmentCostMultiplier / 100,
      };
      
      const results = await calculateMutation.mutateAsync(params);
      setCalculationResults(results);
    } catch (error) {
      toast.error('Failed to calculate scenario');
      console.error(error);
    } finally {
      setIsCalculating(false);
    }
  };
  
  const handleValidateDeterminism = async () => {
    toast.info('Running 1000 validation tests...');
    try {
      const params = {
        discountRate: discountRate / 100,
        growthFactor: growthFactor / 100,
        implementationSpeed,
        hardwareCostMultiplier: hardwareCostMultiplier / 100,
        softwareCostMultiplier: softwareCostMultiplier / 100,
        developmentCostMultiplier: developmentCostMultiplier / 100,
      };
      
      const result = await validateMutation.mutateAsync(params);
      setIsDeterministic(result.isDeterministic);
      
      if (result.isDeterministic) {
        toast.success('✓ Calculations are 100% deterministic across 1000 iterations');
      } else {
        toast.error('✗ Calculations show variance - please report this issue');
      }
    } catch (error) {
      toast.error('Validation failed');
      console.error(error);
    }
  };
  
  const handleSave = async () => {
    if (!scenarioName.trim()) {
      toast.error('Please enter a scenario name');
      return;
    }
    
    if (!calculationResults) {
      toast.error('Please wait for calculations to complete');
      return;
    }
    
    try {
      const params = {
        discountRate: discountRate / 100,
        growthFactor: growthFactor / 100,
        implementationSpeed,
        hardwareCostMultiplier: hardwareCostMultiplier / 100,
        softwareCostMultiplier: softwareCostMultiplier / 100,
        developmentCostMultiplier: developmentCostMultiplier / 100,
      };
      
      const result = await createMutation.mutateAsync({
        name: scenarioName,
        description: scenarioDescription,
        params,
      });
      
      toast.success('Scenario saved successfully');
      if (onSave) {
        onSave(result.id);
      }
    } catch (error) {
      toast.error('Failed to save scenario');
      console.error(error);
    }
  };
  
  const handleReset = () => {
    setDiscountRate(10);
    setGrowthFactor(5);
    setImplementationSpeed(100);
    setHardwareCostMultiplier(100);
    setSoftwareCostMultiplier(100);
    setDevelopmentCostMultiplier(100);
    toast.info('Parameters reset to baseline');
  };
  
  // Calculate deltas from baseline
  const getDelta = (current: number, baseline: number) => {
    const delta = current - baseline;
    const percent = baseline !== 0 ? (delta / baseline) * 100 : 0;
    return { delta, percent };
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">Scenario Builder</h2>
          <p className="text-muted-foreground mt-1">
            Create custom financial scenarios with adjustable parameters
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button variant="outline" onClick={handleValidateDeterminism} disabled={validateMutation.isPending}>
            {validateMutation.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4 mr-2" />
            )}
            Validate
          </Button>
          <Button onClick={handleSave} disabled={createMutation.isPending || !calculationResults}>
            {createMutation.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Scenario
          </Button>
        </div>
      </div>
      
      {/* Determinism indicator */}
      {isDeterministic !== null && (
        <Card className={isDeterministic ? 'border-green-500' : 'border-red-500'}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              {isDeterministic ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="font-medium">Calculations are deterministic (1000/1000 tests passed)</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <span className="font-medium">Calculations show variance - please report this issue</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Parameter Controls */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Scenario Details</CardTitle>
              <CardDescription>Name and describe your scenario</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Scenario Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Conservative Estimate"
                  value={scenarioName}
                  onChange={(e) => setScenarioName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  placeholder="Brief description..."
                  value={scenarioDescription}
                  onChange={(e) => setScenarioDescription(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Financial Assumptions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Discount Rate</Label>
                  <span className="text-sm font-medium">{discountRate}%</span>
                </div>
                <Slider
                  value={[discountRate]}
                  onValueChange={([value]) => setDiscountRate(value)}
                  min={0}
                  max={30}
                  step={0.5}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Cost of capital for NPV calculations
                </p>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Growth Factor</Label>
                  <span className="text-sm font-medium">{growthFactor}%</span>
                </div>
                <Slider
                  value={[growthFactor]}
                  onValueChange={([value]) => setGrowthFactor(value)}
                  min={-10}
                  max={20}
                  step={0.5}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Annual benefit growth rate
                </p>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Implementation Speed</Label>
                  <span className="text-sm font-medium">{implementationSpeed}%</span>
                </div>
                <Slider
                  value={[implementationSpeed]}
                  onValueChange={([value]) => setImplementationSpeed(value)}
                  min={25}
                  max={100}
                  step={5}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Percentage of full benefit realization
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Cost Multipliers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Hardware Costs</Label>
                  <span className="text-sm font-medium">{hardwareCostMultiplier}%</span>
                </div>
                <Slider
                  value={[hardwareCostMultiplier]}
                  onValueChange={([value]) => setHardwareCostMultiplier(value)}
                  min={50}
                  max={200}
                  step={5}
                  className="w-full"
                />
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Software Costs</Label>
                  <span className="text-sm font-medium">{softwareCostMultiplier}%</span>
                </div>
                <Slider
                  value={[softwareCostMultiplier]}
                  onValueChange={([value]) => setSoftwareCostMultiplier(value)}
                  min={50}
                  max={200}
                  step={5}
                  className="w-full"
                />
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Development Costs</Label>
                  <span className="text-sm font-medium">{developmentCostMultiplier}%</span>
                </div>
                <Slider
                  value={[developmentCostMultiplier]}
                  onValueChange={([value]) => setDevelopmentCostMultiplier(value)}
                  min={50}
                  max={200}
                  step={5}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right: Results */}
        <div className="lg:col-span-2 space-y-6">
          {isCalculating && !calculationResults ? (
            <Card>
              <CardContent className="pt-6 flex items-center justify-center h-96">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
                  <p className="text-muted-foreground">Calculating scenario...</p>
                </div>
              </CardContent>
            </Card>
          ) : calculationResults ? (
            <>
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">Total Annual Value</p>
                        <p className="text-2xl font-bold mt-1">{formatCurrency(calculationResults.totalAnnualValue)}</p>
                        {baselineResults && (
                          <p className="text-sm mt-1">
                            <Badge variant={getDelta(calculationResults.totalAnnualValue, baselineResults.totalAnnualValue).delta >= 0 ? 'default' : 'destructive'}>
                              {getDelta(calculationResults.totalAnnualValue, baselineResults.totalAnnualValue).delta >= 0 ? '+' : ''}
                              {formatPercent(getDelta(calculationResults.totalAnnualValue, baselineResults.totalAnnualValue).percent / 100)}
                            </Badge>
                          </p>
                        )}
                      </div>
                      <TrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-green-700 dark:text-green-300 font-medium">5-Year NPV</p>
                        <p className="text-2xl font-bold mt-1">{formatCurrency(calculationResults.fiveYearNPV)}</p>
                        {baselineResults && (
                          <p className="text-sm mt-1">
                            <Badge variant={getDelta(calculationResults.fiveYearNPV, baselineResults.fiveYearNPV).delta >= 0 ? 'default' : 'destructive'}>
                              {getDelta(calculationResults.fiveYearNPV, baselineResults.fiveYearNPV).delta >= 0 ? '+' : ''}
                              {formatPercent(getDelta(calculationResults.fiveYearNPV, baselineResults.fiveYearNPV).percent / 100)}
                            </Badge>
                          </p>
                        )}
                      </div>
                      <DollarSign className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-purple-700 dark:text-purple-300 font-medium">ROI</p>
                        <p className="text-2xl font-bold mt-1">{formatPercent(calculationResults.roi / 100)}</p>
                        {baselineResults && (
                          <p className="text-sm mt-1">
                            <Badge variant={getDelta(calculationResults.roi, baselineResults.roi).delta >= 0 ? 'default' : 'destructive'}>
                              {getDelta(calculationResults.roi, baselineResults.roi).delta >= 0 ? '+' : ''}
                              {getDelta(calculationResults.roi, baselineResults.roi).delta.toFixed(1)}pp
                            </Badge>
                          </p>
                        )}
                      </div>
                      <Percent className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-orange-700 dark:text-orange-300 font-medium">Payback Period</p>
                        <p className="text-2xl font-bold mt-1">{calculationResults.paybackMonths} months</p>
                        {baselineResults && (
                          <p className="text-sm mt-1">
                            <Badge variant={getDelta(calculationResults.paybackMonths, baselineResults.paybackMonths).delta <= 0 ? 'default' : 'destructive'}>
                              {getDelta(calculationResults.paybackMonths, baselineResults.paybackMonths).delta >= 0 ? '+' : ''}
                              {getDelta(calculationResults.paybackMonths, baselineResults.paybackMonths).delta} months
                            </Badge>
                          </p>
                        )}
                      </div>
                      <Calendar className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Charts */}
              <Card>
                <CardHeader>
                  <CardTitle>5-Year Financial Projection</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={calculationResults.yearlyBreakdown}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" label={{ value: 'Year', position: 'insideBottom', offset: -5 }} />
                      <YAxis label={{ value: 'Amount ($M)', angle: -90, position: 'insideLeft' }} tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      <Legend />
                      <Bar dataKey="benefits" fill="#10b981" name="Benefits" />
                      <Bar dataKey="costs" fill="#ef4444" name="Costs" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Cumulative Cash Flow</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={calculationResults.yearlyBreakdown}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" label={{ value: 'Year', position: 'insideBottom', offset: -5 }} />
                      <YAxis label={{ value: 'Amount ($M)', angle: -90, position: 'insideLeft' }} tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      <Legend />
                      <Line type="monotone" dataKey="cumulativeCashFlow" stroke="#3b82f6" strokeWidth={3} name="Cumulative Cash Flow" />
                      <Line type="monotone" dataKey="discountedCashFlow" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="5 5" name="Discounted Cash Flow" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="pt-6 flex items-center justify-center h-96">
                <div className="text-center">
                  <Zap className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Adjust parameters to see results</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
