import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MicroactivityCard.css';
function MicroactivityCard({ microactivity, onClick, className = '' }) {
  const navigate = useNavigate();
  const handleClick = () => {
    if (onClick) {
      onClick(microactivity);
    } else {
      navigate(`/catalog/${microactivity.id}`);
    }
  };
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  };
  if (!microactivity) {
    return null;
  }
  return (
    <div
      className={`microactivity-card ${className}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Ver detalles de ${microactivity.title}`}
    >
      {}
      <div className="microactivity-card__image-container">
        {microactivity.imageUrl ? (
          <img
            src={microactivity.imageUrl}
            alt={microactivity.title}
            className="microactivity-card__image"
            loading="lazy"
          />
        ) : (
          <div className="microactivity-card__image-placeholder">
            <span className="microactivity-card__category-icon">
              {microactivity.categoryIcon}
            </span>
          </div>
        )}
      </div>
      {}
      <div className="microactivity-card__content">
        {}
        <h3 className="microactivity-card__title" title={microactivity.title}>
          {microactivity.title}
        </h3>
        {}
        <div className="microactivity-card__metadata">
          {}
          <div className="microactivity-card__category">
            <span className="microactivity-card__category-icon">
              {microactivity.categoryIcon}
            </span>
            <span className="microactivity-card__category-text">
              {microactivity.category}
            </span>
          </div>
          {}
          <div className="microactivity-card__duration">
            <span className="microactivity-card__duration-icon">⏱️</span>
            <span className="microactivity-card__duration-text">
              {microactivity.durationLabel}
            </span>
          </div>
        </div>
      </div>
      {}
      <div className="microactivity-card__overlay">
        <span className="microactivity-card__overlay-text">Ver detalles</span>
      </div>
    </div>
  );
}
export default MicroactivityCard;
