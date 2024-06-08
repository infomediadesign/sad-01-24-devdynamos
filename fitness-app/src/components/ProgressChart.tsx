import React, { useEffect, useState } from 'react';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import 'chart.js/auto';  // Automatically registers all necessary components for Chart.js
import { fetchProgress, Progress } from '../services/progressService';

interface ProgressChartProps {
  goalId: string;
}

const ProgressChart: React.FC<ProgressChartProps> = ({ goalId }) => {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [chartData, setChartData] = useState<any>(null);
  const [workoutTypeData, setWorkoutTypeData] = useState<any>(null);
  const [goalProgressData, setGoalProgressData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const progressData: Progress = await fetchProgress(goalId);  // Use goal ID for fetching progress
        setProgress(progressData);

        // Data for main activity progress (Doughnut chart)
        const totalProgress = progressData.logs.reduce((acc, log) => acc + log.value, 0);
        setChartData({
          labels: ['Progress', 'Remaining'],
          datasets: [
            {
              label: `${progressData.activityType} Progress`,
              data: [totalProgress, progressData.goal - totalProgress],
              backgroundColor: ['#4caf50', '#e0e0e0'],
              borderColor: ['#4caf50', '#e0e0e0'],
              borderWidth: 1
            }
          ]
        });

        // Data for workout types breakdown (Bar chart)
        const workoutTypes = ['Running', 'Cycling', 'Swimming', 'Walking'];
        const workoutTypeCounts = workoutTypes.map(type =>
          progressData.logs.filter(log => log.activityType === type).length
        );
        setWorkoutTypeData({
          labels: workoutTypes,
          datasets: [
            {
              label: 'Workout Types',
              data: workoutTypeCounts,
              backgroundColor: '#3b82f6'
            }
          ]
        });

        // Data for overall progress towards the goal (Line chart)
        const dates = progressData.logs.map(log => new Date(log.date).toLocaleDateString());
        const values = progressData.logs.map(log => log.value);
        setGoalProgressData({
          labels: dates,
          datasets: [
            {
              label: 'Progress Over Time',
              data: values,
              fill: false,
              backgroundColor: '#f97316',
              borderColor: '#f97316'
            }
          ]
        });

      } catch (error: any) {
        console.error('Error fetching progress data', error);
      }
    };

    fetchData();
  }, [goalId]);

  if (!progress) return <p>Loading...</p>;

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-4 w-full max-w-4xl mb-8">
        <h2 className="text-xl font-semibold mb-4">Progress Chart</h2>
        <div className="h-64">
          <Doughnut
            data={chartData}
            options={{
              maintainAspectRatio: false,
              cutout: '80%',
              plugins: {
                tooltip: {
                  callbacks: {
                    label: (context) => {
                      const label = context.label || '';
                      const value = Number(context.raw || 0);  // Ensure value is a number
                      const total = context.dataset.data.reduce((acc: number, curr: number) => acc + Number(curr), 0);
                      const percentage = ((value / total) * 100).toFixed(2);
                      return `${label}: ${value} (${percentage}%)`;
                    }
                  }
                }
              }
            }}
          />
        </div>
        <div className="text-center mt-4">
          <p className="text-lg">Goal: {progress.goal}</p>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-4 w-full max-w-4xl mb-8">
        <h2 className="text-xl font-semibold mb-4">Workout Types Breakdown</h2>
        <div className="h-64">
          <Bar
            data={workoutTypeData}
            options={{
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true
                }
              }
            }}
          />
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-4 w-full max-w-4xl">
        <h2 className="text-xl font-semibold mb-4">Progress Over Time</h2>
        <div className="h-64">
          <Line
            data={goalProgressData}
            options={{
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProgressChart;
