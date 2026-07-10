import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SubmitComplaint from './pages/SubmitComplaint';
import TrackStatus from './pages/TrackStatus';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import UserAuth from './pages/UserAuth';
import UserDashboard from './pages/UserDashboard';
import { useVisitorTracking } from './hooks/useVisitorTracking';

function App() {
  useVisitorTracking();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/submit" element={<SubmitComplaint />} />
        <Route path="/track" element={<TrackStatus />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/login" element={<UserAuth />} />
        <Route path="/dashboard" element={<UserDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
