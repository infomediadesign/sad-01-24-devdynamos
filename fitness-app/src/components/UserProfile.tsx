import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProfile, updateUserProfile, deleteUserAccount } from '../services/userServices';
import axios from 'axios';
import Navbar from './common/NavBar';
import BackButton from './common/BackButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const defaultUserPhoto = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9w6xP8W6dZxsTRJVPe1LBYIO_eO4DWAui1Q&s';

const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [formData, setFormData] = useState<any>({ age: '', username: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getUserProfile();
        setProfile(profileData);
        setFormData({ age: profileData.age, username: profileData.username, email: profileData.email, password: '', confirmPassword: '' });
      } catch (error) {
        handleError(error);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.email.trim() === '') {
      setError('Email cannot be empty');
      return;
    }
    if (formData.age.trim() === '') {
      setError('Age cannot be empty');
      return;
    }
    if (parseInt(formData.age) < 18) {
      setError('Age cannot be less than 18');
      return;
    }
    if (parseInt(formData.age) < 0) {
      setError('Age cannot be negative');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const { confirmPassword, username, ...updateData } = formData; // Exclude confirmPassword and username
    try {
      const updatedProfile = await updateUserProfile(updateData);
      setProfile(updatedProfile);
      setError(null);
      setMessage('User profile updated successfully');
      setTimeout(() => {
        navigate('/dashboard');
      }, 60000); // Navigate after 1 minute
    } catch (error) {
      handleError(error);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
    if (!confirmDelete) return;

    try {
      await deleteUserAccount();
      setMessage('Your account is deleted successfully');
      navigate('/');
    } catch (error) {
      handleError(error);
    }
  };

  const handleError = (error: unknown) => {
    console.error('Handle Error:', error); // Added for debugging

    if (axios.isAxiosError(error) && error.response && error.response.data) {
      const errorMessage = error.response.data.error;
      console.error('Error message:', errorMessage); // Added for debugging

      if (errorMessage) {
        setError(errorMessage);
      } else {
        setError('No error message');
      }
    } else if (error instanceof Error) {
      setError(error.message);
    } else {
      setError('User Name Already Exists');
    }
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('https://static.vecteezy.com/system/resources/previews/002/422/411/non_2x/background-of-gym-with-big-window-vector.jpg')` }}>
      <Navbar />
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="bg-gray-800 bg-opacity-50 text-white rounded-lg shadow-lg max-w-md w-full p-6">
          <h2 className="text-3xl font-bold mb-4 text-center">My Account</h2>
          <div className="flex items-center justify-center mb-6">
            <img src={profile.photo || defaultUserPhoto} alt="User Photo" className="w-20 h-20 rounded-full object-cover" />
          </div>
          {error && <p className="text-red-500 text-center">{error}</p>}
          {message && <p className="text-green-500 text-center">{message}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Username: </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                readOnly
                className="mt-1 block w-full rounded-md border-transparent shadow-sm focus:border-transparent focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-black bg-gray-200 bg-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Age: </label>
              <input
                type="number"
                name="age"
                min="18"
                value={formData.age}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-transparent shadow-sm focus:border-transparent focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-black bg-gray-200 bg-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Email: </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-transparent shadow-sm focus:border-transparent focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-black bg-gray-200 bg-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Password: </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-transparent shadow-sm focus:border-transparent focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-black bg-gray-200 bg-opacity-50"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Confirm Password: </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-transparent shadow-sm focus:border-transparent focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-black bg-gray-200 bg-opacity-50"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                </button>
              </div>
            </div>
            <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full w-full">
              Update Profile
            </button>
          </form>
          <button onClick={handleDeleteAccount} className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full w-full">
            Delete Account
          </button>
          
          <BackButton className="mt-4 rounded-lg bg-yellow-500 text-white font-bold hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-full w-full"/>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
