import React, { useState, forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { setCalorieGoal } from '../services/calorieServices';
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

const SetCalorieGoal: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [goal, setGoal] = useState<number>(0);
  const [activity, setActivity] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formattedStartDate = startDate ? format(startDate, 'dd-MM-yyyy') : '';
      const formattedEndDate = endDate ? format(endDate, 'dd-MM-yyyy') : '';

      const data = await setCalorieGoal({
        start_date: formattedStartDate,
        end_date: formattedEndDate,
        goal,
        activity,
      });
      setMessage(data.message);

      // Clear the form after 2-3 seconds
      setTimeout(() => {
        setStartDate(null);
        setEndDate(null);
        setGoal(0);
        setActivity('');
        setMessage('');
      }, 2500); // 2500 milliseconds = 2.5 seconds
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage('Unexpected error');
      }
    }
  };

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
        <h2 className="text-2xl font-bold mb-6 text-center">Set Calorie Goal</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="dd-MM-yyyy"
            placeholderText="Start Date (dd-mm-yyyy)"
            customInput={<CustomInput />}
          />
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="dd-MM-yyyy"
            placeholderText="End Date (dd-mm-yyyy)"
            customInput={<CustomInput />}
          />
          <input
            type="number"
            value={goal}
            onChange={(e) => setGoal(Number(e.target.value))}
            placeholder="Goal"
            className="w-full p-3 border border-gray-300 rounded-lg text-center"
          />
          <input
            type="text"
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            placeholder="Activity"
            className="w-full p-3 border border-gray-300 rounded-lg text-center"
          />
          <button
            type="submit"
            className="w-full p-3 rounded-lg bg-yellow-500 text-white font-bold hover:bg-yellow-600"
          >
            Set Goal
          </button>
          <BackButton className="w-full p-3 rounded-lg bg-yellow-500 text-white font-bold hover:bg-yellow-600 mt-2" />
        </form>
        <p className="mt-4 text-center text-gray-700">{message}</p>
      </div>
    </div>
  );
};

export default SetCalorieGoal;
