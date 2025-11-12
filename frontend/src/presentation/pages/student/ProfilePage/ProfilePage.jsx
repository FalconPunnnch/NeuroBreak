// HU05 - Profile Page con Bootstrap + Modal
// frontend/src/presentation/pages/student/ProfilePage/ProfilePage.jsx

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/layout/Header/Header.jsx';
import './ProfilePage.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const ProfilePage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [badges, setBadges] = useState([]);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

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
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        navigate('/login');
        return;
      }

      const userData = JSON.parse(storedUser);
      setUser(userData);

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
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      const data = await response.json();
      if (response.ok) {
        const updatedUser = { ...user, profilePicture: data.profilePicture };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        alert('✅ Foto de perfil actualizada exitosamente');
      } else {
        alert(data.message || 'Error al subir la foto');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al subir la foto.');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleOpenEditModal = () => {
    setEditFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      bio: user.bio || ''
    });
    setEditError('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditError('');
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setEditError('');

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
        body: JSON.stringify(editFormData)
      });

      const data = await response.json();
      if (response.ok) {
        const updatedUser = { ...user, ...data.user };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setIsModalOpen(false);
        alert('✅ Perfil actualizado exitosamente');
      } else {
        setEditError(data.message || 'Error al actualizar perfil');
      }
    } catch (error) {
      console.error('Error:', error);
      setEditError('Error de conexión.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center vh-100">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-3">Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div className="profile-page bg-light min-vh-100">
      <Header />
      <main className="container py-5">
        <div className="row g-4">
          {/* Columna Izquierda */}
          <div className="col-lg-4 text-center">
            <div className="card p-4 shadow-sm">
              <div className="d-flex flex-column align-items-center">
                <div className="avatar mb-3">
                  {user.profilePicture ? (
                    <img
                      src={`http://localhost:3001${user.profilePicture}`}
                      alt="Perfil"
                      className="img-fluid rounded"
                    />
                  ) : (
                    <div className="avatar-placeholder">
                      <i className="bi bi-person fs-1 text-muted"></i>
                    </div>
                  )}
                </div>

                <button
                  className="btn btn-warning text-white mb-3"
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
                  hidden
                />

                <h4 className="fw-bold text-dark">
                  {user.firstName} {user.lastName}
                </h4>

                <button className="btn btn-dark mt-3" onClick={handleLogout}>
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>

          {/* Columna Derecha */}
          <div className="col-lg-8">
            <div className="card p-4 shadow-sm mb-4">
              <h5 className="fw-bold mb-3 text-primary">Información Personal</h5>
              <div className="row">
                <div className="col-md-6 mb-2">
                  <strong>Nombre:</strong> {user.firstName}
                </div>
                <div className="col-md-6 mb-2">
                  <strong>Apellido:</strong> {user.lastName}
                </div>
                <div className="col-md-6 mb-2">
                  <strong>Email:</strong> {user.email}
                </div>
                <div className="col-md-6 mb-2">
                  <strong>Rol:</strong>{' '}
                  {user.role === 'student' ? '🎓 Estudiante' : '👨‍🏫 Profesor'}
                </div>
              </div>
            </div>

            <div className="card p-4 shadow-sm mb-4">
              <h5 className="fw-bold mb-3 text-primary">Acerca de mí</h5>
              <p>{user.bio || 'Sin descripción aún.'}</p>
            </div>

            <div className="text-center">
              <button className="btn btn-warning text-white" onClick={handleOpenEditModal}>
                ✏️ Editar Perfil
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Modal Bootstrap */}
      {isModalOpen && (
        <div className="modal fade show d-block" style={{ background: 'rgba(0,0,0,0.6)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">✏️ Editar Perfil</h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body">
                {editError && <div className="alert alert-danger">{editError}</div>}

                <form onSubmit={handleSaveProfile}>
                  <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    <input
                      type="text"
                      name="firstName"
                      className="form-control"
                      value={editFormData.firstName}
                      onChange={handleEditChange}
                      disabled={isSaving}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Apellido</label>
                    <input
                      type="text"
                      name="lastName"
                      className="form-control"
                      value={editFormData.lastName}
                      onChange={handleEditChange}
                      disabled={isSaving}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Acerca de mí</label>
                    <textarea
                      name="bio"
                      className="form-control"
                      rows="3"
                      value={editFormData.bio}
                      onChange={handleEditChange}
                      disabled={isSaving}
                    ></textarea>
                  </div>

                  <div className="text-end">
                    <button
                      type="button"
                      className="btn btn-secondary me-2"
                      onClick={handleCloseModal}
                      disabled={isSaving}
                    >
                      Cancelar
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={isSaving}>
                      {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
