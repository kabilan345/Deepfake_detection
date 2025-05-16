import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoadingScreen from './components/LoadingScreen'; // ✅ Custom loading screen
import { useAuth } from './context/AuthContext';

// Lazy load your page components
const Home = lazy(() => import('./Pages/Home/Home'));
const Contact = lazy(() => import('./Pages/Contact/Contact'));
const Dashboard = lazy(() => import('./Pages/Dashboard/Dashboard'));
const AiEngine = lazy(() => import('./Pages/AiEngine/AiEngine'));
const Project = lazy(() => import('./Pages/Project/Project'));
const Login = lazy(() => import('./Pages/Auth/Login'));
const Register = lazy(() => import('./Pages/Auth/Register'));

// Private route component
const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

// Wrapper to conditionally hide navbar on login/register pages
const AppContent = () => {
  const location = useLocation();
  const { user } = useAuth();
  const hideNavbar = location.pathname === '/login' || location.pathname === '/register';

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/ai-engine" element={<PrivateRoute><AiEngine /></PrivateRoute>} />
          <Route path="/project" element={<PrivateRoute><Project /></PrivateRoute>} />
          <Route path="/contact" element={<PrivateRoute><Contact /></PrivateRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        </Routes>
      </Suspense>
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;