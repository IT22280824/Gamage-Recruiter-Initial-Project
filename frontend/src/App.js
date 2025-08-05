import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Register from './pages/Register.js'
import Login from './pages/Login.js'
import OAuthSuccessPage from './pages/OAuthSuccess.js';
import ProtectedRoute from './components/ProtectedRoute.js';
import Dashboard from './pages/Dashboard.js'
import Admindashboard from './pages/AdminUserManagement.js'
import ForgotPassword from './pages/ForgotPassword.js'

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/register" />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/oauth-success" element={<OAuthSuccessPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />


          <Route path="/admin/dashboard" element={
            <ProtectedRoute>
              <Admindashboard />
            </ProtectedRoute>
            } />


          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        </Routes>
      </Router>
      
    </div>
  );
}

export default App;
