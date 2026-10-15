import { useEffect } from 'react';
import { toast } from 'sonner';

/**
 * Backwards-compatible wrapper. Prefer calling `toast()` from 'sonner' directly.
 * Rendering <Toast message="..." type="success" onClose={...} /> fires a sonner toast.
 */
export default function Toast({ message, type = 'info', onClose, duration = 4000, description }) {
  useEffect(() => {
    if (!message) return;
    const fn = toast[type] || toast;
    fn(message, {
      description,
      duration,
      onDismiss: () => onClose?.(),
      onAutoClose: () => onClose?.(),
    });
  }, [message, type, duration, description, onClose]);

  return null;
}

export { toast };
