import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Standard portal page header: eyebrow, title, description, right-side actions.
 */
export default function PageHeader({ eyebrow, title, description, actions, children, className }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={cn('mb-6 flex flex-col gap-4 border-b pb-6 sm:mb-8 sm:flex-row sm:items-end sm:justify-between sm:pb-7', className)}
    >
      <div className="min-w-0">
        {eyebrow && (
          <div className="mb-1 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">{eyebrow}</div>
        )}
        <h1 className="text-xl font-extrabold tracking-tight sm:text-2xl md:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{description}</p>}
        {children}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2 sm:gap-3">{actions}</div>}
    </motion.header>
  );
}
