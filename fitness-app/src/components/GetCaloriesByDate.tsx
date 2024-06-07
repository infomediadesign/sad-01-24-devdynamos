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
    <div>
      <h2>Get Calories by Date</h2>
      <input type="text" value={date} onChange={(e) => setDate(e.target.value)} placeholder="Date (dd-mm-yyyy)" />
      <button onClick={fetchCaloriesByDate}>Fetch Calories</button>
      {message && <p>{message}</p>}
      {calories !== null && <p>Calories for {date}: {calories}</p>}
    </div>
  );
};

export default GetCaloriesByDate;
