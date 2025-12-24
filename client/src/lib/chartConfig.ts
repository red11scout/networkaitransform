// Enhanced chart colors and configuration for better readability

export const chartColors = {
  primary: '#2563eb',      // Blue
  secondary: '#7c3aed',    // Purple
  success: '#10b981',      // Green
  warning: '#f59e0b',      // Amber
  danger: '#ef4444',       // Red
  info: '#06b6d4',         // Cyan
  accent: '#ec4899',       // Pink
  chart1: '#3b82f6',       // Bright Blue
  chart2: '#8b5cf6',       // Bright Purple
  chart3: '#10b981',       // Emerald
  chart4: '#f59e0b',       // Amber
  chart5: '#ef4444',       // Red
  chart6: '#06b6d4',       // Cyan
  chart7: '#ec4899',       // Pink
  chart8: '#14b8a6',       // Teal
};

export const horizonColors = {
  'Horizon 1': '#10b981',  // Green - Immediate wins
  'Horizon 2': '#3b82f6',  // Blue - Workforce augmentation
  'Horizon 3': '#8b5cf6',  // Purple - Strategic transformation
  'Foundational': '#f59e0b' // Amber - Enablers
};

export const chartConfig = {
  style: {
    fontSize: 14,
    fontFamily: "'IBM Plex Sans', 'Inter', sans-serif",
    fontWeight: 500
  },
  tooltip: {
    contentStyle: {
      backgroundColor: 'hsl(var(--card))',
      border: '1px solid hsl(var(--border))',
      borderRadius: '8px',
      padding: '12px',
      fontSize: '14px',
      fontWeight: 500,
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
    },
    labelStyle: {
      fontWeight: 600,
      marginBottom: '4px'
    }
  },
  cartesianGrid: {
    strokeDasharray: '3 3',
    stroke: 'hsl(var(--border))',
    opacity: 0.5
  },
  axis: {
    tick: {
      fontSize: 13,
      fontWeight: 500,
      fill: 'hsl(var(--muted-foreground))'
    },
    label: {
      fontSize: 14,
      fontWeight: 600,
      fill: 'hsl(var(--foreground))'
    }
  }
};

export const getHorizonColor = (horizon: string): string => {
  if (horizon.includes('Horizon 1')) return horizonColors['Horizon 1'];
  if (horizon.includes('Horizon 2')) return horizonColors['Horizon 2'];
  if (horizon.includes('Horizon 3')) return horizonColors['Horizon 3'];
  if (horizon.includes('Foundational')) return horizonColors['Foundational'];
  return chartColors.primary;
};

export const valueDriverColors = {
  'Revenue Growth': chartColors.success,
  'Cost Reduction': chartColors.info,
  'Risk Mitigation': chartColors.warning,
  'Cash Flow': chartColors.primary
};
