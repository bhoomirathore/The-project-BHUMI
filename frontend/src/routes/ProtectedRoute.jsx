import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute({ allowedRoles = [], children }) {
  const { user, role, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F2F0] flex items-center justify-center text-[#2B1B14]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-[#2B1B14] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-[#6E5D53]">Authenticating...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    // Redirect to the appropriate portal for the user's role
    if (role === 'CITIZEN') {
      return <Navigate to="/citizen/dashboard" replace />;
    } else if (role === 'REGISTRAR') {
      return <Navigate to="/authority/dashboard" replace />;
    } else if (role === 'GOVERNMENT_HQ') {
      return <Navigate to="/government/dashboard" replace />;
    }
    return <Navigate to="/auth/login" replace />;
  }

  return children;
}
