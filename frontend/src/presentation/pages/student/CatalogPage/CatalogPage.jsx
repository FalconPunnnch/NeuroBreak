import React from 'react';
import { CatalogProvider } from '../../../../state/contexts/catalog/CatalogContext.js';
import { FiltersBar, MicroactivityList } from '../../../components/features/catalog/index.js';
import { useCatalog } from '../../../hooks/catalog/index.js';
import Header from '../../../components/layout/Header/Header.jsx';
import Footer from '../../../components/layout/Footer/Footer.jsx';
import FloatingTimerButton from '../../../../components/FloatingTimerButton';
import './CatalogPage.css';
function CatalogPageContent() {
  const {
    filteredMicroactivities,
    loading,
    error,
    hasFilteredItems,
    filteredCount,
    reloadCatalog
  } = useCatalog();
  return (
    <div className="catalog-page">
      <div className="catalog-page__container">
        {}
        <FiltersBar />
        {}
        {error && (
          <div className="catalog-page__error">
            <div className="catalog-page__error-content">
              <h3>¡Oops! Algo salió mal</h3>
              <p>{error}</p>
              <button 
                onClick={reloadCatalog}
                className="catalog-page__retry-btn"
              >
                Reintentar
              </button>
            </div>
          </div>
        )}
        {}
        {!error && (
          <div className="catalog-page__content">
            {}
            {!loading && hasFilteredItems && (
              <div className="catalog-page__results-header">
                <h3 className="catalog-page__results-title">
                  {filteredCount === 1 
                    ? '1 microactividad encontrada' 
                    : `${filteredCount} microactividades encontradas`
                  }
                </h3>
              </div>
            )}
            {}
            <MicroactivityList
              microactivities={filteredMicroactivities}
              loading={loading}
              emptyMessage="No se encontraron microactividades que coincidan con los filtros seleccionados. Prueba ajustando los criterios de búsqueda."
              className="catalog-page__list"
            />
          </div>
        )}
      </div>
    </div>
  );
}
function CatalogPage() {
  return (
    <>
      <Header />
      <CatalogProvider>
        <div className="catalog-page-wrapper">
          {}
          <div className="catalog-page__header">
            <div className="catalog-page__header-content">
              <h1 className="catalog-page__title">Catálogo de Microactividades</h1>
              <p className="catalog-page__subtitle">
                Descubre actividades diseñadas para mejorar tu bienestar mental y físico
              </p>
            </div>
          </div>
          {}
          <CatalogPageContent />
        </div>
      </CatalogProvider>
      {}
      <FloatingTimerButton />
      <Footer />
    </>
  );
}
export default CatalogPage;
