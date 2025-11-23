import React from 'react';
import './AdminSidebar.css';
const AdminSidebar = ({ user, navigationItems, onNavigationChange }) => {
  return (
    <div className="admin-sidebar">
      <AdminProfile user={user} />
      <AdminNavigation items={navigationItems} onItemClick={onNavigationChange} />
    </div>
  );
};
const AdminProfile = ({ user }) => (
  <div className="admin-profile-section">
    <div className="admin-avatar">
      <i className="fas fa-user-circle"></i>
    </div>
    <div className="admin-info">
      <h4>{user?.firstName} {user?.lastName}</h4>
      <p>{user?.email}</p>
    </div>
  </div>
);
const AdminNavigation = ({ items, onItemClick }) => (
  <nav className="admin-navigation">
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
export default AdminSidebar;
