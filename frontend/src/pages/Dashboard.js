import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from '../components/Navbar';
import EmployeeDashboard from '../components/EmployeeDashboard';
import ManagerDashboard from '../components/ManagerDashboard';
import AdminDashboard from '../components/AdminDashboard';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const { user } = useAuth();

  const getDashboardComponent = () => {
    switch (user?.role) {
      case 'ADMIN':
        return <AdminDashboard />;
      case 'MANAGER':
        return <ManagerDashboard />;
      case 'EMPLOYEE':
        return <EmployeeDashboard />;
      default:
        return <Navigate to="/login" />;
    }
  };

  return (
    <Box>
      <Navbar />
      <Box sx={{ p: 3 }}>
        <Routes>
          <Route path="/" element={getDashboardComponent()} />
        </Routes>
      </Box>
    </Box>
  );
}

export default Dashboard;
