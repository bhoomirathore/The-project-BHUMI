import React, { useState } from 'react';
import {
  FileText,
  Upload,
  CheckCircle2,
  Copy,
  Loader2,
  AlertCircle,
  FileCheck,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';
import documentService from '@/services/documentService';
import applicationService from '@/services/applicationService';
import { DOCUMENT_TYPES, DOCUMENT_TYPE_LABELS } from '@/utils/statuses';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';

export const REQUIRED_DOC_TYPES = [
  DOCUMENT_TYPES.SALE_DEED,
  DOCUMENT_TYPES.IDENTITY_PROOF,
  DOCUMENT_TYPES.LAND_MAP,
  DOCUMENT_TYPES.ENCUMBRANCE_CERT,
  DOCUMENT_TYPES.TAX_RECEIPT,
];

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png'];

function truncateHash(hash) {
  if (!hash) return '—';
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
}

export default function DocumentUploadList({
  applicationId,
  documents = [],
  onDocumentsUpdated,
}) {
  const [rowLoading, setRowLoading] = useState({});
  const [rowError, setRowError] = useState({});
  const [dragOverType, setDragOverType] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Map uploaded documents by type
  const docMap = {};
  (documents || []).forEach((d) => {
    docMap[d.type] = d;
  });

  const uploadedCount = REQUIRED_DOC_TYPES.filter((t) => Boolean(docMap[t])).length;
  const progressPercent = Math.round((uploadedCount / REQUIRED_DOC_TYPES.length) * 100);
  const allUploaded = uploadedCount === REQUIRED_DOC_TYPES.length;

  const validateFile = (file) => {
    if (!file) return 'No file selected.';
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return 'Unsupported file format. Please upload a PDF, JPG, or PNG document.';
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return `File is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum allowed size is 10 MB.`;
    }
    return null;
  };

  const handleFileUpload = async (type, file) => {
    const errorMsg = validateFile(file);
    if (errorMsg) {
      setRowError((prev) => ({ ...prev, [type]: errorMsg }));
      toast.error(errorMsg);
      return;
    }

    setRowError((prev) => ({ ...prev, [type]: '' }));
    setRowLoading((prev) => ({ ...prev, [type]: true }));

    try {
      // 1. Perform server-side hash computation via documentService
      const uploadRes = await documentService.uploadDocument(file, type);

      // 2. Attach document to draft application
      await applicationService.addDocument(applicationId, {
        type,
        fileName: file.name,
        hash: uploadRes.hash,
      });

      toast.success(`${DOCUMENT_TYPE_LABELS[type] || type} uploaded successfully.`);
      if (onDocumentsUpdated) {
        await onDocumentsUpdated();
      }
    } catch (err) {
      console.error(err);
      const msg = err.message || 'Failed to upload document.';
      setRowError((prev) => ({ ...prev, [type]: msg }));
      toast.error(msg);
    } finally {
      setRowLoading((prev) => ({ ...prev, [type]: false }));
    }
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    setDragOverType(null);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(type, file);
    }
  };

  const handleSubmitApplication = async () => {
    setSubmitting(true);
    try {
      await applicationService.submitApplication(applicationId);
      toast.success('All documents verified and application submitted to the Registrar.');
      if (onDocumentsUpdated) {
        await onDocumentsUpdated();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to submit application.');
    } finally {
      setSubmitting(false);
      setConfirmOpen(false);
    }
  };

  const copyText = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success('Document hash copied to clipboard');
  };

  return (
    <div className="space-y-4">
      {/* Progress header */}
      <div className="rounded-xl border border-border/80 bg-muted/20 p-4">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="font-bold text-foreground">
            {uploadedCount} of {REQUIRED_DOC_TYPES.length} uploaded
          </span>
          <span className="font-mono text-muted-foreground">{progressPercent}%</span>
        </div>
        <Progress value={progressPercent} className="h-2" aria-label="Required documents progress" />
        <p className="mt-2 text-xs text-muted-foreground">
          Upload all 5 required deeds and clearance certificates before your Sub-Registrar Office appointment.
        </p>
      </div>

      {/* 5 Rows */}
      <div className="space-y-3">
        {REQUIRED_DOC_TYPES.map((type) => {
          const doc = docMap[type];
          const isLoading = rowLoading[type];
          const error = rowError[type];
          const isDragOver = dragOverType === type;
          const inputId = `file-upload-${type}`;

          return (
            <div
              key={type}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOverType(type);
              }}
              onDragLeave={() => setDragOverType(null)}
              onDrop={(e) => handleDrop(e, type)}
              className={cn(
                'rounded-xl border p-4 transition-all',
                isDragOver ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border/80 bg-card'
              )}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-start gap-3">
                  <div
                    className={cn(
                      'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border',
                      doc ? 'border-success/30 bg-success/15 text-success' : 'border-border bg-muted/40 text-muted-foreground'
                    )}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : doc ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <FileText className="h-4 w-4" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <strong className="text-sm font-semibold text-foreground">
                        {DOCUMENT_TYPE_LABELS[type]}
                      </strong>
                      {doc ? (
                        <Badge variant="success" className="text-[10px]">Uploaded</Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px] text-muted-foreground">Not uploaded</Badge>
                      )}
                    </div>

                    {doc ? (
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span className="font-medium text-foreground truncate max-w-[200px]">{doc.fileName}</span>
                        <span>·</span>
                        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px]">
                          {truncateHash(doc.hash)}
                        </code>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              aria-label="Copy document cryptographic hash"
                              onClick={() => copyText(doc.hash)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Copy SHA-256 hash</TooltipContent>
                        </Tooltip>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">PDF, JPG, PNG up to 10 MB</span>
                    )}
                  </div>
                </div>

                {/* Upload action */}
                <div className="shrink-0 flex items-center gap-2">
                  <input
                    id={inputId}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="sr-only"
                    disabled={isLoading}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(type, file);
                    }}
                  />
                  <Label
                    htmlFor={inputId}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold cursor-pointer transition-colors min-h-[36px]',
                      doc
                        ? 'border-border/80 bg-background hover:bg-muted text-foreground'
                        : 'border-primary bg-primary text-primary-foreground hover:bg-primary/90'
                    )}
                  >
                    {isLoading ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : doc ? (
                      <RefreshCw className="h-3.5 w-3.5" />
                    ) : (
                      <Upload className="h-3.5 w-3.5" />
                    )}
                    <span>{doc ? 'Replace file' : 'Upload file'}</span>
                  </Label>
                </div>
              </div>

              {error && (
                <div className="mt-2 flex items-center gap-1.5 text-xs text-destructive">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submission trigger */}
      <div className="rounded-xl border border-border/80 bg-card p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h4 className="text-sm font-bold text-foreground">Submit for Verification</h4>
            <p className="text-xs text-muted-foreground">
              Once all 5 required documents are attached, submit this draft for official Sub-Registrar review.
            </p>
          </div>
          <Button
            type="button"
            disabled={!allUploaded || submitting}
            onClick={() => setConfirmOpen(true)}
            className="gap-2 font-bold px-6 min-h-[44px]"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <FileCheck className="h-4 w-4" />
                Submit for verification
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Final submission confirmation */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Application for Verification?</AlertDialogTitle>
            <AlertDialogDescription>
              You can't change documents after submitting. Your application will transition to Submitted and become visible in the Sub-Registrar review queue.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={submitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={submitting}
              onClick={handleSubmitApplication}
            >
              {submitting ? 'Submitting...' : 'Yes, Submit for Verification'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
