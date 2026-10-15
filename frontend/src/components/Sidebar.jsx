import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronsLeft, ChevronsRight, LogOut, Menu, Search, Settings, UserRound } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../hooks/useAuth';
import { PORTAL_META, PORTAL_NAV } from '@/config/navigation';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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
  const item = (
    <NavLink
      to={link.to}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[0.9rem] font-medium outline-none transition-all duration-200',
          'focus-visible:ring-2 focus-visible:ring-ring',
          isActive
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'text-muted-foreground hover:bg-sidebar-accent hover:text-foreground',
          collapsed && 'justify-center px-0'
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.span
              layoutId="sidebar-active-pill"
              className="absolute inset-0 rounded-lg bg-primary"
              transition={{ type: 'spring', stiffness: 400, damping: 32 }}
            />
          )}
          <Icon className={cn('relative z-10 h-[18px] w-[18px] shrink-0 transition-transform duration-200 group-hover:scale-110')} aria-hidden="true" />
          {!collapsed && <span className="relative z-10 truncate">{link.label}</span>}
        </>
      )}
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

function SidebarBody({ portal, collapsed, onToggleCollapse, onNavigate, onLogoutRequest, onOpenSearch }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const meta = PORTAL_META[portal] || PORTAL_META.citizen;
  const sections = PORTAL_NAV[portal] || PORTAL_NAV.citizen;

  const displayName = user?.name || meta.name;
  const displayAvatar = user?.avatar || (user?.name ? initials(user.name) : meta.avatar);
  const displayRole = user?.role === 'CITIZEN' ? 'Citizen' : meta.role;
  const displayBadge = user?.role || meta.badge;

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      {/* Header */}
      <div className={cn('flex items-center border-b border-sidebar-border bg-background/50 p-4', collapsed ? 'justify-center' : 'justify-between')}>
        <BrandLogo size="sm" subtitle={collapsed ? undefined : meta.sub} showText={!collapsed} to="/" />
        {!collapsed && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onToggleCollapse} className="hidden h-8 w-8 md:inline-flex" aria-label="Collapse sidebar">
                <ChevronsLeft className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Collapse</TooltipContent>
          </Tooltip>
        )}
      </div>

      {/* User card */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={cn(
              'flex w-full items-center gap-3 border-b border-sidebar-border bg-muted/30 p-3 text-left outline-none transition-colors hover:bg-sidebar-accent focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring',
              collapsed && 'justify-center'
            )}
            aria-label="Account menu"
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
            <div className="text-xs text-muted-foreground">{user?.email || displayRole}</div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => toast.info('Profile settings are not available in this prototype.')}>
            <UserRound className="mr-2 h-4 w-4" /> Profile
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => toast.info('Settings are not available in this prototype.')}>
            <Settings className="mr-2 h-4 w-4" /> Settings
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => navigate(meta.home)}>
            <Search className="mr-2 h-4 w-4" /> Go to dashboard
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive focus:text-destructive" onSelect={onLogoutRequest}>
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Search trigger */}
      <div className={cn('px-3 pt-3', collapsed && 'px-2')}>
        {collapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" className="w-full" onClick={onOpenSearch} aria-label="Search (Ctrl+K)">
                <Search className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Search · Ctrl K</TooltipContent>
          </Tooltip>
        ) : (
          <Button variant="outline" className="w-full justify-between text-muted-foreground" onClick={onOpenSearch}>
            <span className="flex items-center gap-2"><Search className="h-4 w-4" /> Quick search…</span>
            <kbd className="pointer-events-none hidden rounded border bg-muted px-1.5 font-mono text-[10px] font-medium sm:inline-block">⌘K</kbd>
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
                <div className="mb-1 px-3 text-[0.66rem] font-bold uppercase tracking-wider text-muted-foreground/80">{sec.label}</div>
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
        <ThemeToggle />
        {collapsed ? (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={onToggleCollapse} className="hidden md:inline-flex" aria-label="Expand sidebar">
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Expand</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={onLogoutRequest} aria-label="Logout">
                  <LogOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Logout</TooltipContent>
            </Tooltip>
          </>
        ) : (
          <Button variant="outline" size="sm" className="gap-2 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={onLogoutRequest}>
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        )}
      </div>
    </div>
  );
}

export default function Sidebar({ portal = 'citizen', onOpenSearch, mobileOpen, onMobileOpenChange, collapsed: collapsedProp, onCollapsedChange }) {
  const [collapsedState, setCollapsedState] = useState(readCollapsed);
  const [mobileState, setMobileState] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const collapsed = collapsedProp ?? collapsedState;
  const setCollapsed = (v) => {
    try { localStorage.setItem(STORAGE_KEY, v ? '1' : '0'); } catch { /* ignore */ }
    setCollapsedState(v);
    onCollapsedChange?.(v);
  };
  const isMobileOpen = mobileOpen ?? mobileState;
  const setMobileOpen = (v) => { setMobileState(v); onMobileOpenChange?.(v); };

  useEffect(() => { onCollapsedChange?.(collapsed); /* eslint-disable-next-line */ }, []);

  const confirmLogout = () => {
    setLogoutOpen(false);
    logout();
    toast.success('You have been signed out.');
    navigate('/auth/login');
  };

  const bodyProps = {
    portal,
    onLogoutRequest: () => setLogoutOpen(true),
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
        <SheetContent side="left" className="w-[290px] p-0 [&>button]:z-20">
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
        className="fixed left-0 top-0 z-40 hidden h-screen border-r border-sidebar-border shadow-[4px_0_30px_hsl(var(--shadow-color)/0.06)] md:block"
      >
        <SidebarBody {...bodyProps} collapsed={collapsed} onToggleCollapse={() => setCollapsed(!collapsed)} onNavigate={undefined} />
      </motion.aside>

      <AlertDialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign out of B.H.U.M.I?</AlertDialogTitle>
            <AlertDialogDescription>
              You will need to sign in again to access your portal. Any unsaved form progress will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Stay signed in</AlertDialogCancel>
            <AlertDialogAction onClick={confirmLogout} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Sign out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
