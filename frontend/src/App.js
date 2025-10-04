import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import AddExpense from './pages/AddExpense';
import Reports from './pages/Reports';
import Categories from './pages/Categories';
import { GradientBackground } from './components/UI/Components';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Login from './pages/Login';
import Register from './pages/Register';
import GroupSelect from './pages/GroupSelect';
import WelcomeGroup from './pages/WelcomeGroup';
import InviteAcceptPage from './pages/InviteAcceptPage';

import { useParams, useLocation } from 'react-router-dom';

const Protected = ({ children }) => {
  const { user, loading, memberships, currentGroup, setCurrentGroup } = useAuth();
  const location = useLocation();
  const groupIdParam = /\/app\/(.*?)\//.test(location.pathname) ? location.pathname.split('/')[2] : null;

  if (loading) return <div className="p-6">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  const count = memberships.length;
  // If user has no groups, force onboarding except for pages that allow creating/joining
  if (count === 0 && !location.pathname.startsWith('/welcome') && !location.pathname.startsWith('/select-group')) {
    return <Navigate to="/welcome/group" replace />;
  }
  // If exactly one group and user is on a generic root or selection page, push to that group's dashboard
  if (count === 1 && (location.pathname === '/' || location.pathname.startsWith('/select-group'))) {
    const onlyId = memberships[0].group._id;
    return <Navigate to={`/app/${onlyId}/dashboard`} replace />;
  }
  // If multiple groups and at root: if a currentGroup is set stay in that group, else go select
  if (count > 1 && location.pathname === '/') {
    if (currentGroup && memberships.some(m => m.group._id === currentGroup)) {
      return <Navigate to={`/app/${currentGroup}/dashboard`} replace />;
    }
    return <Navigate to="/select-group" replace />;
  }
  // Sync currentGroup with route param if present
  if (groupIdParam && groupIdParam !== currentGroup) {
    // verify membership; if not a member redirect to selector
    const isMember = memberships.find(m => m.group._id === groupIdParam);
    if (isMember) {
      setCurrentGroup(groupIdParam);
    } else {
      return <Navigate to="/select-group" replace />;
    }
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
      <Router>
        <div className="min-h-screen">
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/welcome/group" element={<Protected><WelcomeGroup /></Protected>} />
            <Route path="/select-group" element={<Protected><GroupSelect /></Protected>} />
            <Route path="/invite/:token" element={<Protected><InviteAcceptPage /></Protected>} />
            <Route path="/app/:groupId/dashboard" element={<Protected><Dashboard /></Protected>} />
            <Route path="/" element={<Protected><Dashboard /></Protected>} />
            {/* Group-scoped feature routes */}
            <Route path="/app/:groupId/add" element={
              <Protected>
                <GradientBackground className="min-h-screen py-8">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <AddExpense />
                  </div>
                </GradientBackground>
              </Protected>
            } />
            <Route path="/app/:groupId/reports" element={<Protected><Reports /></Protected>} />
            <Route path="/app/:groupId/categories" element={
              <Protected>
                <GradientBackground className="min-h-screen py-8">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Categories />
                  </div>
                </GradientBackground>
              </Protected>
            } />
            {/* Backwards-compatible non-group paths: delegate to Protected which will redirect */}
            <Route path="/add" element={<Protected><Navigate to="/" replace /></Protected>} />
            <Route path="/categories" element={<Protected><Navigate to="/" replace /></Protected>} />
            <Route path="/reports" element={<Protected><Navigate to="/" replace /></Protected>} />
          </Routes>
        </div>
      </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
