import React, { useState, useEffect, useRef, useCallback, forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import { logCalories } from '../services/calorieServices';
import BackButton from './common/BackButton';
import { format } from 'date-fns';

// Custom input component for the date picker
const CustomInput = forwardRef<HTMLInputElement, any>(({ value, onClick, placeholder }, ref) => (
  <input
    value={value}
    onClick={onClick}
    placeholder={placeholder}
    ref={ref}
    className="w-full p-3 border border-gray-300 rounded-lg text-center"
    readOnly
  />
));

const LogCalories: React.FC = () => {
  const [date, setDate] = useState<Date | null>(null);
  const [calories, setCalories] = useState<string>('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formattedDate = date ? format(date, 'dd-MM-yyyy') : '';

      const data = await logCalories({
        date: formattedDate,
        calories: parseInt(calories) || 0,
      });
      setMessage(data.message);

      // Clear the form
      setTimeout(() => {
        setDate(null);
        setCalories('');
        setMessage('');
      }, 10000); // 10 seconds timeout
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
    if (/^\d*$/.test(value)) { // Only allow digits
      setCalories(value);
    }
  };

  const resetTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      navigate('/dashboard');
    }, 10000); // 10000 milliseconds = 10 seconds
  }, [navigate]);

  useEffect(() => {
    const handleActivity = () => resetTimeout();

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keypress', handleActivity);

    // Set initial timeout
    resetTimeout();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keypress', handleActivity);
    };
  }, [resetTimeout]);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen p-6"
      style={{
        backgroundImage: 'url(https://slidechef.net/wp-content/uploads/2024/03/Fitness-Background.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="w-full max-w-md p-6 bg-blue-100 bg-opacity-60 border-2 border-green-800 rounded-lg shadow-md">
        <div className="flex-shrink-0 mb-6 text-center">
          <img src="https://i.gifer.com/7kvp.gif" alt="Exercise illustration" className="w-48 h-auto mx-auto" />
        </div>
        <h2 className="text-2xl font-bold mb-6 text-center">Log Calories</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center mb-4">
            <DatePicker
              selected={date}
              onChange={(date) => setDate(date)}
              dateFormat="dd-MM-yyyy"
              placeholderText="Date"
              customInput={<CustomInput />}
            />
          </div>
          <input
            type="text"
            value={calories}
            onChange={handleCaloriesChange}
            placeholder="Calories"
            className="w-full p-3 border border-gray-300 rounded-lg text-center"
          />
          <button
            type="submit"
            className="w-full p-3 rounded-lg bg-yellow-500 text-white font-bold hover:bg-yellow-600"
          >
            Log Calories
          </button>
          <BackButton className="w-full p-3 rounded-lg bg-yellow-500 text-white font-bold hover:bg-yellow-600 mt-2" />
        </form>
        <p className="mt-4 text-center text-gray-700">{message}</p>
      </div>
    </div>
  );
};

export default LogCalories;
