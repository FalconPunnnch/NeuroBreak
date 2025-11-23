import React from 'react';
import './StudentMetricsGrid.css';
const StudentMetricsGrid = ({ metrics = [] }) => {
  if (!metrics || metrics.length === 0) {
    return null;
  }
  return (
    <div className="student-metrics-grid">
      <h3 className="metrics-title">
        <i className="fas fa-chart-bar me-2"></i>
        Resumen General
      </h3>
      <div className="metrics-container">
        {metrics.map((metric, index) => (
          <StudentMetricCard key={index} metric={metric} />
        ))}
      </div>
    </div>
  );
};
const StudentMetricCard = ({ metric }) => (
  <div className={`student-metric-card ${metric.color}`}>
    <div className="metric-icon">
      <i className={metric.icon}></i>
    </div>
    <div className="metric-details">
      <h3>{metric.value}</h3>
      <p>{metric.title}</p>
      <small>{metric.description}</small>
    </div>
  </div>
);
export default StudentMetricsGrid;
