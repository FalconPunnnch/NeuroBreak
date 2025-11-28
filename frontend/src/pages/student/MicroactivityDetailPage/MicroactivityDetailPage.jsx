import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CatalogProvider, useCatalogContext } from 'contexts/catalog/CatalogContext';
import Header from 'components/layout/Header/Header';
import Footer from 'components/layout/Footer/Footer';
import './MicroactivityDetailPage.css';

function MicroactivityDetailContent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    selectedMicroactivity, 
    loading, 
    error, 
    loadMicroactivityById 
  } = useCatalogContext();
  useEffect(() => {
    if (id) {
      loadMicroactivityById(id);
    }
  }, [id, loadMicroactivityById]);
  const handleBack = () => {
    navigate('/catalog');
  };
  const handleStartActivity = () => {
    if (selectedMicroactivity?.id) {
      navigate(`/actividad/${selectedMicroactivity.id}`);
    }
  };
  if (loading) {
    return (
      <div className="microactivity-detail-page">
        <div className="microactivity-detail-page__container">
          <div className="microactivity-detail-page__loading">
            <div className="microactivity-detail-page__spinner"></div>
            <p>Cargando detalles...</p>
          </div>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="microactivity-detail-page">
        <div className="microactivity-detail-page__container">
          <div className="microactivity-detail-page__error">
            <h2>Error al cargar la microactividad</h2>
            <p>{error}</p>
            <div className="microactivity-detail-page__error-actions">
              <button onClick={() => loadMicroactivityById(id)} className="btn btn--primary">
                Reintentar
              </button>
              <Link to="/catalog" className="btn btn--secondary">
                Volver al catálogo
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (!selectedMicroactivity) {
    return (
      <div className="microactivity-detail-page">
        <div className="microactivity-detail-page__container">
          <div className="microactivity-detail-page__not-found">
            <h2>Microactividad no encontrada</h2>
            <p>La microactividad que buscas no existe o ha sido eliminada.</p>
            <Link to="/catalog" className="btn btn--primary">
              Volver al catálogo
            </Link>
          </div>
        </div>
      </div>
    );
  }
  const { 
    title, 
    description, 
    category, 
    categoryIcon,
    durationLabel, 
    imageUrl, 
    steps = [] 
  } = selectedMicroactivity;
  return (
    <div className="microactivity-detail-page">
      <div className="microactivity-detail-page__container">
        {}
        <div className="microactivity-detail-page__navigation">
          <button onClick={handleBack} className="microactivity-detail-page__back-btn">
            ← Volver al catálogo
          </button>
        </div>
        {}
        <div className="microactivity-detail-page__content">
          {}
          <div className="microactivity-detail-page__hero">
            <div className="microactivity-detail-page__hero-image">
              {imageUrl ? (
                <img src={imageUrl} alt={title} />
              ) : (
                <div className="microactivity-detail-page__placeholder">
                  <span className="microactivity-detail-page__icon">{categoryIcon}</span>
                </div>
              )}
            </div>
            <div className="microactivity-detail-page__hero-content">
              <div className="microactivity-detail-page__metadata">
                <span className="microactivity-detail-page__category">
                  {categoryIcon} {category}
                </span>
                <span className="microactivity-detail-page__duration">
                  ⏱️ {durationLabel}
                </span>
              </div>
              <h1 className="microactivity-detail-page__title">{title}</h1>
              {description && (
                <p className="microactivity-detail-page__description">{description}</p>
              )}
              <div className="microactivity-detail-page__actions">
                <button 
                  onClick={handleStartActivity} 
                  className="btn btn--primary btn--large"
                >
                  Iniciar actividad
                </button>
              </div>
            </div>
          </div>
          {}
          {steps.length > 0 && (
            <div className="microactivity-detail-page__steps">
              <h2 className="microactivity-detail-page__steps-title">
                Pasos de la actividad
              </h2>
              <ol className="microactivity-detail-page__steps-list">
                {steps.map((step, index) => (
                  <li key={index} className="microactivity-detail-page__step">
                    <div className="microactivity-detail-page__step-number">
                      {index + 1}
                    </div>
                    <div className="microactivity-detail-page__step-content">
                      {typeof step === 'string' ? step : step.description || step.text}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}
          {}
          <div className="microactivity-detail-page__info">
            <div className="microactivity-detail-page__info-card">
                <h3>¿Qué necesitas?</h3>
                <ul className="microactivity-detail__list">
                  {(selectedMicroactivity.requirements || []).length === 0 && (
                    <li className="microactivity-detail__list-item microactivity-detail__list-item--empty">Nada especial</li>
                  )}
                  {(selectedMicroactivity.requirements || []).map((req, idx) => (
                    <li key={idx} className="microactivity-detail__list-item">{req}</li>
                  ))}
                </ul>
            </div>
            <div className="microactivity-detail-page__info-card">
                <h3>Beneficios</h3>
                <ul className="microactivity-detail__list">
                  {(selectedMicroactivity.benefits || []).length === 0 && (
                    <li className="microactivity-detail__list-item microactivity-detail__list-item--empty">Sin beneficios registrados aún</li>
                  )}
                  {(selectedMicroactivity.benefits || []).map((benefit, idx) => (
                    <li key={idx} className="microactivity-detail__list-item">{benefit}</li>
                  ))}
                </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
function MicroactivityDetailPage() {
  return (
    <>
      <Header />
      <CatalogProvider>
        <MicroactivityDetailContent />
      </CatalogProvider>
      <Footer />
    </>
  );
}
export default MicroactivityDetailPage;
