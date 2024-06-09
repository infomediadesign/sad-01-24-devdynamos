import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000/calories';

const setCalorieGoal = async (data: { start_date: string; end_date: string; goal: number; activity: string }) => {
  try {
    const response = await axios.post(`${API_URL}/goal`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        Username: localStorage.getItem('username') // Add username to headers
      }
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Error setting calorie goal');
    }
    throw new Error('Unexpected error setting calorie goal');
  }
};

const logCalories = async (data: { date: string; calories: number }) => {
  try {
    const response = await axios.post(API_URL, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        Username: localStorage.getItem('username') // Add username to headers
      }
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Error logging calories');
    }
    throw new Error('Unexpected error logging calories');
  }
};

const getProgress = async () => {
  try {
    const response = await axios.get(`${API_URL}/progress`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        Username: localStorage.getItem('username') // Add username to headers
      }
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Error fetching progress');
    }
    throw new Error('Unexpected error fetching progress');
  }
};

const getCaloriesByDate = async (date: string) => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        Username: localStorage.getItem('username') // Add username to headers
      },
      params: { date }
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Error fetching calories by date');
    }
    throw new Error('Unexpected error fetching calories by date');
  }
};

const deleteCaloriesByDate = async (date: string) => {
  try {
    const response = await axios.delete(API_URL, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        Username: localStorage.getItem('username') // Add username to headers
      },
      params: { date }
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Error deleting calories by date');
    }
    throw new Error('Unexpected error deleting calories by date');
  }
};

const deleteGoal = async (start_date: string, end_date: string) => {
  try {
    const response = await axios.delete(`${API_URL}/goals`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        Username: localStorage.getItem('username') // Add username to headers
      },
      params: { start_date, end_date }
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Error deleting goal');
    }
    throw new Error('Unexpected error deleting goal');
  }
};

export { setCalorieGoal, logCalories, getProgress, getCaloriesByDate, deleteCaloriesByDate, deleteGoal };
