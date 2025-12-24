import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCases } from '@/lib/useCasesData';
import { formatMillions, getHorizonColor } from '@/lib/utils';
import { Move, Info } from 'lucide-react';

interface Position {
  x: number;
  y: number;
}

export default function PriorityMatrix() {
  // Initialize positions based on effort (x-axis) and annual value (y-axis)
  const [positions, setPositions] = useState<Record<number, Position>>(() => {
    const initial: Record<number, Position> = {};
    const maxValue = Math.max(...useCases.map(uc => uc.annualValue));
    const maxEffort = 5;

    useCases.forEach(uc => {
      // Normalize to 0-100 range for positioning
      // X-axis: Effort (inverted - lower effort is better, so on the right)
      // Y-axis: Value (higher value is better, so at the top)
      initial[uc.id] = {
        x: ((maxEffort - uc.effort) / maxEffort) * 85 + 5, // 5-90% range
        y: (uc.annualValue / maxValue) * 85 + 5 // 5-90% range
      };
    });
    return initial;
  });

  const [draggedId, setDraggedId] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, id: number) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedId === null) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setPositions(prev => ({
      ...prev,
      [draggedId]: { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) }
    }));
    setDraggedId(null);
  };

  // Categorize use cases by quadrant
  const getQuadrant = (pos: Position) => {
    if (pos.x >= 50 && pos.y >= 50) return 'Quick Wins';
    if (pos.x < 50 && pos.y >= 50) return 'Strategic';
    if (pos.x >= 50 && pos.y < 50) return 'Fill-Ins';
    return 'Hard Slogs';
  };

  const quadrantColors = {
    'Quick Wins': 'hsl(var(--chart-4))',
    'Strategic': 'hsl(var(--chart-2))',
    'Fill-Ins': 'hsl(var(--chart-1))',
    'Hard Slogs': 'hsl(var(--chart-5))'
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Move className="h-5 w-5 text-primary" />
            Interactive Priority Matrix
          </CardTitle>
          <CardDescription>
            Drag and drop use cases to explore different prioritization scenarios. 
            Positioned based on effort (x-axis) and annual value (y-axis).
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Matrix Container */}
          <div className="relative">
            {/* The Matrix Grid */}
            <div
              className="relative w-full bg-muted/30 rounded-lg border-2 border-border overflow-hidden"
              style={{ height: '600px' }}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {/* Quadrant Labels */}
              <div className="absolute top-4 right-4 bg-chart-4/10 border border-chart-4/30 rounded px-3 py-1 text-sm font-semibold z-10">
                Quick Wins
              </div>
              <div className="absolute top-4 left-4 bg-chart-2/10 border border-chart-2/30 rounded px-3 py-1 text-sm font-semibold z-10">
                Strategic
              </div>
              <div className="absolute bottom-4 right-4 bg-chart-1/10 border border-chart-1/30 rounded px-3 py-1 text-sm font-semibold z-10">
                Fill-Ins
              </div>
              <div className="absolute bottom-4 left-4 bg-chart-5/10 border border-chart-5/30 rounded px-3 py-1 text-sm font-semibold z-10">
                Hard Slogs
              </div>

              {/* Center Lines */}
              <div className="absolute top-0 left-1/2 w-px h-full bg-border z-0" />
              <div className="absolute top-1/2 left-0 w-full h-px bg-border z-0" />

              {/* Axis Labels */}
              <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                Lower Effort →
              </div>
              <div className="absolute top-2 left-2 text-xs text-muted-foreground transform -rotate-90 origin-top-left">
                ← Higher Value
              </div>

              {/* Use Case Bubbles */}
              {useCases.map(uc => {
                const pos = positions[uc.id];
                const quadrant = getQuadrant(pos);
                const isDragging = draggedId === uc.id;

                return (
                  <div
                    key={uc.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, uc.id)}
                    className={`absolute cursor-move transition-all ${isDragging ? 'opacity-50 scale-110' : 'hover:scale-105'}`}
                    style={{
                      left: `${pos.x}%`,
                      top: `${100 - pos.y}%`, // Invert Y for visual consistency
                      transform: 'translate(-50%, -50%)',
                      zIndex: isDragging ? 50 : 20
                    }}
                  >
                    <div
                      className="rounded-full shadow-lg border-2 p-3 bg-card hover:shadow-xl transition-shadow"
                      style={{
                        borderColor: getHorizonColor(uc.horizon),
                        minWidth: '120px',
                        maxWidth: '180px'
                      }}
                    >
                      <div className="text-center">
                        <Badge 
                          variant="outline" 
                          className="mb-1 text-xs"
                          style={{ borderColor: getHorizonColor(uc.horizon) }}
                        >
                          {uc.horizon}
                        </Badge>
                        <div className="font-semibold text-xs leading-tight mb-1">
                          {uc.name}
                        </div>
                        <div className="text-xs font-bold text-primary">
                          {formatMillions(uc.annualValue, 1)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Effort: {uc.effort}/5
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(quadrantColors).map(([quadrant, color]) => {
                const count = useCases.filter(uc => getQuadrant(positions[uc.id]) === quadrant).length;
                return (
                  <div key={quadrant} className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full border-2"
                      style={{ borderColor: color, backgroundColor: `${color}20` }}
                    />
                    <div className="text-sm">
                      <div className="font-semibold">{quadrant}</div>
                      <div className="text-xs text-muted-foreground">{count} use cases</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quadrant Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(quadrantColors).map(([quadrant, color]) => {
          const quadrantCases = useCases.filter(uc => getQuadrant(positions[uc.id]) === quadrant);
          const totalValue = quadrantCases.reduce((sum, uc) => sum + uc.annualValue, 0);

          return (
            <Card key={quadrant} className="border-l-4" style={{ borderLeftColor: color }}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{quadrant}</CardTitle>
                <CardDescription>
                  {quadrant === 'Quick Wins' && 'High value, low effort - prioritize these first'}
                  {quadrant === 'Strategic' && 'High value, high effort - plan carefully'}
                  {quadrant === 'Fill-Ins' && 'Low value, low effort - quick additions'}
                  {quadrant === 'Hard Slogs' && 'Low value, high effort - reconsider'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Use Cases:</span>
                    <span className="font-semibold">{quadrantCases.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Value:</span>
                    <span className="font-semibold">{formatMillions(totalValue)}</span>
                  </div>
                  {quadrantCases.length > 0 && (
                    <div className="pt-2 border-t">
                      <div className="text-xs text-muted-foreground mb-2">Use Cases:</div>
                      <div className="space-y-1">
                        {quadrantCases.map(uc => (
                          <div key={uc.id} className="text-xs flex justify-between">
                            <span>{uc.name}</span>
                            <span className="font-medium">{formatMillions(uc.annualValue, 1)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Instructions */}
      <Card className="bg-muted/30">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-primary mt-0.5" />
            <div className="space-y-2 text-sm">
              <p className="font-semibold">How to use the Priority Matrix:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Drag and drop use cases to reposition them based on your assessment</li>
                <li>X-axis represents effort (right = lower effort, easier to implement)</li>
                <li>Y-axis represents value (top = higher value, greater impact)</li>
                <li>Use cases are initially positioned based on their actual effort scores and annual values</li>
                <li>The quadrant analysis updates automatically as you move use cases</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
