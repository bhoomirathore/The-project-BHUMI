import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export default function GoogleSignInButton({ onCredentialResponse, text = 'Sign in with Google', disabled = false }) {
  const buttonRef = useRef(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
  const isRealClientId = clientId && !clientId.includes('your-google-client-id');

  useEffect(() => {
    // Check if script already exists
    if (window.google?.accounts?.id) {
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setScriptLoaded(true);
    };
    script.onerror = () => {
      console.warn('Failed to load Google Identity Services SDK.');
    };
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!scriptLoaded || !isRealClientId || !buttonRef.current || !window.google?.accounts?.id) {
      return;
    }

    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response) => {
          if (response?.credential) {
            onCredentialResponse(response.credential);
          }
        },
      });

      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: 'outline',
        size: 'large',
        width: buttonRef.current.offsetWidth || 320,
        text: text.includes('up') ? 'signup_with' : 'signin_with',
        shape: 'rectangular',
      });
    } catch (err) {
      console.error('Error rendering Google button:', err);
    }
  }, [scriptLoaded, isRealClientId, clientId, onCredentialResponse, text]);

  const handleManualClick = () => {
    if (!isRealClientId) {
      toast.info('Google OAuth Setup Notice', {
        description: 'To enable live Google Sign-In, set your Google Client ID in frontend/.env (VITE_GOOGLE_CLIENT_ID).',
        duration: 5000,
      });
      return;
    }

    if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt();
    }
  };

  if (isRealClientId && scriptLoaded) {
    return (
      <div className="w-full flex justify-center">
        <div ref={buttonRef} className="w-full min-h-[44px]" />
      </div>
    );
  }

  // Fallback branded button matching official Google style guidelines
  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      disabled={disabled}
      onClick={handleManualClick}
      className="relative flex w-full items-center justify-center gap-3 border-input bg-card font-semibold text-foreground hover:bg-accent"
    >
      <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          fill="#EA4335"
        />
      </svg>
      <span>{text}</span>
    </Button>
  );
}
