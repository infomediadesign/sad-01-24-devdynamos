import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://127.0.0.1:5000';

axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

const handleError = (error: unknown) => {
  if (axios.isAxiosError(error) && error.response) {
    throw error.response.data;
  } else if (error instanceof Error) {
    throw new Error(error.message);
  } else {
    throw new Error('An unknown error occurred');
  }
};

export const getUserProfile = async () => {
  try {
    const response = await axios.get(`${API_URL}/user/profile`);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;  // Add this line to propagate the error
  }
};

export const updateUserProfile = async (data: any) => {
  try {
    const response = await axios.put(`${API_URL}/user/profile`, data);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;  // Add this line to propagate the error
  }
};

export const deleteUserAccount = async () => {
  try {
    const response = await axios.delete(`${API_URL}/user/account`);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;  // Add this line to propagate the error
  }
};
