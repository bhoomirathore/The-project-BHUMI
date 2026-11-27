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
            <Loader2 className="h-4 w-4 animate-spin" /> Authenticating…
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    if (role === 'CITIZEN') return <Navigate to="/citizen/dashboard" replace />;
    if (role === 'REGISTRAR') return <Navigate to="/authority/dashboard" replace />;
    if (role === 'GOVERNMENT_HQ') return <Navigate to="/government/dashboard" replace />;
    return <Navigate to="/auth/login" replace />;
  }

  return children;
}
