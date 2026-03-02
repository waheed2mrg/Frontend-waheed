import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'; 
import Dashboard from './components/Dashboard';
import Login from './components/Login'; 
import Signup from './components/Signup'; 
import AdminDashboard from './components/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        
        {/* New Signup Route */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        
        <Route path="/dashboard" element={
          <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
            <Dashboard />
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;