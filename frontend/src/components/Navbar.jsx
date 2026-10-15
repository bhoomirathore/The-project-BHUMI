import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Menu, ArrowRight, SearchCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import BrandLogo from '@/components/common/BrandLogo';
import ThemeToggle from '@/components/common/ThemeToggle';
import { cn } from '@/lib/utils';

const LINKS = [
  { id: '#about', label: 'About' },
  { id: '#features', label: 'Features' },
  { id: '#services', label: 'Services' },
  { id: '#contact', label: 'Contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.3 });

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Highlight the section currently in view
  useEffect(() => {
    const sections = LINKS.map((l) => document.querySelector(l.id)).filter(Boolean);
    if (!sections.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActive(`#${e.target.id}`); });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  const scrollTo = (e, id) => {
    e.preventDefault();
    setOpen(false);
    const target = document.querySelector(id);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav
      className={cn(
        'fixed inset-x-0 top-0 z-[60] border-b backdrop-blur-xl transition-all duration-300',
        isScrolled ? 'bg-background/90 py-2.5 shadow-soft' : 'border-transparent bg-background/70 py-4'
      )}
    >
      <motion.div style={{ scaleX: progress }} className="absolute inset-x-0 bottom-[-1px] h-[2px] origin-left bg-primary" aria-hidden="true" />
      <div className="page-container flex items-center justify-between">
        <BrandLogo size="md" to={null} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />

        <ul className="hidden items-center gap-1 md:flex" role="list">
          {LINKS.map((l) => (
            <li key={l.id}>
              <a
                href={l.id}
                onClick={(e) => scrollTo(e, l.id)}
                className={cn(
                  'relative rounded-md px-3 py-1.5 text-[0.92rem] font-medium text-muted-foreground transition-colors hover:text-foreground',
                  active === l.id && 'text-foreground'
                )}
              >
                {l.label}
                {active === l.id && (
                  <motion.span layoutId="nav-underline" className="absolute inset-x-3 -bottom-0.5 h-[2px] rounded-full bg-primary" />
                )}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <Button variant="outline" onClick={() => navigate('/auth/login')}>Sign In</Button>
          <Button onClick={() => navigate('/auth/register')} className="group">
            Get Started
            <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
          </Button>
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <Button variant="outline" size="icon" aria-label="Open menu" onClick={() => setOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-[300px]">
          <SheetHeader className="text-left">
            <SheetTitle><BrandLogo size="sm" to={null} onClick={() => { setOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} /></SheetTitle>
            <SheetDescription>Blockchain-backed land registry</SheetDescription>
          </SheetHeader>
          <ul className="mt-6 flex flex-col gap-1" role="list">
            {LINKS.map((l) => (
              <li key={l.id}>
                <a href={l.id} onClick={(e) => scrollTo(e, l.id)} className="block rounded-lg px-3 py-2.5 text-base font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <Separator className="my-5" />
          <div className="flex flex-col gap-2">
            <Button variant="outline" className="w-full" onClick={() => { setOpen(false); navigate('/verify'); }}>
              <SearchCheck /> Verify Land
            </Button>
            <Button variant="secondary" className="w-full" onClick={() => { setOpen(false); navigate('/auth/login'); }}>Sign In</Button>
            <Button className="w-full" onClick={() => { setOpen(false); navigate('/auth/register'); }}>Get Started</Button>
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
}
