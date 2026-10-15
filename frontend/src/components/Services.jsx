import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, ShieldCheck, Landmark, Check, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Reveal, { staggerContainer, staggerItem } from '@/components/common/Reveal';
import { cn } from '@/lib/utils';

const servicesData = [
  { number: '01', Icon: User, title: 'For Citizens', featured: false, route: '/citizen/dashboard', items: ['Land ownership verification', 'Registry appointment booking', 'E-registry download', 'Transaction history'] },
  { number: '02', Icon: ShieldCheck, title: 'For Local Authorities', featured: true, route: '/authority/dashboard', items: ['Document verification', 'eKYC processing', 'Registry & mutation', 'Blockchain integration'] },
  { number: '03', Icon: Landmark, title: 'For Government HQ', featured: false, route: '/government/dashboard', items: ['Registry monitoring', 'Analytics & reports', 'Tehsil-wise tracking', 'Dispute management'] },
];

export default function Services() {
  const navigate = useNavigate();

  return (
    <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8" id="services">
      <div className="mx-auto max-w-[1300px]">
        <Reveal className="mb-10 text-center sm:mb-14">
          <div className="mb-2 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-muted-foreground">Portals</div>
          <h2 className="section-title">Our Services</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">Comprehensive land management solutions</p>
        </Reveal>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {servicesData.map(({ number, Icon, title, featured, route, items }) => (
            <motion.div key={number} variants={staggerItem} className={cn(featured && 'lg:-mt-4 lg:mb-4')}>
              <Card
                className={cn(
                  'card-interactive group relative h-full overflow-hidden shadow-card',
                  featured ? 'border-2 border-primary/30 bg-card' : 'bg-card/70'
                )}
              >
                {featured && (
                  <Badge className="absolute right-4 top-4 z-10 text-[0.62rem] uppercase tracking-wide">Most used</Badge>
                )}
                <div className="pointer-events-none absolute right-5 top-4 select-none text-5xl font-black text-primary/10 transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-110 sm:text-6xl">
                  {number}
                </div>
                <CardContent className="flex h-full flex-col p-6 sm:p-8">
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="mb-5 text-xl font-bold sm:text-2xl">{title}</h3>
                  <ul className="mb-8 flex-1 space-y-2.5" role="list">
                    {items.map((item) => (
                      <li key={item} className="flex items-center gap-2.5 border-b border-border/60 py-1.5 text-sm text-muted-foreground">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-success-foreground">
                          <Check className="h-3 w-3" aria-hidden="true" />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant={featured ? 'default' : 'outline'}
                    className={cn('group/btn w-full font-bold', !featured && 'border-2 border-primary hover:bg-primary hover:text-primary-foreground')}
                    onClick={() => navigate(route)}
                  >
                    Access Portal
                    <ArrowRight className="transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
