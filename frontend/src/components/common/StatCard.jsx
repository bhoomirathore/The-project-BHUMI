import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import AnimatedNumber from './AnimatedNumber';

const TONE = {
  default: 'text-foreground',
  success: 'text-success-foreground',
  warning: 'text-warning-foreground',
  info: 'text-info-foreground',
  error: 'text-destructive',
};
const ICON_TONE = {
  default: 'bg-primary/10 text-primary',
  success: 'bg-success/15 text-success-foreground',
  warning: 'bg-warning/15 text-warning-foreground',
  info: 'bg-info/15 text-info-foreground',
  error: 'bg-destructive/15 text-destructive',
};

/**
 * Dashboard metric tile.
 * props: label, value (number|string), icon (lucide component), tone, hint, loading, onClick, format
 */
export default function StatCard({ label, value, icon: Icon, tone = 'default', hint, loading, onClick, format, className, delay = 0 }) {
  const numeric = typeof value === 'number';
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn('h-full', className)}
    >
      <Card
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        onClick={onClick}
        onKeyDown={(e) => { if (onClick && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); onClick(); } }}
        className={cn('group relative h-full overflow-hidden shadow-card', onClick && 'cursor-pointer card-interactive')}
      >
        <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-primary/5 transition-transform duration-500 group-hover:scale-150" />
        <CardContent className="flex items-start justify-between gap-4 p-5 sm:p-6">
          <div className="min-w-0">
            {loading ? (
              <Skeleton className="mb-2 h-9 w-20" />
            ) : (
              <div className={cn('text-3xl font-extrabold tracking-tight', TONE[tone])}>
                {numeric ? <AnimatedNumber value={value} format={format} /> : value}
              </div>
            )}
            <div className="mt-1 text-sm font-medium text-muted-foreground">{label}</div>
            {hint && <div className="mt-1 text-[0.7rem] text-muted-foreground/80">{hint}</div>}
          </div>
          {Icon && (
            <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110', ICON_TONE[tone])}>
              <Icon className="h-5 w-5" aria-hidden="true" />
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
