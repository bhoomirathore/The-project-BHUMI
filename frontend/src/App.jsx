import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import PublicVerify from './pages/PublicVerify';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

import CitizenDashboard from './pages/citizen/Dashboard';
import CitizenProperties from './pages/citizen/Properties';
import CitizenApplications from './pages/citizen/Applications';
import CitizenApplicationDetail from './pages/citizen/ApplicationDetail';
import CitizenVerifyLand from './pages/citizen/VerifyLand';
import CitizenBookAppointment from './pages/citizen/BookAppointment';

import AuthorityDashboard from './pages/authority/Dashboard';
import AuthorityApplicationQueue from './pages/authority/ApplicationQueue';
import AuthorityVerification from './pages/authority/Verification';
import AuthorityEKYC from './pages/authority/EKYC';
import AuthorityRegistry from './pages/authority/Registry';

import GovernmentDashboard from './pages/government/Dashboard';
import GovernmentAnalytics from './pages/government/Analytics';
import GovernmentMonitoring from './pages/government/Monitoring';
import GovernmentDisputes from './pages/government/Disputes';

// Redirect helpers preserving query params
function RedirectNewTransfer() {
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  search.set('purpose', 'TRANSFER');
  return <Navigate to={`/citizen/book-appointment?${search.toString()}`} replace />;
}

function RedirectDownloadRegistry() {
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  search.set('tab', 'registry');
  return <Navigate to={`/citizen/verify-land?${search.toString()}`} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Landing Page (Public) */}
          <Route path="/" element={<LandingPage />} />

          {/* Public Verify Page (No auth required) */}
          <Route path="/verify" element={<PublicVerify />} />

          {/* Authentication Routes (Public) */}
          <Route path="/auth/login" element={<Login />} />
          <Route path="/login" element={<Navigate to="/auth/login" replace />} />

          <Route path="/auth/register" element={<Register />} />
          <Route path="/register" element={<Navigate to="/auth/register" replace />} />

          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          <Route path="/forgot-password" element={<Navigate to="/auth/forgot-password" replace />} />

          <Route path="/auth/reset-password" element={<ResetPassword />} />
          <Route path="/reset-password" element={<Navigate to="/auth/reset-password" replace />} />

          {/* Citizen Portal Routes (Protected: CITIZEN) */}
          <Route
            path="/citizen/dashboard"
            element={
              <ProtectedRoute allowedRoles={['CITIZEN']}>
                <CitizenDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/citizen/properties"
            element={
              <ProtectedRoute allowedRoles={['CITIZEN']}>
                <CitizenProperties />
              </ProtectedRoute>
            }
          />
          {/* Backward compatibility redirects */}
          <Route
            path="/citizen/new-transfer"
            element={
              <ProtectedRoute allowedRoles={['CITIZEN']}>
                <RedirectNewTransfer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/citizen/download-registry"
            element={
              <ProtectedRoute allowedRoles={['CITIZEN']}>
                <RedirectDownloadRegistry />
              </ProtectedRoute>
            }
          />
          <Route
            path="/citizen/applications"
            element={
              <ProtectedRoute allowedRoles={['CITIZEN']}>
                <CitizenApplications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/citizen/applications/:id"
            element={
              <ProtectedRoute allowedRoles={['CITIZEN']}>
                <CitizenApplicationDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/citizen/verify-land"
            element={
              <ProtectedRoute allowedRoles={['CITIZEN']}>
                <CitizenVerifyLand />
              </ProtectedRoute>
            }
          />
          <Route
            path="/citizen/book-appointment"
            element={
              <ProtectedRoute allowedRoles={['CITIZEN']}>
                <CitizenBookAppointment />
              </ProtectedRoute>
            }
          />

          {/* Authority Portal Routes (Protected: REGISTRAR) */}
          <Route
            path="/authority/dashboard"
            element={
              <ProtectedRoute allowedRoles={['REGISTRAR']}>
                <AuthorityDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/authority/applications"
            element={
              <ProtectedRoute allowedRoles={['REGISTRAR']}>
                <AuthorityApplicationQueue />
              </ProtectedRoute>
            }
          />
          <Route
            path="/authority/applications/:id"
            element={
              <ProtectedRoute allowedRoles={['REGISTRAR']}>
                <AuthorityVerification />
              </ProtectedRoute>
            }
          />
          <Route
            path="/authority/ekyc"
            element={
              <ProtectedRoute allowedRoles={['REGISTRAR']}>
                <AuthorityEKYC />
              </ProtectedRoute>
            }
          />
          <Route
            path="/authority/registry"
            element={
              <ProtectedRoute allowedRoles={['REGISTRAR']}>
                <AuthorityRegistry />
              </ProtectedRoute>
            }
          />

          {/* Government HQ Routes (Protected: GOVERNMENT_HQ) */}
          <Route
            path="/government/dashboard"
            element={
              <ProtectedRoute allowedRoles={['GOVERNMENT_HQ']}>
                <GovernmentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/government/analytics"
            element={
              <ProtectedRoute allowedRoles={['GOVERNMENT_HQ']}>
                <GovernmentAnalytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/government/monitoring"
            element={
              <ProtectedRoute allowedRoles={['GOVERNMENT_HQ']}>
                <GovernmentMonitoring />
              </ProtectedRoute>
            }
          />
          <Route
            path="/government/disputes"
            element={
              <ProtectedRoute allowedRoles={['GOVERNMENT_HQ']}>
                <GovernmentDisputes />
              </ProtectedRoute>
            }
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
