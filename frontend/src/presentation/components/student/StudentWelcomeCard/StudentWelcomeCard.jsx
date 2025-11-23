import React from 'react';
import { useStudentStats } from './../../../hooks/useStudentStats';
import './StudentWelcomeCard.css';
const StudentWelcomeCard = ({ user, onSectionChange }) => {
  const { stats, loading, error } = useStudentStats();
  const handleTimerClick = () => {
    window.location.href = '/timer';
  };
  const handleCatalogClick = () => {
    window.location.href = '/catalog';
  };
  return (
    <div className="student-welcome-card">
      <WelcomeContent user={user} />
      <WelcomeActions 
        onTimerClick={handleTimerClick} 
        onCatalogClick={handleCatalogClick}
      />
    </div>
  );
};
const WelcomeContent = ({ user }) => (
  <div className="student-welcome-content">
    <h2>¡Hola {user?.firstName}! 👋</h2>
    <p>¿Qué harás el día de hoy para mejorar tu bienestar?</p>
  </div>
);
const WelcomeActions = ({ onTimerClick, onCatalogClick }) => (
  <div className="student-welcome-actions">
    <button 
      className="welcome-action-btn timer-btn"
      onClick={onTimerClick}
    >
      <i className="fas fa-play me-2"></i>
      Iniciar Timer
    </button>
    <button 
      className="welcome-action-btn catalog-btn"
      onClick={onCatalogClick}
    >
      <i className="fas fa-search me-2"></i>
      Explorar
    </button>
  </div>
);
export default StudentWelcomeCard;
