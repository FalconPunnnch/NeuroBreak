import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import './ConfirmationModal.css';
function ConfirmationModal({ 
  isOpen = false, 
  onConfirm = () => {}, 
  onCancel = () => {},
  duration = 0,
  nextMicroactivity = null,
  className = ''
}) {
  const [hasHeadphones, setHasHeadphones] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const modalRef = useRef(null);
  const firstFocusableRef = useRef(null);
  const lastFocusableRef = useRef(null);
  const headphoneCheckboxRef = useRef(null);
  const confirmButtonRef = useRef(null);
  const cancelButtonRef = useRef(null);
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (remainingSeconds === 0) {
      return `${minutes} minuto${minutes !== 1 ? 's' : ''}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      onCancel();
      return;
    }
    if (event.key === 'Tab') {
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusableElements || focusableElements.length === 0) return;
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }
  };
  const handleConfirm = async () => {
    if (!hasHeadphones) {
      headphoneCheckboxRef.current?.focus();
      return;
    }
    setIsSubmitting(true);
    try {
      await onConfirm();
    } catch (error) {
      console.error('Error confirmando timer:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleCancel = () => {
    if (isSubmitting) return;
    setHasHeadphones(false);
    onCancel();
  };
  useEffect(() => {
    if (!isOpen) {
      setHasHeadphones(false);
      setIsSubmitting(false);
      return;
    }
    const timer = setTimeout(() => {
      headphoneCheckboxRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, [isOpen]);
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = originalOverflow;
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen]);
  if (!isOpen) return null;
  return createPortal(
    <div 
      className={`confirmation-modal ${className}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmation-modal-title"
      aria-describedby="confirmation-modal-description"
    >
      {}
      <div 
        className="confirmation-modal__backdrop"
        onClick={handleCancel}
      />
      {}
      <div 
        className="confirmation-modal__content"
        ref={modalRef}
      >
        {}
        <div className="confirmation-modal__header">
          <h2 
            id="confirmation-modal-title"
            className="confirmation-modal__title"
          >
            🎯 ¿Iniciar Sesión de Concentración?
          </h2>
          <button
            ref={lastFocusableRef}
            className="confirmation-modal__close"
            onClick={handleCancel}
            aria-label="Cerrar modal"
            disabled={isSubmitting}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
            </svg>
          </button>
        </div>
        {}
        <div className="confirmation-modal__body">
          {}
          <div className="confirmation-modal__timer-info">
            <div className="confirmation-modal__timer-duration">
              <span className="confirmation-modal__timer-icon">⏰</span>
              <span className="confirmation-modal__timer-text">
                Duración: <strong>{formatDuration(duration)}</strong>
              </span>
            </div>
            {nextMicroactivity && (
              <div className="confirmation-modal__microactivity-info">
                <span className="confirmation-modal__microactivity-icon">
                  🎯
                </span>
                <span className="confirmation-modal__microactivity-text">
                  Al finalizar: <strong>{nextMicroactivity.title}</strong>
                </span>
              </div>
            )}
          </div>
          {}
          <p 
            id="confirmation-modal-description"
            className="confirmation-modal__description"
          >
            Una vez iniciado el timer, comenzará la sesión de concentración. 
            Al finalizar, se reproducirán notificaciones de audio para alertarte.
          </p>
          {}
          <div className="confirmation-modal__headphones">
            <label className="confirmation-modal__headphones-label">
              <input
                ref={headphoneCheckboxRef}
                type="checkbox"
                className="confirmation-modal__headphones-checkbox"
                checked={hasHeadphones}
                onChange={(e) => setHasHeadphones(e.target.checked)}
                aria-describedby="headphones-description"
                disabled={isSubmitting}
              />
              <span className="confirmation-modal__headphones-checkmark">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/>
                </svg>
              </span>
              <span className="confirmation-modal__headphones-text">
                <strong>Confirmo que tengo audífonos puestos</strong>
              </span>
            </label>
            <p 
              id="headphones-description"
              className="confirmation-modal__headphones-description"
            >
              🎧 Los audífonos son necesarios para recibir las notificaciones de audio 
              sin molestar a otros. Este campo es <strong>obligatorio</strong>.
            </p>
          </div>
          {}
          {!hasHeadphones && (
            <div className="confirmation-modal__warning" role="alert">
              <span className="confirmation-modal__warning-icon">⚠️</span>
              <span className="confirmation-modal__warning-text">
                Debes confirmar que tienes audífonos para continuar
              </span>
            </div>
          )}
        </div>
        {}
        <div className="confirmation-modal__footer">
          <button
            ref={firstFocusableRef}
            className="confirmation-modal__button confirmation-modal__button--cancel"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            ref={confirmButtonRef}
            className={`
              confirmation-modal__button 
              confirmation-modal__button--confirm
              ${!hasHeadphones ? 'confirmation-modal__button--disabled' : ''}
              ${isSubmitting ? 'confirmation-modal__button--loading' : ''}
            `}
            onClick={handleConfirm}
            disabled={!hasHeadphones || isSubmitting}
            aria-describedby={!hasHeadphones ? 'headphones-description' : undefined}
          >
            {isSubmitting ? (
              <>
                <span className="confirmation-modal__button-spinner"></span>
                Iniciando...
              </>
            ) : (
              <>
                <span className="confirmation-modal__button-icon">🚀</span>
                Iniciar Timer
              </>
            )}
          </button>
        </div>
        {}
        <div className="confirmation-modal__accessibility-hint">
          <p>Presiona ESC para cerrar o TAB para navegar</p>
        </div>
      </div>
    </div>,
    document.body
  );
}
export default ConfirmationModal;
