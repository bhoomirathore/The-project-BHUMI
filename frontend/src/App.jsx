import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

import CitizenDashboard from './pages/citizen/Dashboard';
import CitizenVerifyLand from './pages/citizen/VerifyLand';
import CitizenBookAppointment from './pages/citizen/BookAppointment';
import CitizenDownloadRegistry from './pages/citizen/DownloadRegistry';

import AuthorityDashboard from './pages/authority/Dashboard';
import AuthorityVerification from './pages/authority/Verification';
import AuthorityEKYC from './pages/authority/EKYC';
import AuthorityRegistry from './pages/authority/Registry';

import GovernmentDashboard from './pages/government/Dashboard';
import GovernmentAnalytics from './pages/government/Analytics';
import GovernmentMonitoring from './pages/government/Monitoring';
import GovernmentDisputes from './pages/government/Disputes';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Landing Page (Public) */}
          <Route path="/" element={<LandingPage />} />

          {/* Authentication Routes (Public) */}
          <Route path="/auth/login" element={<Login />} />
          <Route path="/login" element={<Navigate to="/auth/login" replace />} />

          <Route path="/auth/register" element={<Register />} />
          <Route path="/register" element={<Navigate to="/auth/register" replace />} />


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
          <Route
            path="/citizen/download-registry"
            element={
              <ProtectedRoute allowedRoles={['CITIZEN']}>
                <CitizenDownloadRegistry />
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
            path="/authority/verification"
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

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
