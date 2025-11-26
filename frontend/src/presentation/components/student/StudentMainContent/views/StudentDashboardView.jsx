import React from 'react';
import { useAuth } from '../../../../../state/contexts/AuthContext';
import './StudentDashboardView.css';
const StudentDashboardView = ({ metrics = [], loading = false, onRefresh = () => {} }) => {
  const { user } = useAuth();
  const renderMetricCard = (metric, index) => (
    <div key={index} className={`metric-card metric-card--${metric.color}`}>
      <div className="metric-card__header">
        <div className="metric-card__icon">
          <i className={metric.icon}></i>
        </div>
      </div>
      <div className="metric-card__content">
        <h3 className="metric-card__value">{metric.value}</h3>
        <p className="metric-card__title">{metric.title}</p>
        <p className="metric-card__description">{metric.description}</p>
      </div>
    </div>
  );
  return (
    <div className="student-dashboard-view">
      {}
      <div className="dashboard-welcome">
        <div className="welcome-content">
          <h2 className="welcome-title">
            ¡Hola {user?.firstName || 'Usuario'}! 👋
          </h2>
          <p className="welcome-subtitle">
            Aquí tienes un resumen de tu progreso en bienestar
          </p>
        </div>
        <div className="welcome-actions">
          <button 
            className="btn btn--primary"
            onClick={() => window.location.href = '/timer'}
          >
            <i className="fas fa-play me-2"></i>
            Iniciar Timer
          </button>
          <button 
            className="btn btn--secondary"
            onClick={() => window.location.href = '/catalog'}
          >
            <i className="fas fa-search me-2"></i>
            Explorar
          </button>
        </div>
      </div>
      {}
      <div className="dashboard-section">
        <div className="section-header">
          <h3>📊 Resumen General</h3>
          <button className="refresh-btn" onClick={onRefresh} disabled={loading}>
            <i className={`fas fa-sync-alt ${loading ? 'fa-spin' : ''}`}></i>
            Actualizar
          </button>
        </div>
        <div className="metrics-grid">
          {metrics.map((metric, index) => renderMetricCard(metric, index))}
        </div>
      </div>
      {}
      <div className="dashboard-section">
        <h3>🕐 Actividad Reciente</h3>
        <div className="recent-activity">
          <p className="text-muted">Comienza tu primera actividad para ver tu progreso aquí.</p>
        </div>
      </div>
    </div>
  );
};
export default StudentDashboardView;
