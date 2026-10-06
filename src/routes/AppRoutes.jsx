import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Layout from '../components/layout/Layout';
import LoadingSpinner from '../components/common/LoadingSpinner';

// Route-level code splitting for optimized chunk sizes
const SignInPage = lazy(() => import('../pages/SignInPage'));
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const StudentsPage = lazy(() => import('../pages/StudentsPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

// Themed suspense fallback loader matching dark palette
function RouteFallback({ message = 'Loading module...' }) {
  return (
    <div className="min-h-[50vh] flex items-center justify-center py-16">
      <LoadingSpinner size="lg" text={message} />
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<RouteFallback message="Loading Vedha portal..." />}>
      <Routes>
        {/* Public Sign-in Route */}
        <Route path="/signin" element={<SignInPage />} />

        {/* Default Root Redirect to Dashboard */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Navigate to="/dashboard" replace />
            </ProtectedRoute>
          }
        />

        {/* Protected Dashboard Route */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <DashboardPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Protected Students Records Route */}
        <Route
          path="/students"
          element={
            <ProtectedRoute>
              <Layout>
                <StudentsPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Fallback 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
