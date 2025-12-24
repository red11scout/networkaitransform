import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { useFilters } from '@/contexts/FilterContext';
import { Search, Filter, X } from 'lucide-react';
import { formatMillions } from '@/lib/utils';

export default function FilterPanel() {
  const { filters, setSearchQuery, setSelectedHorizons, setValueRange, setSelectedDrivers, resetFilters } = useFilters();

  const horizonOptions = [
    { value: 'H1', label: 'Horizon 1: Immediate Wins' },
    { value: 'H2', label: 'Horizon 2: Workforce Augmentation' },
    { value: 'H3', label: 'Horizon 3: Strategic Transformation' },
    { value: 'Enabler', label: 'Foundational Enablers' }
  ];

  const driverOptions = [
    { value: 'revenue', label: 'Revenue Growth' },
    { value: 'cost', label: 'Cost Reduction' },
    { value: 'risk', label: 'Risk Mitigation' },
    { value: 'cashflow', label: 'Cash Flow Improvement' }
  ];

  const handleHorizonToggle = (horizon: string) => {
    const newHorizons = filters.selectedHorizons.includes(horizon)
      ? filters.selectedHorizons.filter(h => h !== horizon)
      : [...filters.selectedHorizons, horizon];
    setSelectedHorizons(newHorizons);
  };

  const handleDriverToggle = (driver: string) => {
    const newDrivers = filters.selectedDrivers.includes(driver)
      ? filters.selectedDrivers.filter(d => d !== driver)
      : [...filters.selectedDrivers, driver];
    setSelectedDrivers(newDrivers);
  };

  const hasActiveFilters = 
    filters.searchQuery !== '' ||
    filters.selectedHorizons.length > 0 ||
    filters.valueRange[0] !== 0 ||
    filters.valueRange[1] !== 20 ||
    filters.selectedDrivers.length > 0;

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            <CardTitle>Filter & Search</CardTitle>
          </div>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={resetFilters}>
              <X className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>
        <CardDescription>
          Narrow down use cases by search, horizon, value range, or business driver
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search Use Cases
          </Label>
          <Input
            id="search"
            placeholder="Search by name, description, or keywords..."
            value={filters.searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
          {filters.searchQuery && (
            <p className="text-xs text-muted-foreground">
              Searching for: <strong>{filters.searchQuery}</strong>
            </p>
          )}
        </div>

        {/* Horizon Filter */}
        <div className="space-y-3">
          <Label>Implementation Horizon</Label>
          <div className="space-y-2">
            {horizonOptions.map(option => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`horizon-${option.value}`}
                  checked={filters.selectedHorizons.includes(option.value)}
                  onCheckedChange={() => handleHorizonToggle(option.value)}
                />
                <label
                  htmlFor={`horizon-${option.value}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
          {filters.selectedHorizons.length > 0 && (
            <p className="text-xs text-muted-foreground">
              {filters.selectedHorizons.length} horizon{filters.selectedHorizons.length > 1 ? 's' : ''} selected
            </p>
          )}
        </div>

        {/* Value Range Filter */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Annual Value Range</Label>
            <span className="text-sm font-semibold">
              {formatMillions(filters.valueRange[0] * 1000000)} - {formatMillions(filters.valueRange[1] * 1000000)}
            </span>
          </div>
          <Slider
            min={0}
            max={20}
            step={0.5}
            value={filters.valueRange}
            onValueChange={(value) => setValueRange(value as [number, number])}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>$0M</span>
            <span>$20M</span>
          </div>
        </div>

        {/* Business Driver Filter */}
        <div className="space-y-3">
          <Label>Business Drivers</Label>
          <div className="space-y-2">
            {driverOptions.map(option => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`driver-${option.value}`}
                  checked={filters.selectedDrivers.includes(option.value)}
                  onCheckedChange={() => handleDriverToggle(option.value)}
                />
                <label
                  htmlFor={`driver-${option.value}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
          {filters.selectedDrivers.length > 0 && (
            <p className="text-xs text-muted-foreground">
              {filters.selectedDrivers.length} driver{filters.selectedDrivers.length > 1 ? 's' : ''} selected
            </p>
          )}
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="pt-4 border-t">
            <div className="text-sm font-semibold mb-2">Active Filters:</div>
            <div className="flex flex-wrap gap-2">
              {filters.searchQuery && (
                <div className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                  Search: {filters.searchQuery}
                </div>
              )}
              {filters.selectedHorizons.map(h => (
                <div key={h} className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                  {h}
                </div>
              ))}
              {(filters.valueRange[0] !== 0 || filters.valueRange[1] !== 20) && (
                <div className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                  Value: {formatMillions(filters.valueRange[0] * 1000000)} - {formatMillions(filters.valueRange[1] * 1000000)}
                </div>
              )}
              {filters.selectedDrivers.map(d => (
                <div key={d} className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                  {driverOptions.find(opt => opt.value === d)?.label}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
