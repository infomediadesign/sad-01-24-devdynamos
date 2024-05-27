// src/components/SetCalorieGoal.tsx
import React, { useState } from 'react';
import {setCalorieGoal} from '../services/calorieServices';

const SetCalorieGoal: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    start_date: '',
    end_date: '',
    goal: '',
    activity: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setCalorieGoal(formData);
      alert('Goal set successfully');
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error setting goal:', error);
        alert('Error setting goal: ' + error.message);
      } else {
        console.error('Unexpected error', error);
        alert('An unexpected error occurred');
      }
    }
  };


  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="username" placeholder="Username" onChange={handleChange} />
      <input type="date" name="start_date" placeholder="Start Date" onChange={handleChange} />
      <input type="date" name="end_date" placeholder="End Date" onChange={handleChange} />
      <input type="number" name="goal" placeholder="Goal" onChange={handleChange} />
      <input type="text" name="activity" placeholder="Activity" onChange={handleChange} />
      <button type="submit">Set Goal</button>
    </form>
  );
};

export default SetCalorieGoal;
