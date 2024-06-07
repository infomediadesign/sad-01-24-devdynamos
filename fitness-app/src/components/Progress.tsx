import React, { useEffect, useState } from 'react';
import { getProgress } from '../services/calorieServices';
import { ApiError } from './types';

const Progress: React.FC = () => {
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgress = async () => {
      const token = localStorage.getItem('token') || '';
      try {
        const data = await getProgress();
        setProgress(data.progress);
      } catch (err: unknown) {
        const error = err as ApiError;  
        setError(error.response?.data?.error || 'An unexpected error occurred');
      }
    };

    fetchProgress();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Current Week Progress</h1>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <p className="text-lg">{progress !== null ? `Progress: ${progress}` : 'Loading...'}</p>
      )}
    </div>
  );
};

export default Progress;
