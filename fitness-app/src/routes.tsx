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
            <Route path="muscle-groups" element={<MuscleGroupMap />} /> {/* Assuming this is your index route */}
            <Route path="exercises/:muscleGroup" element={<Exercises />} />
            <Route path="set-goal" element={<SetGoal />} />
            <Route path="log-workout/:id" element={<LogWorkout />} />
            <Route path="progress/:id" element={<ProgressChart />} />
        </Routes>
    </Router>
);

export default AppRoutes;
