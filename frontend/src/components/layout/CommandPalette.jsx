import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Moon, Sun, Home, SearchCheck } from 'lucide-react';
import { useTheme } from 'next-themes';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { PORTAL_NAV, portalForRole } from '@/config/navigation';
import { useAuth } from '../../hooks/useAuth';

/**
 * Global Ctrl/Cmd+K palette for jumping between portal pages.
 */
export default function CommandPalette({ open, onOpenChange, portal: portalProp = 'citizen' }) {
  const navigate = useNavigate();
  const { setTheme, resolvedTheme } = useTheme();
  const { user } = useAuth();
  // Always search only the current role's nav entries.
  const portal = user?.role ? portalForRole(user.role) : portalProp;
  const sections = PORTAL_NAV[portal] || PORTAL_NAV.citizen;

  useEffect(() => {
    const down = (e) => {
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open, onOpenChange]);

  const run = (fn) => { onOpenChange(false); fn(); };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Jump to a page or action…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {sections.map((sec) => (
          <CommandGroup key={sec.label} heading={sec.label}>
            {sec.links.map((link) => {
              const Icon = link.icon;
              return (
                <CommandItem key={link.to} value={`${link.label} ${link.keywords || ''}`} onSelect={() => run(() => navigate(link.to))}>
                  <Icon className="mr-2 h-4 w-4" /> {link.label}
                </CommandItem>
              );
            })}
          </CommandGroup>
        ))}
        <CommandSeparator />
        <CommandGroup heading="Quick actions">
          <CommandItem value="public verify land" onSelect={() => run(() => navigate('/verify'))}>
            <SearchCheck className="mr-2 h-4 w-4" /> Public land verification
          </CommandItem>
          <CommandItem value="landing home" onSelect={() => run(() => navigate('/'))}>
            <Home className="mr-2 h-4 w-4" /> Go to landing page
          </CommandItem>
          <CommandItem value="toggle theme dark light" onSelect={() => run(() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark'))}>
            {resolvedTheme === 'dark' ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
            Toggle {resolvedTheme === 'dark' ? 'light' : 'dark'} mode
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
