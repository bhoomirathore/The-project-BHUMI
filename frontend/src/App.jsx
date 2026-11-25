import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import PublicVerify from './pages/PublicVerify';

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
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Public Verify Page */}
          <Route path="/verify" element={<PublicVerify />} />

          {/* Auth routes redirected to home / portals */}
          <Route path="/auth/*" element={<Navigate to="/" replace />} />
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/register" element={<Navigate to="/" replace />} />
          <Route path="/forgot-password" element={<Navigate to="/" replace />} />
          <Route path="/reset-password" element={<Navigate to="/" replace />} />

          {/* Citizen Portal Routes */}
          <Route
            path="/citizen/dashboard"
            element={
              <ProtectedRoute>
                <CitizenDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/citizen/properties"
            element={
              <ProtectedRoute>
                <CitizenProperties />
              </ProtectedRoute>
            }
          />
          {/* Backward compatibility redirects */}
          <Route
            path="/citizen/new-transfer"
            element={
              <ProtectedRoute>
                <RedirectNewTransfer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/citizen/download-registry"
            element={
              <ProtectedRoute>
                <RedirectDownloadRegistry />
              </ProtectedRoute>
            }
          />
          <Route
            path="/citizen/applications"
            element={
              <ProtectedRoute>
                <CitizenApplications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/citizen/applications/:id"
            element={
              <ProtectedRoute>
                <CitizenApplicationDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/citizen/verify-land"
            element={
              <ProtectedRoute>
                <CitizenVerifyLand />
              </ProtectedRoute>
            }
          />
          <Route
            path="/citizen/book-appointment"
            element={
              <ProtectedRoute>
                <CitizenBookAppointment />
              </ProtectedRoute>
            }
          />

          {/* Authority Portal Routes */}
          <Route
            path="/authority/dashboard"
            element={
              <ProtectedRoute>
                <AuthorityDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/authority/applications"
            element={
              <ProtectedRoute>
                <AuthorityApplicationQueue />
              </ProtectedRoute>
            }
          />
          <Route
            path="/authority/applications/:id"
            element={
              <ProtectedRoute>
                <AuthorityVerification />
              </ProtectedRoute>
            }
          />
          <Route
            path="/authority/ekyc"
            element={
              <ProtectedRoute>
                <AuthorityEKYC />
              </ProtectedRoute>
            }
          />
          <Route
            path="/authority/registry"
            element={
              <ProtectedRoute>
                <AuthorityRegistry />
              </ProtectedRoute>
            }
          />

          {/* Government HQ Routes */}
          <Route
            path="/government/dashboard"
            element={
              <ProtectedRoute>
                <GovernmentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/government/analytics"
            element={
              <ProtectedRoute>
                <GovernmentAnalytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/government/monitoring"
            element={
              <ProtectedRoute>
                <GovernmentMonitoring />
              </ProtectedRoute>
            }
          />
          <Route
            path="/government/disputes"
            element={
              <ProtectedRoute>
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
