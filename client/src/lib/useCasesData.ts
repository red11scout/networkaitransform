export interface UseCase {
  id: number;
  name: string;
  horizon: 'H1' | 'H2' | 'H3' | 'Enabler';
  annualValue: number;
  ttv: number;
  effort: number;
  probability: number;
  priorityScore: number;
  rank: number;
  primaryKPI: string;
  baseline: string;
  target: string;
  improvement: string;
  improvementDirection: 'increase' | 'decrease';
  monthlyTransactions: number;
  monthlyTokens: number;
  annualTokenCost: number;
  developmentCost: number;
  maintenanceCost5Year: number;
  businessDrivers: {
    revenue: number;
    cost: number;
    cashFlow: number;
    risk: number;
  };
  description: string;
  complexity: 'Simple' | 'Medium' | 'Complex' | 'Very Complex';
  timeline: string;
}

export const useCases: UseCase[] = [
  {
    id: 1,
    name: 'Autonomous Network Testing',
    horizon: 'H1',
    annualValue: 3000000,
    ttv: 2,
    effort: 3,
    probability: 0.86,
    priorityScore: 77.4,
    rank: 1,
    primaryKPI: 'Labor Hours per Window',
    baseline: '4.0 hrs',
    target: '0.8 hrs',
    improvement: '80%',
    improvementDirection: 'decrease',
    monthlyTransactions: 2083,
    monthlyTokens: 5830000,
    annualTokenCost: 1050,
    developmentCost: 220000,
    maintenanceCost5Year: 182710,
    businessDrivers: {
      revenue: 0,
      cost: 2625000,
      cashFlow: 0,
      risk: 375000
    },
    description: 'Automates network testing during maintenance windows using AI agents',
    complexity: 'Medium',
    timeline: '3 months'
  },
  {
    id: 2,
    name: 'Real-Time Anomaly Detection',
    horizon: 'H1',
    annualValue: 1000000,
    ttv: 2,
    effort: 3,
    probability: 0.87,
    priorityScore: 58.5,
    rank: 5,
    primaryKPI: 'Mean Time to Detect',
    baseline: '4.0 hrs',
    target: '0.25 hrs',
    improvement: '94%',
    improvementDirection: 'decrease',
    monthlyTransactions: 8760,
    monthlyTokens: 15330000,
    annualTokenCost: 2295,
    developmentCost: 190000,
    maintenanceCost5Year: 157795,
    businessDrivers: {
      revenue: 150000,
      cost: 700000,
      cashFlow: 0,
      risk: 150000
    },
    description: 'Real-time monitoring and detection of network anomalies using ML models',
    complexity: 'Medium',
    timeline: '3 months'
  },
  {
    id: 3,
    name: 'Post-Maintenance Documentation',
    horizon: 'H1',
    annualValue: 500000,
    ttv: 1.5,
    effort: 2,
    probability: 0.88,
    priorityScore: 56.7,
    rank: 7,
    primaryKPI: 'Documentation Time',
    baseline: '2.5 hrs',
    target: '0.25 hrs',
    improvement: '90%',
    improvementDirection: 'decrease',
    monthlyTransactions: 2083,
    monthlyTokens: 9170000,
    annualTokenCost: 1513,
    developmentCost: 85000,
    maintenanceCost5Year: 70593,
    businessDrivers: {
      revenue: 0,
      cost: 400000,
      cashFlow: 0,
      risk: 100000
    },
    description: 'Automated generation of post-maintenance documentation using LLMs',
    complexity: 'Simple',
    timeline: '2 months'
  },
  {
    id: 4,
    name: 'Maintenance Window Planning',
    horizon: 'H1',
    annualValue: 350000,
    ttv: 2,
    effort: 3,
    probability: 0.81,
    priorityScore: 50.4,
    rank: 9,
    primaryKPI: 'Customer-Impacting Events',
    baseline: '1,200/yr',
    target: '780/yr',
    improvement: '35%',
    improvementDirection: 'decrease',
    monthlyTransactions: 100,
    monthlyTokens: 700000,
    annualTokenCost: 140,
    developmentCost: 165000,
    maintenanceCost5Year: 137033,
    businessDrivers: {
      revenue: 300000,
      cost: 0,
      cashFlow: 0,
      risk: 50000
    },
    description: 'AI-powered optimization of maintenance window scheduling',
    complexity: 'Medium',
    timeline: '3 months'
  },
  {
    id: 5,
    name: 'GPU Infrastructure Foundation',
    horizon: 'H1',
    annualValue: -50000,
    ttv: 2,
    effort: 3,
    probability: 0.91,
    priorityScore: 44.3,
    rank: 11,
    primaryKPI: 'Infrastructure Availability',
    baseline: 'N/A',
    target: '99.5%',
    improvement: 'New',
    improvementDirection: 'increase',
    monthlyTransactions: 0,
    monthlyTokens: 0,
    annualTokenCost: 0,
    developmentCost: 350000,
    maintenanceCost5Year: 290675,
    businessDrivers: {
      revenue: 0,
      cost: -50000,
      cashFlow: 0,
      risk: 0
    },
    description: 'On-premises GPU infrastructure to support all AI use cases',
    complexity: 'Medium',
    timeline: '2 months'
  },
  {
    id: 6,
    name: 'Tribal Knowledge RAG System',
    horizon: 'H2',
    annualValue: 2500000,
    ttv: 9,
    effort: 4,
    probability: 0.76,
    priorityScore: 57.0,
    rank: 6,
    primaryKPI: 'Knowledge Retrieval Time',
    baseline: '3.0 hrs',
    target: '0.1 hrs',
    improvement: '97%',
    improvementDirection: 'decrease',
    monthlyTransactions: 958,
    monthlyTokens: 3830000,
    annualTokenCost: 575,
    developmentCost: 500000,
    maintenanceCost5Year: 315250,
    businessDrivers: {
      revenue: 0,
      cost: 1750000,
      cashFlow: 0,
      risk: 750000
    },
    description: 'RAG system to capture and retrieve institutional knowledge from retiring experts',
    complexity: 'Complex',
    timeline: '9 months'
  },
  {
    id: 7,
    name: 'Intelligent Incident Triage',
    horizon: 'H2',
    annualValue: 1500000,
    ttv: 8,
    effort: 4,
    probability: 0.78,
    priorityScore: 44.9,
    rank: 10,
    primaryKPI: 'Mean Time to Route',
    baseline: '1.5 hrs',
    target: '0.25 hrs',
    improvement: '83%',
    improvementDirection: 'decrease',
    monthlyTransactions: 729,
    monthlyTokens: 2480000,
    annualTokenCost: 413,
    developmentCost: 415000,
    maintenanceCost5Year: 261658,
    businessDrivers: {
      revenue: 0,
      cost: 1050000,
      cashFlow: 0,
      risk: 450000
    },
    description: 'AI-powered incident classification and routing system',
    complexity: 'Complex',
    timeline: '8 months'
  },
  {
    id: 8,
    name: 'Secure Data Federation Layer',
    horizon: 'H2',
    annualValue: 1350000,
    ttv: 8,
    effort: 4,
    probability: 0.73,
    priorityScore: 42.3,
    rank: 12,
    primaryKPI: 'Data Access Time',
    baseline: '120 min',
    target: '5 min',
    improvement: '96%',
    improvementDirection: 'decrease',
    monthlyTransactions: 0,
    monthlyTokens: 0,
    annualTokenCost: 0,
    developmentCost: 450000,
    maintenanceCost5Year: 283725,
    businessDrivers: {
      revenue: 0,
      cost: 950000,
      cashFlow: 150000,
      risk: 250000
    },
    description: 'Unified data access layer across multiple network systems',
    complexity: 'Complex',
    timeline: '8 months'
  },
  {
    id: 9,
    name: 'Legacy-to-Modern Translation',
    horizon: 'H2',
    annualValue: 850000,
    ttv: 10,
    effort: 4,
    probability: 0.72,
    priorityScore: 32.7,
    rank: 14,
    primaryKPI: 'Context Switch Time',
    baseline: '2.0 hrs',
    target: '0.2 hrs',
    improvement: '90%',
    improvementDirection: 'decrease',
    monthlyTransactions: 500,
    monthlyTokens: 1400000,
    annualTokenCost: 231,
    developmentCost: 410000,
    maintenanceCost5Year: 168100,
    businessDrivers: {
      revenue: 0,
      cost: 700000,
      cashFlow: 0,
      risk: 150000
    },
    description: 'AI translation between legacy and modern network protocols',
    complexity: 'Complex',
    timeline: '10 months'
  },
  {
    id: 10,
    name: 'Cross-Network Testing',
    horizon: 'H2',
    annualValue: 800000,
    ttv: 9,
    effort: 4,
    probability: 0.77,
    priorityScore: 37.1,
    rank: 13,
    primaryKPI: 'Network Coverage',
    baseline: '40%',
    target: '95%',
    improvement: '138%',
    improvementDirection: 'increase',
    monthlyTransactions: 208,
    monthlyTokens: 1250000,
    annualTokenCost: 244,
    developmentCost: 230000,
    maintenanceCost5Year: 145015,
    businessDrivers: {
      revenue: 0,
      cost: 650000,
      cashFlow: 0,
      risk: 150000
    },
    description: 'Automated testing across multiple network types and vendors',
    complexity: 'Medium',
    timeline: '9 months'
  },
  {
    id: 11,
    name: 'Predictive Maintenance',
    horizon: 'H3',
    annualValue: 1500000,
    ttv: 15,
    effort: 4,
    probability: 0.75,
    priorityScore: 34.8,
    rank: 13,
    primaryKPI: 'Mean Time Between Failures',
    baseline: '2,920 hrs',
    target: '5,840 hrs',
    improvement: '100%',
    improvementDirection: 'increase',
    monthlyTransactions: 25,
    monthlyTokens: 360000,
    annualTokenCost: 78,
    developmentCost: 600000,
    maintenanceCost5Year: 246000,
    businessDrivers: {
      revenue: 300000,
      cost: 700000,
      cashFlow: 0,
      risk: 500000
    },
    description: 'Predictive analytics to prevent network failures before they occur',
    complexity: 'Complex',
    timeline: '15 months'
  },
  {
    id: 12,
    name: 'Cross-Network Semantic Unification',
    horizon: 'H3',
    annualValue: 1250000,
    ttv: 18,
    effort: 5,
    probability: 0.63,
    priorityScore: 25.5,
    rank: 15,
    primaryKPI: 'Development Time per Use Case',
    baseline: '8.0 mo',
    target: '2.0 mo',
    improvement: '75%',
    improvementDirection: 'decrease',
    monthlyTransactions: 0,
    monthlyTokens: 0,
    annualTokenCost: 0,
    developmentCost: 710000,
    maintenanceCost5Year: 291100,
    businessDrivers: {
      revenue: 0,
      cost: 1000000,
      cashFlow: 0,
      risk: 250000
    },
    description: 'Unified semantic layer for cross-network AI development',
    complexity: 'Very Complex',
    timeline: '18 months'
  },
  {
    id: 13,
    name: 'AI Model Governance Pipeline',
    horizon: 'Enabler',
    annualValue: 450000,
    ttv: 6,
    effort: 4,
    probability: 0.82,
    priorityScore: 42.1,
    rank: 12,
    primaryKPI: 'Model Approval Time',
    baseline: '120 days',
    target: '48 days',
    improvement: '60%',
    improvementDirection: 'decrease',
    monthlyTransactions: 50,
    monthlyTokens: 380000,
    annualTokenCost: 75,
    developmentCost: 375000,
    maintenanceCost5Year: 236438,
    businessDrivers: {
      revenue: 0,
      cost: 350000,
      cashFlow: 0,
      risk: 100000
    },
    description: 'Governance framework for AI model development and deployment',
    complexity: 'Medium',
    timeline: '6 months'
  },
  {
    id: 14,
    name: 'Golden Config Drift Detection',
    horizon: 'Enabler',
    annualValue: 700000,
    ttv: 4,
    effort: 3,
    probability: 0.80,
    priorityScore: 50.2,
    rank: 8,
    primaryKPI: 'Drift Detection Time',
    baseline: '48 hrs',
    target: '1 hr',
    improvement: '98%',
    improvementDirection: 'decrease',
    monthlyTransactions: 365,
    monthlyTokens: 1530000,
    annualTokenCost: 253,
    developmentCost: 175000,
    maintenanceCost5Year: 145338,
    businessDrivers: {
      revenue: 0,
      cost: 500000,
      cashFlow: 0,
      risk: 200000
    },
    description: 'Real-time detection of configuration drift from golden standards',
    complexity: 'Medium',
    timeline: '4 months'
  }
];

