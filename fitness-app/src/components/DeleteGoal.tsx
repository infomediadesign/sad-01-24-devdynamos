import React, { useState, forwardRef, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { deleteGoal } from '../services/calorieServices';
import BackButton from './common/BackButton';
import { format, addDays } from 'date-fns';

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

const DeleteGoal: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (startDate) {
      setEndDate(addDays(startDate, 6));
    } else {
      setEndDate(null);
    }
  }, [startDate]);

  const handleDelete = async () => {
    if (startDate && endDate) {
      try {
        const formattedStartDate = format(startDate, 'dd-MM-yyyy');
        const formattedEndDate = format(endDate, 'dd-MM-yyyy');
        const data = await deleteGoal(formattedStartDate, formattedEndDate);
        setMessage(data.message);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setMessage(error.message);
        } else {
          setMessage('Unexpected error');
        }
      }
    } else {
      setMessage('Please select both start and end dates.');
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen p-6"
      style={{
        backgroundImage: 'url(https://image.slidesdocs.com/responsive-images/slides/0-simple-running-outdoor-health-exercise-physical-education-courseware-fitness-sports-business-plan-powerpoint-background_817cd87917__960_540.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="w-full max-w-md p-6 bg-blue-100 bg-opacity-60 border-2 border-green-800 rounded-lg shadow-md">
        <div className="flex-shrink-0 mb-6 text-center">
          <img src="https://metro.co.uk/wp-content/uploads/2019/08/Webp.net-gifmaker_1-7550.gif" alt="Exercise illustration" className="w-48 h-auto mx-auto" />
        </div>
        <h2 className="text-2xl font-bold mb-6 text-center">Delete Goal</h2>
        <div className="space-y-4">
          <div className="flex space-x-4">
            <DatePicker
              selected={startDate}
              onChange={(date: Date | null) => setStartDate(date)}
              dateFormat="dd-MM-yyyy"
              placeholderText="Start Date"
              customInput={<CustomInput />}
            />
            <DatePicker
              selected={endDate}
              onChange={() => {}}
              dateFormat="dd-MM-yyyy"
              placeholderText="End Date"
              customInput={<CustomInput />}
              readOnly
            />
          </div>
          <button
            onClick={handleDelete}
            className="w-full p-3 rounded-lg bg-yellow-500 text-white font-bold hover:bg-yellow-600"
          >
            Delete Goal
          </button>
          <BackButton className="w-full p-3 rounded-lg bg-yellow-500 text-white font-bold hover:bg-yellow-600 mt-2" />
        </div>
        <p className="mt-4 text-center text-gray-700">{message}</p>
      </div>
    </div>
  );
};

export default DeleteGoal;
