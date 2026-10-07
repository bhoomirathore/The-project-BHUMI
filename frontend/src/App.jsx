import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

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
    <BrowserRouter>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/index.html" element={<Navigate to="/" replace />} />

        {/* Authentication Routes */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/login" element={<Navigate to="/auth/login" replace />} />
        <Route path="/auth/login.html" element={<Navigate to="/auth/login" replace />} />

        <Route path="/auth/register" element={<Register />} />
        <Route path="/register" element={<Navigate to="/auth/register" replace />} />
        <Route path="/auth/register.html" element={<Navigate to="/auth/register" replace />} />

        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/forgot-password.html" element={<Navigate to="/auth/forgot-password" replace />} />

        {/* Citizen Portal Routes */}
        <Route path="/citizen/dashboard" element={<CitizenDashboard />} />
        <Route path="/pages/citizen/dashboard.html" element={<Navigate to="/citizen/dashboard" replace />} />

        <Route path="/citizen/verify-land" element={<CitizenVerifyLand />} />
        <Route path="/pages/citizen/verify-land.html" element={<Navigate to="/citizen/verify-land" replace />} />

        <Route path="/citizen/book-appointment" element={<CitizenBookAppointment />} />
        <Route path="/pages/citizen/book-appointment.html" element={<Navigate to="/citizen/book-appointment" replace />} />

        <Route path="/citizen/download-registry" element={<CitizenDownloadRegistry />} />
        <Route path="/pages/citizen/download-registry.html" element={<Navigate to="/citizen/download-registry" replace />} />

        {/* Authority Portal Routes */}
        <Route path="/authority/dashboard" element={<AuthorityDashboard />} />
        <Route path="/pages/authority/dashboard.html" element={<Navigate to="/authority/dashboard" replace />} />

        <Route path="/authority/verification" element={<AuthorityVerification />} />
        <Route path="/pages/authority/verification.html" element={<Navigate to="/authority/verification" replace />} />

        <Route path="/authority/ekyc" element={<AuthorityEKYC />} />
        <Route path="/pages/authority/ekyc.html" element={<Navigate to="/authority/ekyc" replace />} />

        <Route path="/authority/registry" element={<AuthorityRegistry />} />
        <Route path="/pages/authority/registry.html" element={<Navigate to="/authority/registry" replace />} />

        {/* Government HQ Routes */}
        <Route path="/government/dashboard" element={<GovernmentDashboard />} />
        <Route path="/pages/government/dashboard.html" element={<Navigate to="/government/dashboard" replace />} />

        <Route path="/government/analytics" element={<GovernmentAnalytics />} />
        <Route path="/pages/government/analytics.html" element={<Navigate to="/government/analytics" replace />} />

        <Route path="/government/monitoring" element={<GovernmentMonitoring />} />
        <Route path="/pages/government/monitoring.html" element={<Navigate to="/government/monitoring" replace />} />

        <Route path="/government/disputes" element={<GovernmentDisputes />} />
        <Route path="/pages/government/disputes.html" element={<Navigate to="/government/disputes" replace />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
