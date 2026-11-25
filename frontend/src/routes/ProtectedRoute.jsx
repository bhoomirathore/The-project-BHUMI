import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import BrandLogo from '@/components/common/BrandLogo';

export default function ProtectedRoute({ allowedRoles = [], children }) {
  const { user, role, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <BrandLogo size="lg" to={null} />
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Verifying cryptographic session…
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  const normalizedRole = role === 'HQ' ? 'GOVERNMENT_HQ' : role;
  const normalizedAllowed = allowedRoles.map((r) => (r === 'HQ' ? 'GOVERNMENT_HQ' : r));

  if (normalizedAllowed.length > 0 && !normalizedAllowed.includes(normalizedRole)) {
    if (normalizedRole === 'CITIZEN') return <Navigate to="/citizen/dashboard" replace />;
    if (normalizedRole === 'REGISTRAR') return <Navigate to="/authority/dashboard" replace />;
    if (normalizedRole === 'GOVERNMENT_HQ') return <Navigate to="/government/dashboard" replace />;
    return <Navigate to="/auth/login" replace />;
  }

  return children;
}
