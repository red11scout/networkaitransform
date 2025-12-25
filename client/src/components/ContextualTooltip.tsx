import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { HelpCircle, Info } from 'lucide-react';

interface ContextualTooltipProps {
  content: string;
  variant?: 'help' | 'info';
  side?: 'top' | 'right' | 'bottom' | 'left';
}

export function ContextualTooltip({ 
  content, 
  variant = 'help',
  side = 'top' 
}: ContextualTooltipProps) {
  const Icon = variant === 'help' ? HelpCircle : Info;
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button 
          className="inline-flex items-center justify-center ml-1 text-muted-foreground hover:text-foreground transition-colors"
          aria-label={`Help: ${content}`}
        >
          <Icon className="h-4 w-4" />
        </button>
      </TooltipTrigger>
      <TooltipContent side={side} className="max-w-xs">
        <p className="text-sm">{content}</p>
      </TooltipContent>
    </Tooltip>
  );
}

// Predefined tooltips for common metrics
export const tooltips = {
  annualValue: "Total annual financial value across all use cases, including revenue impact and cost reduction",
  roi: "Return on Investment calculated as (Total Benefits - Total Investment) / Total Investment over 5 years",
  npv: "Net Present Value at 10% discount rate, representing the present value of all future cash flows",
  payback: "Time required to recover the initial investment through generated benefits",
  horizon1: "Immediate wins with quick implementation (0-6 months) and proven ROI",
  horizon2: "Workforce augmentation initiatives (6-12 months) that enhance productivity",
  horizon3: "Strategic transformation projects (12-24 months) with long-term impact",
  discountRate: "Rate used to calculate present value of future cash flows, typically company's cost of capital",
  probabilitySuccess: "Estimated likelihood of successful implementation based on complexity and risk factors",
  tokenConsumption: "Number of AI model tokens consumed monthly, directly impacting operational costs",
  implementationCost: "One-time costs for development, integration, training, and deployment",
  annualOperational: "Recurring yearly costs for maintenance, support, infrastructure, and operations"
};
