import React from 'react';
import './StudentMoodHistoryView.css';
const StudentMoodHistoryView = ({ user }) => {
  return (
    <div className="student-mood-view">
      <div className="mood-header">
        <h2>Estados de Ánimo</h2>
        <p>Rastrea cómo te has sentido a lo largo del tiempo</p>
      </div>
      <div className="mood-content">
        <div className="mood-placeholder">
          <i className="fas fa-heart"></i>
          <h3>Sin registros de ánimo aún</h3>
          <p>Cuando completes actividades y registres tu estado emocional, aparecerá aquí tu historial.</p>
        </div>
      </div>
    </div>
  );
};
export default StudentMoodHistoryView;
