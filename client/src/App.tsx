import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import ProjectDetails from './pages/ProjectDetails';

const ProtectedRoute: React.FC = () => {
  const token = localStorage.getItem('access_token');

  if (!token) {
    return <Navigate to="/signin" />;
  }

  return <Outlet />;
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const checkAuthentication = () => {
    const token = localStorage.getItem('access_token');
    setIsAuthenticated(Boolean(token));
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/signin" />} />
        <Route path="/signin" element={<SignIn onLogin={checkAuthentication} />} />
        <Route path="/signup" element={<SignUp />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/project/:id" element={<ProjectDetails />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
