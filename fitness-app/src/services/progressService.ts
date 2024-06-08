import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export interface Goal {
  id: string;  // Add id field
  activityType: string;
  goal: number;
  endDate: string;
}

export interface Log {
  date: string;
  value: number;
  activityType: string; // Add activityType to Log
}

export interface Progress {
  _id: string;  // Add an ID field
  activityType: string;
  goal: number;
  endDate: string;
  logs: Log[];
}

// Mock Data for Testing
const mockProgressData: Progress = {
  _id: '60d21b4667d0d8992e610c85',  // Mock MongoDB ObjectId
  activityType: 'running',
  goal: 50,
  endDate: '2023-12-31',
  logs: [
    { date: '2023-05-01', value: 5, activityType: 'Running' },
    { date: '2023-05-02', value: 7, activityType: 'Cycling' },
    { date: '2023-05-03', value: 10, activityType: 'Swimming' },
    { date: '2023-05-04', value: 12, activityType: 'Walking' },
    { date: '2023-05-05', value: 0, activityType: 'Running' },
    { date: '2023-05-06', value: 3, activityType: 'Cycling' },
  ]
};

export const setGoal = async (goal: Omit<Goal, 'id'>): Promise<Goal> => {
  // Mock Response for Testing
  return new Promise<Goal>((resolve) => {
    setTimeout(() => {
      const newGoal = { ...goal, id: 'new_goal_id' };  // Add id to the new goal
      console.log('Goal set:', newGoal);
      resolve(newGoal);
    }, 500);
  });
};

export const logWorkout = async (progressId: string, log: Log) => {
  // Mock Response for Testing
  return new Promise<Log>((resolve) => {
    setTimeout(() => {
      console.log('Workout logged:', log);
      resolve(log);
    }, 500);
  });
};

export const fetchProgress = async (progressId: string): Promise<Progress> => {
  // Mock Response for Testing
  return new Promise<Progress>((resolve) => {
    setTimeout(() => {
      console.log('Fetching progress for id:', progressId);
      resolve(mockProgressData);
    }, 500);
  });
};
