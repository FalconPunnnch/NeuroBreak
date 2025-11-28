import React from 'react';
import { useMicroactivityStats } from 'hooks/shared/useMicroactivityStats';
import './WelcomeCard.css';
const WelcomeCard = ({ user, onSectionChange }) => {
  const { stats, loading, error } = useMicroactivityStats();
  const handleMicroactivitiesClick = () => {
    if (onSectionChange) {
      onSectionChange('microactivities');
    }
  };
  return (
    <div className="welcome-card">
      <WelcomeContent user={user} />
      <QuickStats stats={stats} loading={loading} error={error} />
      <WelcomeActions onMicroactivitiesClick={handleMicroactivitiesClick} />
    </div>
  );
};
const WelcomeContent = ({ user }) => (
  <div className="welcome-content">
    <h3>¡Bienvenido/a, {user?.firstName}!</h3>
    <p>Tu panel de control está listo para gestionar la plataforma</p>
  </div>
);
const QuickStats = ({ stats, loading, error }) => {
  if (loading) {
    return (
      <div className="quick-stats">
        <div className="stat-item">
          <span className="stat-number">...</span>
          <span className="stat-label">Cargando...</span>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="quick-stats">
        <div className="stat-item">
          <span className="stat-number">--</span>
          <span className="stat-label">Error al cargar</span>
        </div>
      </div>
    );
  }
  return (
    <div className="quick-stats">
      <div className="stat-item">
        <span className="stat-number">{stats.total}</span>
        <span className="stat-label">Microactividades Activas</span>
      </div>
    </div>
  );
};
const WelcomeActions = ({ onMicroactivitiesClick }) => (
  <div className="welcome-actions">
    <button 
      className="btn btn-primary"
      onClick={onMicroactivitiesClick}
    >
      <i className="fas fa-brain me-2"></i>
      Gestionar Contenido
    </button>
  </div>
);
export default WelcomeCard;