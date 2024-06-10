import React, { useEffect, useState } from 'react';
import { getCalories } from '../services/dashboardServices';
import { ApiError } from './types';

const CaloriesCard: React.FC<{ calories: number | null; error: string | null }> = ({ calories, error }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-2">Calories Burned This Week</h2>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : calories !== null ? (
        <p className="text-2xl">{calories} calories burned</p>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

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
        setError(error.response?.data?.error || 'You have not logged the Calories burned out yet');
      }
    };

    fetchCalories();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4"></h1>
      <CaloriesCard calories={calories} error={error} />
    </div>
  );
};

export default Calories;
