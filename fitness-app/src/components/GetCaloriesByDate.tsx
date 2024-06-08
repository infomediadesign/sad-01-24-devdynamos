// import React, { useState } from 'react';
// import { getCaloriesByDate } from '../services/calorieServices';

// const GetCaloriesByDate: React.FC = () => {
//   const [date, setDate] = useState('');
//   const [calories, setCalories] = useState<number | null>(null);
//   const [message, setMessage] = useState('');

//   const fetchCaloriesByDate = async () => {
//     try {
//       const data = await getCaloriesByDate(date);
//       setCalories(data.calories);
//       setMessage('');
//     } catch (error: unknown) {
//       if (error instanceof Error) {
//         setMessage(error.message);
//       } else {
//         setMessage('Unexpected error');
//       }
//     }
//   };

//   return (
//     <div>
//       <h2>Get Calories by Date</h2>
//       <input type="text" value={date} onChange={(e) => setDate(e.target.value)} placeholder="Date (dd-mm-yyyy)" />
//       <button onClick={fetchCaloriesByDate}>Fetch Calories</button>
//       {message && <p>{message}</p>}
//       {calories !== null && <p>Calories for {date}: {calories}</p>}
//     </div>
//   );
// };

// export default GetCaloriesByDate;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getCaloriesByDate } from '../services/calorieServices';
import BackButton from './common/BackButton';
import { format } from 'date-fns';

const GetCaloriesByDate: React.FC = () => {
  const [date, setDate] = useState<Date | null>(null);
  const [calories, setCalories] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const resetTimeout = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        navigate('/dashboard');
      }, 8000);
    };

    const handleActivity = () => {
      resetTimeout();
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);

    resetTimeout();

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
    };
  }, [navigate]);

  const fetchCaloriesByDate = async () => {
    if (!date) {
      setMessage('Please select a date');
      return;
    }

    const formattedDate = format(date, 'dd-MM-yyyy');

    try {
      const data = await getCaloriesByDate(formattedDate);
      setCalories(data.calories);
      setMessage('');

      // Clear the output after 3 seconds
      setTimeout(() => {
        setCalories(null);
        setMessage('');
      }, 3000);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage('Unexpected error');
      }

      // Clear the message after 3 seconds
      setTimeout(() => {
        setMessage('');
      }, 3000);
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen p-6"
      style={{
        backgroundImage: `url(https://static.vecteezy.com/system/resources/previews/014/744/307/original/place-to-exercise-at-home-flat-color-illustration-sports-gym-with-dumbbells-and-water-bottle-active-lifestyle-fully-editable-2d-simple-cartoon-interior-with-living-room-on-background-vector.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="w-full max-w-md p-6 bg-blue-100 bg-opacity-60 border-2 border-green-800 rounded-lg shadow-md">
        <div className="flex-shrink-0 mb-6 text-center">
          <img src="https://media.tenor.com/CTyUtwvvWwkAAAAM/feel-after-workout-gymaholic.gif" alt="Exercise illustration" className="w-48 h-auto mx-auto" />
        </div>
        <h2 className="text-2xl font-bold mb-6 text-center">Get Calories by Date</h2>
        <div className="w-full flex justify-center mb-4">
          <DatePicker
            selected={date}
            onChange={(date: Date | null) => setDate(date)}
            dateFormat="dd-MM-yyyy"
            placeholderText="Select a date"
            className="w-full p-3 rounded-lg border border-gray-300"
          />
        </div>
        <button
          onClick={fetchCaloriesByDate}
          className="w-full p-3 rounded-lg bg-yellow-500 text-white font-bold hover:bg-yellow-600 mb-4"
        >
          Fetch Calories
        </button>
        {message && <p className="mt-4 text-center text-gray-700">{message}</p>}
        {calories !== null && (
          <p className="mt-4 text-center text-gray-700">You Have Burnt: {calories} Calories!</p>
        )}
        <BackButton className="w-full p-3 rounded-lg bg-yellow-500 text-white font-bold hover:bg-yellow-600 mt-2" />
      </div>
    </div>
  );
};

export default GetCaloriesByDate;

