import React, { createContext, useContext, useState, useMemo } from 'react';

const AuthContext = createContext(null);

export const DEFAULT_PROFILES = {
  citizen: {
    id: 'usr-citizen-rajesh',
    name: 'Rajesh Kumar Singh',
    email: 'rajesh.singh@example.com',
    phone: '9876543210',
    role: 'CITIZEN',
    avatar: 'RS',
  },
  authority: {
    id: 'usr-registrar-ramesh',
    name: 'Ramesh Sharma',
    email: 'ramesh.sharma@example.com',
    phone: '9876543211',
    role: 'REGISTRAR',
    avatar: 'RS',
    badge: 'REGISTRAR',
  },
  government: {
    id: 'usr-hq-mukesh',
    name: 'Mukesh Kumar',
    email: 'mukesh.kumar@example.com',
    phone: '9876543212',
    role: 'GOVERNMENT_HQ',
    avatar: 'MK',
    badge: 'GOV HQ',
  },
};

export function AuthProvider({ children }) {
  const [activePortal, setActivePortal] = useState('citizen');

  // Derive user profile based on active portal
  const user = useMemo(() => {
    return DEFAULT_PROFILES[activePortal] || DEFAULT_PROFILES.citizen;
  }, [activePortal]);

  const value = {
    user,
    role: user.role,
    isAuthenticated: true,
    loading: false,
    activePortal,
    setActivePortal,
    // Portal switch helper
    switchProfile: (portalKey) => {
      if (DEFAULT_PROFILES[portalKey]) {
        setActivePortal(portalKey);
      }
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
