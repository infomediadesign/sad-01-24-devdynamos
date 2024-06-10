import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from './common/NavBar';
import Calories from './Calories';

const Dashboard: React.FC = () => {
  const { username } = useParams<{ username: string }>();

  return (
    <div 
      className="flex min-h-screen bg-cover bg-center" 
      style={{ backgroundImage: `url('https://img.freepik.com/free-photo/white-sneakers-pink-weights-with-copy-space_23-2148343777.jpg')` }}
    >
      <Navbar />
      <div className="flex-grow p-4 bg-white bg-opacity-75">
        <h1 className="text-2xl font-bold mb-4">Welcome, {username}!</h1>
        <Calories />
      </div>
    </div>
  );
};

export default Dashboard;
