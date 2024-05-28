import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000'; // Adjust the URL to your backend API

interface FormData {
  username: string;
  password: string;
  email?: string;
  age?: string;
}

interface AuthResponse {
  message?: string;
  jwt_token?: string;
}

export const authenticateUser = async (endpoint: string, formData: FormData): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${API_URL}${endpoint}`, formData);
    if (response.data.jwt_token) {
      localStorage.setItem('token', response.data.jwt_token);
      // Set the default authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.jwt_token}`;
    }
    return response.data;
  } catch (error: any) {
    const errorMessage = error.response ? (error.response.data.error || 'Something went wrong') : 'Network error';
    throw new Error(errorMessage);
  }
};

// Set the default authorization header if the token is already present in localStorage
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}
