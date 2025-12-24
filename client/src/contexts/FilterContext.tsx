import { createContext, useContext, useState, ReactNode } from 'react';

export interface FilterState {
  searchQuery: string;
  selectedHorizons: string[];
  valueRange: [number, number];
  selectedDrivers: string[];
}

interface FilterContextType {
  filters: FilterState;
  setSearchQuery: (query: string) => void;
  setSelectedHorizons: (horizons: string[]) => void;
  setValueRange: (range: [number, number]) => void;
  setSelectedDrivers: (drivers: string[]) => void;
  resetFilters: () => void;
}

const defaultFilters: FilterState = {
  searchQuery: '',
  selectedHorizons: [],
  valueRange: [0, 20],
  selectedDrivers: []
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const setSearchQuery = (query: string) => {
    setFilters(prev => ({ ...prev, searchQuery: query }));
  };

  const setSelectedHorizons = (horizons: string[]) => {
    setFilters(prev => ({ ...prev, selectedHorizons: horizons }));
  };

  const setValueRange = (range: [number, number]) => {
    setFilters(prev => ({ ...prev, valueRange: range }));
  };

  const setSelectedDrivers = (drivers: string[]) => {
    setFilters(prev => ({ ...prev, selectedDrivers: drivers }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  return (
    <FilterContext.Provider
      value={{
        filters,
        setSearchQuery,
        setSelectedHorizons,
        setValueRange,
        setSelectedDrivers,
        resetFilters
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilters must be used within FilterProvider');
  }
  return context;
}
