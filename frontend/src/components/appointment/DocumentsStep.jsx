import React, { useState, useRef } from 'react';
import {
  Upload,
  Check,
  X,
  FileText,
  AlertCircle,
  FileCheck2,
  ShieldAlert,
  RotateCw,
  Loader2,
  Image as ImageIcon,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { DOCUMENT_TYPES } from '@/utils/statuses';

// NOTE: Client-side validation is for immediate user feedback only.
// Authoritative security validation (file type, size limits, and magic byte verification)
// MUST strictly be performed server-side to protect against forged extensions/MIME headers.

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

const BLOCKED_EXTENSIONS = new Set([
  'exe', 'bat', 'cmd', 'sh', 'js', 'mjs', 'cjs', 'html', 'htm', 'svg',
  'jar', 'msi', 'vbs', 'wsf', 'ps1', 'psm1', 'php', 'py', 'rb', 'bin',
  'dll', 'com', 'scr', 'app', 'deb', 'rpm'
]);

const BLOCKED_MIME_TYPES = new Set([
  'application/x-msdownload',
  'application/x-sh',
  'application/x-csh',
  'application/javascript',
  'text/javascript',
  'text/html',
  'image/svg+xml',
  'application/java-archive',
  'application/x-bat',
  'application/x-executable',
  'application/x-dosexec',
  'application/vnd.microsoft.portable-executable',
]);

export function validateFile(file) {
  if (!file) {
    return 'Please select a file to upload.';
  }
  if (file.size === 0) {
    return 'The selected file is empty (0 bytes). Please choose a valid file.';
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return `File is too large (${sizeMb} MB). Maximum allowed file size is 10 MB.`;
  }

  const extension = (file.name.split('.').pop() || '').toLowerCase();
  if (BLOCKED_EXTENSIONS.has(extension)) {
    return `Executable or script files (.${extension}) are not permitted. Please upload a standard document or image.`;
  }

  const mime = (file.type || '').toLowerCase();
  if (BLOCKED_MIME_TYPES.has(mime) || mime.startsWith('text/html') || mime.includes('javascript')) {
    return 'Executable or scriptable file types are blocked. Please upload a standard document or image.';
  }

  return null;
}

export function formatFileSize(bytes) {
  if (!bytes || bytes <= 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export const DOCUMENT_SLOTS = [
  {
    id: DOCUMENT_TYPES.AADHAAR,
    type: DOCUMENT_TYPES.AADHAAR,
    label: 'Aadhaar Card',
    helperText: 'Front and back or e-Aadhaar of seller / applicant.',
    maxFiles: 1,
  },
  {
    id: DOCUMENT_TYPES.PAN_CARD,
    type: DOCUMENT_TYPES.PAN_CARD,
    label: 'PAN Card',
    helperText: 'Signed PAN card copy for tax and identity verification.',
    maxFiles: 1,
  },
  {
    id: DOCUMENT_TYPES.KHASRA_DOC,
    type: DOCUMENT_TYPES.KHASRA_DOC,
    label: 'Khasra Document (Land Record Extract)',
    helperText: 'Recent certified Khasra (Form P-II) extract of the property.',
    maxFiles: 1,
  },
  {
    id: DOCUMENT_TYPES.PROPERTY_IMAGE,
    type: DOCUMENT_TYPES.PROPERTY_IMAGE,
    label: 'Property Image',
    helperText: 'Photographs of the plot/property from different angles (allow up to 5 files).',
    maxFiles: 5,
  },
  {
    id: DOCUMENT_TYPES.BUYER_IMAGE_PROOF,
    type: DOCUMENT_TYPES.BUYER_IMAGE_PROOF,
    label: 'Buyer Image Proof',
    helperText: "Recent passport photo or photo ID image of the registered buyer.",
    maxFiles: 1,
  },
  {
    id: DOCUMENT_TYPES.CHATUR_SEEMA,
    type: DOCUMENT_TYPES.CHATUR_SEEMA,
    label: 'Chatur Seema (Boundary Description)',
    helperText: "The property's north, south, east, and west boundary specifications.",
    maxFiles: 1,
  },
  {
    id: DOCUMENT_TYPES.WITNESS_DOCS,
    type: DOCUMENT_TYPES.WITNESS_DOCS,
    label: 'Witness Documents',
    helperText: 'ID proofs of the witnesses (allow up to 4 files; Aadhaar, Voter ID, Passport).',
    maxFiles: 4,
  },
];

export default function DocumentsStep({
  documents = {},
  onUploadFile,
  onRemoveFile,
  uploading = {},
  slotErrors = {},
  setSlotErrors,
  error,
}) {
  const [liveAnnouncement, setLiveAnnouncement] = useState('');
  const [dragActiveSlot, setDragActiveSlot] = useState(null);
  const fileInputRefs = useRef({});

  // Count how many of the 7 slots have at least 1 file
  const completedCount = DOCUMENT_SLOTS.filter(
    (slot) => (documents[slot.id] || []).length > 0
  ).length;

  const progressPct = Math.round((completedCount / DOCUMENT_SLOTS.length) * 100);

  const handleFilesChosen = async (slot, fileList) => {
    if (!fileList || fileList.length === 0) return;
    const currentFiles = documents[slot.id] || [];

    setSlotErrors((prev) => ({ ...prev, [slot.id]: '' }));

    // Check multi-file count limit
    const incomingCount = fileList.length;
    if (slot.maxFiles > 1 && currentFiles.length + incomingCount > slot.maxFiles) {
      const errMsg = `You can upload at most ${slot.maxFiles} files for ${slot.label}. (Already uploaded: ${currentFiles.length})`;
      setSlotErrors((prev) => ({ ...prev, [slot.id]: errMsg }));
      setLiveAnnouncement(errMsg);
      return;
    }

    // Process files
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const validationError = validateFile(file);
      if (validationError) {
        setSlotErrors((prev) => ({ ...prev, [slot.id]: validationError }));
        setLiveAnnouncement(`Upload failed for ${file.name}: ${validationError}`);
        return;
      }

      try {
        const replaceIndex = slot.maxFiles === 1 ? 0 : -1;
        await onUploadFile(slot.id, file, replaceIndex);
        setLiveAnnouncement(`${slot.label} file ${file.name} uploaded successfully.`);
      } catch (err) {
        const msg = err.message || 'File upload failed. Please try again.';
        setSlotErrors((prev) => ({ ...prev, [slot.id]: msg }));
        setLiveAnnouncement(`Upload error: ${msg}`);
      }
    }
  };

  const handleDragOver = (e, slotId) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveSlot(slotId);
  };

  const handleDragLeave = (e, slotId) => {
    e.preventDefault();
    e.stopPropagation();
    if (dragActiveSlot === slotId) {
      setDragActiveSlot(null);
    }
  };

  const handleDrop = (e, slot) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveSlot(null);
    if (e.dataTransfer?.files) {
      handleFilesChosen(slot, Array.from(e.dataTransfer.files));
    }
  };

  return (
    <div className="space-y-6">
      {/* Screen reader live announcement region */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {liveAnnouncement}
      </div>

      <div>
        <h2 id="step-heading" className="text-lg font-bold text-foreground outline-none" tabIndex={-1}>
          Upload Transfer Documents
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Please upload the 7 required documents for verification before your Sub-Registrar Office appointment.
        </p>
      </div>

      {/* Progress banner */}
      <Card className="border-border/80 bg-muted/30 shadow-none">
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Verification Progress
              </span>
              <p className="mt-0.5 text-base font-bold text-foreground">
                {completedCount} of {DOCUMENT_SLOTS.length} uploaded
              </p>
            </div>
            <Badge
              variant={completedCount === DOCUMENT_SLOTS.length ? 'success' : 'outline'}
              className="text-xs font-semibold px-2.5 py-1"
            >
              {completedCount === DOCUMENT_SLOTS.length ? 'All Required Uploaded' : `${DOCUMENT_SLOTS.length - completedCount} Remaining`}
            </Badge>
          </div>
          <Progress value={progressPct} className="mt-3 h-2" aria-label={`Uploaded ${completedCount} of 7 required documents`} />
        </CardContent>
      </Card>

      {/* Privacy disclaimer */}
      <Alert className="border-primary/20 bg-primary/5 text-foreground">
        <ShieldAlert className="h-4 w-4 text-primary" />
        <AlertDescription className="text-xs text-muted-foreground">
          Documents are stored securely and used only for your appointment verification. This is a prototype; no real government verification is performed.
        </AlertDescription>
      </Alert>

      {/* 7 Document Slots */}
      <div className="space-y-4" role="group" aria-label="Required transfer documents list">
        {DOCUMENT_SLOTS.map((slot, index) => {
          const files = documents[slot.id] || [];
          const isDone = files.length > 0;
          const isUploading = !!uploading[slot.id];
          const slotError = slotErrors[slot.id];
          const isDragActive = dragActiveSlot === slot.id;
          const canAddMore = files.length < slot.maxFiles;

          return (
            <Card
              key={slot.id}
              className={cn(
                'border transition-colors shadow-sm',
                isDone ? 'border-border/80 bg-card' : 'border-border/70 bg-card/60'
              )}
            >
              <CardContent className="p-4 sm:p-5">
                {/* Slot Header */}
                <div className="flex flex-wrap items-start justify-between gap-2 pb-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-bold text-muted-foreground">
                        {index + 1}
                      </span>
                      <h3 className="text-sm font-bold text-foreground">
                        {slot.label}
                      </h3>
                      {slot.maxFiles > 1 && (
                        <span className="text-[11px] text-muted-foreground font-mono">
                          (up to {slot.maxFiles})
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground pl-7">
                      {slot.helperText}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    {isDone ? (
                      <Badge variant="success" className="gap-1 text-xs font-semibold px-2 py-0.5">
                        <Check className="h-3 w-3" aria-hidden="true" />
                        Uploaded {slot.maxFiles > 1 ? `(${files.length})` : ''}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs font-medium text-warning-foreground border-warning/40 bg-warning/10 px-2 py-0.5">
                        Required
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Uploaded Files Chips */}
                {files.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2 pl-7" aria-label={`Uploaded files for ${slot.label}`}>
                    {files.map((fileItem) => (
                      <div
                        key={fileItem.docId || fileItem.fileName}
                        className="inline-flex max-w-full items-center gap-2 rounded-lg border border-border/80 bg-muted/40 px-3 py-1.5 text-xs text-foreground shadow-xs"
                      >
                        <FileCheck2 className="h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                        <span className="truncate max-w-[200px] sm:max-w-[260px] font-medium" title={fileItem.fileName}>
                          {fileItem.fileName}
                        </span>
                        <span className="text-[11px] text-muted-foreground font-mono shrink-0">
                          ({formatFileSize(fileItem.size || fileItem.fileSize)})
                        </span>

                        {/* Replace Button (for single-file slots) */}
                        {slot.maxFiles === 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => fileInputRefs.current[slot.id]?.click()}
                            disabled={isUploading}
                            className="h-6 px-1.5 text-[11px] text-muted-foreground hover:text-foreground"
                            aria-label={`Replace file for ${slot.label}`}
                          >
                            <RotateCw className="h-3 w-3 mr-1" aria-hidden="true" />
                            Replace
                          </Button>
                        )}

                        {/* Remove Button */}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => onRemoveFile(slot.id, fileItem.docId)}
                          disabled={isUploading}
                          className="h-6 w-6 text-muted-foreground hover:text-destructive focus-visible:ring-2 focus-visible:ring-destructive"
                          aria-label={`Remove ${fileItem.fileName} from ${slot.label}`}
                        >
                          <X className="h-3.5 w-3.5" aria-hidden="true" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Hidden File Input */}
                <input
                  ref={(el) => (fileInputRefs.current[slot.id] = el)}
                  type="file"
                  id={`file-input-${slot.id}`}
                  multiple={slot.maxFiles > 1}
                  className="sr-only"
                  onChange={(e) => {
                    handleFilesChosen(slot, Array.from(e.target.files || []));
                    e.target.value = ''; // reset so same file can be picked again if needed
                  }}
                  tabIndex={-1}
                  aria-hidden="true"
                />

                {/* Dropzone & Upload Button (shown if can add more or no files yet) */}
                {canAddMore && (
                  <div
                    onDragOver={(e) => handleDragOver(e, slot.id)}
                    onDragLeave={(e) => handleDragLeave(e, slot.id)}
                    onDrop={(e) => handleDrop(e, slot)}
                    className={cn(
                      'mt-3 ml-7 flex flex-col items-center justify-center rounded-xl border border-dashed p-4 text-center transition-colors',
                      isDragActive
                        ? 'border-primary bg-primary/10 ring-2 ring-primary/30'
                        : 'border-border/80 bg-muted/15 hover:border-primary/50 hover:bg-muted/30'
                    )}
                  >
                    <div className="flex flex-wrap items-center justify-center gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isUploading}
                        onClick={() => fileInputRefs.current[slot.id]?.click()}
                        className="gap-2 min-h-[36px] font-semibold focus-visible:ring-2 focus-visible:ring-primary"
                        aria-label={`Upload file for ${slot.label}`}
                      >
                        {isUploading ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="h-3.5 w-3.5" aria-hidden="true" />
                            {files.length > 0 ? 'Add Another File' : 'Upload Document'}
                          </>
                        )}
                      </Button>
                      <span className="text-xs text-muted-foreground">
                        or drag and drop file here (PDF, DOCX, JPG, PNG up to 10 MB)
                      </span>
                    </div>
                  </div>
                )}

                {/* Slot inline error */}
                {slotError && (
                  <div className="mt-2.5 ml-7 flex items-center gap-1.5 text-xs font-semibold text-destructive" role="alert">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    <span>{slotError}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Global Step Error */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs font-semibold">
            {error}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
