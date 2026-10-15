import React from 'react';
import { Inbox } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function EmptyState({ icon: Icon = Inbox, title = 'Nothing here yet', description, action, className, compact }) {
  return (
    <div className={cn('flex flex-col items-center justify-center text-center', compact ? 'p-6' : 'p-10 sm:p-14', className)}>
      <div className="relative mb-4">
        <div className="absolute inset-0 animate-pulse-ring rounded-full bg-primary/10" />
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border bg-card text-muted-foreground shadow-sm">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </div>
      </div>
      <h3 className="text-sm font-bold text-foreground sm:text-base">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-xs text-muted-foreground sm:text-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
