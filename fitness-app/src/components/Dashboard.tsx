import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from './common/NavBar';
import Calories from './Calories';

const Dashboard: React.FC = () => {
  const { username } = useParams<{ username: string }>();

  return (
    <div className="flex min-h-screen">
      <Navbar />
      <div className="flex-grow p-4">
        <h1 className="text-2xl font-bold mb-4">Welcome, {username}!</h1>
        <Calories />
      </div>
    </div>
  );
};

export default Dashboard;
