import React, { useState } from 'react';
import SetGoal from './setGoal';
import LogWorkout from './LogWorkout';
import ProgressChart from './ProgressChart';

const ProgressTracking: React.FC = () => {
  const [goalId, setGoalId] = useState<string | null>(null);

  const handleGoalSet = (id: string) => {
    setGoalId(id);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden p-6 mb-8">
        <h2 className="text-3xl font-bold text-blue-600 mb-4">Set Your Goal</h2>
        <SetGoal onGoalSet={handleGoalSet} />
      </div>

      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden p-6 mb-8">
        <h2 className="text-3xl font-bold text-blue-600 mb-4">Log Workout</h2>
        <LogWorkout goalId={goalId} />
      </div>

      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden p-6 mb-8">
        <h2 className="text-3xl font-bold text-blue-600 mb-4">Your Progress</h2>
        {goalId && <ProgressChart goalId={goalId} />}
      </div>
    </div>
  );
};

export default ProgressTracking;