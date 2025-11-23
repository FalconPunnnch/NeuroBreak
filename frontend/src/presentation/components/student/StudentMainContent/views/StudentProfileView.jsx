import React, { useState } from 'react';
import { useAuth } from '../../../../../state/contexts/AuthContext';
const StudentProfileView = ({ loading = false, onRefresh = () => {} }) => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    preferences: user?.preferences || {
      notifications: true,
      emailUpdates: false,
      weeklyReports: true
    }
  });
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };
  const handleSave = async () => {
    try {
      await updateUser(formData);
      setIsEditing(false);
      onRefresh();
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error al actualizar el perfil');
    }
  };
  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      bio: user?.bio || '',
      preferences: user?.preferences || {
        notifications: true,
        emailUpdates: false,
        weeklyReports: true
      }
    });
    setIsEditing(false);
  };
  return (
    <div className="student-profile-view">
      {}
      <div className="student-profile-header">
        <div className="student-profile-header__content">
          <h2 className="student-profile-header__title">
            <i className="fas fa-user"></i>
            Mi Perfil
          </h2>
          <p className="student-profile-header__subtitle">
            Gestiona tu información personal y preferencias
          </p>
        </div>
        <div className="student-profile-header__actions">
          {!isEditing ? (
            <button 
              className="student-dashboard-btn student-dashboard-btn--primary"
              onClick={() => setIsEditing(true)}
            >
              <i className="fas fa-edit"></i>
              Editar Perfil
            </button>
          ) : (
            <div className="student-profile-header__edit-actions">
              <button 
                className="student-dashboard-btn student-dashboard-btn--outline"
                onClick={handleCancel}
              >
                <i className="fas fa-times"></i>
                Cancelar
              </button>
              <button 
                className="student-dashboard-btn student-dashboard-btn--success"
                onClick={handleSave}
              >
                <i className="fas fa-save"></i>
                Guardar
              </button>
            </div>
          )}
        </div>
      </div>
      {}
      <div className="student-profile-section">
        <h3 className="student-profile-section__title">
          <i className="fas fa-id-card"></i>
          Información Personal
        </h3>
        <div className="student-profile-form">
          <div className="student-profile-form__row">
            <div className="student-profile-form__field">
              <label>Nombre</label>
              {isEditing ? (
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="student-profile-form__input"
                />
              ) : (
                <div className="student-profile-form__value">
                  {user?.firstName || 'No especificado'}
                </div>
              )}
            </div>
            <div className="student-profile-form__field">
              <label>Apellido</label>
              {isEditing ? (
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="student-profile-form__input"
                />
              ) : (
                <div className="student-profile-form__value">
                  {user?.lastName || 'No especificado'}
                </div>
              )}
            </div>
          </div>
          <div className="student-profile-form__row">
            <div className="student-profile-form__field">
              <label>Email</label>
              <div className="student-profile-form__value">
                {user?.email}
                <span className="student-profile-form__note">
                  (No se puede cambiar)
                </span>
              </div>
            </div>
            <div className="student-profile-form__field">
              <label>Teléfono</label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="student-profile-form__input"
                  placeholder="Opcional"
                />
              ) : (
                <div className="student-profile-form__value">
                  {user?.phone || 'No especificado'}
                </div>
              )}
            </div>
          </div>
          <div className="student-profile-form__field student-profile-form__field--full">
            <label>Sobre mí</label>
            {isEditing ? (
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                className="student-profile-form__textarea"
                placeholder="Cuéntanos un poco sobre ti..."
                rows="3"
              />
            ) : (
              <div className="student-profile-form__value">
                {user?.bio || 'Aún no has agregado información sobre ti.'}
              </div>
            )}
          </div>
        </div>
      </div>
      {}
      <div className="student-profile-section">
        <h3 className="student-profile-section__title">
          <i className="fas fa-cog"></i>
          Preferencias
        </h3>
        <div className="student-profile-preferences">
          <div className="student-profile-preference">
            <div className="student-profile-preference__content">
              <h4>Notificaciones Push</h4>
              <p>Recibir recordatorios de sesiones</p>
            </div>
            <div className="student-profile-preference__control">
              <label className="student-profile-toggle">
                <input
                  type="checkbox"
                  name="preferences.notifications"
                  checked={formData.preferences.notifications}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
                <span className="student-profile-toggle__slider"></span>
              </label>
            </div>
          </div>
          <div className="student-profile-preference">
            <div className="student-profile-preference__content">
              <h4>Actualizaciones por Email</h4>
              <p>Recibir novedades y consejos de bienestar</p>
            </div>
            <div className="student-profile-preference__control">
              <label className="student-profile-toggle">
                <input
                  type="checkbox"
                  name="preferences.emailUpdates"
                  checked={formData.preferences.emailUpdates}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
                <span className="student-profile-toggle__slider"></span>
              </label>
            </div>
          </div>
          <div className="student-profile-preference">
            <div className="student-profile-preference__content">
              <h4>Reportes Semanales</h4>
              <p>Resumen semanal de tu progreso</p>
            </div>
            <div className="student-profile-preference__control">
              <label className="student-profile-toggle">
                <input
                  type="checkbox"
                  name="preferences.weeklyReports"
                  checked={formData.preferences.weeklyReports}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
                <span className="student-profile-toggle__slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
      {}
      <div className="student-profile-section">
        <h3 className="student-profile-section__title">
          <i className="fas fa-chart-pie"></i>
          Estadísticas de Perfil
        </h3>
        <div className="student-profile-stats">
          <div className="student-profile-stat">
            <div className="student-profile-stat__icon">
              <i className="fas fa-calendar-check"></i>
            </div>
            <div className="student-profile-stat__content">
              <h4>Miembro desde</h4>
              <p>{new Date(user?.createdAt || Date.now()).toLocaleDateString('es-ES', { 
                year: 'numeric', 
                month: 'long' 
              })}</p>
            </div>
          </div>
          <div className="student-profile-stat">
            <div className="student-profile-stat__icon">
              <i className="fas fa-trophy"></i>
            </div>
            <div className="student-profile-stat__content">
              <h4>Nivel actual</h4>
              <p>Principiante</p>
            </div>
          </div>
          <div className="student-profile-stat">
            <div className="student-profile-stat__icon">
              <i className="fas fa-heart"></i>
            </div>
            <div className="student-profile-stat__content">
              <h4>Categoría favorita</h4>
              <p>Respiración</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default StudentProfileView;
