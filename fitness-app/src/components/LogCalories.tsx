// src/components/LogCalories.tsx
import React, { useState } from 'react';
import { logCalories } from '../services/calorieServices';

const LogCalories: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    date: '',
    calories: ''
  });
  
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Form validation
    if (!formData.username || !formData.date || !formData.calories) {
      setError('All fields are required');
      return;
    }
    console.log("Submitting form data:", formData);
    try {
      await logCalories(formData.username, formData.date, String(parseInt(formData.calories)) );
      alert('Calories logged successfully');
    } catch (error) {
      alert('Error logging calories');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="username" placeholder="Username" onChange={handleChange} />
      <input type="date" name="date" placeholder="Date" onChange={handleChange} />
      <input type="number" name="calories" placeholder="Calories" onChange={handleChange} />
      <button type="submit">Log Calories</button>
      {error && <p style={{color: 'red'}}>{error}</p>}
    </form>
  );
};

export default LogCalories;
