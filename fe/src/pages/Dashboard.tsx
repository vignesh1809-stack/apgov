import React from 'react';
import { useAppSelector } from '../store';
import MlaDashboard from './mla/MlaDashboard';
import CitizenDashboard from './citizen/CitizenDashboard';
import FieldOfficerPortal from './fieldofficer/FieldOfficerPortal';
import CoordinatorPortal from './coordinator/CoordinatorPortal';

const Dashboard: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  if (user?.role === 'mla') {
    return <MlaDashboard />;
  }

  if (user?.role === 'citizen') {
    return <CitizenDashboard />;
  }

  if (user?.role === 'fieldofficer') {
    return <FieldOfficerPortal />;
  }

  if (user?.role === 'coordinator') {
    return <CoordinatorPortal />;
  }

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      Loading dashboard...
    </div>
  );
};

export default Dashboard;
