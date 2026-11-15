import React from 'react';
import { Check } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export default function StepHeader({ steps, currentStep, className }) {
  const total = steps.length;
  const progress = Math.min(100, Math.round(((currentStep - 1) / total) * 100 + (1 / total) * 50));

  return (
    <div className={cn('border-b bg-muted/30 p-4 sm:p-5', className)}>
      <div className="mb-3 flex items-center justify-between text-xs">
        <span className="font-bold uppercase tracking-wider text-muted-foreground">
          Step {currentStep} of {total}
        </span>
        <span className="font-mono text-muted-foreground">{progress}%</span>
      </div>
      <Progress value={progress} className="h-1.5" aria-label={`Step ${currentStep} of ${total}`} />
      <ol className="mt-4 flex gap-2 overflow-x-auto pb-1" aria-label="Form steps">
        {steps.map((item) => {
          const done = currentStep > item.num;
          const active = currentStep === item.num;
          const Icon = item.icon;
          return (
            <li
              key={item.num}
              aria-current={active ? 'step' : undefined}
              className={cn(
                'flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors',
                active
                  ? 'border-primary bg-primary text-primary-foreground'
                  : done
                  ? 'border-success/30 bg-success/15 text-success-foreground'
                  : 'bg-card text-muted-foreground'
              )}
            >
              <span
                className={cn(
                  'flex h-5 w-5 items-center justify-center rounded-full text-[0.65rem] font-bold',
                  active ? 'bg-primary-foreground/20' : done ? 'bg-success text-success-foreground' : 'bg-muted'
                )}
              >
                {done ? <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" /> : item.num}
              </span>
              {Icon && <Icon className="h-3.5 w-3.5" aria-hidden="true" />}
              <span>{item.label}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