export const financialMetrics = {
  totalAnnualValue: 15700000,
  fiveYearBenefits: 60450000,
  fiveYearInvestment: 11023500,
  npv: 34870000,
  irr: 1.87,
  paybackPeriod: 11,
  roi: 4.483
};

export const horizonSummaries = [
  {
    horizon: 'H1',
    name: 'Immediate Wins',
    useCaseCount: 5,
    annualValue: 4800000,
    totalRevenue: 450000,
    totalCostReduction: 3675000,
    totalRiskValue: 675000,
    avgTTV: 1.9,
    avgEffort: 2.8,
    avgProbability: 0.866,
    timeframe: 'Months 1-3'
  },
  {
    horizon: 'H2',
    name: 'Workforce Augmentation',
    useCaseCount: 5,
    annualValue: 7000000,
    totalRevenue: 0,
    totalCostReduction: 5100000,
    totalRiskValue: 1750000,
    avgTTV: 8.8,
    avgEffort: 4.0,
    avgProbability: 0.752,
    timeframe: 'Months 6-18'
  },
  {
    horizon: 'H3',
    name: 'Strategic Transformation',
    useCaseCount: 2,
    annualValue: 2750000,
    totalRevenue: 300000,
    totalCostReduction: 1700000,
    totalRiskValue: 750000,
    avgTTV: 16.5,
    avgEffort: 4.5,
    avgProbability: 0.690,
    timeframe: 'Months 18+'
  },
  {
    horizon: 'Enabler',
    name: 'Foundational Enablers',
    useCaseCount: 2,
    annualValue: 1150000,
    totalRevenue: 0,
    totalCostReduction: 850000,
    totalRiskValue: 300000,
    avgTTV: 5.0,
    avgEffort: 3.5,
    avgProbability: 0.810,
    timeframe: 'Ongoing'
  }
];
