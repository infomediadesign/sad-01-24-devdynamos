import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import MuscleGroupMap from './components/MuscleGroupMap';
import Exercises from './components/Excercises'
import AuthForm from './services/AuthForm';  // Import the AuthForm component

const AppRoutes: React.FC = () => (
    <Router>
        <Routes>
            <Route path="/" element={<App />}>
                <Route index element={<MuscleGroupMap />} />
                <Route path="exercises/:bodyPart" element={<Exercises />} />
                <Route path="login" element={<AuthForm />} />  {/* Add the register route */}
            </Route>
        </Routes>
    </Router>
);

export default AppRoutes;
