import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import MoodService from '../core/services/MoodService';
import './EmotionModal.css';
function EmotionModal({ 
  isOpen = false, 
  onClose = () => {}, 
  onMoodSelected = () => {},
  microactivityId = null,
  microactivityName = '',
  className = ''
}) {
  const [selectedMood, setSelectedMood] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();
  const modalRef = useRef(null);
  const submitButtonRef = useRef(null);
  const moodOptionsRef = useRef([]);
  const closeButtonRef = useRef(null);
  const moodService = new MoodService();
  const moodOptions = moodService.getMoodOptions();
  const handleMoodSelect = (moodType) => {
    setSelectedMood(moodType);
    setError(null);
    setTimeout(() => {
      submitButtonRef.current?.focus();
    }, 100);
  };
  const handleSubmitMood = async () => {
    if (!selectedMood || !microactivityId) return;
    setIsSubmitting(true);
    setError(null);
    try {
      console.log('🎯 EmotionModal: Iniciando guardado de mood...');
      await moodService.saveMood(microactivityId, selectedMood.value);
      console.log('✅ EmotionModal: Mood guardado exitosamente');
      setShowSuccess(true);
      console.log('📢 EmotionModal: Notificando al componente padre...');
      onMoodSelected(selectedMood);
      console.log('⏰ EmotionModal: Programando navegación a /timer en 1.5s...');
      setTimeout(() => {
        console.log('🧭 EmotionModal: Navegando a /timer...');
        navigate('/timer', { replace: true });
        setTimeout(() => {
          console.log('❌ EmotionModal: Cerrando modal...');
          handleClose();
        });
      });
    } catch (error) {
      console.error('❌ EmotionModal: Error saving mood:', error);
      setError('Error al guardar el estado emocional. Por favor, inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleClose = () => {
    if (isSubmitting || showSuccess) return; // No permitir cerrar durante envío o éxito
    setSelectedMood(null);
    setError(null);
    setShowSuccess(false);
    onClose();
  };
  const handleKeyDown = (e) => {
    if (!isOpen) return;
    if (e.key === 'Escape' && !showSuccess) {
      handleClose();
      return;
    }
    if (e.key === 'Enter' && selectedMood) {
      handleSubmitMood();
      return;
    }
    const numKey = parseInt(e.key);
    if (numKey >= 1 && numKey <= 5 && moodOptions[numKey - 1]) {
      handleMoodSelect(moodOptions[numKey - 1]);
      return;
    }
    if (['ArrowLeft', 'ArrowRight'].includes(e.key)) {
      e.preventDefault();
      const currentIndex = selectedMood ? 
        moodOptions.findIndex(mood => mood.value === selectedMood.value) : -1;
      let nextIndex;
      if (e.key === 'ArrowLeft') {
        nextIndex = currentIndex <= 0 ? moodOptions.length - 1 : currentIndex - 1;
      } else {
        nextIndex = currentIndex >= moodOptions.length - 1 ? 0 : currentIndex + 1;
      }
      handleMoodSelect(moodOptions[nextIndex]);
      moodOptionsRef.current[nextIndex]?.focus();
    }
  };
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isSubmitting && !showSuccess) {
      if (error) {
        handleClose();
      }
    }
  };
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        moodOptionsRef.current[0]?.focus();
      }, 300);
      document.addEventListener('keydown', handleKeyDown);
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = originalOverflow || 'auto';
      };
    }
  }, [isOpen, selectedMood]);
  useEffect(() => {
    if (isOpen) {
      setSelectedMood(null);
      setError(null);
      setShowSuccess(false);
    }
  }, [isOpen]);
  if (!isOpen) return null;
  return createPortal(
    <div 
      className={`emotion-modal ${className} ${showSuccess ? 'success' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="emotion-modal-title"
      aria-describedby="emotion-modal-description"
      onClick={handleBackdropClick}
    >
      {}
      <div className="emotion-modal__backdrop" />
      {}
      <div 
        className="emotion-modal__content"
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        {}
        {showSuccess && (
          <div className="emotion-modal__success">
            <div className="emotion-modal__success-icon">✅</div>
            <p className="emotion-modal__success-message">
              ¡Estado emocional guardado!
            </p>
          </div>
        )}
        {}
        <div className="emotion-modal__header">
          <h2 
            id="emotion-modal-title"
            className="emotion-modal__title"
          >
            ¿Cómo te sientes?
          </h2>
          <p 
            id="emotion-modal-description"
            className="emotion-modal__subtitle"
          >
            {microactivityName ? 
              `Acabas de completar: ${microactivityName}` :
              'Acabas de completar una microactividad'
            }
          </p>
        </div>
        {}
        <div className="emotion-modal__body">
          {}
          <p className="emotion-modal__instructions">
            Selecciona el emoji que mejor describe tu estado emocional actual:
          </p>
          {}
          <div className="emotion-modal__mood-grid" role="radiogroup" aria-required="true">
            {moodOptions.map((moodType, index) => (
              <button
                key={moodType.value}
                ref={(el) => (moodOptionsRef.current[index] = el)}
                className={`
                  emotion-modal__mood-option
                  ${selectedMood?.value === moodType.value ? 'selected' : ''}
                `}
                onClick={() => handleMoodSelect(moodType)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleMoodSelect(moodType);
                  }
                }}
                role="radio"
                aria-checked={selectedMood?.value === moodType.value}
                aria-label={`${moodType.label} - ${moodType.emoji}`}
                tabIndex={selectedMood?.value === moodType.value ? 0 : -1}
                disabled={isSubmitting}
              >
                <span className="emotion-modal__mood-emoji">
                  {moodType.emoji}
                </span>
                <span className="emotion-modal__mood-label">
                  {moodType.label}
                </span>
                <span className="emotion-modal__mood-shortcut">
                  {index + 1}
                </span>
              </button>
            ))}
          </div>
          {}
          {error && (
            <div className="emotion-modal__error" role="alert">
              <span className="emotion-modal__error-icon">⚠️</span>
              {error}
            </div>
          )}
          {}
          <div className="emotion-modal__notice">
            <span className="emotion-modal__notice-icon">ℹ️</span>
            La selección de estado emocional es <strong>obligatoria</strong> para continuar.
          </div>
        </div>
        {}
        <div className="emotion-modal__footer">
          <button
            ref={submitButtonRef}
            className={`
              emotion-modal__submit-button
              ${!selectedMood ? 'disabled' : ''}
              ${isSubmitting ? 'loading' : ''}
            `}
            onClick={handleSubmitMood}
            disabled={!selectedMood || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="emotion-modal__submit-spinner"></span>
                Guardando...
              </>
            ) : (
              <>
                <span className="emotion-modal__submit-icon">💾</span>
                Guardar Estado Emocional
              </>
            )}
          </button>
        </div>
        {}
        <div className="emotion-modal__keyboard-hints">
          <p>
            💡 <strong>Atajos:</strong> Números 1-5 para seleccionar • Flechas ← → para navegar • Enter para confirmar
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}
export default EmotionModal;
