import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPage } from '../pages/landingPage/LandingPage';
import SobreNosotros from '../pages/sobreNosotros/SobreNosotros';
import Registro from '../components/usuario/Registro/Registro';
import Login from '../components/usuario/login/Login';  // ← Asegúrate de importar Login

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/sobre-nosotros" element={<SobreNosotros />} />
        <Route path="/como-funciona" element={<SobreNosotros />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/login" element={<Login />} />  {/* ← Debe usar Login, no Registro */}
      </Routes>
    </Router>
  );
};

export default AppRoutes;