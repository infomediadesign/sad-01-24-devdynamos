import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProgress } from '../services/calorieServices';
import BackButton from './common/BackButton';

const GetProgress: React.FC = () => {
  const [progress, setProgress] = useState<any[]>([]);
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

  const fetchProgress = async () => {
    try {
      const data = await getProgress();
      setProgress(data);
      setMessage('');

      // Clear the output after 3 seconds
      setTimeout(() => {
        setProgress([]);
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
        <h2 className="text-2xl font-bold mb-6 text-center">Get Progress</h2>
        <button
          onClick={fetchProgress}
          className="w-full p-3 rounded-lg bg-yellow-500 text-white font-bold hover:bg-yellow-600 mb-4"
        >
          Fetch Progress
        </button>
        {message && <p className="mt-4 text-center text-gray-700">{message}</p>}
        {progress.length > 0 && (
          <ul className="mt-4 space-y-2">
            {progress.map((item, index) => (
              <li key={index} className="p-3 border border-gray-300 rounded-lg bg-white">
                <p><strong>Goal:</strong> {item.goal}</p>
                <p><strong>Calories Burned:</strong> {item.calories_burned}</p>
                <p><strong>Activity:</strong> {item.activity}</p>
                <p><strong>Start Date:</strong> {item.start_date}</p>
                <p><strong>End Date:</strong> {item.end_date}</p>
              </li>
            ))}
          </ul>
        )}
        <BackButton className="w-full p-3 rounded-lg bg-yellow-500 text-white font-bold hover:bg-yellow-600 mt-2" />
      </div>
    </div>
  );
};

export default GetProgress;
