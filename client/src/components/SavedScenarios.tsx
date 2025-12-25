import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';
import { formatCurrency, formatPercent } from '@/lib/utils';
import { 
  Trash2, 
  GitCompare, 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  Percent,
  Loader2,
  FolderOpen
} from 'lucide-react';
import { format } from 'date-fns';

interface SavedScenariosProps {
  onCompare?: (scenarioIds: [number, number]) => void;
}

export default function SavedScenarios({ onCompare }: SavedScenariosProps) {
  const [selectedScenarios, setSelectedScenarios] = useState<number[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [scenarioToDelete, setScenarioToDelete] = useState<number | null>(null);
  
  const { data: scenarios, isLoading, refetch } = trpc.scenarios.list.useQuery();
  const deleteMutation = trpc.scenarios.delete.useMutation();
  
  const handleSelectScenario = (id: number) => {
    if (selectedScenarios.includes(id)) {
      setSelectedScenarios(selectedScenarios.filter(s => s !== id));
    } else if (selectedScenarios.length < 2) {
      setSelectedScenarios([...selectedScenarios, id]);
    } else {
      toast.error('You can only select 2 scenarios to compare');
    }
  };
  
  const handleCompare = () => {
    if (selectedScenarios.length === 2 && onCompare) {
      onCompare(selectedScenarios as [number, number]);
    }
  };
  
  const handleDelete = async () => {
    if (!scenarioToDelete) return;
    
    try {
      await deleteMutation.mutateAsync({ id: scenarioToDelete });
      toast.success('Scenario deleted successfully');
      refetch();
      setDeleteDialogOpen(false);
      setScenarioToDelete(null);
      setSelectedScenarios(selectedScenarios.filter(id => id !== scenarioToDelete));
    } catch (error) {
      toast.error('Failed to delete scenario');
      console.error(error);
    }
  };
  
  const openDeleteDialog = (id: number) => {
    setScenarioToDelete(id);
    setDeleteDialogOpen(true);
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 flex items-center justify-center h-96">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading scenarios...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!scenarios || scenarios.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 flex items-center justify-center h-96">
          <div className="text-center">
            <FolderOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">No saved scenarios</p>
            <p className="text-muted-foreground">Create your first scenario to get started</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">Saved Scenarios</h2>
          <p className="text-muted-foreground mt-1">
            Manage and compare your financial scenarios
          </p>
        </div>
        {selectedScenarios.length === 2 && (
          <Button onClick={handleCompare}>
            <GitCompare className="w-4 h-4 mr-2" />
            Compare Selected
          </Button>
        )}
      </div>
      
      {selectedScenarios.length > 0 && (
        <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <p className="text-sm font-medium">
              {selectedScenarios.length} scenario{selectedScenarios.length > 1 ? 's' : ''} selected
              {selectedScenarios.length === 2 && ' - Click "Compare Selected" to view side-by-side analysis'}
            </p>
          </CardContent>
        </Card>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {scenarios.map((scenario) => {
          const isSelected = selectedScenarios.includes(scenario.id);
          const totalAnnualValue = scenario.totalAnnualValue / 100;
          const fiveYearNPV = scenario.fiveYearNPV / 100;
          const roi = scenario.roi / 100;
          
          return (
            <Card 
              key={scenario.id} 
              className={`cursor-pointer transition-all ${isSelected ? 'ring-2 ring-primary' : ''}`}
              onClick={() => handleSelectScenario(scenario.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl">{scenario.name}</CardTitle>
                    {scenario.description && (
                      <CardDescription className="mt-1">{scenario.description}</CardDescription>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      openDeleteDialog(scenario.id);
                    }}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  {scenario.isBaseModel === 1 && (
                    <Badge variant="secondary">Base Model</Badge>
                  )}
                  <span className="text-xs text-muted-foreground">
                    Created {format(new Date(scenario.createdAt), 'MMM d, yyyy')}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <TrendingUp className="w-4 h-4" />
                      <span>Annual Value</span>
                    </div>
                    <p className="text-lg font-bold">{formatCurrency(totalAnnualValue)}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <DollarSign className="w-4 h-4" />
                      <span>5-Year NPV</span>
                    </div>
                    <p className="text-lg font-bold">{formatCurrency(fiveYearNPV)}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Percent className="w-4 h-4" />
                      <span>ROI</span>
                    </div>
                    <p className="text-lg font-bold">{formatPercent(roi / 100)}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>Payback</span>
                    </div>
                    <p className="text-lg font-bold">{scenario.paybackMonths} months</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">Discount Rate</span>
                    <p className="font-medium">{(scenario.discountRate / 100).toFixed(1)}%</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Growth</span>
                    <p className="font-medium">{(scenario.growthFactor / 100).toFixed(1)}%</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Speed</span>
                    <p className="font-medium">{scenario.implementationSpeed}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Scenario</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this scenario? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
