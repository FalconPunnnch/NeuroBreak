import React from 'react';
import './StudentHeader.css';
const StudentHeader = ({ user, title = "Dashboard", subtitle = "¡Hola! Bienvenido a NeuroBreak" }) => {
  return (
    <div className="student-header">
      <div className="header-left">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <div className="header-right">
        <StudentBadge />
        <StudentClock />
      </div>
    </div>
  );
};
const StudentBadge = () => (
  <div className="student-badge">
    <i className="fas fa-graduation-cap me-2"></i>
    Estudiante
  </div>
);
const StudentClock = () => {
  const now = new Date();
  const timeString = now.toLocaleTimeString('es-ES', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  const dateString = now.toLocaleDateString('es-ES', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
  return (
    <div className="student-clock">
      <div className="time">{timeString}</div>
      <div className="date">{dateString}</div>
    </div>
  );
};
export default StudentHeader;
