import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatMillions(value: number, decimals: number = 2): string {
  return `$${(value / 1000000).toFixed(decimals)}M`;
}

export function formatPercent(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatNumber(value: number, decimals: number = 0): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function getHorizonColor(horizon: string): string {
  switch (horizon) {
    case 'H1':
      return 'hsl(var(--chart-1))';
    case 'H2':
      return 'hsl(var(--chart-2))';
    case 'H3':
      return 'hsl(var(--chart-3))';
    case 'Enabler':
      return 'hsl(var(--chart-4))';
    default:
      return 'hsl(var(--chart-5))';
  }
}

export function getHorizonLabel(horizon: string): string {
  switch (horizon) {
    case 'H1':
      return 'Horizon 1: Immediate Wins';
    case 'H2':
      return 'Horizon 2: Workforce Augmentation';
    case 'H3':
      return 'Horizon 3: Strategic Transformation';
    case 'Enabler':
      return 'Foundational Enablers';
    default:
      return horizon;
  }
}
