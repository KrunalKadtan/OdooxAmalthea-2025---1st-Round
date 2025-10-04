import { useState } from 'react';
import { useAuth } from './AuthContext';
import EmployeeSettings from './EmployeeSettings';
import ManagerSettings from './ManagerSettings';
import AdminSettings from './AdminSettings';

interface SettingsRouterProps {
  onBack: () => void;
}

export default function SettingsRouter({ onBack }: SettingsRouterProps) {
  const { user } = useAuth();

  // Determine which settings component to render based on user role
  const renderSettingsComponent = () => {
    switch (user?.role) {
      case 'admin':
        return <AdminSettings onBack={onBack} />;
      case 'manager':
        return <ManagerSettings onBack={onBack} />;
      case 'employee':
      default:
        return <EmployeeSettings onBack={onBack} />;
    }
  };

  return renderSettingsComponent();
}