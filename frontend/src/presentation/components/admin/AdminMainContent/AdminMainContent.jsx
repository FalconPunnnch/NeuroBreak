import React from 'react';
import AdminHeader from '../AdminHeader/AdminHeader';
import DashboardWelcome from '../DashboardWelcome/DashboardWelcome';
import MicroactivitiesCrud from '../MicroactivitiesCrud/MicroactivitiesCrud';
import './AdminMainContent.css';
const AdminMainContent = ({ activeSection, user, metrics, onSectionChange }) => {
  const renderContent = () => {
    switch(activeSection) {
      case 'dashboard':
        return <DashboardWelcome user={user} metrics={metrics} onSectionChange={onSectionChange} />;
      case 'microactivities':
        return <MicroactivitiesCrud />;
      default:
        return <DashboardWelcome user={user} metrics={metrics} onSectionChange={onSectionChange} />;
    }
  };
  return (
    <div className="admin-main-content">
      <AdminHeader user={user} />
      {renderContent()}
    </div>
  );
};
export default AdminMainContent;
