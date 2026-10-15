import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Mail, ArrowUp } from 'lucide-react';
import BrandLogo from '@/components/common/BrandLogo';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const QUICK = [
  { href: '#about', label: 'About Us' },
  { href: '#features', label: 'Features' },
  { href: '#services', label: 'Services' },
  { href: '#contact', label: 'Contact' },
];
const LEGAL = ['Privacy Policy', 'Terms of Service', 'Compliance', 'Support'];

export default function Footer() {
  const scrollTo = (e, id) => {
    e.preventDefault();
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <footer className="border-t bg-card/60 px-4 pb-8 pt-12 sm:px-6 sm:pt-14 lg:px-8">
      <div className="mx-auto mb-10 grid max-w-[1300px] grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <BrandLogo size="md" to={null} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="mb-3.5" />
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">Revolutionizing land registry through blockchain technology.</p>
          <div className="mt-4 flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Website" asChild>
                  <a href="/" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}><Globe className="h-4 w-4" /></a>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Website</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Email" asChild>
                  <a href="mailto:support@example.com"><Mail className="h-4 w-4" /></a>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Email</TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div>
          <h4 className="mb-3 text-base font-bold">Quick Links</h4>
          <ul className="space-y-2" role="list">
            {QUICK.map((q) => (
              <li key={q.href}>
                <a href={q.href} onClick={(e) => scrollTo(e, q.href)} className="inline-block py-0.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
                  {q.label}
                </a>
              </li>
            ))}
            <li>
              <Link to="/verify" className="inline-block py-0.5 text-sm text-muted-foreground transition-colors hover:text-foreground">Public Verification</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-base font-bold">Legal</h4>
          <ul className="space-y-2" role="list">
            {LEGAL.map((l) => (
              <li key={l}>
                <a href="#" onClick={(e) => e.preventDefault()} className="inline-block py-0.5 text-sm text-muted-foreground transition-colors hover:text-foreground">{l}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-base font-bold">Contact</h4>
          <p className="text-sm leading-relaxed text-muted-foreground">
            For support or enquiries, please use the feedback option within your portal after signing in.
          </p>
          <p className="mt-3 text-[0.72rem] leading-relaxed text-muted-foreground/80">
            This is a prototype system for demonstration purposes only. It does not represent an official government service.
          </p>
        </div>
      </div>

      <Separator className="mx-auto max-w-[1300px]" />
      <div className="mx-auto flex max-w-[1300px] flex-col items-center justify-between gap-3 pt-6 text-xs text-muted-foreground sm:flex-row">
        <p>&copy; 2026 B.H.U.M.I. Prototype. All rights reserved.</p>
        <Button variant="ghost" size="sm" className="gap-1.5" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          Back to top <ArrowUp className="h-3.5 w-3.5" />
        </Button>
      </div>
    </footer>
  );
}
