import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, UserCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function BuyerStep({
  buyerQuery,
  onChangeBuyerQuery,
  onSearchBuyer,
  buyerSearching,
  buyerResult,
  buyerError,
  error,
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 id="step-heading" className="text-lg font-bold text-foreground outline-none" tabIndex={-1}>
          Buyer Identification
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Search for the registered buyer by registered email address or 10-digit mobile phone number.
        </p>
      </div>

      <form onSubmit={onSearchBuyer} noValidate className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex flex-1 flex-col gap-1.5">
          <Label htmlFor="buyerQuery">Buyer email or mobile phone</Label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              id="buyerQuery"
              type="text"
              placeholder="e.g., suresh.singh@example.com or 9876543211"
              value={buyerQuery}
              onChange={(e) => onChangeBuyerQuery(e.target.value)}
              aria-invalid={!!buyerError}
              aria-describedby={buyerError ? 'buyer-error' : 'buyer-hint'}
              className="pl-9"
            />
          </div>
          {buyerError ? (
            <p id="buyer-error" role="alert" className="text-xs text-destructive">{buyerError}</p>
          ) : (
            <p id="buyer-hint" className="text-xs text-muted-foreground">
              Buyer must already have a citizen account on B.H.U.M.I.
            </p>
          )}
        </div>
        <Button type="submit" disabled={buyerSearching}>
          {buyerSearching ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Searching...
            </>
          ) : (
            <>
              <Search className="h-4 w-4" aria-hidden="true" />
              Search Buyer
            </>
          )}
        </Button>
      </form>

      <AnimatePresence>
        {buyerResult && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-xl border border-success/30 bg-success/5 p-5"
          >
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h3 className="flex items-center gap-2 text-sm font-bold text-foreground">
                <UserCheck className="h-4 w-4 text-success" aria-hidden="true" />
                Buyer Record Verified
              </h3>
              <Badge variant="success">KYC: {buyerResult.kycStatus}</Badge>
            </div>
            <dl className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-3">
              <div>
                <dt className="text-muted-foreground">Legal Name</dt>
                <dd className="font-semibold text-foreground text-sm mt-0.5">{buyerResult.maskedName}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Email</dt>
                <dd className="break-all font-semibold text-foreground mt-0.5">{buyerResult.email}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Phone</dt>
                <dd className="font-mono font-semibold text-foreground mt-0.5">+91 {buyerResult.phone}</dd>
              </div>
            </dl>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <p className="text-xs font-semibold text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
