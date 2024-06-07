import React, { useState } from 'react';
import { getProgress } from '../services/calorieServices';

const GetProgress: React.FC = () => {
  const [progress, setProgress] = useState<any[]>([]);
  const [message, setMessage] = useState('');

  const fetchProgress = async () => {
    try {
      const data = await getProgress();
      setProgress(data);
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
      <h2>Get Progress</h2>
      <button onClick={fetchProgress}>Fetch Progress</button>
      {message && <p>{message}</p>}
      {progress.length > 0 && (
        <ul>
          {progress.map((item, index) => (
            <li key={index}>
              Goal: {item.goal}, Calories Burned: {item.calories_burned}, Activity: {item.activity}, Start Date: {item.start_date}, End Date: {item.end_date}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GetProgress;