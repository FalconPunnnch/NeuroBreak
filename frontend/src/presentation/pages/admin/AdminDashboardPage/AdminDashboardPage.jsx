import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../state/contexts/AuthContext';
import AdminSidebar from '../../../components/admin/AdminSidebar/AdminSidebar';
import AdminHeader from '../../../components/admin/AdminHeader/AdminHeader';
import AdminMainContent from '../../../components/admin/AdminMainContent/AdminMainContent';
import NavigationService from '../../../../core/services/NavigationService';
import { 
  DashboardNavigationHandler,
  ProfileNavigationHandler,
  MicroactivitiesNavigationHandler,
  LogoutNavigationHandler
} from '../../../../core/services/NavigationHandlers';
import { useMicroactivityStats } from '../../../hooks/useMicroactivityStats';
import './AdminDashboardPage.css';
const AdminDashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [navigationService] = useState(() => new NavigationService());
  const { stats, loading: statsLoading } = useMicroactivityStats();
  useEffect(() => {
    const context = { setActiveSection, navigate, logout };
    navigationService.registerHandler('dashboard', new DashboardNavigationHandler());
    navigationService.registerHandler('profile', new ProfileNavigationHandler());
    navigationService.registerHandler('microactivities', new MicroactivitiesNavigationHandler());
    navigationService.registerHandler('logout', new LogoutNavigationHandler());
  }, [navigationService, navigate, logout]);
  const createDashboardMetrics = () => [
    {
      title: 'Microactividades',
      value: statsLoading ? 'Cargando...' : stats.total.toString(),
      icon: 'fas fa-brain',
      color: 'success',
      description: 'Total contenido'
    }
  ];
  const handleNavigationChange = (item) => {
    try {
      const context = { setActiveSection, navigate, logout };
      const result = navigationService.navigate(item.id, context);
      navigationService.notifyChange(item.id, true);
      console.log('Navegación exitosa:', result);
    } catch (error) {
      console.error('Error en navegación:', error);
    }
  };
  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
  };
  const buildNavigationItems = () => [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: 'fas fa-home', 
      active: activeSection === 'dashboard'
    },
    { 
      id: 'profile', 
      label: 'Perfil', 
      icon: 'fas fa-user', 
      active: activeSection === 'profile'
    },
    { 
      id: 'microactivities', 
      label: 'Microactividades', 
      icon: 'fas fa-brain', 
      active: activeSection === 'microactivities'
    },
    { 
      id: 'logout', 
      label: 'Cerrar Sesión', 
      icon: 'fas fa-sign-out-alt', 
      active: false
    }
  ];
  const metrics = createDashboardMetrics();
  const navigationItems = buildNavigationItems();
  return (
    <div className="admin-dashboard-layout">
      <AdminSidebar
        user={user}
        navigationItems={navigationItems}
        onNavigationChange={handleNavigationChange}
      />
      <AdminMainContent 
        activeSection={activeSection} 
        user={user} 
        metrics={metrics}
        onSectionChange={handleSectionChange}
      />
    </div>
  );
};
export default AdminDashboardPage;
