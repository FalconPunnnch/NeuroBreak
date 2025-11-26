import React, { useState } from 'react';
import { useMicroactivityCrud } from './../../../hooks/useMicroactivityCrud';
import { useAuth } from '../../../../state/contexts/AuthContext';
import { CATEGORIES_ARRAY } from '../../../../config/constants';
import './MicroactivitiesCrud.css';
const MicroactivitiesCrud = () => {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const {
    microactivities,
    loading,
    error,
    loadMicroactivities,
    createMicroactivity,
    updateMicroactivity,
    deleteMicroactivity
  } = useMicroactivityCrud();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMicroactivity, setSelectedMicroactivity] = useState(null);
  const isAdmin = user && (user.role === 'admin' || user.rol === 'admin');
  const handleEditClick = (microactivity) => {
    setSelectedMicroactivity(microactivity);
    setShowEditModal(true);
  };
  const handleDeleteClick = async (microactivity) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta microactividad?')) {
      try {
        await deleteMicroactivity(microactivity.id);
        await loadMicroactivities();
      } catch (error) {
        console.error('Error eliminando microactividad:', error);
      }
    }
  };
  const handleCreateSuccess = async () => {
    setShowCreateModal(false);
    await loadMicroactivities();
  };
  const handleEditSuccess = async () => {
    setShowEditModal(false);
    setSelectedMicroactivity(null);
    await loadMicroactivities();
  };
  const handleCloseModals = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setSelectedMicroactivity(null);
  };
  if (authLoading) {
    return <LoadingState />;
  }
  if (!isAuthenticated || !isAdmin) {
    return <UnauthorizedAccess />;
  }
  return (
    <div className="microactivities-crud">
      <div className="crud-content">
        <CrudHeader onCreateClick={() => setShowCreateModal(true)} />
        <MicroactivitiesTable 
          microactivities={microactivities}
          loading={loading}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
        {error && <ErrorState error={error} onRetry={loadMicroactivities} />}
      </div>
      <ModalManager 
        showCreateModal={showCreateModal}
        showEditModal={showEditModal}
        selectedMicroactivity={selectedMicroactivity}
        onCreateSuccess={handleCreateSuccess}
        onEditSuccess={handleEditSuccess}
        onClose={handleCloseModals}
        onCreate={createMicroactivity}
        onUpdate={updateMicroactivity}
      />
    </div>
  );
};
const LoadingState = () => (
  <div className="loading-state" style={{ textAlign: 'center', padding: '2rem' }}>
    <div className="spinner-border" role="status">
      <span className="sr-only">Cargando...</span>
    </div>
    <p>Cargando panel de administración...</p>
  </div>
);
const UnauthorizedAccess = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '60vh',
    padding: '2rem'
  }}>
    <div style={{
      textAlign: 'center',
      background: 'white',
      padding: '3rem',
      borderRadius: '10px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      maxWidth: '400px'
    }}>
      <h3 style={{ color: '#333', marginBottom: '1rem' }}>
        🔐 Acceso Restringido
      </h3>
      <p style={{ color: '#666', lineHeight: '1.5' }}>
        Necesitas permisos de administrador para acceder a esta página.
      </p>
    </div>
  </div>
);
const ErrorState = ({ error, onRetry }) => (
  <div className="error-state" style={{ 
    textAlign: 'center', 
    padding: '2rem', 
    background: '#f8d7da', 
    border: '1px solid #f5c6cb',
    borderRadius: '5px',
    margin: '1rem 0'
  }}>
    <h4>⚠️ Error</h4>
    <p>{error}</p>
    <button className="btn btn-primary" onClick={onRetry}>
      <i className="fas fa-retry"></i> Reintentar
    </button>
  </div>
);
const CrudHeader = ({ onCreateClick }) => (
  <div className="crud-header">
    <div>
      <h2>
        📋 Gestión de Microactividades
      </h2>
      <p style={{ color: '#6c757d', margin: '0.5rem 0 0 0' }}>
        Administra las actividades disponibles para los estudiantes
      </p>
    </div>
    <button 
      className="btn btn-success"
      onClick={onCreateClick}
    >
      <i className="fas fa-plus"></i> Crear Microactividad
    </button>
  </div>
);
const MicroactivitiesTable = ({ microactivities, loading, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div className="loading">
        <div className="spinner-border" role="status"></div>
        <p>Cargando microactividades...</p>
      </div>
    );
  }
  if (!microactivities || microactivities.length === 0) {
    return (
      <div className="no-data">
        <i className="fas fa-inbox fa-3x"></i>
        <h4>📭 No hay microactividades</h4>
        <p>Aún no se han creado microactividades. ¡Crea la primera!</p>
      </div>
    );
  }
  return (
    <div className="crud-table">
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Categoría</th>
            <th>Duración</th>
            <th>Tiempo de concentración</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {microactivities.map(microactivity => (
            <MicroactivityRow 
              key={microactivity.id}
              microactivity={microactivity}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
const MicroactivityRow = ({ microactivity, onEdit, onDelete }) => (
  <tr>
    <td>{microactivity.id}</td>
    <td style={{ fontWeight: 'bold' }}>{microactivity.title}</td>
    <td>
      <span className={`badge badge-${getCategoryColor(microactivity.category)}`}>
        {microactivity.category}
      </span>
    </td>
  <td>{microactivity.duration} min</td>
  <td>{microactivity.concentration_time ? `${microactivity.concentration_time} min` : 'N/A'}</td>
    <td>
      <div className="btn-group" role="group">
        <button
          className="btn btn-sm btn-outline-primary"
          onClick={() => onEdit(microactivity)}
          title="Editar"
        >
          <i className="fas fa-edit"></i>
        </button>
        <button
          className="btn btn-sm btn-outline-danger"
          onClick={() => onDelete(microactivity)}
          title="Eliminar"
        >
          <i className="fas fa-trash"></i>
        </button>
      </div>
    </td>
  </tr>
);
const ModalManager = ({
  showCreateModal,
  showEditModal,
  selectedMicroactivity,
  onCreateSuccess,
  onEditSuccess,
  onClose,
  onCreate,
  onUpdate
}) => (
  <>
    {showCreateModal && (
      <CreateModal 
        isOpen={showCreateModal}
        onClose={onClose}
        onSuccess={onCreateSuccess}
        onCreate={onCreate}
      />
    )}
    {showEditModal && selectedMicroactivity && (
      <EditModal 
        isOpen={showEditModal}
        microactivity={selectedMicroactivity}
        onClose={onClose}
        onSuccess={onEditSuccess}
        onUpdate={onUpdate}
      />
    )}
  </>
);
const CreateModal = ({ isOpen, onClose, onSuccess, onCreate }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    duration: '',
    concentration_time: ''
  });
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onCreate({
        ...formData,
        duration: parseInt(formData.duration),
        concentration_time: formData.concentration_time ? parseInt(formData.concentration_time) : null
      });
      onSuccess();
    } catch (error) {
      console.error('Error creando microactividad:', error);
      alert('Error al crear la microactividad: ' + error.message);
    } finally {
      setLoading(false);
    }
  };
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Crear Nueva Microactividad</h3>
          <button className="btn-close" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <MicroactivityForm 
              formData={formData}
              onChange={setFormData}
            />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-success" disabled={loading}>
              {loading ? 'Creando...' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
const EditModal = ({ isOpen, microactivity, onClose, onSuccess, onUpdate }) => {
  const [formData, setFormData] = useState({
    title: microactivity?.title || '',
    description: microactivity?.description || '',
    category: microactivity?.category || '',
    duration: microactivity?.duration || '',
    concentration_time: microactivity?.concentration_time || ''
  });
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onUpdate(microactivity.id, {
        ...formData,
        duration: parseInt(formData.duration),
        concentration_time: formData.concentration_time ? parseInt(formData.concentration_time) : null
      });
      onSuccess();
    } catch (error) {
      console.error('Error actualizando microactividad:', error);
      alert('Error al actualizar la microactividad: ' + error.message);
    } finally {
      setLoading(false);
    }
  };
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Editar Microactividad</h3>
          <button className="btn-close" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <MicroactivityForm 
              formData={formData}
              onChange={setFormData}
            />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-success" disabled={loading}>
              {loading ? 'Actualizando...' : 'Actualizar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
const MicroactivityForm = ({ formData, onChange }) => (
  <div>
    <div className="form-group">
      <label>Título *</label>
      <input
        type="text"
        className="form-control"
        value={formData.title}
        onChange={(e) => onChange({ ...formData, title: e.target.value })}
        required
      />
    </div>
    <div className="form-group">
      <label>Categoría *</label>
      <select
        className="form-control"
        value={formData.category}
        onChange={(e) => onChange({ ...formData, category: e.target.value })}
        required
      >
        <option value="">Selecciona una categoría</option>
        {CATEGORIES_ARRAY.map(category => (
          <option key={category} value={category}>{category}</option>
        ))}
      </select>
    </div>
    <div className="form-group">
      <label>Duración (minutos) *</label>
      <input
        type="number"
        className="form-control"
        min="1"
        max="60"
        value={formData.duration}
        onChange={(e) => onChange({ ...formData, duration: e.target.value })}
        required
        style={{ width: '120px' }}
      />
    </div>
    <div className="form-group">
      <label>Tiempo de concentración sugerido (minutos)</label>
      <input
        type="number"
        className="form-control"
        min="1"
        max="60"
        value={formData.concentration_time}
        onChange={(e) => onChange({ ...formData, concentration_time: e.target.value })}
        style={{ width: '120px' }}
      />
    </div>
    <div className="form-group">
      <label>Descripción *</label>
      <textarea
        className="form-control"
        value={formData.description}
        onChange={(e) => onChange({ ...formData, description: e.target.value })}
        rows="3"
        required
      />
    </div>
  </div>
);
const getCategoryColor = (category) => {
  const colors = {
    'Mente': 'primary',
    'Creatividad': 'success', 
    'Cuerpo': 'warning'
  };
  return colors[category] || 'secondary';
};
export default MicroactivitiesCrud;
