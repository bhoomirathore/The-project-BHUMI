import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export default function ThemeToggle({ className, variant = 'ghost' }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted && resolvedTheme === 'dark';

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={variant}
          size="icon"
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          className={cn('relative overflow-hidden', className)}
        >
          <Sun
            className={cn(
              'absolute h-[1.1rem] w-[1.1rem] transition-all duration-300',
              isDark ? '-rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
            )}
          />
          <Moon
            className={cn(
              'absolute h-[1.1rem] w-[1.1rem] transition-all duration-300',
              isDark ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0'
            )}
          />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{isDark ? 'Light mode' : 'Dark mode'}</TooltipContent>
    </Tooltip>
  );
}
