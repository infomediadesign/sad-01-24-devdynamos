import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import HomePage from './components/HomePage';
import AuthForm from './components/AuthForm';
import LogCalories from './components/LogCalories';
import SetCalorieGoal from './components/SetCalorieGoal';
import ViewProgress from './components/ViewProgress';

const AppRoutes: React.FC = () => (
    <Router>
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="home" element={<HomePage />} />
            <Route path="login" element={<AuthForm />} />
            <Route path="/log" element={<LogCalories />} />
            <Route path="/set_caloriesgoal" element={<SetCalorieGoal />} />
            { <Route path="/progress" element={<ViewProgress />} /> /*view calorie goal progress */}
        </Routes>
    </Router>
);

export default AppRoutes;
