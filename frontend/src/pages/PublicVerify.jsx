import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, Lock, AlertCircle, X, SearchX, LogIn, ArrowRight } from 'lucide-react';
import VerifyLandForm from '../components/VerifyLandForm';
import VerifyLandResult from '../components/VerifyLandResult';
import publicService from '../services/publicService';
import BrandLogo from '@/components/common/BrandLogo';
import ThemeToggle from '@/components/common/ThemeToggle';
import EmptyState from '@/components/common/EmptyState';
import Reveal from '@/components/common/Reveal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function PublicVerify() {
  const [result, setResult] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState('');

  const handleVerify = async (searchParams) => {
    setIsLoading(true);
    setResult(null);
    setNotFound(false);
    setSearchError('');

    try {
      const data = await publicService.verifyProperty(searchParams);
      if (!data) {
        setNotFound(true);
      } else {
        setResult(data);
      }
    } catch (err) {
      setSearchError(err.message || 'Unable to verify property. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setNotFound(false);
    setSearchError('');
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Simple public top bar */}
      <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 w-full max-w-[1100px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <BrandLogo size="sm" subtitle="Public Verify" />
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link to="/auth/login">
                <LogIn />
                Sign in
              </Link>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1100px] flex-1 px-4 pb-16 pt-8 sm:px-6 sm:pt-12 lg:px-8">
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="mb-8 sm:mb-10"
        >
          <Badge variant="neutral" className="mb-4 gap-1.5 px-3 py-1.5">
            <Search className="h-3.5 w-3.5" aria-hidden="true" />
            Public Land Records
          </Badge>
          <h1 className="mb-3 text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl md:text-4xl">
            Verify Land Ownership
          </h1>
          <p className="max-w-[640px] text-sm leading-relaxed text-muted-foreground sm:text-base">
            Look up any land parcel using its revenue identifiers. Records are verified against
            confirmed blockchain state. This is a public, read-only service — no login required.
          </p>
        </motion.div>

        {/* Privacy notice */}
        <Reveal className="mb-8">
          <Alert className="border-info/30 bg-info/15 text-info-foreground [&>svg]:text-info-foreground">
            <Lock className="h-4 w-4" />
            <AlertDescription className="text-xs leading-relaxed text-muted-foreground">
              <strong className="text-foreground">Privacy Notice: </strong>
              Personal information (owner name, contact, identity documents) is not disclosed on this
              public page in compliance with applicable data protection obligations. To view masked
              owner details, please{' '}
              <Link to="/auth/login" className="font-semibold text-foreground underline underline-offset-2 hover:opacity-75">
                sign in as a registered citizen
              </Link>
              .
            </AlertDescription>
          </Alert>
        </Reveal>

        {/* Search error */}
        <AnimatePresence>
          {searchError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <Alert variant="destructive" className="pr-12">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs font-semibold">{searchError}</AlertDescription>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSearchError('')}
                  aria-label="Dismiss error"
                  className="absolute right-2 top-2 h-7 w-7 text-destructive hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <div className="mb-8">
          <VerifyLandForm onVerify={handleVerify} isLoading={isLoading} onReset={handleReset} />
        </div>

        {/* Not found */}
        <AnimatePresence>
          {notFound && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-8"
            >
              <Card className="shadow-card">
                <EmptyState
                  icon={SearchX}
                  title="No Record Found"
                  description="No land parcel matching the provided details was found in the registry. Please double-check the State, District, Tehsil, Village, and Khasra Number."
                  action={
                    <Button variant="outline" onClick={handleReset}>
                      Try another search
                    </Button>
                  }
                />
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result */}
        <VerifyLandResult result={!isLoading ? result : null} isPublic={true} onClose={handleReset} />

        {/* CTA footer */}
        <Reveal className="mt-10">
          <Card className="shadow-card">
            <CardContent className="flex flex-col items-start gap-6 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
              <div>
                <h3 className="mb-1 text-base font-bold">Own a registered property?</h3>
                <p className="max-w-sm text-xs leading-relaxed text-muted-foreground">
                  Citizens can sign in to initiate a land transfer application, track application
                  status, and download e-Registry certificates.
                </p>
              </div>
              <Button asChild className="shrink-0 font-bold">
                <Link to="/auth/login">
                  Sign In
                  <ArrowRight />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </Reveal>
      </main>

      <footer className="border-t py-6 text-center text-xs text-muted-foreground">
        B.H.U.M.I. prototype (not an official government service)
      </footer>
    </div>
  );
}
