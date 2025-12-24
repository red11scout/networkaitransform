import { useMemo } from 'react';
import { useCases } from '@/lib/useCasesData';
import { useFilters } from '@/contexts/FilterContext';

export function useFilteredUseCases() {
  const { filters } = useFilters();

  const filteredUseCases = useMemo(() => {
    let filtered = [...useCases];

    // Apply search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(uc =>
        uc.name.toLowerCase().includes(query) ||
        uc.description.toLowerCase().includes(query) ||
        uc.horizon.toLowerCase().includes(query)
      );
    }

    // Apply horizon filter
    if (filters.selectedHorizons.length > 0) {
      filtered = filtered.filter(uc =>
        filters.selectedHorizons.some(h => uc.horizon.includes(h))
      );
    }

    // Apply value range filter
    const minValue = filters.valueRange[0] * 1000000;
    const maxValue = filters.valueRange[1] * 1000000;
    filtered = filtered.filter(uc =>
      uc.annualValue >= minValue && uc.annualValue <= maxValue
    );

    // Apply business driver filter
    if (filters.selectedDrivers.length > 0) {
      filtered = filtered.filter(uc => {
        const hasRevenue = filters.selectedDrivers.includes('revenue') && uc.businessDrivers.revenue > 0;
        const hasCost = filters.selectedDrivers.includes('cost') && uc.businessDrivers.cost > 0;
        const hasRisk = filters.selectedDrivers.includes('risk') && uc.businessDrivers.risk > 0;
        const hasCashFlow = filters.selectedDrivers.includes('cashflow') && uc.businessDrivers.cashFlow > 0;
        return hasRevenue || hasCost || hasRisk || hasCashFlow;
      });
    }

    return filtered;
  }, [filters]);

  return {
    filteredUseCases,
    totalCount: useCases.length,
    filteredCount: filteredUseCases.length,
    isFiltered: filteredUseCases.length < useCases.length
  };
}
