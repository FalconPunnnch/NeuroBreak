import React from 'react';
import { useAuth } from 'contexts/AuthContext';
import Header from './Header/Header.jsx';
import HeaderLogged from './Header/HeaderLogged/HeaderLogged.jsx';
import Footer from './Footer/Footer.jsx';
import './Layout.css';
function Layout({ children, showHeader = true, showFooter = true, useLoggedHeader = false }) {
  const { isAuthenticated } = useAuth();
  const shouldUseLoggedHeader = useLoggedHeader && isAuthenticated;
  return (
    <div className="layout">
      {}
      {showHeader && (
        shouldUseLoggedHeader ? <HeaderLogged /> : <Header />
      )}
      {}
      <main className="layout__content">
        {children}
      </main>
      {}
      {showFooter && <Footer />}
    </div>
  );
}
export default Layout;
