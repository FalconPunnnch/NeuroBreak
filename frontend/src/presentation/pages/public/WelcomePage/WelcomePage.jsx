// HU01 - Welcome Page FINAL
// Ubicación: frontend/src/presentation/pages/public/WelcomePage/WelcomePage.jsx

import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../../../components/layout/Header/Header";
import Footer from "../../../components/layout/Footer/Footer";
import HeroCarousel from "./sections/HeroCarousel";
import BeneficiosSection from "./sections/BeneficiosSection";
import PerformanceSection from "./sections/PerformanceSection";
import "./WelcomePage.css";

const WelcomePage = () => {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    document.title = "NeuroBreak";

    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <div className="welcome-page">
      <Header />
      <main className="welcome-main">
        <HeroCarousel />
        <BeneficiosSection />
        <PerformanceSection />
      </main>
      <Footer />
    </div>
  );
};

export default WelcomePage;