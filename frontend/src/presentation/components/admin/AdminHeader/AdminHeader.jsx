import React from 'react';
import './AdminHeader.css';
const AdminHeader = ({ user, title = "Panel de Administración", subtitle = "Gestiona la plataforma NeuroBreak" }) => {
  return (
    <div className="admin-header">
      <div className="header-left">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <div className="header-right">
        <AdminBadge />
      </div>
    </div>
  );
};
const AdminBadge = () => (
  <div className="admin-badge">
    <i className="fas fa-crown me-2"></i>
    Administrador
  </div>
);
export default AdminHeader;
