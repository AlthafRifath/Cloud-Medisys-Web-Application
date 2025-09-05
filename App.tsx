
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import AuthCallback from './pages/AuthCallback';
import Dashboard from './pages/Dashboard';
import UploadReport from './pages/UploadReport';
import MyReports from './pages/MyReports';
import AllReports from './pages/AllReports';
import Profile from './pages/Profile';
import ManageUsers from './pages/ManageUsers';

const App: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.roles.includes('Admin');
  const isStaff = user?.roles.includes('MedisysStaff');
  // A Clinic User is an authenticated user who is not an Admin or Staff.
  const isClinicUser = user && !isAdmin && !isStaff;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Navbar />
      <main className="container mx-auto p-4 md:p-8">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          
          {/* Common Protected Routes */}
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          
          {/* Clinic User Routes */}
          {isClinicUser && (
            <>
              <Route path="/upload" element={<ProtectedRoute><UploadReport /></ProtectedRoute>} />
              <Route path="/my-reports" element={<ProtectedRoute><MyReports /></ProtectedRoute>} />
            </>
          )}

          {/* Staff and Admin Routes */}
          {(isAdmin || isStaff) && (
            <Route path="/all-reports" element={<ProtectedRoute><AllReports /></ProtectedRoute>} />
          )}

          {/* Admin Only Routes */}
          {isAdmin && (
            <Route path="/manage-users" element={<ProtectedRoute><ManageUsers /></ProtectedRoute>} />
          )}

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
