import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronsLeft, ChevronsRight, Home, Menu, Search, Settings, UserRound } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../hooks/useAuth';
import { PORTAL_META, PORTAL_NAV, portalForRole } from '@/config/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import BrandLogo from '@/components/common/BrandLogo';
import RoleBadge from '@/components/RoleBadge';
import ThemeToggle from '@/components/common/ThemeToggle';

export const SIDEBAR_WIDTH = 280;
export const SIDEBAR_COLLAPSED_WIDTH = 80;
const STORAGE_KEY = 'bhumi-sidebar-collapsed';

function readCollapsed() {
  try { return localStorage.getItem(STORAGE_KEY) === '1'; } catch { return false; }
}

function initials(name = '') {
  return name.split(' ').filter(Boolean).map((n) => n[0]).join('').slice(0, 2).toUpperCase();
}

function NavItem({ link, collapsed, onNavigate }) {
  const Icon = link.icon;
  const location = useLocation();
  // Dashboard routes match only exact paths; all other routes also match child paths.
  const isActive =
    location.pathname === link.to ||
    (!link.to.endsWith('/dashboard') && location.pathname.startsWith(link.to + '/'));

  const item = (
    <NavLink
      to={link.to}
      onClick={onNavigate}
      className={cn(
        'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[0.9rem] font-medium outline-none transition-all duration-200',
        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar',
        isActive
          ? 'bg-primary text-primary-foreground shadow-sm'
          : 'text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground dark:text-slate-300 dark:hover:text-white',
        collapsed && 'justify-center px-0'
      )}
    >
      {isActive && (
        <motion.span
          layoutId="sidebar-active-pill"
          className="absolute inset-0 rounded-lg bg-primary"
          transition={{ type: 'spring', stiffness: 400, damping: 32 }}
        />
      )}
      <Icon className="relative z-10 h-[18px] w-[18px] shrink-0 transition-transform duration-200 group-hover:scale-110" aria-hidden="true" />
      {!collapsed && <span className="relative z-10 truncate">{link.label}</span>}
    </NavLink>
  );

  if (!collapsed) return item;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{item}</TooltipTrigger>
      <TooltipContent side="right" sideOffset={10}>{link.label}</TooltipContent>
    </Tooltip>
  );
}

/** Maps auth role → human-readable label shown under the user name in the sidebar. */
const ROLE_LABEL = {
  CITIZEN: 'Citizen',
  REGISTRAR: 'Registrar',
  GOVERNMENT_HQ: 'Government HQ',
};

