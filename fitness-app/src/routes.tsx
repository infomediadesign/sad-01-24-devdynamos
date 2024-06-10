import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
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
      <div className="min-h-screen bg-gray-100">
        <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<AuthForm onLogin={handleLogin} />} />
        <Route path="/dashboard/*" element={token ? <Dashboard /> : <Navigate to="/dashboard/*" />}>
          <Route path="progress-cal" element={<Progress />} />
          <Route path="calories" element={<Calories />} />
        </Route>
        <Route path="muscle-groups" element={<MuscleGroupMap />} /> {/* Assuming this is your index route */}
          <Route path="exercises/:muscleGroup" element={<Exercises />} />
          <Route path="/cal-goal" element={<SetCalorieGoal />} />
          <Route path="/log-cal" element={<LogCalories />} />
          <Route path="/progress-cal" element={<GetProgress />} />
          <Route path="/calories_bydate" element={<GetCaloriesByDate />} />
          <Route path="/delete_cal_bydate" element={<DeleteCaloriesByDate />} />
          <Route path="/delete_cal_goal" element={<DeleteGoal />} />
          <Route path='/progressTracking' element={<ProgressTracking/>}/>
          <Route path='/routines'element={<WorkoutRoutine/>}/>
        </Routes>
      </div>
    
  );
};

export default AppRoutes;