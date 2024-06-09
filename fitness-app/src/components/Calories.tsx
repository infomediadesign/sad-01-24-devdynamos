import React, { useEffect, useState } from 'react';
import { getCalories } from '../services/dashboardServices';
import { ApiError } from './types';

const Calories: React.FC = () => {
  const [calories, setCalories] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCalories = async () => {
      const token = localStorage.getItem('token') || '';
      try {
        const data = await getCalories(token);
        setCalories(data.calories_burned);
      } catch (err: unknown) {
        const error = err as ApiError;  
        setError(error.response?.data?.error || 'An unexpected error occurred');
      }
    };

    fetchCalories();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Current Week Calories Burned</h1>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <p className="text-lg">{calories !== null ? `Calories Burned: ${calories}` : 'Loading...'}</p>
      )}
    </div>
  );
};

export default Calories;
