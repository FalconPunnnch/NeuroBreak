import React from 'react';
import './MetricsGrid.css';
const MetricsGrid = ({ metrics = [] }) => {
  if (!metrics || metrics.length === 0) {
    return null;
  }
  return (
    <div className="metrics-grid">
      {metrics.map((metric, index) => (
        <MetricCard key={index} metric={metric} />
      ))}
    </div>
  );
};
const MetricCard = ({ metric }) => (
  <div className={`metric-card ${metric.color}`}>
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
export default MetricsGrid;
