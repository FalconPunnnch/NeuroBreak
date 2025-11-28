import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'contexts/AuthContext';
import DashboardService from 'services/DashboardService';
import './StudentDashboardPage.css';
const StudentDashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState({
    totalActivities: 0,
    totalTime: 0,
    totalMoods: 0,
    weeklyActivities: 0,
    recentActivities: [],
    recentMoods: []
  });
  const [loading, setLoading] = useState(false);
  const dashboardService = new DashboardService();
  useEffect(() => {
    loadDashboardData();
  }, []);
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      console.log('🔄 Loading dashboard data...');
      const stats = await dashboardService.getDashboardStats();
      console.log('📊 Dashboard stats loaded:', stats);
      setDashboardData(stats);
    } catch (error) {
      console.error('❌ Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  const handleNavigation = (section) => {
    switch(section) {
      case 'catalogo':
        navigate('/catalog');
        break;
      case 'timer':
        navigate('/timer');
        break;
      case 'profile':
        navigate('/profile');
        break;
      case 'logout':
        handleLogout();
        break;
      default:
        setActiveSection(section);
    }
  };
  const createStudentMetrics = () => {
    return [
      {
        title: 'Actividades Completadas',
        value: loading ? 'Cargando...' : dashboardData.totalActivities.toString(),
        icon: 'fas fa-check-circle',
        color: 'success',
        description: 'Total de microactividades'
      },
      {
        title: 'Tiempo Total',
        value: loading ? 'Cargando...' : `${dashboardData.totalTime}min`,
        icon: 'fas fa-clock',
        color: 'info',
        description: 'Tiempo invertido en bienestar'
      },
      {
        title: 'Estados de Ánimo',
        value: loading ? 'Cargando...' : dashboardData.totalMoods.toString(),
        icon: 'fas fa-heart',
        color: 'warning',
        description: 'Emociones registradas'
      },
      {
        title: 'Esta Semana',
        value: loading ? 'Cargando...' : `${dashboardData.weeklyActivities}`,
        icon: 'fas fa-chart-line',
        color: 'purple',
        description: 'Actividades esta semana'
      }
    ];
  };
  const renderMainContent = () => {
    switch(activeSection) {
      case 'dashboard':
        return (
          <div className="dashboard-view">
            <div className="dashboard-stats">
              {createStudentMetrics().map((metric, index) => (
                <div key={index} className={`metric-card ${metric.color}`}>
                  <div className="metric-icon">
                    <i className={metric.icon}></i>
                  </div>
                  <div className="metric-info">
                    <h3>{metric.title}</h3>
                    <p className="metric-value">{metric.value}</p>
                    <span className="metric-description">{metric.description}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="dashboard-welcome">
              <h2>¡Bienvenido de vuelta!</h2>
              <p>Continúa tu journey de bienestar mental</p>
            </div>
          </div>
        );
      case 'history':
        return (
          <div className="section-content">
            <h2>Mi Historial de Actividades</h2>
            <div className="content-card">
              {loading ? (
                <p>Cargando historial...</p>
              ) : dashboardData.recentActivities.length > 0 ? (
                <div className="history-list">
                  {dashboardData.recentActivities.map((activity, index) => (
                    <div key={index} className="history-item">
                      <div className="history-info">
                        <h4>Actividad #{activity.id}</h4>
                        <p>Microactividad: {activity.microactivityName || activity.microactivity_name || 'N/A'}</p>
                        <p>Duración: {activity.duration ? `${activity.duration} min` : 'N/A'}</p>
                        <span className="history-date">
                          {activity.completedAt ? 
                            new Date(activity.completedAt).toLocaleDateString() : 
                            activity.createdAt || activity.created_at ?
                            new Date(activity.createdAt || activity.created_at).toLocaleDateString() :
                            'Fecha no disponible'
                          }
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No tienes actividades registradas aún.</p>
              )}
            </div>
          </div>
        );
      case 'mood':
        return (
          <div className="section-content">
            <h2>Historial de Estados de Ánimo</h2>
            <div className="content-card">
              {loading ? (
                <p>Cargando estados de ánimo...</p>
              ) : dashboardData.recentMoods.length > 0 ? (
                <div className="mood-list">
                  {dashboardData.recentMoods.map((mood, index) => (
                    <div key={index} className="mood-item">
                      <div className="mood-info">
                        <h4>{mood.emoji || '😊'} {mood.mood || 'Estado de ánimo'}</h4>
                        <p>Después de actividad #{mood.microactivity_id || mood.microactivityId || 'N/A'}</p>
                        <span className="mood-date">
                          {mood.createdAt || mood.created_at ? 
                            new Date(mood.createdAt || mood.created_at).toLocaleDateString() : 
                            'Fecha no disponible'
                          }
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No tienes estados de ánimo registrados aún.</p>
              )}
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="section-content">
            <h2>Mi Perfil</h2>
            <div className="content-card">
              <p>Información de tu perfil de usuario.</p>
            </div>
          </div>
        );
      default:
        return renderMainContent();
    }
  };
  return (
    <div className="student-dashboard-layout">
      {}
      <div className="student-sidebar">
        <div className="student-profile-section">
          <div className="student-avatar">
            <i className="fas fa-user-circle"></i>
          </div>
          <div className="student-info">
            <h4>{user?.firstName || user?.username || 'Usuario'}</h4>
            <p>Estudiante</p>
          </div>
        </div>
        <nav className="student-navigation">
          <button
            className={`nav-item ${activeSection === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleNavigation('dashboard')}
          >
            <i className="fas fa-home"></i>
            <span>Dashboard</span>
          </button>
          <button
            className="nav-item"
            onClick={() => handleNavigation('catalogo')}
          >
            <i className="fas fa-th-large"></i>
            <span>Catálogo</span>
          </button>
          <button
            className="nav-item"
            onClick={() => handleNavigation('timer')}
          >
            <i className="fas fa-stopwatch"></i>
            <span>Timer</span>
          </button>
          <button
            className={`nav-item ${activeSection === 'history' ? 'active' : ''}`}
            onClick={() => handleNavigation('history')}
          >
            <i className="fas fa-history"></i>
            <span>Mi Historial</span>
          </button>
          <button
            className={`nav-item ${activeSection === 'mood' ? 'active' : ''}`}
            onClick={() => handleNavigation('mood')}
          >
            <i className="fas fa-heart"></i>
            <span>Estados de Ánimo</span>
          </button>
          <button
            className={`nav-item ${activeSection === 'profile' ? 'active' : ''}`}
            onClick={() => handleNavigation('profile')}
          >
            <i className="fas fa-user"></i>
            <span>Mi Perfil</span>
          </button>
          <button
            className="nav-item logout-btn"
            onClick={() => handleNavigation('logout')}
          >
            <i className="fas fa-sign-out-alt"></i>
            <span>Cerrar Sesión</span>
          </button>
        </nav>
      </div>
      {}
      <div className="student-main-content">
        <div className="student-header">
          <h1>Panel de Estudiante</h1>
          <div className="user-info">
            <span>Bienvenido, {user?.firstName || 'Usuario'}</span>
          </div>
        </div>
        <main className="student-content">
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
};
export default StudentDashboardPage;
