import React from 'react';
import './StudentHistoryView.css';
const StudentHistoryView = ({ user }) => {
  return (
    <div className="student-history-view">
      <div className="history-header">
        <h2>Mi Historia</h2>
        <p>Revisa tu progreso y actividades completadas</p>
      </div>
      <div className="history-content">
        <div className="history-placeholder">
          <i className="fas fa-history"></i>
          <h3>No hay actividades aún</h3>
          <p>Cuando completes tu primera actividad, aparecerá aquí tu progreso.</p>
        </div>
      </div>
    </div>
  );
};
export default StudentHistoryView;
