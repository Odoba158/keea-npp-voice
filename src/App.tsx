import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { supabase } from './lib/supabase';
import Home from './pages/Home';
import SubmitComplaint from './pages/SubmitComplaint';
import TrackStatus from './pages/TrackStatus';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import UserAuth from './pages/UserAuth';
import UserDashboard from './pages/UserDashboard';
import { useVisitorTracking } from './hooks/useVisitorTracking';

// A wrapper for protecting routes
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });
    
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (isAuthenticated === null) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" state={{ from: location }} replace />;
}

function App() {
  useVisitorTracking();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<UserAuth />} />
        
        {/* Main Interface protected by Login */}
        <Route path="/" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        
        {/* We keep SubmitComplaint accessible if they try to navigate directly, also protected */}
        <Route path="/submit" element={
          <ProtectedRoute>
            <SubmitComplaint />
          </ProtectedRoute>
        } />
        
        {/* Dashboard also protected */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        } />

        <Route path="/track" element={<TrackStatus />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/login" element={<AdminLogin />} />
      </Routes>
    </Router>
  );
}

export default App;
