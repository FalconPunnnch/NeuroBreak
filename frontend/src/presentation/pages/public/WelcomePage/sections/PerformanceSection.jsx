// HU01 - Performance Section con Bootstrap y escala de imagen responsiva
// Ubicación: frontend/src/presentation/pages/public/WelcomePage/sections/PerformanceSection.jsx

import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import "./PerformanceSection.css";
import birreteImg from "../../../../../assets/images/birrete.png";

const PerformanceSection = () => {
  return (
    <section id="como-funciona" className="performance-section">
      <Container className="text-center text-md-start">
        <Row className="align-items-center mb-5">
          {/* Izquierda */}
          <Col md={4} className="mb-4 mb-md-0">
            <div className="performance-item fade-in-up">
              <h2 className="performance-title">Mejora tu desempeño</h2>
              <p className="performance-text">
                Aprende a manejar tu energía para rendir mejor en tus estudios o trabajo.
              </p>
            </div>
          </Col>

          {/* Imagen centro */}
          <Col md={4} className="d-flex justify-content-center">
            <div className="performance-item fade-in-up">
              <img
                src={birreteImg}
                alt="Birrete de graduación"
                className="performance-image img-fluid"
              />
            </div>
          </Col>

          {/* Derecha */}
          <Col md={4} className="mb-4 mb-md-0">
            <div className="performance-item fade-in-up text-md-end">
              <h2 className="performance-title">Aumenta tu productividad</h2>
              <p className="performance-text">
                Usa tus pausas de forma estratégica para potenciar tus resultados.
              </p>
            </div>
          </Col>
        </Row>

        {/* Botón de registro */}
        <div className="text-center">
          <Link to="/register" className="btn btn-register">
            Registrarme
          </Link>
        </div>
      </Container>
    </section>
  );
};

export default PerformanceSection;
