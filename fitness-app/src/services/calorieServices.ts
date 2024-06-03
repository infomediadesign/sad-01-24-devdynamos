// // src/services/calorieService.ts
// import axios from 'axios';

// const API_BASE_URL = 'http://127.0.0.1:5000/calories';

// export const setCalorieGoal = async (goalData: any) => {
//   return axios.post(`${API_BASE_URL}/set_caloriesgoal`, goalData);
// };

// export const logCalories = async (username: string, date: string, calories: string) => {
//   return axios.post(`${API_BASE_URL}/log`, {
//     username,
//     date,
//     calories,
//   });
// };

// export const getProgress = async (username: string, startDate: string, endDate: string) => {
//   return axios.get(`${API_BASE_URL}/progress`, {
//     params: { username, start_date: startDate, end_date: endDate },
//   });
// };

// export const getCaloriesByDate = async (username: string, date: string) => {
//   return axios.get(`${API_BASE_URL}/calories_bydate`, {
//     params: { username, date },
//   });
// };

import axios from 'axios';
import { useAuth } from '../components/AuthContext';

const API_URL = 'http://localhost:5000/calories'; // Adjust this as needed

// Custom hook to handle API calls with authentication
const calorieServices = () => {
    const { token } = useAuth(); // Get token from AuthContext

    // Set Calorie Goal
    const setCalorieGoal = async (start_date: string, end_date: string, goal: number, activity: string) => {
        const response = await axios.post(
            `${API_URL}/set_caloriesgoal`,
            { start_date, end_date, goal, activity },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    };

    // Log Calorie
    const logCalorie = async (date: string, calories: number) => {
        const response = await axios.post(
            `${API_URL}/log`,
            { date, calories },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    };

    // Delete Goal
    const deleteGoal = async (start_date: string, end_date: string) => {
        const response = await axios.delete(
            `${API_URL}/delete_goal`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: { start_date, end_date }
            }
        );
        return response.data;
    };

    return { setCalorieGoal, logCalorie, deleteGoal };
};

export default calorieServices;
