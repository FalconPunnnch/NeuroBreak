import React from 'react';
import MetricsGrid from '../MetricsGrid/MetricsGrid';
import WelcomeCard from '../WelcomeCard/WelcomeCard';
import './DashboardWelcome.css';
const DashboardWelcome = ({ user, metrics, onSectionChange }) => {
  return (
    <div className="dashboard-content">
      <MetricsGrid metrics={metrics} />
      <WelcomeCard user={user} onSectionChange={onSectionChange} />
    </div>
  );
};
export default DashboardWelcome;
