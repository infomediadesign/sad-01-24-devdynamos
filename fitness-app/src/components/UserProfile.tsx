
import React, { useEffect, useState } from 'react';
import { getUserProfile, updateUserProfile, deleteUserAccount } from '../services/userServices';
import axios from 'axios';

const UserProfile: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [formData, setFormData] = useState<any>({ age: '', username: '', email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getUserProfile();
        setProfile(profileData);
        setFormData({ age: profileData.age, username: profileData.username, email: profileData.email, password: '' });
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
    try {
      const updatedProfile = await updateUserProfile(formData);
      setProfile(updatedProfile);
      setError(null);
      setShowForm(false);
    } catch (error) {
      handleError(error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteUserAccount();
      // Optionally, handle logout and redirection here
    } catch (error) {
      handleError(error);
    }
  };

  const handleError = (error: unknown) => {
    if (axios.isAxiosError(error) && error.response) {
      setError(error.response.data.error);
    } else if (error instanceof Error) {
      setError(error.message);
    } else {
      setError('An unknown error occurred');
    }
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="p-4 bg-gray-800 text-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Welcome, {profile.username}!</h2>
      <div className="flex items-center justify-between mb-4">
        {profile.photo && <img src={profile.photo} alt="User Photo" className="w-16 h-16 rounded-full object-cover" />}
        <button onClick={() => setShowForm(!showForm)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          My Account
        </button>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">Age: </label>
            <input type="number" name="age" value={formData.age} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Username: </label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Email: </label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Password: </label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
          </div>
          <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Update Profile
          </button>
        </form>
      )}
      <button onClick={handleDeleteAccount} className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
        Delete Account
      </button>
    </div>
  );
};

export default UserProfile;
