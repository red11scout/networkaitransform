import { createContext, useContext, useState, ReactNode } from 'react';
import { UseCase } from '@/lib/useCasesData';

interface ComparisonContextType {
  selectedUseCases: UseCase[];
  addUseCase: (useCase: UseCase) => void;
  removeUseCase: (useCaseId: number) => void;
  clearSelection: () => void;
  isSelected: (useCaseId: number) => boolean;
  canAddMore: boolean;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

const MAX_COMPARISON = 4;

export function ComparisonProvider({ children }: { children: ReactNode }) {
  const [selectedUseCases, setSelectedUseCases] = useState<UseCase[]>([]);

  const addUseCase = (useCase: UseCase) => {
    if (selectedUseCases.length < MAX_COMPARISON && !selectedUseCases.find(uc => uc.id === useCase.id)) {
      setSelectedUseCases(prev => [...prev, useCase]);
    }
  };

  const removeUseCase = (useCaseId: number) => {
    setSelectedUseCases(prev => prev.filter(uc => uc.id !== useCaseId));
  };

  const clearSelection = () => {
    setSelectedUseCases([]);
  };

  const isSelected = (useCaseId: number) => {
    return selectedUseCases.some(uc => uc.id === useCaseId);
  };

  const canAddMore = selectedUseCases.length < MAX_COMPARISON;

  return (
    <ComparisonContext.Provider
      value={{
        selectedUseCases,
        addUseCase,
        removeUseCase,
        clearSelection,
        isSelected,
        canAddMore
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison() {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error('useComparison must be used within ComparisonProvider');
  }
  return context;
}
