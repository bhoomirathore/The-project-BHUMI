import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileDown, Eye, Search, FileCheck2, Copy, Landmark, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import applicationService from '@/services/applicationService';
import propertyService from '@/services/propertyService';
import documentService from '@/services/documentService';
import Section from '@/components/common/Section';
import EmptyState from '@/components/common/EmptyState';
import { staggerContainer, staggerItem } from '@/components/common/Reveal';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getDistricts } from '@/api/mock/locations';

const ALL_DISTRICTS = '__all__';

export default function ERegistryList({ onCountChange }) {
  const { user } = useAuth();
  const [searchKhasra, setSearchKhasra] = useState('');
  const [searchDistrict, setSearchDistrict] = useState('');
  const [previewDoc, setPreviewDoc] = useState(null);
  const [completedApps, setCompletedApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCompletedTransfers() {
      if (user?.id) {
        try {
          const [apps, props] = await Promise.all([
            applicationService.getUserApplications(user.id),
            propertyService.getUserProperties(user.id),
          ]);

          const completed = apps
            .filter((a) => a.applicationStatus === 'COMPLETED' || a.hasERegistry)
            .map((a) => {
              const prop = props.find((p) => p.propertyId === a.propertyId);
              return {
                id: a.registryNumber || `REG/2026/${a.id}`,
                transferId: a.id,
                propertyId: a.propertyId,
                khasra: prop?.khasraNumber || '123/1',
                district: prop?.district || 'Bhopal',
                location: `Village ${prop?.village || 'Acharpura'}, Tehsil ${prop?.tehsil || 'Huzur'}`,
                owner: a.buyerName || user.name,
                area: prop ? `${prop.areaSqFt.toLocaleString()} sq. ft` : '2,500 sq. ft',
                date: a.completedAt || a.approvedAt || '15-Jan-2026',
                txHash: a.txHash,
                status: 'Finalized and synchronized',
              };
            });

          setCompletedApps(completed);
          if (onCountChange) {
            onCountChange(completed.length);
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    }
    loadCompletedTransfers();
  }, [user]);

  const handleDownload = async (transferId) => {
    try {
      const res = await documentService.downloadERegistry(transferId);
      if (res?.isMockNotice) {
        toast.info(res.message);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to download E-Registry.');
    }
  };

  const filteredDocs = completedApps.filter((doc) => {
    const matchKhasra =
      !searchKhasra.trim() ||
      doc.khasra.toLowerCase().includes(searchKhasra.trim().toLowerCase());
    const matchDistrict =
      !searchDistrict ||
      doc.district.toLowerCase() === searchDistrict.toLowerCase();
    return matchKhasra && matchDistrict;
  });

  const truncateHash = (hash) => {
    if (!hash) return 'N/A';
    if (hash.length <= 16) return hash;
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
  };

  const copy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const hasFilters = Boolean(searchKhasra || searchDistrict);

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card className="shadow-card border-border/80 bg-card">
        <CardContent className="grid grid-cols-1 items-end gap-4 p-5 sm:grid-cols-[1.5fr_1.5fr_auto]">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="searchKhasra">Khasra Number</Label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input
                id="searchKhasra"
                value={searchKhasra}
                onChange={(e) => setSearchKhasra(e.target.value)}
                placeholder="e.g., 123/1"
                className="pl-9"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="searchDistrict">District</Label>
            <Select
              value={searchDistrict || ALL_DISTRICTS}
              onValueChange={(v) => setSearchDistrict(v === ALL_DISTRICTS ? '' : v)}
            >
              <SelectTrigger id="searchDistrict" aria-label="District">
                <SelectValue placeholder="All Districts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_DISTRICTS}>All Districts</SelectItem>
                {getDistricts('Madhya Pradesh').map((d) => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            type="button"
            variant="outline"
            disabled={!hasFilters}
            onClick={() => {
              setSearchKhasra('');
              setSearchDistrict('');
            }}
            className="gap-1.5"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Clear
          </Button>
        </CardContent>
      </Card>

      {/* Available Certificates List */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground">
            Available Registry Certificates ({filteredDocs.length})
          </h3>
          <span className="text-xs text-muted-foreground">Only completed, synchronized transfers</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {[0, 1].map((i) => (
              <Card key={i} className="shadow-card">
                <CardContent className="space-y-3 p-6">
                  <Skeleton className="h-10 w-10 rounded-xl" />
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-9 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredDocs.length === 0 ? (
          <Card className="shadow-card border-border/80">
            <EmptyState
              icon={hasFilters ? Search : Landmark}
              title={hasFilters ? 'No matching certificates' : 'No certificates yet'}
              description="No finalized E-Registry certificates found matching your criteria. Only fully completed transfers appear here."
              action={
                hasFilters ? (
                  <Button variant="outline" onClick={() => { setSearchKhasra(''); setSearchDistrict(''); }}>
                    Clear filters
                  </Button>
                ) : undefined
              }
            />
          </Card>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 gap-5 md:grid-cols-2"
          >
            {filteredDocs.map((doc) => (
              <motion.div key={doc.id} variants={staggerItem} className="h-full">
                <Card className="card-interactive flex h-full flex-col shadow-card border-border/80 bg-card">
                  <CardContent className="flex h-full flex-col p-6">
                    <div className="mb-4 flex items-center justify-between gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/15 text-success">
                        <FileCheck2 className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <Badge variant="success">Finalized &amp; Synchronized</Badge>
                    </div>
                    <h4 className="text-base font-bold text-foreground">Digital E-Registry Certificate</h4>
                    <p className="mt-0.5 font-mono text-xs text-muted-foreground">{doc.id}</p>

                    <dl className="mt-4 grid grid-cols-1 gap-x-4 gap-y-2 text-xs sm:grid-cols-2">
                      <div>
                        <dt className="text-muted-foreground">Transfer ID</dt>
                        <dd className="font-mono font-semibold text-foreground">{doc.transferId}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Property ID</dt>
                        <dd className="break-all font-mono font-semibold text-foreground">{doc.propertyId}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Khasra No</dt>
                        <dd className="font-semibold text-foreground">{doc.khasra}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Surface Area</dt>
                        <dd className="font-mono text-foreground">{doc.area}</dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-muted-foreground">Location</dt>
                        <dd className="text-foreground">{doc.location}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Finalized Date</dt>
                        <dd className="font-mono text-foreground">{doc.date}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Transaction Hash</dt>
                        <dd className="flex items-center gap-1 font-mono text-foreground">
                          <span>{truncateHash(doc.txHash)}</span>
                          {doc.txHash && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-6 w-6" aria-label="Copy transaction hash" onClick={() => copy(doc.txHash)}>
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Copy hash</TooltipContent>
                            </Tooltip>
                          )}
                        </dd>
                      </div>
                    </dl>

                    <div className="mt-auto flex flex-wrap gap-2 border-t border-border/60 pt-4">
                      <Button className="flex-1 min-h-[40px]" onClick={() => handleDownload(doc.transferId)}>
                        <FileDown className="h-4 w-4 mr-1.5" aria-hidden="true" />
                        Download PDF
                      </Button>
                      <Button variant="outline" className="min-h-[40px]" onClick={() => setPreviewDoc(doc)}>
                        <Eye className="h-4 w-4 mr-1.5" aria-hidden="true" />
                        Preview
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Preview Dialog */}
      <Dialog open={Boolean(previewDoc)} onOpenChange={(open) => { if (!open) setPreviewDoc(null); }}>
        <DialogContent className="sm:max-w-[560px]">
          {previewDoc && (
            <>
              <DialogHeader>
                <DialogTitle>Digital E-Registry Certificate Preview</DialogTitle>
                <DialogDescription>Certificate metadata as recorded in the ledger.</DialogDescription>
              </DialogHeader>
              <div className="rounded-xl border bg-muted/30 p-4">
                <div className="border-b pb-3 text-center">
                  <h4 className="text-sm font-bold text-foreground">B.H.U.M.I. (MADHYA PRADESH)</h4>
                  <p className="text-[0.7rem] uppercase tracking-wider text-muted-foreground">Digital Land Registry Certificate</p>
                </div>
                <dl className="mt-3 grid grid-cols-1 gap-y-2 font-mono text-xs sm:grid-cols-[150px_1fr]">
                  <dt className="font-bold text-muted-foreground">REGISTRY NUMBER</dt><dd className="text-foreground">{previewDoc.id}</dd>
                  <dt className="font-bold text-muted-foreground">TRANSFER REF</dt><dd className="text-foreground">{previewDoc.transferId}</dd>
                  <dt className="font-bold text-muted-foreground">PROPERTY ID</dt><dd className="break-all text-foreground">{previewDoc.propertyId}</dd>
                  <dt className="font-bold text-muted-foreground">KHASRA NUMBER</dt><dd className="text-foreground">{previewDoc.khasra}</dd>
                  <dt className="font-bold text-muted-foreground">TITLE HOLDER</dt><dd className="text-foreground">{previewDoc.owner}</dd>
                  <dt className="font-bold text-muted-foreground">LOCATION</dt><dd className="text-foreground">{previewDoc.location}</dd>
                  <dt className="font-bold text-muted-foreground">SURFACE AREA</dt><dd className="text-foreground">{previewDoc.area}</dd>
                  <dt className="font-bold text-muted-foreground">DATE FINALIZED</dt><dd className="text-foreground">{previewDoc.date}</dd>
                  <dt className="font-bold text-muted-foreground">LEDGER EVENT</dt>
                  <dd className="text-foreground">Finalized and synchronized (Tx: {truncateHash(previewDoc.txHash)})</dd>
                </dl>
              </div>
              <DialogFooter>
                <Button
                  onClick={() => {
                    handleDownload(previewDoc.transferId);
                    setPreviewDoc(null);
                  }}
                >
                  <FileDown className="h-4 w-4 mr-1.5" aria-hidden="true" />
                  Download PDF
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
