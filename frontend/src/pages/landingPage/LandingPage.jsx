import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import Carrusel from "./Carrusel";
import Beneficios from "./Beneficios";
import Performance from "./Performance";
import "./LandingPage.css";

export const LandingPage = () => {
  return (
    <div className="landing-page">
      <Header />
      <Carrusel />
      <Beneficios />
      <Performance />
      <Footer />
    </div>
  );
};

export default LandingPage;
