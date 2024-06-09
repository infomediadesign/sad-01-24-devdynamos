import React, { useState, useEffect, forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import { getCaloriesByDate, deleteCaloriesByDate } from '../services/calorieServices';
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

const GetCaloriesByDate: React.FC = () => {
  const [date, setDate] = useState<Date | null>(null);
  const [calories, setCalories] = useState<number | null>(null);
  const [message, setMessage] = useState<string | JSX.Element>('');
  const navigate = useNavigate();

  const fetchCaloriesByDate = async () => {
    if (date) {
      try {
        const formattedDate = format(date, 'dd-MM-yyyy');
        const data = await getCaloriesByDate(formattedDate);
        setCalories(data.calories);
        setMessage('');
      } catch (error: unknown) {
        if (error instanceof Error) {
          setMessage(error.message);
        } else {
          setMessage('Unexpected error');
        }
      }
    } else {
      setMessage('Please select a date.');
    }
  };

  const handleDeleteCaloriesByDate = async () => {
    if (date) {
      try {
        const formattedDate = format(date, 'dd-MM-yyyy');
        await deleteCaloriesByDate(formattedDate);
        setMessage(<span className="font-bold">Calorie deleted successfully</span>);
        setCalories(null);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setMessage(error.message);
        } else {
          setMessage('Unexpected error');
        }
      }
    } else {
      setMessage(<span className="font-bold">Please Select a date</span>);
    }
  };

  useEffect(() => {
    const clearDateTimeout = setTimeout(() => {
      setDate(null);
      setCalories(null);
      setMessage('');
    }, 5000);

    return () => clearTimeout(clearDateTimeout);
  }, [date]);

  useEffect(() => {
    const navigateTimeout = setTimeout(() => {
      navigate('/dashboard');
    }, 60000);

    const handleActivity = () => {
      clearTimeout(navigateTimeout);
      document.removeEventListener('click', handleActivity);
      document.removeEventListener('keypress', handleActivity);
    };

    document.addEventListener('click', handleActivity);
    document.addEventListener('keypress', handleActivity);

    return () => {
      clearTimeout(navigateTimeout);
      document.removeEventListener('click', handleActivity);
      document.removeEventListener('keypress', handleActivity);
    };
  }, [navigate]);

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
          <img src="https://i.gifer.com/7kvp.gif" alt="Exercise illustration" className="w-48 h-auto mx-auto" />
        </div>
        <h2 className="text-2xl font-bold mb-6 text-center">Delete Calories by Date</h2>
        <div className="space-y-4 flex flex-col items-center">
          <DatePicker
            selected={date}
            onChange={(date: Date | null) => setDate(date)}
            dateFormat="dd-MM-yyyy"
            placeholderText="Select Date"
            customInput={<CustomInput />}
          />
          <button
            onClick={fetchCaloriesByDate}
            className="w-full p-3 rounded-lg bg-blue-500 text-white font-bold hover:bg-blue-600"
          >
            Fetch Calories
          </button>
          {calories !== null && (
            <button
              onClick={handleDeleteCaloriesByDate}
              className="w-full p-3 rounded-lg bg-red-500 text-white font-bold hover:bg-red-600"
            >
              Delete Calories
            </button>
          )}
          <BackButton className="w-full p-3 rounded-lg bg-yellow-500 text-white font-bold hover:bg-yellow-600 mt-2" />
        </div>
        {message && <p className="mt-4 text-center text-red-500">{message}</p>}
        {calories !== null && (
          <p className="mt-4 text-center">
            Calories for {format(date!, 'dd-MM-yyyy')} is : <span className="font-bold">{calories} Calories</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default GetCaloriesByDate;
