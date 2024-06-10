import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Slider from 'react-slick';
import { fetchExerciseByMuscleGroup, Exercise } from '../services/excerciseService';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

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

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  return (
    <div className="max-w-6xl mx-auto p-4 mt-40">
      <h1 className="text-4xl font-bold text-blue-600 mb-8 text-center">Exercises for {muscleGroup}</h1>
      <Slider {...settings}>
        {exercises.map((exercise) => (
          <div key={exercise._id} className="bg-white shadow-md rounded-lg overflow-hidden mx-2">
            <div className="bg-blue-600 p-4">
              <h1 className="text-2xl font-bold text-white">{exercise.name} Exercise</h1>
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
      </Slider>
    </div>
  );
};

export default Exercises;
