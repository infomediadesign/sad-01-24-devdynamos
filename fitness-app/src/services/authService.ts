import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://127.0.0.1:5000'; 

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
    const token = response.data.jwt_token;

    if (token) {
      localStorage.setItem('token', token);
      // Set the default authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
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
