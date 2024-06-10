import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchExerciseByMuscleGroup, Exercise } from '../services/excerciseService';

const Exercises: React.FC = () => {
  const { muscleGroup } = useParams<{ muscleGroup: string }>();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchExerciseByMuscleGroup(muscleGroup!)
      .then(data => {
        if (data.length > 0) {
          setExercises(data);
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
    <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden mt-40">
      {exercises.map((exercise) => (
        <div key={exercise._id} className="mb-8">
          <div className="bg-blue-600 p-4">
            <h1 className="text-3xl font-bold text-white">{exercise.name} Exercise</h1>
          </div>
          <div className="p-4">
            <div className="aspect-w-16 aspect-h-9 mb-4">
              <iframe
                width="560"
                height="315"
                src={getEmbedUrl(exercise.youtube_link)}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
            <ul className="list-decimal pl-5">
              {exercise.description.split('. ').map((point, index) => (
                <li key={index} className="mb-2 text-lg">{point}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Exercises;
