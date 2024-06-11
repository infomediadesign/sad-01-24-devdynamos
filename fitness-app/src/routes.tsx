import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Calories from './components/Calories';
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
import UserProfile from './components/UserProfile';


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
        <Route path="/dashboard/*" element={token ? <Dashboard /> : <Navigate to="/dashboard" />}>
          <Route path="progress" element={token ? <Progress /> : <Navigate to="/" /> } />
          <Route path="calories" element={token ? <Calories />: <Navigate to="/" /> } />
        </Route>
        <Route path="/profile" element={token ? <UserProfile /> : <Navigate to="/" /> } /> 
        <Route path="muscle-groups" element={<MuscleGroupMap />} /> 
        <Route path="exercises/:muscleGroup" element={<Exercises />} />
        <Route path="/goal" element={token ? <SetCalorieGoal /> :<Navigate to="/" /> } />
        <Route path="/log" element={token ? <LogCalories />:<Navigate to="/" /> } />
        <Route path="/progress" element={token ? <GetProgress /> :<Navigate to="/" /> } />
        <Route path="/calories_bydate" element={token ? <GetCaloriesByDate /> :<Navigate to="/" /> } />
        <Route path="/delete_bydate" element={token ? <DeleteCaloriesByDate /> :<Navigate to="/" /> } />
        <Route path="/delete_goal" element={token ? <DeleteGoal /> :<Navigate to="/" /> } />
        <Route path='/progressTracking' element={<ProgressTracking/>}/>
        <Route path='/routines'element={<WorkoutRoutine/>}/>
        </Routes>

      </div>
    
  );
};

export default AppRoutes;