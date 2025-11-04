// Dashboard principal del estudiante
import React from 'react';
import { useAuth } from '../../../../state/contexts/AuthContext';
import './DashboardPage.module.css';

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-page">
      <h1>¡Bienvenido, {user?.firstName}!</h1>
      <p>Tu espacio de bienestar está listo</p>
      
      {/* TODO: Agregar componentes del dashboard */}
      <div className="dashboard-content">
        <div className="quick-actions">
          <h3>Acciones Rápidas</h3>
          {/* Botones para catálogo, sorpréndeme, etc. */}
        </div>
        
        <div className="metrics-preview">
          <h3>Resumen</h3>
          {/* Métricas básicas */}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
