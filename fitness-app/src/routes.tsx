import React, { useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Calories from './components/Calories';
import Progress from './components/Progress';
import AuthForm from './components/AuthForm';
import WorkoutRoutine from './components/WorkoutRoutine';
import ProgressTracking from './components/ProgressTracking';
import Dashboard from './components/Dashboard';
import SetCalorieGoal from './components/SetCalorieGoal';
import LogCalories from './components/LogCalories';
import GetProgress from './components/GetProgress';
import GetCaloriesByDate from './components/GetCaloriesByDate';
import DeleteCaloriesByDate from './components/DeleteCaloriesByDate';
import DeleteGoal from './components/DeleteGoal';
import HomePage from './components/HomePage';
import MuscleGroupMap from './components/MuscleGroupMap';
import Exercises from './components/Excercises';

const AppRoutes: React.FC = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  const handleLogin = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<AuthForm onLogin={handleLogin} />} />
      {token ? (
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="progress" element={<Progress />} />
          <Route path="calories" element={<Calories />} />
          <Route path="set-your-calorie-goal" element={<SetCalorieGoal />} />
          <Route path="log-calories" element={<LogCalories />} />
          <Route path="progressTracking" element={<ProgressTracking />} />
          <Route path="calories-by-date" element={<GetCaloriesByDate />} />
          <Route path="delete-calories-by-date" element={<DeleteCaloriesByDate />} />
          <Route path="delete-goal" element={<DeleteGoal />} />
          <Route path="cal-progress-tracking" element={<Progress />} />
          
          
        </Route>
      ) : (
        <Route path="/dashboard/*" element={<Navigate to="/login" />} />
      )}
      <Route path="exercises/:muscleGroup" element={<Exercises />} />
      <Route path="/muscle-groups" element={<MuscleGroupMap />} />
      <Route path="/routines" element={<WorkoutRoutine />} />
      
    </Routes>
  );
};

export default AppRoutes;
