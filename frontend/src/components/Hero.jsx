import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';
import { ShieldCheck, Zap, BadgeCheck, ArrowRight, ChevronDown, Blocks } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const CARDS = [
  { title: 'Secure', sub: 'Blockchain Protected', Icon: ShieldCheck, pos: 'md:top-[4%] md:left-[4%]', delay: 0 },
  { title: 'Fast', sub: 'Quick Processing', Icon: Zap, pos: 'md:top-[38%] md:right-[2%]', delay: 1.5 },
  { title: 'Verified', sub: '100% Authentic', Icon: BadgeCheck, pos: 'md:bottom-[4%] md:left-[18%]', delay: 3 },
];

function FloatingCard({ title, sub, Icon, pos, delay, depth, mx, my }) {
  const x = useTransform(mx, (v) => v * depth);
  const y = useTransform(my, (v) => v * depth);
  return (
    <motion.div
      style={{ x, y }}
      className={cn(
        'card-interactive group rounded-2xl border bg-card p-5 shadow-card md:absolute md:min-w-[200px] md:animate-float',
        pos
      )}
    >
      <div className="flex items-center gap-3 md:block" style={{ animationDelay: `${delay}s` }}>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110 md:mb-3">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-base font-bold md:text-[1.1rem]">{title}</h3>
          <p className="text-xs text-muted-foreground md:text-sm">{sub}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function Hero() {
  const navigate = useNavigate();
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mx = useSpring(rawX, { stiffness: 60, damping: 20 });
  const my = useSpring(rawY, { stiffness: 60, damping: 20 });

  const onMove = (e) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    rawX.set(((e.clientX - r.left) / r.width - 0.5) * 24);
    rawY.set(((e.clientY - r.top) / r.height - 0.5) * 24);
  };
  const onLeave = () => { rawX.set(0); rawY.set(0); };

  const scrollToFeatures = () => document.querySelector('#features')?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const container = { hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } };
  const item = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } };

  return (
    <section id="about" className="relative overflow-hidden px-4 pb-16 pt-28 sm:px-6 sm:pt-32 md:pb-24 md:pt-40 lg:px-8">
      <div className="bg-grid pointer-events-none absolute inset-0 -z-10 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-primary/5 blur-[120px]" />

      <div className="mx-auto grid w-full max-w-[1300px] grid-cols-1 items-center gap-12 md:grid-cols-[1.1fr_0.9fr] md:gap-8">
        <motion.div variants={container} initial="hidden" animate="show" className="text-left">
          <motion.div variants={item}>
            <Badge variant="outline" className="mb-5 gap-2 border-primary/20 bg-card py-1 pl-1.5 pr-3 text-xs font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
              </span>
              Ledger synced · Prototype build
            </Badge>
          </motion.div>
          <motion.h1 variants={item} className="mb-5 text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.6rem]">
            Securing Land Rights
            <span className="mt-1 block bg-gradient-to-r from-muted-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
              Through Blockchain
            </span>
          </motion.h1>
          <motion.p variants={item} className="mb-8 max-w-[540px] text-base leading-relaxed text-muted-foreground sm:text-lg">
            A revolutionary digital land registry system that brings transparency,
            security, and efficiency to land ownership and transactions across India.
          </motion.p>
          <motion.div variants={item} className="flex max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:gap-4">
            <Button size="lg" className="group h-12 px-8 text-[0.95rem] font-bold shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift" onClick={() => navigate('/verify')}>
              Verify Your Land
              <ArrowRight className="transition-transform group-hover:translate-x-1" />
            </Button>
            <Button size="lg" variant="secondary" className="h-12 border px-8 text-[0.95rem] font-semibold" onClick={scrollToFeatures}>
              Learn More
              <ChevronDown className="transition-transform group-hover:translate-y-0.5" />
            </Button>
          </motion.div>
          <motion.div variants={item} className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-muted-foreground">
            <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-success" /> Immutable records</span>
            <span className="flex items-center gap-1.5"><Blocks className="h-4 w-4 text-info" /> Smart-contract mutations</span>
            <span className="flex items-center gap-1.5"><BadgeCheck className="h-4 w-4 text-warning" /> Registrar-verified</span>
          </motion.div>
        </motion.div>

        <motion.div
          ref={ref}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="w-full"
        >
          <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-3 md:block md:h-[380px]">
            <div className="pointer-events-none absolute inset-6 hidden rounded-[32px] border border-dashed border-primary/15 md:block" />
            {CARDS.map((c, i) => (
              <FloatingCard key={c.title} {...c} depth={0.5 + i * 0.35} mx={mx} my={my} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
