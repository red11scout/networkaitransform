import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  problemSolutionMappings, 
  problemCategories, 
  getProblemsByCategory, 
  getProblemsByHorizon,
  type ProblemSolutionMapping 
} from '@/lib/problemSolutionData';
import { formatMillions, getHorizonColor } from '@/lib/utils';
import { 
  AlertCircle, 
  Target, 
  Lightbulb, 
  TrendingUp, 
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Shield,
  Zap,
  Users,
  Wrench
} from 'lucide-react';
import { KPIBreakdownDialog } from '@/components/KPIBreakdownDialog';

const categoryIcons: Record<string, any> = {
  operational: Zap,
  customer: Users,
  technical: Wrench,
  strategic: Target
};

export default function ProblemSolutionOverview() {
  const [selectedHorizon, setSelectedHorizon] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'category' | 'horizon'>('category');

  // Filter mappings
  let filteredMappings = problemSolutionMappings;
  if (selectedHorizon !== 'all') {
    filteredMappings = filteredMappings.filter(m => m.horizon === selectedHorizon);
  }
  if (selectedCategory !== 'all') {
    filteredMappings = filteredMappings.filter(m => m.problemCategory === selectedCategory);
  }

  // Calculate aggregate metrics
  const totalProblems = filteredMappings.length;
  const categoriesCount = new Set(filteredMappings.map(m => m.problemCategory)).size;
  const horizonsCount = new Set(filteredMappings.map(m => m.horizon)).size;

  return (
    <div className="space-y-8">
      {/* Executive Summary */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" />
                <CardTitle className="text-3xl font-bold">AI Transformation Problem-Solution Framework</CardTitle>
              </div>
              <CardDescription className="text-base max-w-4xl">
                A comprehensive analysis of BlueAlly's operational challenges, strategic AI solutions, and quantified business improvements across 14 transformative initiatives spanning immediate wins to long-term strategic innovation.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 rounded-xl p-6 border border-emerald-500/20">
              <div className="flex items-center gap-2 md:gap-3 mb-2">
                <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-bold text-emerald-600 dark:text-emerald-400">14</div>
                  <div className="text-sm text-muted-foreground">Critical Problems</div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Identified across operations, customer experience, technical infrastructure, and strategic innovation
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-xl p-6 border border-blue-500/20">
              <div className="flex items-center gap-2 md:gap-3 mb-2">
                <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">14</div>
                  <div className="text-sm text-muted-foreground">AI Solutions</div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Leveraging NLP, ML, computer vision, and predictive analytics for transformation
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-xl p-6 border border-purple-500/20">
              <div className="flex items-center gap-2 md:gap-3 mb-2">
                <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-bold text-purple-600 dark:text-purple-400">$15.7M</div>
                  <div className="text-sm text-muted-foreground">Annual Value</div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Combined annual business value across all transformation initiatives
              </p>
            </div>

            <KPIBreakdownDialog>
              <div className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 rounded-xl p-6 border border-amber-500/20 cursor-pointer hover:border-amber-500/40 transition-all hover:shadow-lg">
                <div className="flex items-center gap-2 md:gap-3 mb-2">
                  <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <div className="text-2xl md:text-3xl font-bold text-amber-600 dark:text-amber-400">14</div>
                    <div className="text-sm text-muted-foreground">KPI Improvements</div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Primary KPI for each initiative with baseline, target, and timeframe
                </p>
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-2 font-medium">
                  Click to view breakdown →
                </p>
              </div>
            </KPIBreakdownDialog>
          </div>

          {/* Strategic Context */}
          <div className="mt-6 p-6 bg-muted/30 rounded-xl border border-border/50">
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Strategic Context
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This framework addresses BlueAlly's most pressing operational and strategic challenges through targeted AI interventions. Each solution is designed to deliver measurable business impact while building foundational capabilities for sustained competitive advantage. The initiatives span from immediate operational wins (Horizon 1) through workforce augmentation (Horizon 2) to transformative strategic capabilities (Horizon 3), supported by essential governance and organizational enablers.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Filters and View Controls */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Explore Problems & Solutions</CardTitle>
              <CardDescription>
                {totalProblems} initiatives across {categoriesCount} problem categories and {horizonsCount} implementation horizons
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-3">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="operational">Operational Efficiency</SelectItem>
                  <SelectItem value="customer">Customer Experience</SelectItem>
                  <SelectItem value="technical">Technical Excellence</SelectItem>
                  <SelectItem value="strategic">Strategic Innovation</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedHorizon} onValueChange={setSelectedHorizon}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Horizons" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Horizons</SelectItem>
                  <SelectItem value="H1">Horizon 1 (0-12mo)</SelectItem>
                  <SelectItem value="H2">Horizon 2 (12-24mo)</SelectItem>
                  <SelectItem value="H3">Horizon 3 (24-36mo)</SelectItem>
                  <SelectItem value="Enabler">Enablers</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex gap-1 border rounded-lg p-1">
                <Button
                  size="sm"
                  variant={viewMode === 'category' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('category')}
                >
                  By Category
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === 'horizon' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('horizon')}
                >
                  By Horizon
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Problem-Solution Cards */}
      <div className="space-y-6">
        {filteredMappings.map((mapping) => (
          <ProblemSolutionCard key={mapping.id} mapping={mapping} />
        ))}
      </div>

      {filteredMappings.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No problem-solution mappings found matching your filters.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ProblemSolutionCard({ mapping }: { mapping: ProblemSolutionMapping }) {
  const [expanded, setExpanded] = useState(false);
  const CategoryIcon = categoryIcons[mapping.problemCategory];
  const categoryInfo = problemCategories[mapping.problemCategory as keyof typeof problemCategories];

  return (
    <Card className="border-l-4 hover:shadow-xl transition-all duration-300" style={{ borderLeftColor: getHorizonColor(mapping.horizon) }}>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge 
                variant="outline" 
                className="font-semibold"
                style={{ borderColor: getHorizonColor(mapping.horizon), color: getHorizonColor(mapping.horizon) }}
              >
                {mapping.horizon}
              </Badge>
              <Badge 
                variant="secondary"
                className="flex items-center gap-1"
                style={{ backgroundColor: `${categoryInfo.color}20`, color: categoryInfo.color, borderColor: `${categoryInfo.color}40` }}
              >
                <CategoryIcon className="h-3 w-3" />
                {categoryInfo.name}
              </Badge>
            </div>
            <CardTitle className="text-2xl">{mapping.useCaseName}</CardTitle>
            <CardDescription className="text-base">{categoryInfo.description}</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Show Less' : 'Show Details'}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Problem Statement */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-red-500/10 flex items-center justify-center">
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="font-semibold text-lg">The Problem</h3>
          </div>
          <p className="text-sm text-foreground leading-relaxed pl-10">
            {mapping.problemStatement}
          </p>
          <div className="pl-10 p-4 bg-red-500/5 border border-red-500/20 rounded-lg">
            <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-1">Business Impact:</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {mapping.businessImpact}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <ArrowRight className="h-6 w-6 text-primary animate-pulse" />
        </div>

        {/* AI Solution */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Lightbulb className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-lg">The AI Solution</h3>
          </div>
          <p className="text-sm text-foreground leading-relaxed pl-10">
            {mapping.aiSolution}
          </p>
          {expanded && (
            <div className="pl-10 p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg">
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">Technology Approach:</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {mapping.technologyApproach}
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center">
          <ArrowRight className="h-6 w-6 text-primary animate-pulse" />
        </div>

        {/* Expected Improvements */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="font-semibold text-lg">Expected Improvements</h3>
          </div>
          
          <div className="pl-10 grid grid-cols-1 md:grid-cols-3 gap-4">
            {mapping.expectedImprovements.map((improvement, idx) => (
              <div 
                key={idx} 
                className="p-4 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 rounded-lg space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    {improvement.metric}
                  </p>
                  <Badge variant="secondary" className="text-xs">
                    {improvement.timeframe}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Baseline:</span>
                    <span className="font-medium">{improvement.baseline}</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <ArrowRight className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Target:</span>
                    <span className="font-medium">{improvement.target}</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-emerald-500/20">
                  <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 text-center">
                    {improvement.improvement}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Business Value & Strategic Alignment */}
        {expanded && (
          <div className="pl-10 space-y-4">
            <div className="p-4 bg-purple-500/5 border border-purple-500/20 rounded-lg">
              <p className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-2">Business Value:</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {mapping.businessValue}
              </p>
            </div>

            <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-lg">
              <p className="text-sm font-medium text-amber-600 dark:text-amber-400 mb-2">Strategic Alignment:</p>
              <div className="flex flex-wrap gap-2">
                {mapping.strategicAlignment.map((alignment, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {alignment}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
