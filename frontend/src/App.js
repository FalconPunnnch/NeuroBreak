import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './presentation/routes/AppRoutes';
import { AuthProvider } from './state/contexts/AuthContext';
import { ActivityProvider } from './state/contexts/ActivityContext';
import { TimerProvider } from './store/TimerContext';
import './App.css';
import './styles/global.css';
function App() {
  return (
    <BrowserRouter 
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <AuthProvider>
        <ActivityProvider>
          <TimerProvider>
            <AppRoutes />
          </TimerProvider>
        </ActivityProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
export default App;
