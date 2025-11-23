import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import './DurationConfigModal.css';
function DurationConfigModal({ 
  isOpen = false, 
  onClose = () => {},
  onSetDuration = () => {},
  currentDuration = 1500 // 25 minutos por defecto en segundos
}) {
  const [selectedMinutes, setSelectedMinutes] = useState(Math.floor(currentDuration / 60));
  const durationOptions = [15, 20, 25, 30, 45, 60, 90];
  const handleDurationSelect = (minutes) => {
    setSelectedMinutes(minutes);
  };
  const handleApply = () => {
    try {
      onSetDuration(selectedMinutes);
      onClose();
    } catch (error) {
      console.error('Error setting duration:', error);
      onClose();
    }
  };
  const handleCancel = () => {
    setSelectedMinutes(Math.floor(currentDuration / 60));
    onClose();
  };
  const handleCustomInput = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0 && value <= 180) {
      setSelectedMinutes(value);
    }
  };
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  };
  if (!isOpen) return null;
  return createPortal(
    <div 
      className="duration-config-modal"
      onClick={handleBackdropClick}
    >
      <div 
        className="duration-config-modal__content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="duration-config-modal__header">
          <h2>⏱️ Configurar Tiempo de Concentración</h2>
          <button 
            className="duration-config-modal__close"
            onClick={handleCancel}
          >
            ✕
          </button>
        </div>
        <div className="duration-config-modal__body">
          <p className="duration-config-modal__description">
            Selecciona la duración de tu sesión de concentración. 
            Recomendamos comenzar con sesiones de 25 minutos.
          </p>
          {}
          <div className="duration-config-modal__quick-options">
            <h3>Duraciones Populares:</h3>
            <div className="duration-config-modal__options-grid">
              {durationOptions.map(minutes => (
                <button
                  key={minutes}
                  className={`duration-config-modal__option ${
                    selectedMinutes === minutes ? 'selected' : ''
                  }`}
                  onClick={() => handleDurationSelect(minutes)}
                >
                  <span className="duration-config-modal__option-time">
                    {minutes}min
                  </span>
                  <span className="duration-config-modal__option-label">
                    {minutes === 15 && '⚡ Rápida'}
                    {minutes === 25 && '🎯 Clásica'}
                    {minutes === 45 && '💪 Intensa'}
                    {minutes === 60 && '🔥 Máximo'}
                    {minutes === 90 && '🌟 Extrema'}
                  </span>
                </button>
              ))}
            </div>
          </div>
          {}
          <div className="duration-config-modal__custom">
            <h3>Duración Personalizada:</h3>
            <div className="duration-config-modal__custom-input">
              <input
                type="number"
                min="5"
                max="180"
                value={selectedMinutes}
                onChange={handleCustomInput}
                className="duration-config-modal__input"
              />
              <span>minutos</span>
            </div>
            <small className="duration-config-modal__hint">
              Entre 5 y 180 minutos
            </small>
          </div>
          {}
          <div className="duration-config-modal__preview">
            <div className="duration-config-modal__preview-circle">
              <span className="duration-config-modal__preview-time">
                {selectedMinutes.toString().padStart(2, '0')}:00
              </span>
            </div>
            <p className="duration-config-modal__preview-text">
              Tu sesión durará <strong>{selectedMinutes} minutos</strong>
            </p>
          </div>
        </div>
        <div className="duration-config-modal__footer">
          <button 
            className="duration-config-modal__button duration-config-modal__button--secondary"
            onClick={handleCancel}
          >
            Cancelar
          </button>
          <button 
            className="duration-config-modal__button duration-config-modal__button--primary"
            onClick={handleApply}
          >
            ✅ Establecer {selectedMinutes} minutos
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
export default DurationConfigModal;
