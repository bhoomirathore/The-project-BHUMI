import React, { useState, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle2,
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
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const TRUST_POINTS = [
  { icon: ShieldCheck, title: 'Bcrypt Hash Security', text: 'Passwords are salted and cryptographically hashed.' },
  { icon: Blocks, title: 'Session Invalidation', text: 'All past logins across all devices are terminated.' },
  { icon: FileCheck, title: 'Single-Use Token', text: 'The reset token expires and cannot be reused.' },
];

function scorePassword(pw) {
  if (!pw) return { score: 0, label: 'Enter a password', tone: '[&>div]:bg-muted-foreground/40' };
  let s = 0;
  if (pw.length >= 8) s += 1;
  if (pw.length >= 12) s += 1;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s += 1;
  if (/\d/.test(pw)) s += 1;
  if (/[^A-Za-z0-9]/.test(pw)) s += 1;
  const pct = Math.min(100, Math.round((s / 5) * 100));
  if (s <= 1) return { score: Math.max(pct, 15), label: 'Weak', tone: '[&>div]:bg-destructive' };
  if (s <= 3) return { score: pct, label: 'Fair', tone: '[&>div]:bg-warning' };
  return { score: pct, label: 'Strong', tone: '[&>div]:bg-success' };
}

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const strength = useMemo(() => scorePassword(password), [password]);
  const confirmTouched = confirmPassword.length > 0;
  const passwordsMatch = password === confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!token || !email) {
      setError('Invalid or missing password reset link. Please request a new one.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (!passwordsMatch) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword({ token, email, password });
      setSuccess(true);
      toast.success('Password updated successfully', {
        description: 'You can now sign in with your new password.',
      });
      setTimeout(() => {
        navigate('/auth/login');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to reset password. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background p-3 text-foreground sm:p-4 md:p-6">
      <div className="absolute right-4 top-4 z-20 sm:right-6 sm:top-6">
        <ThemeToggle variant="outline" />
      </div>

      <div className="grid w-full max-w-[1200px] grid-cols-1 overflow-hidden rounded-2xl border bg-card shadow-card md:min-h-[660px] md:grid-cols-2">
        {/* Left panel */}
        <div className="bg-grid relative hidden flex-col justify-center overflow-hidden border-r bg-muted/40 p-12 md:flex lg:p-16">
          <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />

          <div className="relative z-10">
            <BrandLogo size="lg" className="mb-8" />
            <h1 className="mb-4 text-3xl font-extrabold leading-tight tracking-tight lg:text-4xl">
              Choose New Password
            </h1>
            <p className="mb-10 text-lg text-muted-foreground">
              Set a strong, unique password to secure your digital land deeds
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
                  <Lock className="h-6 w-6" />
                </div>
                <CardTitle className="text-2xl font-extrabold sm:text-3xl">Reset Password</CardTitle>
                <CardDescription>
                  {email ? `Updating credentials for ${email}` : 'Enter your new account password'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {(!token || !email) && (
                  <Alert variant="destructive" className="mb-5">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-xs font-semibold">
                      Missing reset token or email. Please{' '}
                      <Link to="/auth/forgot-password" className="underline underline-offset-2">
                        request a new password reset link
                      </Link>
                      .
                    </AlertDescription>
                  </Alert>
                )}

                {error && (
                  <Alert variant="destructive" className="mb-5">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-xs font-semibold">{error}</AlertDescription>
                  </Alert>
                )}

                {success ? (
                  <div className="flex flex-col items-center gap-4 text-center py-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/15 text-success">
                      <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-foreground">Password Successfully Changed</h4>
                      <p className="text-sm text-muted-foreground">
                        Your password has been updated and prior sessions were closed. Redirecting to sign in...
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="password">New Password</Label>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          id="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter new password"
                          autoComplete="new-password"
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
                              className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                              {showPassword ? <EyeOff /> : <Eye />}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{showPassword ? 'Hide password' : 'Show password'}</TooltipContent>
                        </Tooltip>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter new password"
                        autoComplete="new-password"
                        required
                        className={cn(
                          'h-11',
                          confirmTouched && !passwordsMatch && 'border-destructive focus-visible:ring-destructive'
                        )}
                      />
                      {confirmTouched && !passwordsMatch && (
                        <p className="text-xs text-destructive">Passwords do not match.</p>
                      )}
                    </div>

                    {/* Password strength */}
                    <div className="flex flex-col gap-1.5" aria-live="polite">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Password strength</span>
                        <span
                          className={cn(
                            'font-semibold',
                            strength.label === 'Weak' && 'text-destructive',
                            strength.label === 'Fair' && 'text-warning-foreground',
                            strength.label === 'Strong' && 'text-success-foreground',
                            !password && 'text-muted-foreground'
                          )}
                        >
                          {strength.label}
                        </span>
                      </div>
                      <Progress
                        value={strength.score}
                        aria-label="Password strength"
                        className={cn('h-1.5 bg-muted', strength.tone)}
                      />
                      <p className="text-[0.68rem] text-muted-foreground">
                        Use 8+ characters with uppercase, lowercase, numbers, and symbols.
                      </p>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      disabled={loading || !token || !email || !passwordsMatch || password.length < 8}
                      className="mt-1 w-full font-bold"
                    >
                      {loading ? <Loader2 className="animate-spin" /> : <Lock className="h-4 w-4 mr-1" />}
                      {loading ? 'Updating password...' : 'Update Password'}
                    </Button>

                    <div className="mt-2 text-center text-xs text-muted-foreground sm:text-sm">
                      <Link to="/auth/login" className="font-bold text-foreground underline-offset-4 hover:underline">
                        Return to Sign In
                      </Link>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
