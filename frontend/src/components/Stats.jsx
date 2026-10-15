import React from 'react';
import { Database, FileCheck2, MapPinned, Gauge } from 'lucide-react';
import AnimatedNumber from '@/components/common/AnimatedNumber';
import Reveal from '@/components/common/Reveal';

const statsData = [
  { target: 50000, label: 'Land Records Digitized', Icon: Database, suffix: '+' },
  { target: 15000, label: 'Successful Registrations', Icon: FileCheck2, suffix: '+' },
  { target: 200, label: 'Tehsils Connected', Icon: MapPinned, suffix: '' },
  { target: 99, label: 'Accuracy Rate', Icon: Gauge, suffix: '%' },
];

export default function Stats() {
  return (
    <section className="relative overflow-hidden border-y bg-primary px-4 py-14 text-primary-foreground sm:px-6 sm:py-20 lg:px-8" id="contact">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-[0.12] [mask-image:linear-gradient(to_bottom,transparent,black,transparent)]" style={{ filter: 'invert(1)' }} />
      <div className="mx-auto grid max-w-[1300px] grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4">
        {statsData.map(({ target, label, Icon, suffix }, i) => (
          <Reveal key={label} delay={i * 0.08} className="group text-center">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-foreground/10 text-primary-foreground transition-transform duration-300 group-hover:scale-110">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <h3 className="mb-1 text-3xl font-extrabold tracking-tight sm:text-4xl md:text-[2.8rem]">
              <AnimatedNumber value={target} suffix={suffix} />
            </h3>
            <p className="text-xs font-medium text-primary-foreground/70 sm:text-sm">{label}</p>
          </Reveal>
        ))}
      </div>
      <p className="mx-auto mt-8 max-w-[1300px] text-center text-[0.72rem] text-primary-foreground/50">
        Sample figures for demonstration only. Not representative of actual land registry data.
      </p>
    </section>
  );
}
