import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  KeyRound,
  Mail,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  ShieldCheck,
  Blocks,
  FileCheck,
} from 'lucide-react';
import authService from '../../services/authService';
import BrandLogo from '@/components/common/BrandLogo';
import ThemeToggle from '@/components/common/ThemeToggle';
import { staggerContainer, staggerItem } from '@/components/common/Reveal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

const TRUST_POINTS = [
  { icon: ShieldCheck, title: 'Cryptographic Security', text: 'Reset links are signed with single-use, time-limited tokens.' },
  { icon: Blocks, title: 'Session Invalidation', text: 'Resetting your password automatically invalidates all previous sessions.' },
  { icon: FileCheck, title: 'Verified Identity', text: 'Instructions are dispatched directly to your registered email address.' },
];

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please provide a valid email address.');
      return;
    }

    setLoading(true);
    try {
      await authService.forgotPassword(email.trim());
      setSubmitted(true);
      toast.success('Reset link dispatched', {
        description: 'Check your email for instructions to reset your password.',
      });
    } catch (err) {
      setError(err.message || 'Failed to request password reset. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background p-3 text-foreground sm:p-4 md:p-6">
      <div className="absolute right-4 top-4 z-20 sm:right-6 sm:top-6">
        <ThemeToggle variant="outline" />
      </div>

      <div className="grid w-full max-w-[1200px] grid-cols-1 overflow-hidden rounded-2xl border bg-card shadow-card md:min-h-[640px] md:grid-cols-2">
        {/* Left panel (desktop only) */}
        <div className="bg-grid relative hidden flex-col justify-center overflow-hidden border-r bg-muted/40 p-12 md:flex lg:p-16">
          <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />

          <div className="relative z-10">
            <BrandLogo size="lg" className="mb-8" />
            <h1 className="mb-4 text-3xl font-extrabold leading-tight tracking-tight lg:text-4xl">
              Account Recovery
            </h1>
            <p className="mb-10 text-lg text-muted-foreground">
              Recover access to your land records and applications securely
            </p>

            <motion.ul variants={staggerContainer} initial="hidden" animate="show" className="flex flex-col gap-4">
              {TRUST_POINTS.map(({ icon: Icon, title, text }) => (
                <motion.li key={title} variants={staggerItem} className="flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border bg-card text-primary shadow-sm">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-sm font-bold">{title}</span>
                    <span className="block text-xs text-muted-foreground">{text}</span>
                  </span>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </div>

        {/* Right panel / form */}
        <div className="flex flex-col justify-center bg-background p-4 sm:p-8 md:p-10 lg:p-14">
          <div className="mb-6 flex justify-center md:hidden">
            <BrandLogo size="md" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <Card className="shadow-card">
              <CardHeader className="items-center text-center">
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <KeyRound className="h-6 w-6" />
                </div>
                <CardTitle className="text-2xl font-extrabold sm:text-3xl">Forgot Password?</CardTitle>
                <CardDescription>
                  Enter your email address and we will send you a secure link to reset your password.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert variant="destructive" className="mb-5">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-xs font-semibold">{error}</AlertDescription>
                  </Alert>
                )}

                {submitted ? (
                  <div className="flex flex-col items-center gap-4 text-center py-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/15 text-success">
                      <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-foreground">Reset Link Dispatched</h4>
                      <p className="text-sm text-muted-foreground">
                        If an account exists for <span className="font-semibold text-foreground">{email}</span>, you will receive an email shortly with instructions to reset your password.
                      </p>
                    </div>
                    <div className="w-full pt-4">
                      <Button asChild variant="outline" className="w-full font-bold">
                        <Link to="/auth/login">
                          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Sign In
                        </Link>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Input
                          type="email"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your.email@example.com"
                          autoComplete="email"
                          required
                          className="h-11 pl-10"
                        />
                        <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                      </div>
                    </div>

                    <Button type="submit" size="lg" disabled={loading} className="mt-1 w-full font-bold">
                      {loading ? <Loader2 className="animate-spin" /> : <KeyRound className="h-4 w-4 mr-1" />}
                      {loading ? 'Sending link...' : 'Send Reset Link'}
                    </Button>

                    <div className="mt-2 text-center text-xs text-muted-foreground sm:text-sm">
                      Remember your password?{' '}
                      <Link to="/auth/login" className="font-bold text-foreground underline-offset-4 hover:underline">
                        Sign In
                      </Link>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <div className="mt-5 text-center text-xs text-muted-foreground">
            B.H.U.M.I. Security Gateway · Tamper-proof Identity
          </div>
        </div>
      </div>
    </div>
  );
}
