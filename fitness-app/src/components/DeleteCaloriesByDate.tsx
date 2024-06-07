import React, { useState } from 'react';
import { getCaloriesByDate } from '../services/calorieServices';

const GetCaloriesByDate: React.FC = () => {
  const [date, setDate] = useState('');
  const [calories, setCalories] = useState<number | null>(null);
  const [message, setMessage] = useState('');

  const fetchCaloriesByDate = async () => {
    try {
      const data = await getCaloriesByDate(date);
      setCalories(data.calories);
      setMessage('');
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
      <h2 className="text-2xl font-bold mb-4">Get Calories by Date</h2>
      <input
        type="text"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        placeholder="Date (dd-mm-yyyy)"
        className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
      />
      <button
        onClick={fetchCaloriesByDate}
        className="w-full p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
      >
        Fetch Calories
      </button>
      {message && <p className="mt-4 text-red-500">{message}</p>}
      {calories !== null && <p className="mt-4">Calories for {date}: {calories}</p>}
    </div>
  );
};

export default GetCaloriesByDate;
