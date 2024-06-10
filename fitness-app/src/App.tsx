import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import AppRoutes from './routes';
import Footer from './components/common/Footer';
import Navbar from './components/common/NavBar';

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const location = useLocation();

  useEffect(() => {
    setToken(localStorage.getItem('token'));
  }, []);

  // Determine if the Navbar should be shown based on the current path
  const showNavbar = token && location.pathname.startsWith('/dashboard/*');

  return (
    <div className="flex flex-col min-h-screen">
      {showNavbar && <Navbar />}
      <div className="flex-grow">
        <AppRoutes />
      </div>
      <Footer />
    </div>
  );
};

export default App;
