import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  ShieldCheck,
  Blocks,
  FileCheck,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  LogIn,
  User,
  Landmark,
  Building2,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { isMockMode } from '../../api/client';
import BrandLogo from '@/components/common/BrandLogo';
import ThemeToggle from '@/components/common/ThemeToggle';
import { staggerContainer, staggerItem } from '@/components/common/Reveal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const TRUST_POINTS = [
  { icon: ShieldCheck, title: 'Tamper-proof records', text: 'Every title change is sealed with a cryptographic proof.' },
  { icon: Blocks, title: 'Blockchain synchronized', text: 'Registry state mirrors the confirmed ledger in real time.' },
  { icon: FileCheck, title: 'Verified e-Registry', text: 'Download certificates that anyone can independently verify.' },
];

// Mock login only matches on email; any password is accepted.
const DEMO_ACCOUNTS = [
  { role: 'Citizen', email: 'rajesh.singh@example.com', icon: User },
  { role: 'Registrar', email: 'ramesh.sharma@example.com', icon: Landmark },
  { role: 'HQ', email: 'mukesh.kumar@example.com', icon: Building2 },
];
const DEMO_PASSWORD = 'demo1234';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      if (user.role === 'CITIZEN') {
        navigate('/citizen/dashboard');
      } else if (user.role === 'REGISTRAR') {
        navigate('/authority/dashboard');
      } else if (user.role === 'GOVERNMENT_HQ') {
        navigate('/government/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (acct) => {
    setEmail(acct.email);
    setPassword(DEMO_PASSWORD);
    setError('');
    toast.info(`${acct.role} demo credentials filled`, { description: acct.email });
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background p-3 text-foreground sm:p-4 md:p-6">
      <div className="absolute right-4 top-4 z-20 sm:right-6 sm:top-6">
        <ThemeToggle variant="outline" />
      </div>

      <div className="grid w-full max-w-[1200px] grid-cols-1 overflow-hidden rounded-2xl border bg-card shadow-card md:min-h-[720px] md:grid-cols-2">
        {/* Left panel (desktop only) */}
        <div className="bg-grid relative hidden flex-col justify-center overflow-hidden border-r bg-muted/40 p-12 md:flex lg:p-16">
          <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />

          <div className="relative z-10">
            <BrandLogo size="lg" className="mb-8" />
            <h1 className="mb-4 text-3xl font-extrabold leading-tight tracking-tight lg:text-4xl">
              Digital Land Registry System
            </h1>
            <p className="mb-10 text-lg text-muted-foreground">
              Securing land rights through blockchain technology
            </p>

            <motion.ul
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="flex flex-col gap-4"
            >
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
                <CardTitle className="text-2xl font-extrabold sm:text-3xl">Welcome Back</CardTitle>
                <CardDescription>Sign in to access your account</CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert variant="destructive" className="mb-5">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-xs font-semibold">{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleLogin} className="flex flex-col gap-4 sm:gap-5">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      autoComplete="email"
                      required
                      className="h-11"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        required
                        className="h-11 pr-11"
                      />
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowPassword((v) => !v)}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                            aria-pressed={showPassword}
                            className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showPassword ? <EyeOff /> : <Eye />}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>{showPassword ? 'Hide password' : 'Show password'}</TooltipContent>
                      </Tooltip>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="remember"
                      checked={remember}
                      onCheckedChange={(v) => setRemember(v === true)}
                    />
                    <Label htmlFor="remember" className="cursor-pointer text-xs font-normal text-muted-foreground sm:text-sm">
                      Remember me
                    </Label>
                  </div>

                  <Button type="submit" size="lg" disabled={loading} className="mt-1 w-full font-bold">
                    {loading ? <Loader2 className="animate-spin" /> : <LogIn />}
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>

                  <div className="mt-2 text-center text-xs text-muted-foreground sm:text-sm">
                    Don't have an account?{' '}
                    <Link to="/auth/register" className="font-bold text-foreground underline-offset-4 hover:underline">
                      Sign Up
                    </Link>
                  </div>
                </form>

                {isMockMode() && (
                  <div className="mt-5 rounded-lg border bg-muted/30 p-3">
                    <div className="mb-2 text-[0.72rem] font-bold uppercase tracking-wider text-muted-foreground">
                      Demo Accounts
                    </div>
                    <ul className="flex flex-col gap-1">
                      {DEMO_ACCOUNTS.map((acct) => {
                        const Icon = acct.icon;
                        return (
                          <li key={acct.email}>
                            <button
                              type="button"
                              onClick={() => fillDemo(acct)}
                              className="group flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-xs transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            >
                              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                              </span>
                              <span className="w-16 shrink-0 font-semibold">{acct.role}</span>
                              <span className="min-w-0 flex-1 truncate font-mono text-muted-foreground group-hover:text-foreground">
                                {acct.email}
                              </span>
                              <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                    <p className="mt-2 text-[0.68rem] text-muted-foreground">Click a row to fill the form. Any password works in demo mode.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <div className="mt-5 text-center text-xs text-muted-foreground">
            B.H.U.M.I. prototype (not an official government service)
          </div>
        </div>
      </div>
    </div>
  );
}
