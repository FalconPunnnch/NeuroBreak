import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPage } from '../pages/landingPage/LandingPage';
import SobreNosotros from '../pages/sobreNosotros/SobreNosotros';
import Registro from '../components/usuario/Registro/Registro';
import Login from '../components/usuario/login/Login';
import Catalogo from '../pages/catalogo/Catalogo';
import DetallesMicroActividad from '../pages/detallesMicroActividad/DetallesMicroActividad';
import Timer from '../pages/timer/Timer';
import RecuperarContrasena from '../pages/recuperarContrasena/RecuperarContrasena';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/sobre-nosotros" element={<SobreNosotros />} />
        <Route path="/como-funciona" element={<SobreNosotros />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/recuperar-contrasena" element={<RecuperarContrasena />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/actividad/:id" element={<DetallesMicroActividad />} />
        <Route path="/timer" element={<Timer />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;