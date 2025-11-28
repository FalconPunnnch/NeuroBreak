import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import { AuthProvider } from 'contexts/AuthContext';
import { ActivityProvider } from 'contexts/ActivityContext';
import { TimerProvider } from 'contexts/TimerContext';
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
