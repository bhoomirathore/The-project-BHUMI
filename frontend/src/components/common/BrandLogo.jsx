import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export default function BrandLogo({ size = 'md', subtitle, className, to = '/', onClick, showText = true }) {
  const box = { sm: 'h-8 w-8 rounded-md', md: 'h-9 w-9 rounded-lg', lg: 'h-11 w-11 rounded-[10px]' }[size];
  const dot = { sm: 'h-3 w-3 rounded-[2px]', md: 'h-3.5 w-3.5 rounded-[3px]', lg: 'h-[18px] w-[18px] rounded-[4px]' }[size];
  const text = { sm: 'text-lg', md: 'text-xl sm:text-2xl', lg: 'text-2xl sm:text-3xl' }[size];

  const content = (
    <>
      <span
        className={cn(
          'relative flex shrink-0 items-center justify-center bg-primary shadow-sm transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105',
          box
        )}
      >
        <span className={cn('bg-primary-foreground transition-transform duration-300 group-hover:-rotate-6', dot)} />
      </span>
      {showText && (
        <span className="flex flex-col leading-none">
          <span className={cn('font-bold tracking-[2px] text-foreground', text)}>B.H.U.M.I</span>
          {subtitle && (
            <span className="mt-1 text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">
              {subtitle}
            </span>
          )}
        </span>
      )}
    </>
  );

  const cls = cn('group inline-flex select-none items-center gap-3', className);
  if (to === null) {
    return (
      <button type="button" onClick={onClick} className={cls}>
        {content}
      </button>
    );
  }
  return (
    <Link to={to} onClick={onClick} className={cls} aria-label="B.H.U.M.I home">
      {content}
    </Link>
  );
}
