import { Info } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

interface PaybackTooltipProps {
  paybackMonths: number;
}

export function PaybackTooltip({ paybackMonths }: PaybackTooltipProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-4 w-4 p-0 hover:bg-transparent"
        >
          <Info className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground transition-colors" />
          <span className="sr-only">Payback period calculation details</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="space-y-3">
          <div>
            <h4 className="font-semibold text-sm mb-2">Payback Period Calculation</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              The payback period represents the time required to recover the initial infrastructure investment through net cash flow.
            </p>
          </div>
          
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b">
              <span className="text-muted-foreground">Initial Investment:</span>
              <span className="font-medium">$2.11M</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground pl-2">• HPE Infrastructure:</span>
                <span>$1.03M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground pl-2">• NVIDIA GPUs:</span>
                <span>$1.08M</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b">
              <span className="text-muted-foreground">Annual Benefits:</span>
              <span className="font-medium">$15.7M</span>
            </div>
            <div className="flex justify-between py-1 border-b">
              <span className="text-muted-foreground">Annual Operating Costs:</span>
              <span className="font-medium">$3.0M</span>
            </div>
            <div className="flex justify-between py-1 border-b">
              <span className="text-muted-foreground">Annual Net Cash Flow:</span>
              <span className="font-medium text-green-600 dark:text-green-400">$12.7M</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground">Monthly Net Cash Flow:</span>
              <span className="font-medium">$1.06M</span>
            </div>
          </div>

          <div className="pt-2 border-t">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold">Payback Period:</span>
              <span className="text-sm font-bold text-primary">{paybackMonths} {paybackMonths === 1 ? 'month' : 'months'}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              $2.11M ÷ $1.06M/month ≈ {paybackMonths} {paybackMonths === 1 ? 'month' : 'months'}
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
