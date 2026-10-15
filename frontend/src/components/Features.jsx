import React from 'react';
import { motion } from 'framer-motion';
import { SearchCheck, CalendarClock, FileDown, Blocks, Activity, Scale, ArrowUpRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Reveal, { staggerContainer, staggerItem } from '@/components/common/Reveal';

const featuresData = [
  { Icon: SearchCheck, title: 'Land Verification', description: 'Instantly verify land ownership using Khasra number with complete transparency and accuracy.' },
  { Icon: CalendarClock, title: 'Online Appointments', description: 'Book registry appointments at your convenience without standing in long queues.' },
  { Icon: FileDown, title: 'E-Registry', description: 'Download your digital land registry certificates instantly in PDF format.' },
  { Icon: Blocks, title: 'Blockchain Security', description: 'All transactions recorded on immutable blockchain for maximum security and trust.' },
  { Icon: Activity, title: 'Real-time Tracking', description: 'Monitor your registry process from application to completion in real-time.' },
  { Icon: Scale, title: 'Dispute Resolution', description: 'Efficient handling of land disputes with transparent documentation.' },
];

export default function Features() {
  return (
    <section className="bg-card/60 px-4 py-16 sm:px-6 sm:py-24 lg:px-8" id="features">
      <div className="mx-auto max-w-[1300px]">
        <Reveal className="mb-10 text-center sm:mb-14">
          <div className="mb-2 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-muted-foreground">Features</div>
          <h2 className="section-title">Why Choose B.H.U.M.I?</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">Modern solutions for traditional land management</p>
        </Reveal>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3"
        >
          {featuresData.map(({ Icon, title, description }) => (
            <motion.div key={title} variants={staggerItem}>
              <Card className="card-interactive group relative h-full overflow-hidden bg-background shadow-card">
                <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/5 transition-transform duration-500 group-hover:scale-[1.8]" />
                <CardContent className="flex h-full flex-col p-6 sm:p-7">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold sm:text-[1.2rem]">{title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