function SidebarBody({ portal: portalProp, collapsed, onToggleCollapse, onNavigate, onOpenSearch }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const portal = portalProp || (user?.role ? portalForRole(user.role) : 'citizen');
  const meta = PORTAL_META[portal] || PORTAL_META.citizen;
  const sections = PORTAL_NAV[portal] || PORTAL_NAV.citizen;

  const displayName = meta.name;
  const displayAvatar = meta.avatar;
  const displayRole = meta.role;
  const displayBadge = meta.badge;

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      {/* Header */}
      <div className={cn('flex items-center border-b border-sidebar-border bg-background/50 p-4', collapsed ? 'justify-center' : 'justify-between')}>
        <BrandLogo size="sm" subtitle={collapsed ? undefined : meta.sub} showText={!collapsed} to="/" />
        {!collapsed && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleCollapse}
                className="hidden h-8 w-8 text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground dark:text-slate-300 dark:hover:text-white md:inline-flex"
                aria-label="Collapse sidebar"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Collapse</TooltipContent>
          </Tooltip>
        )}
      </div>

      {/* User / Portal card */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={cn(
              'flex w-full items-center gap-3 border-b border-sidebar-border bg-muted/30 p-3 text-left outline-none transition-colors hover:bg-sidebar-accent focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring',
              collapsed && 'justify-center'
            )}
            aria-label="Account and portal menu"
          >
            <Avatar className="h-10 w-10 shadow-sm ring-2 ring-background">
              <AvatarFallback className="bg-gradient-to-br from-primary to-muted-foreground font-bold text-primary-foreground">
                {displayAvatar}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-[0.92rem] font-bold">{displayName}</span>
                <span className="truncate text-[0.76rem] text-muted-foreground">{displayRole}</span>
                <RoleBadge role={displayBadge} className="mt-1" />
              </div>
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" side="right" sideOffset={8} className="w-56">
          <DropdownMenuLabel className="font-normal">
            <div className="text-sm font-bold">{displayName}</div>
            <div className="text-xs text-muted-foreground">{displayRole}</div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => navigate(meta.home)}>
            <Search className="mr-2 h-4 w-4" /> Go to portal dashboard
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Switch Portal
          </DropdownMenuLabel>
          <DropdownMenuItem onSelect={() => navigate('/citizen/dashboard')}>
            Citizen Portal
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => navigate('/authority/dashboard')}>
            Registrar Portal
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => navigate('/government/dashboard')}>
            Government HQ
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Search trigger */}
      <div className={cn('px-3 pt-3', collapsed && 'px-2')}>
        {collapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="w-full border-sidebar-border bg-sidebar text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground dark:text-slate-300 dark:hover:text-white"
                onClick={onOpenSearch}
                aria-label="Search (Ctrl+K)"
              >
                <Search className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Search · Ctrl K</TooltipContent>
          </Tooltip>
        ) : (
          <Button
            variant="outline"
            className="w-full justify-between border-sidebar-border bg-sidebar text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground dark:text-slate-300 dark:hover:text-white"
            onClick={onOpenSearch}
          >
            <span className="flex items-center gap-2"><Search className="h-4 w-4" /> Quick search…</span>
            <kbd className="pointer-events-none hidden rounded border border-sidebar-border bg-sidebar-accent/50 px-1.5 font-mono text-[10px] font-medium sm:inline-block">⌘K</kbd>
          </Button>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1">
        <nav className={cn('flex flex-col gap-4 px-3 py-4', collapsed && 'px-2')} aria-label="Portal navigation">
          {sections.map((sec) => (
            <div key={sec.label} className="flex flex-col gap-1">
              {collapsed ? (
                <Separator className="my-1 bg-sidebar-border" />
              ) : (
                <div className="mb-1 px-3 text-[0.66rem] font-bold uppercase tracking-wider text-sidebar-muted/80">{sec.label}</div>
              )}
              {sec.links.map((link) => (
                <NavItem key={link.to} link={link} collapsed={collapsed} onNavigate={onNavigate} />
              ))}
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className={cn('flex items-center gap-2 border-t border-sidebar-border p-3', collapsed ? 'flex-col' : 'justify-between')}>
        <ThemeToggle className="text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground dark:text-slate-300 dark:hover:text-white" />
        {collapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleCollapse}
                className="hidden text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground dark:text-slate-300 dark:hover:text-white md:inline-flex"
                aria-label="Expand sidebar"
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Expand</TooltipContent>
          </Tooltip>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground dark:text-slate-300 dark:hover:text-white"
            onClick={() => navigate('/')}
          >
            <Home className="h-4 w-4" /> Home
          </Button>
        )}
      </div>
    </div>
  );
}

export default function Sidebar({ portal: portalProp = 'citizen', onOpenSearch, mobileOpen, onMobileOpenChange, collapsed: collapsedProp, onCollapsedChange }) {
  const [collapsedState, setCollapsedState] = useState(readCollapsed);
  const [mobileState, setMobileState] = useState(false);
  const { user } = useAuth();

  const portal = portalProp || (user?.role ? portalForRole(user.role) : 'citizen');

  const collapsed = collapsedProp ?? collapsedState;
  const setCollapsed = (v) => {
    try { localStorage.setItem(STORAGE_KEY, v ? '1' : '0'); } catch { /* ignore */ }
    setCollapsedState(v);
    onCollapsedChange?.(v);
  };
  const isMobileOpen = mobileOpen ?? mobileState;
  const setMobileOpen = (v) => { setMobileState(v); onMobileOpenChange?.(v); };

  useEffect(() => { onCollapsedChange?.(collapsed); /* eslint-disable-next-line */ }, []);

  const bodyProps = {
    portal,
    onOpenSearch: () => { setMobileOpen(false); onOpenSearch?.(); },
  };

  return (
    <>
      {/* Mobile trigger */}
      <div className="fixed left-3 top-3 z-50 md:hidden">
        <Button variant="outline" size="icon" className="h-10 w-10 shadow-md" onClick={() => setMobileOpen(true)} aria-label="Open navigation">
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Mobile sheet */}
      <Sheet open={isMobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-[290px] border-r border-sidebar-border bg-sidebar p-0 [&>button]:z-20">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SheetDescription className="sr-only">Portal navigation menu</SheetDescription>
          <SidebarBody {...bodyProps} collapsed={false} onToggleCollapse={() => {}} onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH }}
        transition={{ type: 'spring', stiffness: 300, damping: 32 }}
        className="fixed left-0 top-0 z-40 hidden h-screen border-r border-sidebar-border bg-sidebar shadow-[4px_0_30px_hsl(var(--shadow-color)/0.06)] md:block"
      >
        <SidebarBody {...bodyProps} collapsed={collapsed} onToggleCollapse={() => setCollapsed(!collapsed)} onNavigate={undefined} />
      </motion.aside>
    </>
  );
}
