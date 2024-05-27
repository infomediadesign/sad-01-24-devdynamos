// src/services/calorieService.ts
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:5000/calories';

export const setCalorieGoal = async (goalData: any) => {
  return axios.post(`${API_BASE_URL}/set_caloriesgoal`, goalData);
};

export const logCalories = async (username: string, date: string, calories: string) => {
  return axios.post(`${API_BASE_URL}/log`, { params:{
    username,
    date,
    calories,
  }
  });
};

export const getProgress = async (username: string, startDate: string, endDate: string) => {
  return axios.get(`${API_BASE_URL}/progress`, {
    params: { username, start_date: startDate, end_date: endDate },
  });
};

export const getCaloriesByDate = async (username: string, date: string) => {
  return axios.get(`${API_BASE_URL}/calories_bydate`, {
    params: { username, date },
  });
};
