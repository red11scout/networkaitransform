import { Info } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface MetricExplanationTooltipProps {
  title: string;
  explanation: string;
  calculation?: string;
  note?: string;
}

export function MetricExplanationTooltip({
  title,
  explanation,
  calculation,
  note,
}: MetricExplanationTooltipProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="inline-flex items-center justify-center rounded-full w-5 h-5 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          aria-label={`Explanation for ${title}`}
        >
          <Info className="h-4 w-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="space-y-3">
          <div>
            <h4 className="font-semibold text-sm mb-1">{title}</h4>
            <p className="text-sm text-muted-foreground">{explanation}</p>
          </div>
          
          {calculation && (
            <div className="pt-2 border-t">
              <p className="text-xs font-medium text-muted-foreground mb-1">Calculation Method</p>
              <p className="text-xs font-mono bg-muted/50 p-2 rounded">{calculation}</p>
            </div>
          )}
          
          {note && (
            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground italic">{note}</p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
