import React from 'react';
import AppRoutes from './routes'; 
import Footer from './components/common/Footer';


const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
      </header>
      <main>
        <AppRoutes />
      </main>
      <Footer />
    </div>
  );
};

export default App;
