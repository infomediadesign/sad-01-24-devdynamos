import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import MuscleGroupMap from './components/MuscleGroupMap';
import Exercises from './components/Excercises';
import SetGoal from './components/setGoal';
import LogWorkout from './components/LogWorkout';
import ProgressChart from './components/ProgressChart';

import HomePage from './components/HomePage';
import AuthForm from './components/AuthForm';


const AppRoutes: React.FC = () => (
    <Router>
        <Routes>
            <Route path="/" element={<App />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/login" element={<AuthForm />} />
                <Route index element={<MuscleGroupMap />} />
                <Route path="exercises/:muscleGroup" element={<Exercises />} />
                <Route path="set-goal" element={<SetGoal />} />
                <Route path="log-workout/:id" element={<LogWorkout />} />
                <Route path="progress/:id" element={<ProgressChart />} />
            </Route>
        </Routes>
    </Router>
);

export default AppRoutes;
