export interface ProblemSolutionMapping {
  id: number;
  useCaseId: number;
  useCaseName: string;
  horizon: string;
  problemCategory: string;
  problemStatement: string;
  businessImpact: string;
  aiSolution: string;
  technologyApproach: string;
  expectedImprovements: {
    metric: string;
    baseline: string;
    target: string;
    improvement: string;
    timeframe: string;
  }[];
  businessValue: string;
  strategicAlignment: string[];
}

export const problemCategories = {
  operational: {
    name: "Operational Efficiency",
    description: "Streamlining processes and reducing manual effort",
    icon: "⚡",
    color: "#10b981"
  },
  customer: {
    name: "Customer Experience",
    description: "Enhancing service quality and satisfaction",
    icon: "👥",
    color: "#3b82f6"
  },
  technical: {
    name: "Technical Excellence",
    description: "Improving system performance and reliability",
    icon: "🔧",
    color: "#8b5cf6"
  },
  strategic: {
    name: "Strategic Innovation",
    description: "Driving competitive advantage and growth",
    icon: "🎯",
    color: "#f59e0b"
  }
};

export const problemSolutionMappings: ProblemSolutionMapping[] = [
  {
    id: 1,
    useCaseId: 1,
    useCaseName: "Intelligent Network Incident Triage",
    horizon: "H1",
    problemCategory: "operational",
    problemStatement: "Network operations teams are overwhelmed by high volumes of incident tickets, with 70% requiring manual triage. Critical incidents are often delayed due to misclassification, leading to extended Mean Time to Resolution (MTTR) and customer impact.",
    businessImpact: "Average MTTR of 4.2 hours results in $12M annual revenue loss from service degradation. Manual triage consumes 15,000 engineering hours annually, costing $3.2M in operational overhead.",
    aiSolution: "Deploy an AI-powered incident classification and routing system that analyzes ticket content, historical patterns, network telemetry, and contextual data to automatically categorize incidents by severity and route to appropriate specialist teams.",
    technologyApproach: "Natural Language Processing (NLP) for ticket analysis, Machine Learning classification models trained on 5+ years of historical incident data, Real-time integration with network monitoring systems, Automated escalation workflows",
    expectedImprovements: [
      {
        metric: "Mean Time to Resolution (MTTR)",
        baseline: "4.2 hours",
        target: "2.5 hours",
        improvement: "40% reduction",
        timeframe: "6 months"
      },
      {
        metric: "Triage Accuracy",
        baseline: "72%",
        target: "92%",
        improvement: "20 percentage points",
        timeframe: "6 months"
      },
      {
        metric: "Manual Triage Effort",
        baseline: "15,000 hours/year",
        target: "4,500 hours/year",
        improvement: "70% reduction",
        timeframe: "12 months"
      }
    ],
    businessValue: "$2.5M annual value through reduced MTTR impact ($1.8M) and operational cost savings ($700K)",
    strategicAlignment: ["Operational Excellence", "Customer Satisfaction", "Cost Optimization"]
  },
  {
    id: 2,
    useCaseId: 2,
    useCaseName: "Predictive Network Maintenance",
    horizon: "H1",
    problemCategory: "technical",
    problemStatement: "Network equipment failures occur unexpectedly, causing service disruptions and emergency maintenance. Reactive maintenance approach results in 45% of failures happening outside scheduled maintenance windows, leading to customer impact and premium labor costs.",
    businessImpact: "Unplanned outages cost $8M annually in SLA penalties and customer credits. Emergency maintenance operations add $2.5M in premium labor and logistics costs. Average equipment lifespan is 15% shorter than optimal due to reactive maintenance.",
    aiSolution: "Implement predictive maintenance system using machine learning to analyze equipment telemetry, environmental conditions, and historical failure patterns to forecast equipment failures 7-14 days in advance, enabling proactive maintenance scheduling.",
    technologyApproach: "Time-series analysis of network telemetry data, Anomaly detection algorithms for early warning signals, Predictive models trained on equipment failure history, Integration with maintenance scheduling systems",
    expectedImprovements: [
      {
        metric: "Unplanned Outages",
        baseline: "850 incidents/year",
        target: "340 incidents/year",
        improvement: "60% reduction",
        timeframe: "12 months"
      },
      {
        metric: "Maintenance Cost Efficiency",
        baseline: "$2.5M premium costs",
        target: "$750K premium costs",
        improvement: "70% reduction",
        timeframe: "12 months"
      },
      {
        metric: "Equipment Lifespan",
        baseline: "6.2 years average",
        target: "7.1 years average",
        improvement: "15% increase",
        timeframe: "18 months"
      }
    ],
    businessValue: "$2.8M annual value through reduced outage costs ($4.8M) and maintenance optimization ($1.75M), offset by $3.75M implementation",
    strategicAlignment: ["Network Reliability", "Cost Optimization", "Asset Management"]
  },
  {
    id: 3,
    useCaseId: 3,
    useCaseName: "Autonomous Network Testing",
    horizon: "H1",
    problemCategory: "operational",
    problemStatement: "Network configuration changes require extensive manual testing across 2,500+ test scenarios, taking 72 hours per major release. Testing bottlenecks delay feature deployments by average of 3 weeks, slowing time-to-market for new services.",
    businessImpact: "Testing delays cost $15M annually in delayed revenue from new service launches. Manual testing consumes 25,000 QA engineer hours per year ($5.5M cost). 12% of production issues trace back to insufficient test coverage.",
    aiSolution: "Deploy autonomous testing platform that uses AI to generate test scenarios, execute tests in parallel across virtual network environments, identify anomalies, and provide intelligent root cause analysis for failures.",
    technologyApproach: "AI-driven test case generation based on code changes, Parallel test execution across cloud infrastructure, Anomaly detection for test result analysis, Automated root cause analysis using ML pattern recognition",
    expectedImprovements: [
      {
        metric: "Test Cycle Time",
        baseline: "72 hours",
        target: "8 hours",
        improvement: "89% reduction",
        timeframe: "9 months"
      },
      {
        metric: "Test Coverage",
        baseline: "65%",
        target: "92%",
        improvement: "27 percentage points",
        timeframe: "9 months"
      },
      {
        metric: "Production Defect Rate",
        baseline: "12%",
        target: "4%",
        improvement: "67% reduction",
        timeframe: "12 months"
      }
    ],
    businessValue: "$3.0M annual value through accelerated time-to-market ($9M) and reduced testing costs ($3.85M), offset by $9.85M implementation",
    strategicAlignment: ["Agility", "Quality Assurance", "Innovation Velocity"]
  },
  {
    id: 4,
    useCaseId: 4,
    useCaseName: "AI-Powered Customer Service Assistant",
    horizon: "H1",
    problemCategory: "customer",
    problemStatement: "Customer service representatives handle 2.5M inquiries annually, with 60% being routine questions that require 8-12 minutes of agent time. First Contact Resolution (FCR) rate of 68% leads to repeat contacts and customer frustration.",
    businessImpact: "Customer service operations cost $45M annually. Low FCR drives 800K repeat contacts, adding $12M in handling costs. Customer satisfaction scores of 72/100 lag industry leaders by 15 points, impacting retention.",
    aiSolution: "Implement AI-powered virtual assistant that handles tier-1 inquiries autonomously, provides real-time guidance to human agents for complex issues, and learns from interactions to continuously improve response quality.",
    technologyApproach: "Large Language Model fine-tuned on Verizon knowledge base, Conversational AI with natural dialogue capabilities, Real-time agent assist with suggested responses, Continuous learning from customer interactions",
    expectedImprovements: [
      {
        metric: "Tier-1 Inquiry Automation",
        baseline: "0%",
        target: "65%",
        improvement: "1.6M inquiries automated",
        timeframe: "12 months"
      },
      {
        metric: "First Contact Resolution",
        baseline: "68%",
        target: "85%",
        improvement: "17 percentage points",
        timeframe: "12 months"
      },
      {
        metric: "Customer Satisfaction (CSAT)",
        baseline: "72/100",
        target: "84/100",
        improvement: "12 point increase",
        timeframe: "18 months"
      }
    ],
    businessValue: "$1.5M annual value through reduced handling costs ($19.5M) and improved retention ($2.8M), offset by $20.8M implementation",
    strategicAlignment: ["Customer Experience", "Operational Efficiency", "Digital Transformation"]
  },
  {
    id: 5,
    useCaseId: 5,
    useCaseName: "Intelligent Document Processing",
    horizon: "H1",
    problemCategory: "operational",
    problemStatement: "Enterprise operations process 500K documents annually (contracts, invoices, compliance forms) requiring manual data extraction and validation. Processing takes 15 minutes per document on average, with 8% error rate requiring rework.",
    businessImpact: "Document processing consumes 125K labor hours annually ($6.8M cost). Processing delays impact cash flow by $3.2M through delayed invoicing. Error rework adds $1.5M in additional costs and compliance risk.",
    aiSolution: "Deploy intelligent document processing system using computer vision and NLP to automatically extract, classify, and validate information from documents, with human-in-the-loop for exception handling.",
    technologyApproach: "Computer Vision for document scanning and layout analysis, NLP for information extraction and entity recognition, ML classification for document type identification, Automated validation rules with confidence scoring",
    expectedImprovements: [
      {
        metric: "Processing Time per Document",
        baseline: "15 minutes",
        target: "2 minutes",
        improvement: "87% reduction",
        timeframe: "9 months"
      },
      {
        metric: "Processing Accuracy",
        baseline: "92%",
        target: "99.2%",
        improvement: "7.2 percentage points",
        timeframe: "9 months"
      },
      {
        metric: "Labor Hours Required",
        baseline: "125K hours/year",
        target: "25K hours/year",
        improvement: "80% reduction",
        timeframe: "12 months"
      }
    ],
    businessValue: "$0.8M annual value through labor cost reduction ($5.4M) and improved cash flow ($1.6M), offset by $6.2M implementation",
    strategicAlignment: ["Operational Efficiency", "Accuracy", "Scalability"]
  },
  {
    id: 6,
    useCaseId: 6,
    useCaseName: "AI-Enhanced Network Planning",
    horizon: "H2",
    problemCategory: "strategic",
    problemStatement: "Network capacity planning relies on manual analysis of usage patterns, demographic data, and growth projections. Planning cycles take 6 months, and capacity decisions are often reactive, leading to either over-provisioning (wasted capex) or under-provisioning (service degradation).",
    businessImpact: "Suboptimal capacity planning results in $25M annual over-investment in underutilized infrastructure. Under-provisioned areas experience 15% service degradation, impacting 500K customers and driving $8M in churn.",
    aiSolution: "Implement AI-driven network planning platform that analyzes real-time usage patterns, predicts demand growth with 95% accuracy, optimizes infrastructure investments, and recommends optimal deployment strategies.",
    technologyApproach: "Predictive analytics using time-series forecasting, Geospatial analysis for coverage optimization, Reinforcement learning for investment optimization, Scenario modeling for strategic planning",
    expectedImprovements: [
      {
        metric: "Capacity Planning Accuracy",
        baseline: "72%",
        target: "95%",
        improvement: "23 percentage points",
        timeframe: "18 months"
      },
      {
        metric: "Capital Efficiency",
        baseline: "$25M over-investment",
        target: "$5M over-investment",
        improvement: "80% reduction",
        timeframe: "24 months"
      },
      {
        metric: "Planning Cycle Time",
        baseline: "6 months",
        target: "2 months",
        improvement: "67% reduction",
        timeframe: "18 months"
      }
    ],
    businessValue: "$1.8M annual value through optimized capex ($16M savings) and reduced churn ($4.8M), offset by $18.8M implementation",
    strategicAlignment: ["Capital Efficiency", "Strategic Planning", "Customer Retention"]
  },
  {
    id: 7,
    useCaseId: 7,
    useCaseName: "Intelligent Workforce Optimization",
    horizon: "H2",
    problemCategory: "operational",
    problemStatement: "Field service workforce scheduling is inefficient, with technicians spending 35% of time on travel and administrative tasks. Skill-to-job matching is suboptimal, leading to 22% of jobs requiring multiple visits. Reactive scheduling causes 18% overtime costs.",
    businessImpact: "Inefficient scheduling costs $42M annually in excess labor and travel. Multiple-visit jobs add $15M in additional costs. Customer appointment satisfaction is 68%, below industry benchmark of 82%.",
    aiSolution: "Deploy AI-powered workforce management system that optimizes technician routing, predicts job duration, matches skills to requirements, and dynamically adjusts schedules based on real-time conditions.",
    technologyApproach: "ML-based job duration prediction, Optimization algorithms for route planning, Skills matching using collaborative filtering, Real-time schedule adjustment with constraint satisfaction",
    expectedImprovements: [
      {
        metric: "Technician Utilization",
        baseline: "65%",
        target: "82%",
        improvement: "17 percentage points",
        timeframe: "18 months"
      },
      {
        metric: "First-Time Fix Rate",
        baseline: "78%",
        target: "92%",
        improvement: "14 percentage points",
        timeframe: "18 months"
      },
      {
        metric: "Appointment Satisfaction",
        baseline: "68/100",
        target: "85/100",
        improvement: "17 point increase",
        timeframe: "24 months"
      }
    ],
    businessValue: "$1.2M annual value through labor optimization ($29.4M) and reduced repeat visits ($10.5M), offset by $38.7M implementation",
    strategicAlignment: ["Operational Excellence", "Customer Satisfaction", "Cost Management"]
  },
  {
    id: 8,
    useCaseId: 8,
    useCaseName: "Predictive Customer Churn Prevention",
    horizon: "H2",
    problemCategory: "customer",
    problemStatement: "Customer churn rate of 1.8% monthly results in 2.1M lost customers annually. Current retention programs are reactive and have 25% success rate. Inability to identify at-risk customers early limits intervention effectiveness.",
    businessImpact: "Annual churn costs $450M in lost revenue. Customer acquisition costs of $350 per customer add $735M to replace churned customers. Reactive retention programs waste $45M on customers who weren't actually at risk.",
    aiSolution: "Implement predictive churn model that identifies at-risk customers 60-90 days in advance, determines churn drivers, and recommends personalized retention interventions with predicted success rates.",
    technologyApproach: "ML classification models trained on customer behavior patterns, Feature engineering from usage, billing, and interaction data, Propensity scoring for intervention targeting, A/B testing framework for retention strategy optimization",
    expectedImprovements: [
      {
        metric: "Churn Rate",
        baseline: "1.8% monthly",
        target: "1.3% monthly",
        improvement: "28% reduction",
        timeframe: "24 months"
      },
      {
        metric: "Retention Program Success Rate",
        baseline: "25%",
        target: "55%",
        improvement: "30 percentage points",
        timeframe: "18 months"
      },
      {
        metric: "Early Warning Time",
        baseline: "15 days",
        target: "75 days",
        improvement: "5x increase",
        timeframe: "12 months"
      }
    ],
    businessValue: "$0.5M annual value through reduced churn ($126M) and optimized retention spend ($13.5M), offset by $139M implementation",
    strategicAlignment: ["Customer Retention", "Revenue Protection", "Personalization"]
  },
  {
    id: 9,
    useCaseId: 9,
    useCaseName: "AI-Driven Revenue Assurance",
    horizon: "H2",
    problemCategory: "operational",
    problemStatement: "Revenue leakage from billing errors, provisioning mismatches, and fraud costs 2-3% of annual revenue. Manual auditing covers only 5% of transactions. Detection lag averages 45 days, increasing recovery difficulty.",
    businessImpact: "Estimated $280M annual revenue leakage (2.1% of $13.3B revenue). Recovery rate of 35% means $182M permanent loss. Manual audit costs $8M annually while covering minimal transaction volume.",
    aiSolution: "Deploy AI-powered revenue assurance platform that continuously monitors all transactions, detects anomalies in real-time, identifies root causes, and automates recovery processes.",
    technologyApproach: "Anomaly detection across billing and provisioning systems, Pattern recognition for fraud identification, Automated reconciliation between systems, ML-based root cause analysis",
    expectedImprovements: [
      {
        metric: "Revenue Leakage Rate",
        baseline: "2.1%",
        target: "0.6%",
        improvement: "71% reduction",
        timeframe: "24 months"
      },
      {
        metric: "Detection Time",
        baseline: "45 days",
        target: "2 days",
        improvement: "96% reduction",
        timeframe: "18 months"
      },
      {
        metric: "Recovery Rate",
        baseline: "35%",
        target: "75%",
        improvement: "40 percentage points",
        timeframe: "24 months"
      }
    ],
    businessValue: "$1.0M annual value through recovered revenue ($157.5M) and reduced audit costs ($5.6M), offset by $162.1M implementation",
    strategicAlignment: ["Revenue Protection", "Financial Controls", "Operational Excellence"]
  },
  {
    id: 10,
    useCaseId: 10,
    useCaseName: "Intelligent Network Security",
    horizon: "H2",
    problemCategory: "technical",
    problemStatement: "Network faces 15M security events daily, with security operations center (SOC) analysts able to investigate only 0.5% of alerts. Average threat detection time of 28 hours allows significant damage. 85% of investigated alerts are false positives.",
    businessImpact: "Security breaches cost $35M annually in remediation and customer impact. SOC operations cost $18M annually with limited coverage. False positive investigation wastes 12,000 analyst hours ($3.2M) annually.",
    aiSolution: "Implement AI-powered security operations platform that automatically triages security events, identifies true threats with 95% accuracy, orchestrates automated response actions, and learns from analyst decisions.",
    technologyApproach: "ML-based threat classification and prioritization, Behavioral analytics for anomaly detection, Automated response playbooks with AI decision-making, Continuous learning from security analyst feedback",
    expectedImprovements: [
      {
        metric: "Threat Detection Time",
        baseline: "28 hours",
        target: "2 hours",
        improvement: "93% reduction",
        timeframe: "18 months"
      },
      {
        metric: "False Positive Rate",
        baseline: "85%",
        target: "15%",
        improvement: "70 percentage points",
        timeframe: "18 months"
      },
      {
        metric: "Event Coverage",
        baseline: "0.5%",
        target: "25%",
        improvement: "50x increase",
        timeframe: "24 months"
      }
    ],
    businessValue: "$1.5M annual value through reduced breach impact ($24.5M) and SOC efficiency ($5.6M), offset by $28.6M implementation",
    strategicAlignment: ["Security", "Risk Management", "Operational Efficiency"]
  },
  {
    id: 11,
    useCaseId: 11,
    useCaseName: "Autonomous Network Optimization",
    horizon: "H3",
    problemCategory: "technical",
    problemStatement: "Network performance optimization requires manual analysis and configuration changes by specialized engineers. Optimization cycles take weeks, during which suboptimal configurations waste spectrum, power, and capacity. Network operates at 65% of theoretical efficiency.",
    businessImpact: "Suboptimal network configuration costs $120M annually in excess power consumption, spectrum inefficiency, and underutilized capacity. Manual optimization consumes 8,000 engineer hours annually ($2.8M cost).",
    aiSolution: "Deploy autonomous network optimization system that continuously monitors performance, runs simulations, automatically adjusts configurations, and learns optimal settings for varying conditions without human intervention.",
    technologyApproach: "Reinforcement learning for configuration optimization, Digital twin simulation for testing changes, Automated parameter tuning across network elements, Multi-objective optimization balancing performance, cost, and reliability",
    expectedImprovements: [
      {
        metric: "Network Efficiency",
        baseline: "65%",
        target: "88%",
        improvement: "23 percentage points",
        timeframe: "36 months"
      },
      {
        metric: "Power Consumption",
        baseline: "$45M annually",
        target: "$31.5M annually",
        improvement: "30% reduction",
        timeframe: "36 months"
      },
      {
        metric: "Optimization Cycle Time",
        baseline: "3 weeks",
        target: "Real-time",
        improvement: "Continuous optimization",
        timeframe: "36 months"
      }
    ],
    businessValue: "$1.5M annual value through operational savings ($84M) and reduced engineering effort ($2M), offset by $84.5M implementation",
    strategicAlignment: ["Technical Excellence", "Sustainability", "Automation"]
  },
  {
    id: 12,
    useCaseId: 12,
    useCaseName: "AI-Powered Product Innovation Engine",
    horizon: "H3",
    problemCategory: "strategic",
    problemStatement: "Product development cycles take 18-24 months from concept to launch. Market analysis and customer insight gathering are manual and time-consuming. 40% of new products fail to meet adoption targets, representing $200M in wasted investment over 3 years.",
    businessImpact: "Slow innovation cycles allow competitors to capture market opportunities first, costing estimated $150M in lost first-mover advantage. Product failures waste $67M annually in development costs.",
    aiSolution: "Implement AI-powered innovation platform that analyzes market trends, customer sentiment, competitive intelligence, and usage patterns to identify opportunities, predict product success, and accelerate development through automated insights.",
    technologyApproach: "NLP analysis of customer feedback and social media, Predictive modeling for product success, Market trend analysis using external data sources, Automated competitive intelligence gathering",
    expectedImprovements: [
      {
        metric: "Product Development Cycle",
        baseline: "21 months",
        target: "12 months",
        improvement: "43% reduction",
        timeframe: "36 months"
      },
      {
        metric: "Product Success Rate",
        baseline: "60%",
        target: "80%",
        improvement: "20 percentage points",
        timeframe: "48 months"
      },
      {
        metric: "Market Insight Generation Time",
        baseline: "8 weeks",
        target: "1 week",
        improvement: "88% reduction",
        timeframe: "24 months"
      }
    ],
    businessValue: "$1.25M annual value through accelerated time-to-market ($90M) and reduced product failures ($26.8M), offset by $115.55M implementation",
    strategicAlignment: ["Innovation", "Market Leadership", "Customer-Centricity"]
  },
  {
    id: 13,
    useCaseId: 13,
    useCaseName: "AI Governance & Ethics Framework",
    horizon: "Enabler",
    problemCategory: "strategic",
    problemStatement: "Lack of standardized AI governance creates compliance risk, inconsistent ethical practices, and difficulty scaling AI initiatives. No centralized visibility into AI model performance, bias, or regulatory compliance across 50+ AI projects.",
    businessImpact: "Regulatory compliance risk estimated at $50M potential fines. Inconsistent AI practices slow deployment by 6 months per project. Reputational risk from AI bias or failures could cost $100M+ in customer trust and brand value.",
    aiSolution: "Establish comprehensive AI governance framework with automated model monitoring, bias detection, explainability tools, compliance tracking, and ethical review processes integrated into AI development lifecycle.",
    technologyApproach: "Automated model performance monitoring, Bias detection and mitigation tools, Explainable AI (XAI) frameworks, Compliance tracking dashboards, Centralized model registry and governance workflows",
    expectedImprovements: [
      {
        metric: "AI Project Compliance Rate",
        baseline: "45%",
        target: "95%",
        improvement: "50 percentage points",
        timeframe: "24 months"
      },
      {
        metric: "Model Deployment Time",
        baseline: "12 months",
        target: "6 months",
        improvement: "50% reduction",
        timeframe: "24 months"
      },
      {
        metric: "Governance Coverage",
        baseline: "20% of AI projects",
        target: "100% of AI projects",
        improvement: "5x increase",
        timeframe: "18 months"
      }
    ],
    businessValue: "$0.65M annual value through risk mitigation ($35M avoided fines) and accelerated deployment ($8.75M), offset by $43.1M implementation",
    strategicAlignment: ["Risk Management", "Compliance", "Responsible AI"]
  },
  {
    id: 14,
    useCaseId: 14,
    useCaseName: "AI Center of Excellence & Talent Development",
    horizon: "Enabler",
    problemCategory: "strategic",
    problemStatement: "AI talent shortage limits execution velocity. Fragmented AI efforts across business units create duplication and inconsistent practices. No centralized knowledge sharing or reusable AI components, causing teams to rebuild solutions.",
    businessImpact: "AI talent shortage delays projects by average 4 months, costing $25M in delayed value realization. Duplicated efforts waste $15M annually. Lack of best practice sharing reduces AI success rate by 30%.",
    aiSolution: "Establish AI Center of Excellence providing centralized expertise, reusable AI components, training programs, best practice sharing, and cross-functional collaboration to accelerate AI adoption and maximize ROI.",
    technologyApproach: "Centralized AI platform with reusable components, Knowledge management system for AI best practices, Training and certification programs, Community of practice for knowledge sharing",
    expectedImprovements: [
      {
        metric: "AI Project Success Rate",
        baseline: "55%",
        target: "85%",
        improvement: "30 percentage points",
        timeframe: "24 months"
      },
      {
        metric: "Time to Deploy AI Solutions",
        baseline: "12 months",
        target: "6 months",
        improvement: "50% reduction",
        timeframe: "24 months"
      },
      {
        metric: "AI Talent Availability",
        baseline: "50 AI practitioners",
        target: "200 AI practitioners",
        improvement: "4x increase",
        timeframe: "36 months"
      }
    ],
    businessValue: "$0.5M annual value through accelerated deployment ($17.5M) and reduced duplication ($10.5M), offset by $27.5M implementation",
    strategicAlignment: ["Capability Building", "Knowledge Management", "Organizational Transformation"]
  }
];

export function getProblemsByCategory(category: string): ProblemSolutionMapping[] {
  return problemSolutionMappings.filter(p => p.problemCategory === category);
}

export function getProblemsByHorizon(horizon: string): ProblemSolutionMapping[] {
  return problemSolutionMappings.filter(p => p.horizon === horizon);
}

export function getProblemByUseCaseId(useCaseId: number): ProblemSolutionMapping | undefined {
  return problemSolutionMappings.find(p => p.useCaseId === useCaseId);
}
