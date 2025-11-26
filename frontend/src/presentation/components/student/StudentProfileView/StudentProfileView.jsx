import React from 'react';
import './StudentProfileView.css';
const StudentProfileView = ({ user }) => {
  return (
    <div className="student-profile-view">
      <div className="profile-header">
        <h2>Mi Perfil</h2>
        <p>Administra tu información personal</p>
      </div>
      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-avatar">
            <i className="fas fa-user-circle"></i>
          </div>
          <div className="profile-info">
            <h3>{user?.firstName || 'Usuario'} {user?.lastName || ''}</h3>
            <p>{user?.email}</p>
            <span className="profile-role">Estudiante</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default StudentProfileView;
