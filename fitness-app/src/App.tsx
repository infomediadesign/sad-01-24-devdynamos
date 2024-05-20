import React from 'react';
<<<<<<< Updated upstream
import logo from './logo.svg';
import './App.css';
import AuthForm from './services/AuthForm';

function App() {
  return (
    <div className="App">
    <AuthForm />
    </div>
  );
}
=======
import { Outlet, Link } from 'react-router-dom';

const App: React.FC = () => {
    return (
        <div className="App">
            <header className="App-header">
                <nav>
                    <ul className="flex space-x-4 p-4 bg-blue-500 text-white">
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/muscle-group-map">Muscle Group Map</Link>
                        </li>
                    </ul>
                </nav>
            </header>
            <main className="App-main">
                <Outlet />
            </main>
        </div>
    );
};
>>>>>>> Stashed changes

export default App;
