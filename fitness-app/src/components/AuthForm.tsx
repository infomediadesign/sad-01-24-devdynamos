import React, { useState, ChangeEvent, FormEvent } from 'react';
import { authenticateUser } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import backgroundImage from './images/backgroundimage.png';

interface LoginData {
  username: string;
  password: string;
}

interface RegistrationData extends LoginData {
  email: string;
  age: string;
}

interface AuthFormProps {
  onLogin: (token: string) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [formData, setFormData] = useState<RegistrationData>({
    username: '',
    password: '',
    email: '',
    age: ''
  });
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'age') {
      // Ensure only positive numbers for age
      if (Number(value) < 0) {
        setMessage('Age cannot be negative');
        return;
      } else {
        setMessage('');
      }
    }

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const endpoint = isLogin ? '/login' : '/registration';

    if (!isLogin && Number(formData.age) < 18) {
      setMessage('Sorry, you must be at least 18 to register');
      return;
    }

    try {
      setIsLoading(true);
      const responseData = await authenticateUser(endpoint, formData);

      const response = responseData as { message?: string, jwt_token?: string };
      setMessage(response.message || 'Success');

      if (isLogin && response.jwt_token) {
        onLogin(response.jwt_token); // Call the onLogin prop to update token in the parent component
        navigate(`/dashboard/${formData.username}`); // Attach username to the URL path
      }
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div
        className="flex-1 flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      >
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="bg-white p-10 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-3xl font-semibold mb-5">{isLogin ? 'Welcome Back :)' : 'Sign Up'}</h2>
          <form onSubmit={handleSubmit} className="mt-5">
            <input
              className="w-full p-2 mb-4 rounded-lg border border-gray-300"
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <input
              className="w-full p-2 mb-4 rounded-lg border border-gray-300"
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {!isLogin && (
              <>
                <input
                  className="w-full p-2 mb-4 rounded-lg border border-gray-300"
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <input
                  className="w-full p-2 mb-4 rounded-lg border border-gray-300"
                  type="number"
                  name="age"
                  placeholder="Age"
                  min="1"
                  value={formData.age}
                  onChange={handleChange}
                  required
                />
              </>
            )}
            <button
              type="submit"
              className="w-full p-2 mt-4 rounded-lg bg-blue-500 text-white"
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : isLogin ? 'Login' : 'Sign Up'}
            </button>
          </form>
          <p className="mt-4 text-center cursor-pointer text-blue-500" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Need an account? Sign up here.' : 'Already have an account? Log in here.'}
          </p>
          {message && <p className="mt-4 text-center text-red-500">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;

