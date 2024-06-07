import axios from 'axios';
import { ApiError } from '../components/types'; // Ensure this path is correct based on your project structure

const API_BASE_URL = 'http://127.0.0.1:5000/dashboard';

export const getCalories = async (token: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/calories`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: unknown) {
    const typedError = error as ApiError; // Use type assertion
    // Check each level of the object to avoid accessing properties of undefined
    if (typedError.response && typedError.response.data && typedError.response.data.error) {
      throw typedError.response.data.error;
    } else {
      throw 'An error occurred'; // Fallback error message
    }
  }
};

export const getProgress = async (token: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/progress`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: unknown) {
    const typedError = error as ApiError; // Use type assertion
    // More explicit checking
    if (typedError.response?.data?.error) {
      throw typedError.response.data.error;
    } else {
      throw 'An error occurred'; // Fallback error message
    }
  }
};