import { useCases } from './useCasesData';

// Token consumption estimates per use case (monthly)
export const tokenConsumption = {
  'Network Incident Triage': {
    monthlyTokens: 15000000, // 15M tokens/month
    avgTokensPerRequest: 2500,
    requestsPerMonth: 6000,
    modelType: 'GPT-4',
    costPerMillionTokens: 30
  },
  'Customer Service Chatbot': {
    monthlyTokens: 50000000, // 50M tokens/month
    avgTokensPerRequest: 1500,
    requestsPerMonth: 33333,
    modelType: 'GPT-4',
    costPerMillionTokens: 30
  },
  'Network Log Analysis': {
    monthlyTokens: 25000000, // 25M tokens/month
    avgTokensPerRequest: 3000,
    requestsPerMonth: 8333,
    modelType: 'GPT-4',
    costPerMillionTokens: 30
  },
  'Autonomous Network Testing': {
    monthlyTokens: 20000000, // 20M tokens/month
    avgTokensPerRequest: 2000,
    requestsPerMonth: 10000,
    modelType: 'GPT-4',
    costPerMillionTokens: 30
  },
  'Predictive Network Maintenance': {
    monthlyTokens: 18000000, // 18M tokens/month
    avgTokensPerRequest: 2200,
    requestsPerMonth: 8182,
    modelType: 'GPT-4',
    costPerMillionTokens: 30
  },
  'Automated Documentation': {
    monthlyTokens: 12000000, // 12M tokens/month
    avgTokensPerRequest: 3500,
    requestsPerMonth: 3429,
    modelType: 'GPT-4',
    costPerMillionTokens: 30
  },
  'Sales Intelligence': {
    monthlyTokens: 22000000, // 22M tokens/month
    avgTokensPerRequest: 2800,
    requestsPerMonth: 7857,
    modelType: 'GPT-4',
    costPerMillionTokens: 30
  },
  'Churn Prediction': {
    monthlyTokens: 16000000, // 16M tokens/month
    avgTokensPerRequest: 1800,
    requestsPerMonth: 8889,
    modelType: 'GPT-4',
    costPerMillionTokens: 30
  },
  'Network Capacity Planning': {
    monthlyTokens: 14000000, // 14M tokens/month
    avgTokensPerRequest: 2400,
    requestsPerMonth: 5833,
    modelType: 'GPT-4',
    costPerMillionTokens: 30
  },
  'Fraud Detection': {
    monthlyTokens: 30000000, // 30M tokens/month
    avgTokensPerRequest: 1200,
    requestsPerMonth: 25000,
    modelType: 'GPT-4',
    costPerMillionTokens: 30
  },
  'Contract Analysis': {
    monthlyTokens: 10000000, // 10M tokens/month
    avgTokensPerRequest: 4000,
    requestsPerMonth: 2500,
    modelType: 'GPT-4',
    costPerMillionTokens: 30
  },
  'Sentiment Analysis': {
    monthlyTokens: 28000000, // 28M tokens/month
    avgTokensPerRequest: 1000,
    requestsPerMonth: 28000,
    modelType: 'GPT-3.5-Turbo',
    costPerMillionTokens: 2
  },
  'AI-Powered Analytics': {
    monthlyTokens: 24000000, // 24M tokens/month
    avgTokensPerRequest: 2600,
    requestsPerMonth: 9231,
    modelType: 'GPT-4',
    costPerMillionTokens: 30
  },
  'Personalized Marketing': {
    monthlyTokens: 35000000, // 35M tokens/month
    avgTokensPerRequest: 1400,
    requestsPerMonth: 25000,
    modelType: 'GPT-4',
    costPerMillionTokens: 30
  }
};

// Calculate total monthly tokens
export const totalMonthlyTokens = Object.values(tokenConsumption).reduce(
  (sum, uc) => sum + uc.monthlyTokens,
  0
);

// HPE Hardware Infrastructure Costs (On-Premises)
export const hpeInfrastructure = {
  servers: {
    name: 'HPE ProLiant DL380 Gen11',
    quantity: 8,
    unitCost: 15000,
    totalCost: 120000,
    specs: '2x Intel Xeon Scalable, 512GB RAM, 10TB Storage'
  },
  gpuServers: {
    name: 'HPE Apollo 6500 Gen10 Plus',
    quantity: 4,
    unitCost: 85000,
    totalCost: 340000,
    specs: '8x NVIDIA A100 GPUs per server'
  },
  storage: {
    name: 'HPE Nimble Storage dHCI',
    quantity: 2,
    unitCost: 120000,
    totalCost: 240000,
    specs: '500TB usable capacity, all-flash'
  },
  networking: {
    name: 'HPE Aruba CX 8400 Series',
    quantity: 4,
    unitCost: 45000,
    totalCost: 180000,
    specs: '100GbE switching infrastructure'
  },
  backup: {
    name: 'HPE StoreOnce 5650',
    quantity: 2,
    unitCost: 75000,
    totalCost: 150000,
    specs: 'Backup and disaster recovery'
  }
};

