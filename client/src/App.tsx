import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import ProjectDetails from './pages/ProjectDetails';

const ProtectedRoute: React.FC<{ isAuthenticated: boolean }> = ({ isAuthenticated }) => {
  if (!isAuthenticated) {
    return <Navigate to="/signin" />;
  }

  return <Outlet />;
};

const App: React.FC = () => {
  const isAuthenticated = Boolean(localStorage.getItem('access_token'));

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/signin" />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;