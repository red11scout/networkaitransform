import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, decimals: number = 0): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatMillions(value: number, decimals: number = 0): string {
  return `$${(value / 1000000).toFixed(decimals)}M`;
}

export function formatPercent(value: number, decimals: number = 0): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatNumber(value: number, decimals: number = 0): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function getHorizonColor(horizon: string): string {
  // Vibrant colors for better chart readability
  if (horizon.includes('Horizon 1') || horizon === 'H1') return '#10b981'; // Emerald
  if (horizon.includes('Horizon 2') || horizon === 'H2') return '#3b82f6'; // Blue
  if (horizon.includes('Horizon 3') || horizon === 'H3') return '#8b5cf6'; // Purple
  if (horizon.includes('Foundational') || horizon === 'Enabler') return '#f59e0b'; // Amber
  return '#6366f1'; // Indigo default
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