// NVIDIA GPU Infrastructure Costs
export const nvidiaInfrastructure = {
  a100_80gb: {
    name: 'NVIDIA A100 80GB PCIe',
    quantity: 32,
    unitCost: 15000,
    totalCost: 480000,
    performance: '312 TFLOPS (FP16)',
    memory: '80GB HBM2e'
  },
  h100: {
    name: 'NVIDIA H100 80GB PCIe',
    quantity: 16,
    unitCost: 30000,
    totalCost: 480000,
    performance: '756 TFLOPS (FP16)',
    memory: '80GB HBM3'
  },
  l40s: {
    name: 'NVIDIA L40S',
    quantity: 8,
    unitCost: 10000,
    totalCost: 80000,
    performance: '362 TFLOPS (FP16)',
    memory: '48GB GDDR6'
  },
  networking: {
    name: 'NVIDIA ConnectX-7 NICs',
    quantity: 16,
    unitCost: 2500,
    totalCost: 40000,
    specs: '400Gb/s InfiniBand/Ethernet'
  }
};

// Software and Licensing Costs (Annual)
export const softwareCosts = {
  mlOps: {
    name: 'MLOps Platform (Kubeflow/MLflow)',
    annualCost: 150000,
    description: 'Model training, deployment, monitoring'
  },
  dataScience: {
    name: 'Data Science Tools (Databricks)',
    annualCost: 200000,
    description: 'Unified analytics platform'
  },
  monitoring: {
    name: 'Monitoring & Observability',
    annualCost: 80000,
    description: 'Prometheus, Grafana, ELK Stack'
  },
  security: {
    name: 'AI Security & Governance',
    annualCost: 120000,
    description: 'Model security, data privacy'
  },
  llmPlatform: {
    name: 'LLM Inference Platform',
    annualCost: 180000,
    description: 'vLLM, TensorRT-LLM optimization'
  }
};

// Operational Costs (Annual)
export const operationalCosts = {
  power: {
    name: 'Power & Cooling',
    annualCost: 180000,
    description: '~200kW average consumption @ $0.12/kWh'
  },
  maintenance: {
    name: 'Hardware Maintenance',
    annualCost: 150000,
    description: '24/7 support contracts'
  },
  personnel: {
    name: 'AI/ML Engineering Team',
    annualCost: 1200000,
    description: '8 FTEs (engineers, data scientists)'
  },
  training: {
    name: 'Training & Development',
    annualCost: 80000,
    description: 'Certifications, conferences, courses'
  },
  cloudBurst: {
    name: 'Cloud Burst Capacity',
    annualCost: 240000,
    description: 'Peak demand overflow to cloud'
  }
};

// Development Costs (One-time)
export const developmentCosts = {
  initialDevelopment: {
    name: 'Initial Application Development',
    cost: 1500000,
    description: '14 use cases, 6-9 months development'
  },
  integration: {
    name: 'System Integration',
    cost: 400000,
    description: 'Legacy system integration, APIs'
  },
  dataPreparation: {
    name: 'Data Pipeline & Preparation',
    cost: 350000,
    description: 'ETL, data cleaning, feature engineering'
  },
  testing: {
    name: 'Testing & QA',
    cost: 250000,
    description: 'UAT, performance, security testing'
  },
  changeManagement: {
    name: 'Change Management',
    cost: 200000,
    description: 'Training, documentation, rollout'
  }
};

// Calculate totals
export const calculateInfrastructureCosts = () => {
  const hpeTotal = Object.values(hpeInfrastructure).reduce(
    (sum, item) => sum + item.totalCost,
    0
  );
  
  const nvidiaTotal = Object.values(nvidiaInfrastructure).reduce(
    (sum, item) => sum + item.totalCost,
    0
  );
  
  const softwareTotal = Object.values(softwareCosts).reduce(
    (sum, item) => sum + item.annualCost,
    0
  );
  
  const operationalTotal = Object.values(operationalCosts).reduce(
    (sum, item) => sum + item.annualCost,
    0
  );
  
  const developmentTotal = Object.values(developmentCosts).reduce(
    (sum, item) => sum + item.cost,
    0
  );
  
  return {
    hpeTotal,
    nvidiaTotal,
    totalHardware: hpeTotal + nvidiaTotal,
    softwareTotal,
    operationalTotal,
    developmentTotal,
    totalOneTime: hpeTotal + nvidiaTotal + developmentTotal,
    totalAnnualRecurring: softwareTotal + operationalTotal
  };
};

