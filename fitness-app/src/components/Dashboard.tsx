import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from './common/NavBar';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';

const API_URL = 'http://127.0.0.1:5000';  

const fetchProgress = async () => {
  try {
    const response = await axios.get(`${API_URL}/dashboard/progress`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Error fetching progress');
    }
    throw new Error('Unexpected error fetching progress');
  }
};

const fetchCalories = async () => {
  try {
    const response = await axios.get(`${API_URL}/dashboard/calories`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Error fetching calories');
    }
    throw new Error('Unexpected error fetching calories');
  }
};

const Dashboard: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [calorieData, setCalorieData] = useState({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Calories',
        data: [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  });
  const [progressData, setProgressData] = useState({
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Progress',
        data: [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const progressResponse = await fetchProgress();
        const caloriesResponse = await fetchCalories();

        setProgressData((prevData) => ({
          ...prevData,
          datasets: [
            {
              ...prevData.datasets[0],
              data: progressResponse.progress,
            },
          ],
        }));

        setCalorieData((prevData) => ({
          ...prevData,
          datasets: [
            {
              ...prevData.datasets[0],
              data: caloriesResponse.calories_burned,
            },
          ],
        }));
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(error.message);
        } else {
          console.error('Unexpected error', error);
        }
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen">
      <Navbar />
      <div className="flex-grow p-4">
        <h1 className="text-2xl font-bold mb-4">Welcome, {username}!</h1>
        <div className="flex space-x-4">
          <div className="flex-1 p-2 rounded-lg bg-gray-100 text-gray-900 text-center">
            <h2 className="text-xl font-semibold mb-2">Calories</h2>
            <Pie data={calorieData} />
          </div>
          <div className="flex-1 p-2 rounded-lg bg-gray-100 text-gray-900 text-center">
            <h2 className="text-xl font-semibold mb-2">Progress</h2>
            <Pie data={progressData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
