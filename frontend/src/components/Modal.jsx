import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

/**
 * Backwards-compatible modal built on the shadcn Dialog.
 * Props: isOpen, onClose, title, description?, children, footer?, size? ('sm'|'md'|'lg'|'xl')
 */
const SIZE = {
  sm: 'sm:max-w-[420px]',
  md: 'sm:max-w-[540px]',
  lg: 'sm:max-w-[720px]',
  xl: 'sm:max-w-[960px]',
};

export default function Modal({ isOpen, onClose, title, description, children, footer, size = 'md', className }) {
  return (
    <Dialog open={!!isOpen} onOpenChange={(open) => { if (!open) onClose?.(); }}>
      <DialogContent className={cn('max-h-[90vh] gap-0 overflow-hidden p-0', SIZE[size] || SIZE.md, className)}>
        <DialogHeader className="border-b bg-background/70 px-5 py-4 text-left">
          <DialogTitle className="text-base font-bold sm:text-lg">{title}</DialogTitle>
          {description ? (
            <DialogDescription>{description}</DialogDescription>
          ) : (
            <DialogDescription className="sr-only">{title}</DialogDescription>
          )}
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">{children}</div>
        {footer && (
          <DialogFooter className="border-t bg-background/50 px-4 py-3 sm:justify-end">
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
