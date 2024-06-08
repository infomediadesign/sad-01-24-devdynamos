import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { logCalories } from '../services/calorieServices';
import { format } from 'date-fns';

const LogCalories: React.FC = () => {
  const [date, setDate] = useState<Date | null>(null);
  const [calories, setCalories] = useState<number | string>('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formattedDate = date ? format(date, 'dd-MM-yyyy') : '';
      const data = await logCalories({ date: formattedDate, calories: Number(calories) });
      setMessage(data.message);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage('Unexpected error');
      }
    }
  };

  const handleCaloriesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^[0-9\b]+$/.test(value)) {
      setCalories(value);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Log Calories</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex justify-center">
          <DatePicker
            selected={date}
            onChange={(date: Date | null) => setDate(date)}
            dateFormat="dd-MM-yyyy"
            placeholderText="Date (dd-mm-yyyy)"
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>
        <input
          type="text"
          value={calories}
          onChange={handleCaloriesChange}
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
      <p className="mt-4 text-center">{message}</p>
    </div>
  );
};

export default LogCalories;



