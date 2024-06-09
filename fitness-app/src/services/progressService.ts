import axios from 'axios';

const API_URL = 'http://localhost:5000/progress';

export interface Goal {
  id: string;
  activityType: string;
  goal: number;
  endDate: string;
}

export interface Log {
  date: string;
  value: number;
  activityType: string;
}

export interface Progress {
  _id: string;
  activityType: string;
  goal: number;
  endDate: string;
  logs: Log[];
}

// Function to get the bearer token from localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Set Goal
export const setGoal = async (goal: Omit<Goal, 'id'>): Promise<Goal> => {
  try {
    const response = await axios.post(
      `${API_URL}/goal`,
      {
        start_date: new Date().toISOString().split('T')[0], // Assuming start date is today
        end_date: goal.endDate,
        goal: goal.goal,
        activity: goal.activityType,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    return { ...goal, id: response.data.id }; // Assuming the backend response includes the new goal ID
  } catch (error:any) {
    throw new Error(error.response.data.error || 'Failed to set goal');
  }
};

// Log Workout
export const logWorkout = async (progressId: string, log: Log) => {
  try {
    const response = await axios.post(
      `${API_URL}`,
      {
        date: log.date,
        progress: log.value,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    return response.data;
  } catch (error:any) {
    throw new Error(error.response.data.error || 'Failed to log workout');
  }
};

// Fetch Progress
export const fetchProgress = async (progressId: string): Promise<Progress> => {
  try {
    const response = await axios.get(`${API_URL}/all`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    const progressData = response.data.find((goal: any) => goal.goal_id === progressId);
    if (!progressData) {
      throw new Error('Goal not found');
    }

    return {
      _id: progressData.goal_id,
      activityType: progressData.activity,
      goal: progressData.goal,
      endDate: progressData.end_date,
      logs: progressData.progresses.map((log: any) => ({
        date: log.date,
        value: log.progress,
        activityType: progressData.activity,
      })),
    };
  } catch (error:any) {
    throw new Error(error.response.data.error || 'Failed to fetch progress');
  }
};
