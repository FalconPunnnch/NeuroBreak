import React, { useState, useEffect } from 'react';
import { useTimer } from 'contexts/TimerContext';
import './TimerConfigurator.css';
function TimerConfigurator({ className = '', disabled = false }) {
  const {
    duration,
    avoidN,
    setDuration,
    setAvoidN
  } = useTimer();
  const [durationMinutes, setDurationMinutes] = useState(Math.floor(duration / 60));
  const [avoidCount, setAvoidCount] = useState(avoidN);
  const presetDurations = [
    { value: 5, label: '5 min', description: 'Pausa corta' },
    { value: 15, label: '15 min', description: 'Sesión rápida' },
    { value: 25, label: '25 min', description: 'Pomodoro' },
    { value: 30, label: '30 min', description: 'Sesión media' },
    { value: 45, label: '45 min', description: 'Sesión larga' },
    { value: 60, label: '60 min', description: 'Hora completa' }
  ];
  useEffect(() => {
    setDurationMinutes(Math.floor(duration / 60));
    setAvoidCount(avoidN);
  }, [duration, avoidN]);
  const handlePresetDuration = (minutes) => {
    if (disabled) return;
    setDurationMinutes(minutes);
    setDuration(minutes * 60); // Convertir a segundos para el Context
  };
  const handleDurationChange = (event) => {
    if (disabled) return;
    const minutes = parseInt(event.target.value, 10);
    if (isNaN(minutes) || minutes < 1) return;
    setDurationMinutes(minutes);
    setDuration(minutes * 60); // Convertir a segundos
  };
  const handleAvoidNChange = (event) => {
    if (disabled) return;
    const count = parseInt(event.target.value, 10);
    if (isNaN(count) || count < 1) return;
    setAvoidCount(count);
    setAvoidN(count);
  };
  const isValidDuration = (minutes) => {
    return minutes >= 1 && minutes <= 120; // Entre 1 minuto y 2 horas
  };
  const getDurationDescription = () => {
    const preset = presetDurations.find(p => p.value === durationMinutes);
    if (preset) return preset.description;
    if (durationMinutes < 10) return 'Pausa muy corta';
    if (durationMinutes < 20) return 'Pausa corta';
    if (durationMinutes < 40) return 'Sesión media';
    if (durationMinutes < 60) return 'Sesión larga';
    return 'Sesión extendida';
  };
  return (
    <div className={`timer-configurator ${className} ${disabled ? 'disabled' : ''}`}>
      {}
      <div className="timer-configurator__section">
        <h3 className="timer-configurator__title">
          Duración del Timer
        </h3>
        {}
        <div className="timer-configurator__presets">
          {presetDurations.map((preset) => (
            <button
              key={preset.value}
              className={`timer-configurator__preset ${
                durationMinutes === preset.value ? 'active' : ''
              }`}
              onClick={() => handlePresetDuration(preset.value)}
              disabled={disabled}
              type="button"
              aria-label={`Configurar timer a ${preset.label} - ${preset.description}`}
            >
              <span className="timer-configurator__preset-value">
                {preset.label}
              </span>
              <span className="timer-configurator__preset-description">
                {preset.description}
              </span>
            </button>
          ))}
        </div>
        {}
        <div className="timer-configurator__custom">
          <label 
            htmlFor="custom-duration"
            className="timer-configurator__label"
          >
            Duración personalizada (minutos)
          </label>
          <div className="timer-configurator__input-group">
            <input
              id="custom-duration"
              type="number"
              min="1"
              max="120"
              value={durationMinutes}
              onChange={handleDurationChange}
              disabled={disabled}
              className={`timer-configurator__input ${
                !isValidDuration(durationMinutes) ? 'invalid' : ''
              }`}
              aria-describedby="duration-description duration-help"
            />
            <span className="timer-configurator__input-unit">min</span>
          </div>
          <p id="duration-description" className="timer-configurator__description">
            {getDurationDescription()}
          </p>
          {!isValidDuration(durationMinutes) && (
            <p className="timer-configurator__error" role="alert">
              La duración debe estar entre 1 y 120 minutos
            </p>
          )}
        </div>
      </div>
      {}
      <div className="timer-configurator__section">
        <h3 className="timer-configurator__title">
          Variedad de Actividades
        </h3>
        <div className="timer-configurator__avoid-section">
          <label 
            htmlFor="avoid-count"
            className="timer-configurator__label"
          >
            Evitar últimas actividades
          </label>
          <div className="timer-configurator__input-group">
            <input
              id="avoid-count"
              type="number"
              min="1"
              max="10"
              value={avoidCount}
              onChange={handleAvoidNChange}
              disabled={disabled}
              className="timer-configurator__input"
              aria-describedby="avoid-help"
            />
            <span className="timer-configurator__input-unit">
              actividad{avoidCount !== 1 ? 'es' : ''}
            </span>
          </div>
          <p id="avoid-help" className="timer-configurator__help">
            El sistema evitará repetir las últimas {avoidCount} microactividades 
            que hayas realizado para mayor variedad.
          </p>
        </div>
      </div>
      {}
      <div className="timer-configurator__summary">
        <h4 className="timer-configurator__summary-title">
          Configuración actual:
        </h4>
        <ul className="timer-configurator__summary-list">
          <li>
            <strong>Duración:</strong> {durationMinutes} minutos ({getDurationDescription()})
          </li>
          <li>
            <strong>Variedad:</strong> Evita últimas {avoidCount} actividades
          </li>
        </ul>
      </div>
    </div>
  );
}
export default TimerConfigurator;
