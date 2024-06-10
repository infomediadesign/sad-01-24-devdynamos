import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Calories from './components/Calories';
import Progress from './components/Progress';
import AuthForm from './components/AuthForm';
import Dashboard from './components/Dashboard';
import SetCalorieGoal from './components/SetCalorieGoal';
import LogCalories from './components/LogCalories';
import GetProgress from './components/GetProgress';
import GetCaloriesByDate from './components/GetCaloriesByDate';
import DeleteCaloriesByDate from './components/DeleteCaloriesByDate';
import DeleteGoal from './components/DeleteGoal';
import HomePage from './components/HomePage';


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
          <Route path="progress" element={<Progress />} />
          <Route path="calories" element={<Calories />} />
        </Route>
        <Route path="/goal"element={ token ? <SetCalorieGoal /> : <Navigate to= "/"/>} ></Route>
        <Route path="/log" element={ token ? <LogCalories /> : <Navigate to= "/" />}></Route>
        <Route path="/progress" element={token ? <GetProgress /> : <Navigate to= "/" />}></Route>
        <Route path="/calories_bydate" element={token ? <GetCaloriesByDate /> : <Navigate to= "/" />}></Route>
        <Route path="/delete_bydate" element={token ? <DeleteCaloriesByDate /> : <Navigate to ="/" />}></Route>
        <Route path="/delete_goal" element={token ? <DeleteGoal /> : <Navigate to ="/" />}></Route>
      </Routes>
      </div>
    
  );
};

export default AppRoutes;