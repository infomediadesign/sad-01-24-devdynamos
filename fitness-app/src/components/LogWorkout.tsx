import React, { useState, useEffect } from 'react';
import { logWorkout, Log, Goal } from '../services/progressService';

interface LogWorkoutProps {
  goalId: string | null;
  onWorkoutLogged: () => void;
  goals: Goal[];
}

const LogWorkout: React.FC<LogWorkoutProps> = ({ goalId, onWorkoutLogged, goals }) => {
  const [formData, setFormData] = useState<Omit<Log, 'id'>>({
    date: '',
    value: 0,
    metrics: ''
  });
  const [message, setMessage] = useState<string>('');
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(goalId);

  useEffect(() => {
    if (goalId) {
      setSelectedGoalId(goalId);
    }
  }, [goalId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleGoalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGoalId(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGoalId) {
      setMessage('Please select a goal first.');
      return;
    }
    try {
      await logWorkout(selectedGoalId, formData);  // Use goal ID
      setMessage('Workout logged successfully!');
      onWorkoutLogged();  // Trigger chart update
    } catch (error: any) {
      setMessage(error.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          name="goalId"
          value={selectedGoalId || ''}
          onChange={handleGoalChange}
          required
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
        >
          <option value="">Select Goal</option>
          {goals.map(goal => (
            <option key={goal.id} value={goal.id}>
              {goal.activityType} - {goal.goal} {goal.metrics}
            </option>
          ))}
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
        <input
          type="text"
          name="metrics"
          placeholder="Metrics (e.g., km, hours)"
          value={formData.metrics}
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
