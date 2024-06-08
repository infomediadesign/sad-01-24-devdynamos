import React, { useState } from 'react';
import { setGoal, Goal } from '../services/progressService';

const SetGoal: React.FC = () => {
  const [formData, setFormData] = useState<Goal>({
    activityType: '',
    goal: 0,
    endDate: ''
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
    try {
      await setGoal(formData);
      setMessage('Goal set successfully!');
    } catch (error: any) {
      setMessage(error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden mt-40 p-6">
      <h2 className="text-3xl font-bold text-blue-600 mb-4">Set Your Goal</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          name="activityType"
          value={formData.activityType}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
        >
          <option value="">Select Activity</option>
          <option value="walking">Walking</option>
          <option value="running">Running</option>
          <option value="cycling">Cycling</option>
          <option value="swimming">Swimming</option>
        </select>
        <input
          type="number"
          name="goal"
          placeholder="Goal (e.g., distance)"
          value={formData.goal}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
        />
        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
        />
        <button
          type="submit"
          className="w-full p-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
        >
          Set Goal
        </button>
      </form>
      {message && <p className="mt-4 text-center text-green-600">{message}</p>}
    </div>
  );
};

export default SetGoal;
