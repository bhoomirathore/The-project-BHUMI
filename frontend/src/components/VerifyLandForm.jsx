import React, { useState } from 'react';
import { Loader2, Search, RotateCcw, MapPin, AlertCircle } from 'lucide-react';
import { getStates, getDistricts, getTehsils } from '../api/mock/locations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

export default function VerifyLandForm({ onVerify, isLoading = false, onReset }) {
  const [state, setState] = useState('Uttar Pradesh');
  const [district, setDistrict] = useState('Lucknow');
  const [tehsil, setTehsil] = useState('Lucknow Sadar');
  const [village, setVillage] = useState('');
  const [khasraNumber, setKhasraNumber] = useState('');
  const [error, setError] = useState('');
  const [touched, setTouched] = useState({ village: false, khasra: false });

  const states = getStates();
  const districts = getDistricts(state);
  const tehsils = getTehsils(state, district);

  const villageInvalid = touched.village && !village.trim();
  const khasraInvalid = touched.khasra && !khasraNumber.trim();

  const handleStateChange = (newState) => {
    setState(newState);
    const newDistricts = getDistricts(newState);
    setDistrict(newDistricts[0] || '');
    const newTehsils = getTehsils(newState, newDistricts[0] || '');
    setTehsil(newTehsils[0] || '');
  };

  const handleDistrictChange = (newDist) => {
    setDistrict(newDist);
    const newTehsils = getTehsils(state, newDist);
    setTehsil(newTehsils[0] || '');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setTouched({ village: true, khasra: true });

    if (!village.trim() || !khasraNumber.trim()) {
      setError('Please provide Village and Khasra Number.');
      return;
    }

    onVerify({
      state,
      district,
      tehsil,
      village: village.trim(),
      khasraNumber: khasraNumber.trim(),
    });
  };

  const handleResetForm = () => {
    setVillage('');
    setKhasraNumber('');
    setError('');
    setTouched({ village: false, khasra: false });
    if (onReset) onReset();
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <MapPin className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <CardTitle className="text-xl font-bold">Land Verification Form</CardTitle>
            <CardDescription className="mt-1">
              Verify land records directly against synchronized blockchain state
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs font-semibold">{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="state">State *</Label>
              <Select value={state} onValueChange={handleStateChange}>
                <SelectTrigger id="state" aria-label="State">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {states.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="district">District *</Label>
              <Select value={district} onValueChange={handleDistrictChange}>
                <SelectTrigger id="district" aria-label="District">
                  <SelectValue placeholder="Select district" />
                </SelectTrigger>
                <SelectContent>
                  {districts.map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="tehsil">Tehsil *</Label>
              <Select value={tehsil} onValueChange={setTehsil}>
                <SelectTrigger id="tehsil" aria-label="Tehsil">
                  <SelectValue placeholder="Select tehsil" />
                </SelectTrigger>
                <SelectContent>
                  {tehsils.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="village">Village *</Label>
              <Input
                type="text"
                id="village"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, village: true }))}
                placeholder="e.g., Rampur, Shyampur"
                aria-invalid={villageInvalid}
                aria-describedby={villageInvalid ? 'village-error' : undefined}
                required
                className={cn(villageInvalid && 'border-destructive focus-visible:ring-destructive')}
              />
              {villageInvalid && (
                <p id="village-error" className="text-xs text-destructive">Village is required.</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="khasra">Khasra Number *</Label>
            <Input
              type="text"
              id="khasra"
              value={khasraNumber}
              onChange={(e) => setKhasraNumber(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, khasra: true }))}
              placeholder="e.g., 123/1, 456/2"
              aria-invalid={khasraInvalid}
              aria-describedby={khasraInvalid ? 'khasra-error' : 'khasra-hint'}
              required
              className={cn('font-mono', khasraInvalid && 'border-destructive focus-visible:ring-destructive')}
            />
            {khasraInvalid ? (
              <p id="khasra-error" className="text-xs text-destructive">Khasra number is required.</p>
            ) : (
              <p id="khasra-hint" className="text-xs text-muted-foreground">
                Khasra numbers are unique within a village revenue boundary
              </p>
            )}
          </div>

          <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row">
            <Button type="button" variant="outline" onClick={handleResetForm} disabled={isLoading}>
              <RotateCcw />
              Reset Form
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1 font-bold">
              {isLoading ? <Loader2 className="animate-spin" /> : <Search />}
              {isLoading ? 'Verifying Records...' : 'Verify Now'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
