import React, { useState, useEffect } from 'react';
import SetGoal from './setGoal';
import LogWorkout from './LogWorkout';
import ProgressChart from './ProgressChart';
import BackButton from './common/BackButton';
import { fetchAllGoals, Goal, deleteGoal } from '../services/progressService';

const ProgressTracking: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [goalId, setGoalId] = useState<string | null>(null);
  const [workoutLogged, setWorkoutLogged] = useState<boolean>(false);
  const [goalChanged, setGoalChanged] = useState<boolean>(false);  // State to track goal changes

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const goals = await fetchAllGoals();
        setGoals(goals);
        if (goals.length > 0) {
          setGoalId(goals[0].id);  // Set the first goal as the default
        }
      } catch (error) {
        console.error('Error fetching goals', error);
      }
    };

    fetchGoals();
  }, [goalChanged]);  // Refetch goals when a goal is created or deleted

  const handleGoalSet = (id: string) => {
    setGoalId(id);
    setGoalChanged(!goalChanged);  // Trigger goal refetch
  };

  const handleWorkoutLogged = () => {
    setWorkoutLogged(!workoutLogged);  // Toggle workoutLogged to trigger chart update
  };

  const handleDeleteGoal = async (id: string) => {
    try {
      await deleteGoal(id);
      setGoalChanged(!goalChanged);  // Trigger goal refetch
    } catch (error) {
      console.error('Error deleting goal', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white shadow-md rounded-lg overflow-hidden p-6 mb-8">
          <h2 className="text-3xl font-bold text-blue-600 mb-4">Set Your Goal</h2>
          <SetGoal onGoalSet={handleGoalSet} />
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden p-6 mb-8">
          <h2 className="text-3xl font-bold text-blue-600 mb-4">Log Workout</h2>
          <LogWorkout goalId={goalId} onWorkoutLogged={handleWorkoutLogged} goals={goals} />
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden p-6 mb-8">
          <h2 className="text-3xl font-bold text-blue-600 mb-4">Your Progress</h2>
          {goalId && <ProgressChart goalId={goalId} workoutLogged={workoutLogged} goals={goals} />}
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden p-6 mb-8">
          <h2 className="text-3xl font-bold text-blue-600 mb-4">Current Goals</h2>
          <ul>
            {goals.map(goal => (
              <li key={goal.id} className="flex justify-between items-center p-2 border-b border-gray-300">
                <span>{goal.activityType}: {goal.goal}</span>
                <button
                  onClick={() => handleDeleteGoal(goal.id)}
                  className="p-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className='mx-40'>
        <BackButton className="w-1/2 mx-40 p-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"/>
      </div>
    </div>
  );
};

export default ProgressTracking;
