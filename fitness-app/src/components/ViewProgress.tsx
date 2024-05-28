// src/components/ViewProgress.tsx
import React, { useState } from 'react';
import { getProgress } from '../services/calorieServices';

const ViewProgress: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    start_date: '',
    end_date: ''
  });

  const [progress, setProgress] = useState<any>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await getProgress(formData.username, formData.start_date, formData.end_date);
      setProgress(response.data);
    } catch (error) {
      alert('Error fetching progress');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Username" onChange={handleChange} />
        <input type="date" name="start_date" placeholder="Start Date" onChange={handleChange} />
        <input type="date" name="end_date" placeholder="End Date" onChange={handleChange} />
        <button type="submit">View Progress</button>
      </form>
      {progress && (
        <div>
          <h3>Progress</h3>
          <p>Goal: {progress.goal}</p>
          <p>Calories Burned: {progress.calories_burned}</p>
          <p>Activity: {progress.activity}</p>
          <p>Start Date: {progress.start_date}</p>
          <p>End Date: {progress.end_date}</p>
        </div>
      )}
    </div>
  );
};

export default ViewProgress;
