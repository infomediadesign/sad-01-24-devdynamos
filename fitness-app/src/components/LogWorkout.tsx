import React, { useState } from 'react';
import { logWorkout, Log } from '../services/progressService';

interface LogWorkoutProps {
  goalId: string | null;
}

const LogWorkout: React.FC<LogWorkoutProps> = ({ goalId }) => {
  const [formData, setFormData] = useState<Log>({
    date: '',
    value: 0,
    activityType: 'Running' // Default activity type, you can change it as needed
  });
  const [message, setMessage] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalId) {
      setMessage('Please set a goal first.');
      return;
    }
    try {
      await logWorkout(goalId, formData);  // Use goal ID
      setMessage('Workout logged successfully!');
    } catch (error: any) {
      setMessage(error.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          name="activityType"
          value={formData.activityType}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
        >
          <option value="Running">Running</option>
          <option value="Cycling">Cycling</option>
          <option value="Swimming">Swimming</option>
          <option value="Walking">Walking</option>
        </select>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
        />
        <input
          type="number"
          name="value"
          placeholder="Value (e.g., distance)"
          value={formData.value}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
        />
        <button
          type="submit"
          className="w-full p-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
        >
          Log Workout
        </button>
      </form>
      {message && <p className="mt-4 text-center text-green-600">{message}</p>}
    </div>
  );
};

export default LogWorkout;