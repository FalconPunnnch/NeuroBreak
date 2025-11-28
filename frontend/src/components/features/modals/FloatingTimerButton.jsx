import React from 'react';
import { useNavigate } from 'react-router-dom';
import './FloatingTimerButton.css';
function FloatingTimerButton({ 
  className = '', 
  disabled = false,
  onClick = null,
  'aria-label': ariaLabel = 'Abrir temporizador de concentración'
}) {
  const navigate = useNavigate();
  const handleClick = () => {
    if (disabled) return;
    if (onClick) {
      onClick();
    } else {
      navigate('/timer');
    }
  };
  const handleKeyDown = (event) => {
    if (disabled) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  };
  return (
    <button
      className={`floating-timer-button ${className} ${disabled ? 'disabled' : ''}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      aria-label={ariaLabel}
      title="Temporizador de concentración"
      tabIndex={disabled ? -1 : 0}
    >
      <div className="floating-timer-button__icon">
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-hidden="true"
        >
          <circle 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="2"
          />
          <polyline 
            points="12,6 12,12 16,14" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <span className="floating-timer-button__label">
        Timer
      </span>
    </button>
  );
}
export default FloatingTimerButton;