// Token cost calculations
export const calculateTokenCosts = () => {
  const monthlyCost = Object.values(tokenConsumption).reduce(
    (sum, uc) => sum + (uc.monthlyTokens / 1000000) * uc.costPerMillionTokens,
    0
  );
  
  return {
    monthlyTokenCost: monthlyCost,
    annualTokenCost: monthlyCost * 12,
    totalMonthlyTokens,
    avgCostPerMillionTokens: monthlyCost / (totalMonthlyTokens / 1000000)
  };
};

// 3-Year and 5-Year ROI Calculations
export const calculateROI = (years: 3 | 5) => {
  const costs = calculateInfrastructureCosts();
  const tokenCosts = calculateTokenCosts();
  
  // Annual benefits from all use cases
  const annualBenefits = useCases.reduce((sum, uc) => sum + uc.annualValue, 0);
  
  // Year 0: Initial investment
  const year0Investment = costs.totalOneTime;
  
  // Annual recurring costs
  const annualRecurring = costs.totalAnnualRecurring + tokenCosts.annualTokenCost;
  
  // Calculate year-by-year
  const yearlyData = [];
  let cumulativeCashFlow = -year0Investment;
  
  for (let year = 1; year <= years; year++) {
    // Benefits grow 5% annually due to optimization and scale
    const yearBenefits = annualBenefits * Math.pow(1.05, year - 1);
    
    // Costs decrease 3% annually due to efficiency improvements
    const yearCosts = annualRecurring * Math.pow(0.97, year - 1);
    
    const netCashFlow = yearBenefits - yearCosts;
    cumulativeCashFlow += netCashFlow;
    
    // Discounted cash flow (10% discount rate)
    const discountFactor = Math.pow(1.1, -year);
    const discountedCashFlow = netCashFlow * discountFactor;
    
    yearlyData.push({
      year,
      benefits: yearBenefits,
      costs: yearCosts,
      netCashFlow,
      cumulativeCashFlow,
      discountedCashFlow
    });
  }
  
  // Calculate NPV
  const npv = yearlyData.reduce((sum, y) => sum + y.discountedCashFlow, 0) - year0Investment;
  
  // Calculate ROI
  const totalBenefits = yearlyData.reduce((sum, y) => sum + y.benefits, 0);
  const totalCosts = year0Investment + yearlyData.reduce((sum, y) => sum + y.costs, 0);
  const roi = ((totalBenefits - totalCosts) / totalCosts) * 100;
  
  // Calculate payback period
  let paybackPeriod = 0;
  let cumulativeNet = -year0Investment;
  for (const yearData of yearlyData) {
    cumulativeNet += yearData.netCashFlow;
    paybackPeriod += 1;
    if (cumulativeNet >= 0) break;
  }
  
  return {
    years,
    initialInvestment: year0Investment,
    totalBenefits,
    totalCosts,
    netProfit: totalBenefits - totalCosts,
    roi,
    npv,
    paybackPeriod: paybackPeriod + (paybackPeriod < years ? 0 : 0),
    yearlyData,
    annualRecurring
  };
};

// Cost breakdown by use case
export const useCaseCostBreakdown = useCases.map(uc => {
  const tokenData = tokenConsumption[uc.name as keyof typeof tokenConsumption];
  const monthlyTokenCost = tokenData 
    ? (tokenData.monthlyTokens / 1000000) * tokenData.costPerMillionTokens 
    : 0;
  
  const tokenPercentage = tokenData ? (tokenData.monthlyTokens / totalMonthlyTokens) * 100 : 0;
  
  // Allocate infrastructure costs proportionally
  const costs = calculateInfrastructureCosts();
  const infrastructureAllocation = (costs.totalOneTime * tokenPercentage) / 100;
  const annualOperationalAllocation = (costs.totalAnnualRecurring * tokenPercentage) / 100;
  
  return {
    name: uc.name,
    annualValue: uc.annualValue,
    monthlyTokens: tokenData?.monthlyTokens || 0,
    tokenPercentage,
    monthlyTokenCost,
    annualTokenCost: monthlyTokenCost * 12,
    infrastructureAllocation,
    annualOperationalAllocation,
    totalAnnualCost: monthlyTokenCost * 12 + annualOperationalAllocation,
    netAnnualValue: uc.annualValue - (monthlyTokenCost * 12 + annualOperationalAllocation),
    roi: ((uc.annualValue - (monthlyTokenCost * 12 + annualOperationalAllocation)) / 
          (monthlyTokenCost * 12 + annualOperationalAllocation)) * 100
  };
});
