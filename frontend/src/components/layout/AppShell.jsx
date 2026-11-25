import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar, { SIDEBAR_WIDTH, SIDEBAR_COLLAPSED_WIDTH } from '@/components/Sidebar';
import CommandPalette from './CommandPalette';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { portalForRole } from '@/config/navigation';

/**
 * Portal page scaffold: fixed sidebar + scrollable main content + Ctrl+K palette.
 * The sidebar and palette are always driven by the logged-in user's role.
 * The optional `portal` prop is kept for backward compat but ignored if a user is logged in.
 */
export default function AppShell({ portal: portalProp = 'citizen', children, className, contentClassName }) {
  const { user } = useAuth();
  // Derive the portal key from the page's portalProp or fall back to user role.
  const portal = portalProp || (user?.role ? portalForRole(user.role) : 'citizen');
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    try { return localStorage.getItem('bhumi-sidebar-collapsed') === '1'; } catch { return false; }
  });

  return (
    <div className={cn('flex min-h-screen bg-background text-foreground', className)}>
      <Sidebar portal={portal} onOpenSearch={() => setPaletteOpen(true)} collapsed={collapsed} onCollapsedChange={setCollapsed} />
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} portal={portal} />
      <motion.main
        initial={false}
        animate={{ paddingLeft: 0 }}
        style={{ '--sidebar-w': `${collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH}px` }}
        className={cn(
          'min-w-0 flex-1 overflow-x-hidden p-4 pt-16 transition-[margin] duration-300 ease-out sm:p-6 md:ml-[var(--sidebar-w)] md:p-8 md:pt-8 lg:p-10',
          contentClassName
        )}
      >
        <motion.div
          key={typeof window !== 'undefined' ? window.location.pathname : 'page'}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="mx-auto w-full max-w-[1400px]"
        >
          {children}
        </motion.div>
      </motion.main>
    </div>
  );
}
