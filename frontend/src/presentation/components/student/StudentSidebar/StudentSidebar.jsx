import React from 'react';
import './StudentSidebar.css';
const StudentSidebar = ({ user, navigationItems, onNavigationChange }) => {
  return (
    <div className="student-sidebar">
      <StudentProfile user={user} />
      <StudentNavigation items={navigationItems} onItemClick={onNavigationChange} />
    </div>
  );
};
const StudentProfile = ({ user }) => (
  <div className="student-profile-section">
    <div className="student-avatar">
      <i className="fas fa-user-circle"></i>
    </div>
    <div className="student-info">
  <h4>{user?.firstName || 'Usuario'} {user?.lastName || ''}</h4>
      <p>Estudiante</p>
    </div>
  </div>
);
const StudentNavigation = ({ items, onItemClick }) => (
  <nav className="student-navigation">
    {items.map((item) => (
      <NavigationItem
        key={item.id}
        item={item}
        onClick={() => onItemClick(item)}
      />
    ))}
  </nav>
);
const NavigationItem = ({ item, onClick }) => (
  <button
    className={`nav-item ${item.active ? 'active' : ''}`}
    onClick={onClick}
    aria-label={`Navegar a ${item.label}`}
  >
    <i className={item.icon}></i>
    <span>{item.label}</span>
  </button>
);
export default StudentSidebar;
