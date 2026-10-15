import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  ShieldCheck,
  ShieldAlert,
  Copy,
  X,
  RotateCcw,
  Link2,
  History,
  ArrowRight,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const truncateHash = (hash) => {
  if (!hash) return 'N/A';
  if (hash.length <= 16) return hash;
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
};

const maskName = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map((part) => (part.length > 0 ? part[0] + '***' : ''))
    .join(' ');
};

function KeyValue({ label, value, mono, bold, children }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5 text-xs">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={cn('text-right text-foreground', mono && 'font-mono', bold && 'font-bold')}>
        {children ?? value}
      </dd>
    </div>
  );
}

export default function VerifyLandResult({ result, isPublic = false, onClose }) {
  const handleCopyHash = () => {
    if (result?.txHash) {
      navigator.clipboard.writeText(result.txHash);
      toast.success('Copied', { description: 'Transaction hash copied to clipboard.' });
    }
  };

  const isMatch = result ? result.integrityCheck === 'MATCH' : false;
  const history = result?.ownershipHistory || [];

  return (
    <AnimatePresence mode="wait">
      {result && (
        <motion.section
          key={result.propertyId || 'result'}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          aria-live="polite"
          className="mb-12"
        >
          <Card className="overflow-hidden shadow-card">
            {/* Status header */}
            <div
              className={cn(
                'border-b p-5 sm:p-6',
                isMatch ? 'bg-success/15 border-success/30' : 'bg-destructive/15 border-destructive/30'
              )}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-4">
                  <motion.span
                    initial={{ scale: 0.6, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
                    className={cn(
                      'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border bg-card shadow-sm',
                      isMatch ? 'text-success-foreground border-success/30' : 'text-destructive border-destructive/30'
                    )}
                  >
                    {isMatch ? <ShieldCheck className="h-6 w-6" aria-hidden="true" /> : <ShieldAlert className="h-6 w-6" aria-hidden="true" />}
                  </motion.span>
                  <div className="min-w-0">
                    <div className="mb-1 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                      Verification Results
                    </div>
                    <h2
                      className={cn(
                        'text-base font-extrabold leading-tight sm:text-xl',
                        isMatch ? 'text-success-foreground' : 'text-destructive'
                      )}
                    >
                      {isMatch ? 'Record Found & Cryptographically Verified' : 'Record Verification Warning'}
                    </h2>
                    <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                      {result.verificationStatus || 'Verified against blockchain state'}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <Badge variant={isMatch ? 'success' : 'error'}>
                        {isMatch ? <ShieldCheck className="h-3 w-3" /> : <ShieldAlert className="h-3 w-3" />}
                        Integrity: {result.integrityCheck || 'MATCH'}
                      </Badge>
                      <Badge variant={result.registrationStatus === 'Verified' ? 'success' : 'warning'}>
                        {result.registrationStatus}
                      </Badge>
                    </div>
                  </div>
                </div>
                {onClose && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        aria-label="Close Results"
                        className="shrink-0 self-end sm:self-start"
                      >
                        <X />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Close results</TooltipContent>
                  </Tooltip>
                )}
              </div>
            </div>

            <CardContent className="p-5 sm:p-6">
              <h3 className="sr-only">Cryptographic ledger proof and title confirmation</h3>

              {/* Details grid */}
              <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-xl border bg-muted/30 p-4">
                  <h4 className="mb-2 border-b pb-2 text-sm font-bold">Parcel Identification</h4>
                  <dl className="divide-y divide-border/60">
                    <KeyValue label="Property ID" value={result.propertyId} mono bold />
                    <KeyValue label="Khasra Number" value={result.khasraNumber} mono bold />
                    <KeyValue label="Village" value={result.village} />
                    <KeyValue label="Tehsil" value={result.tehsil} />
                    <KeyValue label="District" value={result.district} />
                    <KeyValue label="State" value={result.state} />
                  </dl>
                </div>

                <div className="rounded-xl border bg-muted/30 p-4">
                  <h4 className="mb-2 border-b pb-2 text-sm font-bold">Specifications &amp; Status</h4>
                  <dl className="divide-y divide-border/60">
                    <KeyValue label="Surface Area" bold>
                      <span className="font-mono">{result.areaSqFt}</span> sq. ft
                    </KeyValue>
                    <KeyValue label="Land Classification" value={result.landType} />
                    <KeyValue label="Registration Status">
                      <Badge variant={result.registrationStatus === 'Verified' ? 'success' : 'warning'} className="text-[0.68rem]">
                        {result.registrationStatus}
                      </Badge>
                    </KeyValue>
                    <KeyValue label="Cryptographic Integrity">
                      <Badge variant={isMatch ? 'success' : 'error'} className="text-[0.68rem]">
                        {result.integrityCheck || 'MATCH'}
                      </Badge>
                    </KeyValue>
                  </dl>
                </div>

                <div className="flex flex-col justify-between gap-3 rounded-xl border bg-muted/30 p-4 md:col-span-2 lg:col-span-1">
                  <div>
                    <h4 className="mb-2 flex items-center gap-2 border-b pb-2 text-sm font-bold">
                      <Link2 className="h-4 w-4 text-primary" aria-hidden="true" />
                      Blockchain Reference
                    </h4>
                    <span className="mb-1 block text-[0.72rem] text-muted-foreground">Confirmed Transaction Hash:</span>
                    <div className="flex items-start gap-1 rounded-lg border bg-card p-2.5">
                      <code className="min-w-0 flex-1 break-all font-mono text-xs text-foreground">
                        {result.txHash || 'N/A'}
                      </code>
                      {result.txHash && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={handleCopyHash}
                              aria-label="Copy full transaction hash"
                              className="h-7 w-7 shrink-0"
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Copy Full Tx Hash</TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Ownership history */}
              <Accordion type="single" collapsible defaultValue="history" className="rounded-xl border bg-muted/30 px-4">
                <AccordionItem value="history" className="border-b-0">
                  <AccordionTrigger className="hover:no-underline">
                    <span className="flex flex-col items-start gap-1 text-left sm:flex-row sm:items-center sm:gap-3">
                      <span className="flex items-center gap-2 text-sm font-bold">
                        <History className="h-4 w-4 text-primary" aria-hidden="true" />
                        Ownership History ({history.length} Finalized Transfers)
                      </span>
                      <span className="flex items-center gap-1 text-[0.7rem] font-normal text-muted-foreground">
                        <Lock className="h-3 w-3" aria-hidden="true" />
                        {isPublic ? 'Public view (personal identities withheld)' : 'Citizen view (masked names)'}
                      </span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    {history.length === 0 ? (
                      <p className="text-xs text-muted-foreground">
                        No previous transfer history recorded on this parcel.
                      </p>
                    ) : (
                      <ol className="relative ml-2 flex flex-col gap-4 border-l pl-5">
                        {history.map((h, idx) => (
                          <motion.li
                            key={idx}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.08 * idx, duration: 0.35 }}
                            className="relative"
                          >
                            <span
                              className="absolute -left-[27px] top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-success bg-card"
                              aria-hidden="true"
                            >
                              <span className="h-1.5 w-1.5 rounded-full bg-success" />
                            </span>
                            <div className="flex flex-col gap-2 rounded-lg border bg-card p-3.5 text-xs sm:flex-row sm:items-center sm:justify-between">
                              <div className="min-w-0">
                                <div className="font-bold text-foreground">
                                  Ownership transferred, finalized on blockchain and synchronized
                                </div>
                                {!isPublic && (h.from || h.to) && (
                                  <p className="mt-1 flex items-center gap-1.5 text-[0.72rem] text-muted-foreground">
                                    Parties: <span className="font-medium text-foreground">{maskName(h.from)}</span>
                                    <ArrowRight className="h-3 w-3" aria-hidden="true" />
                                    <span className="font-medium text-foreground">{maskName(h.to)}</span>
                                  </p>
                                )}
                                <span className="mt-0.5 block text-[0.68rem] text-muted-foreground">
                                  Finalized on: <span className="font-mono">{h.date}</span>
                                </span>
                              </div>
                              {h.txHash && (
                                <Badge variant="neutral" className="self-start font-mono text-[0.68rem] sm:self-auto">
                                  Ref: {truncateHash(h.txHash)}
                                </Badge>
                              )}
                            </div>
                          </motion.li>
                        ))}
                      </ol>
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {onClose && (
                <div className="mt-6 flex justify-end">
                  <Button variant="outline" onClick={onClose}>
                    <RotateCcw />
                    Verify another
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
