import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import "./Footer.css";

const Footer = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <footer id="sobre-nosotros" className="footer py-5 mt-auto">
      <Container className="text-center">
        {/* Enlaces superiores */}
        <Row className="justify-content-center align-items-center gy-3 mb-4">
          <Col xs={12} md="auto">
            <Button
              variant="link"
              onClick={() => scrollToSection("como-funciona")}
              className="footer-link text-white text-decoration-none"
            >
              ¿Cómo funciona?
            </Button>
          </Col>

          <Col xs={12} md="auto">
            <span className="footer-year">2025</span>
          </Col>

          <Col xs={12} md="auto">
            <span className="footer-link text-white">
              Sobre nosotros
            </span>
          </Col>
        </Row>

        {/* Descripción inferior */}
        <Row>
          <Col>
            <p className="text-white small mb-2">
              NeuroBreak - Plataforma de microactividades de bienestar para estudiantes
            </p>
            <p className="text-white small mb-0">
              Proyecto Ingeniería de Software 2 © 2025
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
