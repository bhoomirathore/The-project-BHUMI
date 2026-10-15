import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Hash, Ruler, BadgeCheck, Link2, History, ShieldCheck, SearchX } from 'lucide-react';
import VerifyLandForm from '../../components/VerifyLandForm';
import VerifyLandResult from '../../components/VerifyLandResult';
import publicService from '../../services/publicService';
import AppShell from '@/components/layout/AppShell';
import PageHeader from '@/components/common/PageHeader';
import EmptyState from '@/components/common/EmptyState';
import { staggerContainer, staggerItem } from '@/components/common/Reveal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const WHAT_YOU_GET = [
  { icon: Hash, text: 'Property ID & Khasra Details' },
  { icon: Ruler, text: 'Surface Area & Classification' },
  { icon: BadgeCheck, text: 'Registration Status' },
  { icon: Link2, text: 'Blockchain Transaction Reference' },
  { icon: History, text: 'Ownership History' },
];

export default function CitizenVerifyLand() {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const handleVerify = async (searchParams) => {
    setIsLoading(true);
    setNotFound(false);
    setResult(null);

    try {
      const data = await publicService.verifyProperty(searchParams);
      if (data) {
        setResult(data);
      } else {
        setNotFound(true);
      }
    } catch (err) {
      console.error(err);
      setNotFound(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setNotFound(false);
  };

  return (
    <AppShell portal="citizen">
      <PageHeader
        eyebrow="Citizen Portal"
        title="Verify Land Ownership"
        description="Check parcel ownership records against the synchronized blockchain ledger"
      />

      <section className="mb-10 grid grid-cols-1 gap-6 lg:grid-cols-[1.5fr_1fr] lg:gap-8">
        <div>
          <VerifyLandForm onVerify={handleVerify} isLoading={isLoading} onReset={handleReset} />

          <AnimatePresence>
            {notFound && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mt-4"
              >
                <Card className="border-destructive/30 bg-destructive/15">
                  <EmptyState
                    compact
                    icon={SearchX}
                    title="No matching record"
                    description="No matching land parcel record found for the provided details. Please verify your Village and Khasra number."
                    action={
                      <Button variant="outline" size="sm" onClick={handleReset}>
                        Try again
                      </Button>
                    }
                  />
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Info cards */}
        <motion.div variants={staggerContainer} initial="hidden" animate="show" className="flex flex-col gap-6">
          <motion.div variants={staggerItem}>
            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold">What You'll Get</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="flex flex-col gap-2.5 text-xs text-muted-foreground sm:text-sm">
                  {WHAT_YOU_GET.map(({ icon: Icon, text }) => (
                    <li key={text} className="flex items-center gap-2.5">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                      </span>
                      {text}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={staggerItem}>
            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base font-bold">
                  <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />
                  Privacy &amp; Security
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Per B.H.U.M.I. security architecture, personal identification numbers, contact details, and sensitive documents are protected and not publicly exposed. Logged-in citizens view masked party initials.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </section>

      <VerifyLandResult result={result} isPublic={false} onClose={() => setResult(null)} />
    </AppShell>
  );
}
