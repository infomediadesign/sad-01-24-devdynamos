import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchExerciseByMuscleGroup, Exercise, fetchMuscleGroupFact, fetchMuscleGroupTip,fetchMuscleGroupSafetyTip } from '../services/excerciseService';
import BackButton from './common/BackButton';

const Exercises: React.FC = () => {
  const { muscleGroup } = useParams<{ muscleGroup: string }>();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [fact, setFact] = useState<string>('');
  const [tip, setTip] = useState<string>('');
  const [safetyTip, setSafetyTip]= useState<String>('');

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      fetchExerciseByMuscleGroup(muscleGroup!),
      fetchMuscleGroupFact(muscleGroup!),
      fetchMuscleGroupTip(muscleGroup!),
      fetchMuscleGroupSafetyTip(muscleGroup!)
    ])
      .then(([exerciseData, factData, tipData,safetyData]) => {
        if (exerciseData.length > 0) {
          setExercises(exerciseData);
          setFact(factData);
          setTip(tipData);
          setSafetyTip(safetyData)
        } else {
          setError('No data found for this muscle group.');
        }
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch exercise data.');
        setLoading(false);
      });
  }, [muscleGroup]);

  if (loading) return <p className="text-center py-4">Loading...</p>;
  if (error) return <p className="text-center text-red-500 py-4">{error}</p>;

  const getEmbedUrl = (url: string) => {
    const urlObj = new URL(url);
    const videoId = urlObj.searchParams.get('v');
    return `https://www.youtube.com/embed/${videoId}`;
  };

  return (
    <div className="max-w-6xl mx-auto p-4 mt-20">
      <h1 className="text-4xl font-bold text-blue-600 mb-12 text-center">Exercises for {muscleGroup}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        <div className="bg-blue-100 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Fact about {muscleGroup}</h3>
          <p>{fact}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Health Tip</h3>
          <p>{tip}</p>
        </div>
        <div className="bg-red-100 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Safety Tip</h3>
          <p>{safetyTip}</p>
        </div>
      </div>
      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {exercises.map((exercise) => (
          <div key={exercise._id} className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="bg-blue-600 p-4">
              <h1 className="text-2xl font-bold text-white">{exercise.name}</h1>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <iframe
                  width="100%"
                  height="315"
                  src={getEmbedUrl(exercise.youtube_link)}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full rounded-lg"
                ></iframe>
              </div>
              <ul className="list-decimal pl-6 text-gray-700 text-lg">
                {exercise.description.split('. ').map((point, index) => (
                  <li key={index} className="mb-2">{point}</li>
                ))}
              </ul>
            </div>
            
          </div>
          
        ))}
      </div>
      <BackButton className="w-full p-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700" />
    </div>
  );
};

export default Exercises;
