import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './presentation/routes/AppRoutes';
import { AuthProvider } from './state/contexts/AuthContext';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
