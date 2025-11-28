import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from 'components/layout/Header/Header';
import Footer from 'components/layout/Footer/Footer';
import FloatingTimerButton from 'components/features/modals/FloatingTimerButton';
import { useAuth } from 'contexts/AuthContext';
import HeroCarousel from "./sections/HeroCarousel";
import BeneficiosSection from "./sections/BeneficiosSection";
import PerformanceSection from "./sections/PerformanceSection";
import "./WelcomePage.css";
const WelcomePage = () => {
  const { user, isAuthenticated, loading } = useAuth();
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    document.title = "NeuroBreak";
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }
  return (
    <div className="welcome-page">
      <Header />
      <main className="welcome-main">
        <HeroCarousel />
        <BeneficiosSection />
        <PerformanceSection />
      </main>
      <Footer />
      {}
      {isAuthenticated && user && (
        <FloatingTimerButton />
      )}
    </div>
  );
};
export default WelcomePage;
