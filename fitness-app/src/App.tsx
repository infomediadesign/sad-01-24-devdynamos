import React, { useEffect, useState } from 'react';
import AppRoutes from './routes';
import Footer from './components/common/Footer';
import Navbar from './components/common/NavBar';

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  useEffect(() => {
    setToken(localStorage.getItem('token'));
  }, []);

  return (
    <div className="flex min-h-screen">
      {token && <Navbar />}
      <div className={`flex-grow flex flex-col ${token ? 'ml-64' : ''}`}>
        <AppRoutes />
        <Footer />
      </div>
    </div>
  );
};

export default App;
