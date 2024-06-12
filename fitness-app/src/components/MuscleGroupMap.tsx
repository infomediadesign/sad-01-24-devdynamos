import React, { useState, useEffect, useCallback } from 'react';
import Model, { IExerciseData, IMuscleStats } from 'react-body-highlighter';
import { useNavigate } from 'react-router-dom';
import { fetchUnsplashImage } from '../services/unsplashService';
import BackButton from './common/BackButton';
 

const anteriorData: IExerciseData[] = [
  { name: 'Bench Press', muscles: ['chest', 'triceps', 'front-deltoids'] },
  { name: 'Push Ups', muscles: ['chest'] },
  // Add more exercises and associated muscles here
];

const posteriorData: IExerciseData[] = [
  { name: 'Deadlift', muscles: ['lower-back', 'hamstring', 'gluteal'] },
  { name: 'Pull Ups', muscles: ['upper-back', 'biceps'] },
  // Add more exercises and associated muscles here
];

const MuscleGroupMap: React.FC = () => {
  const [hoveredMuscle, setHoveredMuscle] = useState<string | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const loadImage = async () => {
      const imageUrl = await fetchUnsplashImage('gym workout fitness');
      setBackgroundImage(imageUrl);
    };
    loadImage();
  }, []);

  const handleClick = useCallback(({ muscle }: IMuscleStats) => {
    navigate(`/exercises/${muscle}`);
  }, [navigate]);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-10 px-4"
      style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Muscle Group Exercises</h1>
      <div className="flex justify-center space-x-8 w-full max-w-7xl">
        <div className="flex-1 flex flex-col items-center space-y-8">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-center mb-4">Anterior Muscles</h2>
            <Model
              data={anteriorData}
              type="anterior"
              style={{ width: '25rem', padding: '2rem' }}
              onClick={handleClick}
              highlightedColors={hoveredMuscle ? ['#ffcccc'] : ['#b6bdc3']} // Default to gray if not hovered
            />
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center space-y-8">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-center mb-4">Posterior Muscles</h2>
            <Model
              data={posteriorData}
              type="posterior"
              style={{ width: '25rem', padding: '2rem' }}
              onClick={handleClick}
              highlightedColors={hoveredMuscle ? ['#ffcccc'] : ['#b6bdc3']} // Default to gray if not hovered
            />
          </div>
        </div>
        <div id="description" className="relative p-6 w-72 bg-white rounded-lg shadow-lg border border-gray-200 self-start">
          <div className="absolute top-0 left-0 w-full h-10 bg-blue-600 rounded-t-lg"></div>
          <div className="pt-12 w-full">
            <h2 className="text-xl font-semibold mb-2 text-gray-700">How to Use the Muscle Map</h2>
            <ul className="list-disc list-inside text-sm text-gray-600">
              <li>Hover over a muscle to highlight it.</li>
              <li>Click on a muscle to view exercises for that muscle.</li>
            </ul>
          </div>
          <div>
            <BackButton className="w-full p-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MuscleGroupMap;
