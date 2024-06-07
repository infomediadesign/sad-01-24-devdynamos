import React, { useState } from 'react';
import { logCalories } from '../services/calorieServices';

const LogCalories: React.FC = () => {
  const [date, setDate] = useState('');
  const [calories, setCalories] = useState<number>(0);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await logCalories({ date, calories });
      setMessage(data.message);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage('Unexpected error');
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Log Calories</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          placeholder="Date (dd-mm-yyyy)"
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
        <input
          type="number"
          value={calories}
          onChange={(e) => setCalories(Number(e.target.value))}
          placeholder="Calories"
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
        <button
          type="submit"
          className="w-full p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
        >
          Log Calories
        </button>
      </form>
      <p className="mt-4">{message}</p>
    </div>
  );
};

export default LogCalories;
