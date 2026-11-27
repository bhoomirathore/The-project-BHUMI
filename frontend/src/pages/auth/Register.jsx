import React, { useMemo, useState } from 'react';
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
  CheckCircle2,
  UserPlus,
} from 'lucide-react';
import authService from '../../services/authService';
import BrandLogo from '@/components/common/BrandLogo';
import ThemeToggle from '@/components/common/ThemeToggle';
import { staggerContainer, staggerItem } from '@/components/common/Reveal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const TRUST_POINTS = [
  { icon: ShieldCheck, title: 'Your identity, protected', text: 'KYC details are never exposed on public pages.' },
  { icon: Blocks, title: 'Ledger-backed ownership', text: 'Transfers are finalized and synchronized on-chain.' },
  { icon: FileCheck, title: 'Track every application', text: 'Follow mutation and transfer status step by step.' },
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

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    terms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const strength = useMemo(() => scorePassword(formData.password), [formData.password]);
  const phoneTouched = formData.phone.length > 0;
  const phoneValid = /^\d{10}$/.test(formData.phone.trim());
  const confirmTouched = formData.confirmPassword.length > 0;
  const passwordsMatch = formData.password === formData.confirmPassword;

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const cleanPhone = formData.phone.trim();
    if (!/^\d{10}$/.test(cleanPhone)) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!formData.terms) {
      setError('You must accept the terms and conditions.');
      return;
    }

    setLoading(true);
    try {
      const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`;
      await authService.register({
        name: fullName,
        email: formData.email.trim(),
        phone: cleanPhone,
        password: formData.password,
      });

      setSuccess('Account created successfully! Redirecting to login...');
      toast.success('Account created', { description: 'Redirecting you to sign in.' });
      setTimeout(() => {
        navigate('/auth/login');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background p-3 text-foreground sm:p-4 md:p-6">
      <div className="absolute right-4 top-4 z-20 sm:right-6 sm:top-6">
        <ThemeToggle variant="outline" />
      </div>

      <div className="grid w-full max-w-[1200px] grid-cols-1 overflow-hidden rounded-2xl border bg-card shadow-card md:min-h-[760px] md:grid-cols-2">
        {/* Left panel (desktop only) */}
        <div className="bg-grid relative hidden flex-col justify-center overflow-hidden border-r bg-muted/40 p-12 md:flex lg:p-16">
          <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />

          <div className="relative z-10">
            <BrandLogo size="lg" className="mb-8" />
            <h1 className="mb-4 text-3xl font-extrabold leading-tight tracking-tight lg:text-4xl">
              Join B.H.U.M.I Today
            </h1>
            <p className="mb-10 text-lg text-muted-foreground">
              Create your citizen account and start managing land records digitally
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
        <div className="flex flex-col justify-center overflow-y-auto bg-background p-4 sm:p-8 md:p-10 lg:p-12">
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
                <CardTitle className="text-2xl font-extrabold sm:text-3xl">Create Account</CardTitle>
                <CardDescription>Citizen Registration</CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-xs font-semibold">{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="mb-4 border-success/30 bg-success/15 text-success-foreground [&>svg]:text-success-foreground">
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription className="text-xs font-semibold">{success}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleRegister} className="flex flex-col gap-3.5 sm:gap-4">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        type="text"
                        id="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="Rajesh"
                        autoComplete="given-name"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        type="text"
                        id="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Singh"
                        autoComplete="family-name"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your.email@example.com"
                      autoComplete="email"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="phone">Mobile Number (10 Digits)</Label>
                    <Input
                      type="tel"
                      id="phone"
                      inputMode="numeric"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="9876543210"
                      maxLength={10}
                      autoComplete="tel-national"
                      aria-invalid={phoneTouched && !phoneValid}
                      aria-describedby="phone-hint"
                      required
                      className={cn('font-mono', phoneTouched && !phoneValid && 'border-destructive focus-visible:ring-destructive')}
                    />
                    <p id="phone-hint" className={cn('text-xs', phoneTouched && !phoneValid ? 'text-destructive' : 'text-muted-foreground')}>
                      {phoneTouched && !phoneValid
                        ? 'Mobile number must be exactly 10 digits.'
                        : 'Used for OTP and application updates.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          id="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Create password"
                          autoComplete="new-password"
                          required
                          className="pr-10"
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
                              className="absolute right-0.5 top-1/2 h-8 w-8 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                              {showPassword ? <EyeOff /> : <Eye />}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{showPassword ? 'Hide password' : 'Show password'}</TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Re-enter password"
                        autoComplete="new-password"
                        aria-invalid={confirmTouched && !passwordsMatch}
                        required
                        className={cn(confirmTouched && !passwordsMatch && 'border-destructive focus-visible:ring-destructive')}
                      />
                      {confirmTouched && !passwordsMatch && (
                        <p className="text-xs text-destructive">Passwords do not match.</p>
                      )}
                    </div>
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
                          !formData.password && 'text-muted-foreground'
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
                      Use 8+ characters with upper and lower case, a number and a symbol.
                    </p>
                  </div>

                  <div className="mt-1 flex items-start gap-2">
                    <Checkbox
                      id="terms"
                      checked={formData.terms}
                      onCheckedChange={(v) => setFormData((prev) => ({ ...prev, terms: v === true }))}
                      className="mt-0.5"
                      required
                    />
                    <Label htmlFor="terms" className="cursor-pointer text-xs font-normal leading-relaxed text-muted-foreground">
                      I agree to the <span className="font-semibold text-foreground underline underline-offset-2">Terms &amp; Conditions</span> and{' '}
                      <span className="font-semibold text-foreground underline underline-offset-2">Privacy Policy</span>
                    </Label>
                  </div>

                  <Button type="submit" size="lg" disabled={loading} className="mt-2 w-full font-bold">
                    {loading ? <Loader2 className="animate-spin" /> : <UserPlus />}
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Button>

                  <div className="mt-1 text-center text-xs text-muted-foreground sm:text-sm">
                    Already have an account?{' '}
                    <Link to="/auth/login" className="font-bold text-foreground underline-offset-4 hover:underline">
                      Sign In
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
