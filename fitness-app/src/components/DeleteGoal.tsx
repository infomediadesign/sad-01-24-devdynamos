import React, { useState } from 'react';
import { deleteGoal } from '../services/calorieServices';

const DeleteGoal: React.FC = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [message, setMessage] = useState('');

  const handleDelete = async () => {
    try {
      const data = await deleteGoal(startDate, endDate);
      setMessage(data.message);
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
      <h2>Delete Goal</h2>
      <input type="text" value={startDate} onChange={(e) => setStartDate(e.target.value)} placeholder="Start Date (dd-mm-yyyy)" />
      <input type="text" value={endDate} onChange={(e) => setEndDate(e.target.value)} placeholder="End Date (dd-mm-yyyy)" />
      <button onClick={handleDelete}>Delete Goal</button>
      <p>{message}</p>
    </div>
  );
};

export default DeleteGoal;
