// HU05 - Profile Page con modal de edición
// frontend/src/presentation/pages/student/ProfilePage/ProfilePage.jsx

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderLogged from '../../../components/layout/Header/HeaderLogged/HeaderLogged';
import FloatingTimerButton from '../../../../components/FloatingTimerButton';
import './ProfilePage.css';

const ProfilePage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [badges, setBadges] = useState([]);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  
  // Estados para el modal de edición
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    firstName: '',
    lastName: '',
    bio: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [editError, setEditError] = useState('');

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (!token || !storedUser) {
        navigate('/login');
        return;
      }

      const userData = JSON.parse(storedUser);
      console.log('Usuario cargado:', userData);
      
      setUser(userData);
      
      // Inicializar datos del formulario
      setEditFormData({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        bio: userData.bio || ''
      });

      setBadges([
        { id: 1, name: 'Primera Actividad', icon: '🏅', earned: true },
        { id: 2, name: '5 Días Consecutivos', icon: '🔥', earned: true },
        { id: 3, name: 'Maestro del Descanso', icon: '🔒', earned: false }
      ]);

      setIsLoading(false);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      navigate('/login');
    }
  };

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro que deseas cerrar sesión?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  const handleChangePhoto = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona una imagen válida');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen no debe superar 5MB');
      return;
    }

    setIsUploadingPhoto(true);

    try {
      const formData = new FormData();
      formData.append('profilePicture', file);

      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:3001/api/users/profile-picture', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        const updatedUser = {
          ...user,
          profilePicture: data.profilePicture
        };
        
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        alert('✅ Foto de perfil actualizada exitosamente');
      } else {
        alert(data.message || 'Error al subir la foto');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al subir la foto. Intenta de nuevo.');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // Abrir modal de edición
  const handleOpenEditModal = () => {
    setEditFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      bio: user.bio || ''
    });
    setEditError('');
    setIsModalOpen(true);
  };

  // Cerrar modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditError('');
  };

  // Manejar cambios en el formulario de edición
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Guardar cambios del perfil
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setEditError('');

    // Validaciones
    if (!editFormData.firstName.trim()) {
      setEditError('El nombre es obligatorio');
      return;
    }

    if (!editFormData.lastName.trim()) {
      setEditError('El apellido es obligatorio');
      return;
    }

    setIsSaving(true);

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:3001/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          firstName: editFormData.firstName.trim(),
          lastName: editFormData.lastName.trim(),
          bio: editFormData.bio.trim()
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Actualizar usuario en estado y localStorage
        const updatedUser = {
          ...user,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          bio: data.user.bio
        };
        
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        setIsModalOpen(false);
        alert('✅ Perfil actualizado exitosamente');
      } else {
        setEditError(data.message || 'Error al actualizar perfil');
      }
    } catch (error) {
      console.error('Error:', error);
      setEditError('Error de conexión. Intenta de nuevo.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="profile-page">
        <HeaderLogged />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="profile-page">
      <HeaderLogged />
      
      <main className="profile-main">
        <div className="profile-container">
          
          {/* Columna Izquierda */}
          <div className="profile-left">
            <div className="avatar-container">
              <div className="avatar">
                {user.profilePicture ? (
                  <img 
                    src={`http://localhost:3001${user.profilePicture}`} 
                    alt={`${user.firstName} ${user.lastName}`} 
                  />
                ) : (
                  <div className="avatar-placeholder">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                )}
              </div>
              
              <button 
                className="btn-change-photo"
                onClick={handleChangePhoto}
                disabled={isUploadingPhoto}
              >
                {isUploadingPhoto ? '⏳ Subiendo...' : '📷 Cambiar foto'}
              </button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </div>

            <h1 className="user-name">
              {user.firstName} {user.lastName}
            </h1>

            <button 
              className="btn-logout"
              onClick={handleLogout}
            >
              Cerrar Sesión
            </button>
          </div>

          {/* Columna Derecha */}
          <div className="profile-right">
            
            {/* Información Personal */}
            <div className="profile-section">
              <h2 className="section-title">Información Personal</h2>
              
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">NOMBRE:</span>
                  <span className="info-value">{user.firstName || 'No especificado'}</span>
                </div>

                <div className="info-item">
                  <span className="info-label">APELLIDO:</span>
                  <span className="info-value">{user.lastName || 'No especificado'}</span>
                </div>

                <div className="info-item">
                  <span className="info-label">EMAIL:</span>
                  <span className="info-value">{user.email || 'No especificado'}</span>
                </div>

                <div className="info-item">
                  <span className="info-label">ROL:</span>
                  <span className="info-value">
                    <span className="role-badge">
                      {user.role === 'student' ? '🎓 Estudiante' : '👨‍🏫 Admin'}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* Acerca de mí */}
            <div className="profile-section">
              <h2 className="section-title">Acerca de mí</h2>
              <p className="bio-text">
                {user.bio || 'Estudiante universitario comprometido con mi bienestar y rendimiento académico. Utilizo NeuroBreak para mantener un equilibrio saludable entre el estudio y el descanso.'}
              </p>
            </div>

            {/* Insignias */}
            <div className="profile-section">
              <h2 className="section-title">Mis Insignias</h2>
              
              <div className="badges-container">
                {badges.map(badge => (
                  <div 
                    key={badge.id} 
                    className={`badge-item ${badge.earned ? 'earned' : 'locked'}`}
                    title={badge.name}
                  >
                    <div className="badge-icon">
                      {badge.earned ? badge.icon : '🔒'}
                    </div>
                    <p className="badge-name">{badge.name}</p>
                  </div>
                ))}
              </div>

              <p className="badges-hint">
                💡 Completa más actividades para desbloquear insignias
              </p>
            </div>

            {/* Botón Editar Perfil */}
            <div className="profile-actions">
              <button 
                className="btn-edit-profile"
                onClick={handleOpenEditModal}
              >
                ✏️ Editar Perfil
              </button>
            </div>

          </div>

        </div>
      </main>

      {/* Modal de Edición */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>✏️ Editar Perfil</h2>
              <button className="modal-close" onClick={handleCloseModal}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="modal-form">
              
              {editError && (
                <div className="error-message-box">
                  {editError}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="firstName">Nombre</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={editFormData.firstName}
                  onChange={handleEditChange}
                  placeholder="Tu nombre"
                  className="form-input"
                  disabled={isSaving}
                />
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Apellido</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={editFormData.lastName}
                  onChange={handleEditChange}
                  placeholder="Tu apellido"
                  className="form-input"
                  disabled={isSaving}
                />
              </div>

              <div className="form-group">
                <label htmlFor="bio">Acerca de mí</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={editFormData.bio}
                  onChange={handleEditChange}
                  placeholder="Cuéntanos un poco sobre ti..."
                  className="form-textarea"
                  rows="4"
                  disabled={isSaving}
                />
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn-cancel"
                  onClick={handleCloseModal}
                  disabled={isSaving}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn-save"
                  disabled={isSaving}
                >
                  {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
      
      {/* Floating Timer Button */}
      <FloatingTimerButton />
    </div>
  );
};

export default ProfilePage;