import React, { useState, useCallback } from 'react';
import Model, { IExerciseData, IMuscleStats } from 'react-body-highlighter';
import { useNavigate } from 'react-router-dom';

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

    const navigate = useNavigate();

    
    const handleClick = useCallback(({ muscle }: IMuscleStats) => {
        navigate(`/exercises/${muscle}`);
    }, [navigate]);

    return (
        <div className="relative flex flex-col justify-center items-center space-y-8">
            <div className="flex justify-center space-x-8">
                <div className="flex-1 flex justify-center">
                    <Model
                        data={anteriorData}
                        type="anterior"
                        style={{ width: '30rem', padding: '5rem' }}
                        onClick={handleClick}
                        highlightedColors={hoveredMuscle ? ['#ffcccc'] : ['#b6bdc3']} // Default to gray if not hovered
                    />
                </div>
                <div className="flex-1 flex justify-center">
                    <Model
                        data={posteriorData}
                        type="posterior"
                        style={{ width: '30rem', padding: '5rem' }}
                        onClick={handleClick}
                        highlightedColors={hoveredMuscle ? ['#ffcccc'] : ['#b6bdc3']} // Default to gray if not hovered
                    />
                </div>
                <div className="p-2 m-4 max-w-sm h-32 bg-white rounded-lg shadow-md border border-gray-200 flex items-center">
                    <div>
                        <h2 className="text-lg font-semibold mb-2">How to Use the Muscle Map</h2>
                        <ul className="list-disc list-inside text-sm">
                            <li>Hover over a muscle group to highlight it.</li>
                            <li>Click on a muscle group to view exercises for that muscle.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MuscleGroupMap;
