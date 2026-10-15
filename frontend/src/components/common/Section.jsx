import React from 'react';
import { cn } from '@/lib/utils';

/** Titled section block used inside portal pages. */
export default function Section({ title, description, actions, children, className, contentClassName }) {
  return (
    <section className={cn('mb-8 sm:mb-10', className)}>
      {(title || actions) && (
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3 sm:mb-5">
          <div>
            {title && <h2 className="text-lg font-bold tracking-tight sm:text-xl">{title}</h2>}
            {description && <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">{description}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={contentClassName}>{children}</div>
    </section>
  );
}
