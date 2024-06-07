import React, { useState } from 'react';
import { generateWorkoutRoutine } from '../services/workoutRoutineService';

interface Exercise {
  name: string;
  sets: number;
  reps: number | string;
  rest: string;
}

interface WorkoutDay {
  day: string;
  exercises?: Exercise[];
  rest?: string;
}

const WorkoutRoutine: React.FC = () => {
  const [step, setStep] = useState(1);
  const [gender, setGender] = useState('');
  const [age, setAge] = useState<number>(18);
  const [goal, setGoal] = useState('');
  const [fitnessLevel, setFitnessLevel] = useState('');
  const [equipment, setEquipment] = useState<string[]>([]);
  const [routine, setRoutine] = useState<{ [key: string]: WorkoutDay }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleGenerateRoutine = async () => {
    setLoading(true);
    setError(null);
    try {
      const routineData = await generateWorkoutRoutine({ gender, age, goal, fitnessLevel, equipment });
      console.log(routineData)
      const parsedRoutine = JSON.parse(routineData);
      setRoutine(parsedRoutine);
    } catch (err) {
      setError('Failed to generate workout routine. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEquipmentSelect = (equip: string) => {
    if (equipment.includes(equip)) {
      setEquipment(equipment.filter(item => item !== equip));
    } else {
      setEquipment([...equipment, equip]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">{step === 1 && "LET'S GET STARTED"}</h2>
            <h2 className="text-2xl font-bold">{step === 2 && 'AGE'}</h2>
            <h2 className="text-2xl font-bold">{step === 3 && 'YOUR FITNESS GOAL?'}</h2>
            <h2 className="text-2xl font-bold">{step === 4 && 'YOUR FITNESS LEVEL?'}</h2>
            <h2 className="text-2xl font-bold">{step === 5 && 'SELECT YOUR EQUIPMENT'}</h2>
            <h2 className="text-2xl font-bold">{step === 6 && 'WHAT DO YOU WANT TO WORKOUT?'}</h2>
          </div>
          <div className="flex space-x-2 mt-4">
            {Array(6).fill('').map((_, index) => (
              <div key={index} className={`flex-1 h-1 rounded ${index < step ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
            ))}
          </div>
        </div>

        {step === 1 && (
          <div className="flex flex-col items-center">
            <button onClick={() => { setGender('Male'); handleNext(); }} className={`btn mb-4 ${gender === 'Male' ? 'bg-red-600 text-white' : 'bg-white text-gray-700'}`}>Male</button>
            <button onClick={() => { setGender('Female'); handleNext(); }} className={`btn ${gender === 'Female' ? 'bg-red-600 text-white' : 'bg-white text-gray-700'}`}>Female</button>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col items-center">
            <label htmlFor="age" className="text-lg mb-4">Age</label>
            <input
              type="number"
              id="age"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="input mb-4"
            />
            <div className="flex space-x-4">
              <button onClick={handleBack} className="btn-secondary">Go Back</button>
              <button onClick={handleNext} className="btn">Next</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col items-center">
            <button onClick={() => { setGoal('Lose Weight'); handleNext(); }} className={`btn mb-4 ${goal === 'Lose Weight' ? 'bg-red-600 text-white' : 'bg-white text-gray-700'}`}>Lose Weight</button>
            <button onClick={() => { setGoal('Gain Strength'); handleNext(); }} className={`btn mb-4 ${goal === 'Gain Strength' ? 'bg-red-600 text-white' : 'bg-white text-gray-700'}`}>Gain Strength</button>
            <button onClick={() => { setGoal('Gain Muscle'); handleNext(); }} className={`btn ${goal === 'Gain Muscle' ? 'bg-red-600 text-white' : 'bg-white text-gray-700'}`}>Gain Muscle</button>
            <div className="flex space-x-4 mt-4">
              <button onClick={handleBack} className="btn-secondary">Go Back</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="flex flex-col items-center">
            <button onClick={() => { setFitnessLevel('Novice'); handleNext(); }} className={`btn mb-4 ${fitnessLevel === 'Novice' ? 'bg-red-600 text-white' : 'bg-white text-gray-700'}`}>Novice</button>
            <button onClick={() => { setFitnessLevel('Beginner'); handleNext(); }} className={`btn mb-4 ${fitnessLevel === 'Beginner' ? 'bg-red-600 text-white' : 'bg-white text-gray-700'}`}>Beginner</button>
            <button onClick={() => { setFitnessLevel('Intermediate'); handleNext(); }} className={`btn mb-4 ${fitnessLevel === 'Intermediate' ? 'bg-red-600 text-white' : 'bg-white text-gray-700'}`}>Intermediate</button>
            <button onClick={() => { setFitnessLevel('Advanced'); handleNext(); }} className={`btn ${fitnessLevel === 'Advanced' ? 'bg-red-600 text-white' : 'bg-white text-gray-700'}`}>Advanced</button>
            <div className="flex space-x-4 mt-4">
              <button onClick={handleBack} className="btn-secondary">Go Back</button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="flex flex-col items-center">
            <label className="text-lg mb-4">Select Your Equipment</label>
            <div className="grid grid-cols-3 gap-4">
              {['Select All', 'Barbell', 'Dumbbells', 'Bodyweight', 'Kettlebells', 'Cables', 'Band', 'Machine'].map((equip) => (
                <button
                  key={equip}
                  onClick={() => handleEquipmentSelect(equip)}
                  className={`btn ${equipment.includes(equip) ? 'bg-red-600 text-white' : 'bg-white text-gray-700'}`}
                >
                  {equip}
                </button>
              ))}
            </div>
            <div className="flex space-x-4 mt-4">
              <button onClick={handleBack} className="btn-secondary">Go Back</button>
              <button onClick={handleNext} className="btn">Next</button>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="flex flex-col items-center">
            <button onClick={handleGenerateRoutine} className="btn mb-4">Generate</button>
            <div className="flex space-x-4 mt-4">
              <button onClick={handleBack} className="btn-secondary">Go Back</button>
            </div>
          </div>
        )}

        {loading && <div className="mt-8 text-center">Loading...</div>}
        {error && <div className="mt-8 text-center text-red-500">{error}</div>}

        {Object.keys(routine).length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Your Workout Routine</h2>
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 bg-gray-200">Day</th>
                  <th className="py-2 px-4 bg-gray-200">Exercise</th>
                  <th className="py-2 px-4 bg-gray-200">Sets</th>
                  <th className="py-2 px-4 bg-gray-200">Reps</th>
                  <th className="py-2 px-4 bg-gray-200">Rest Time</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(routine).map(([day, details], index) => (
                  <React.Fragment key={index}>
                    {details.rest ? (
                      <tr>
                        <td className="border px-4 py-2">{details.day}</td>
                        <td className="border px-4 py-2" colSpan={4}>Rest Day</td>
                      </tr>
                    ) : (
                      details.exercises?.map((exercise, exerciseIndex) => (
                        <tr key={exerciseIndex}>
                          {exerciseIndex === 0 && details.exercises && (
                            <td className="border px-4 py-2" rowSpan={details.exercises.length}>{details.day}</td>
                          )}
                          <td className="border px-4 py-2">{exercise.name}</td>
                          <td className="border px-4 py-2">{exercise.sets}</td>
                          <td className="border px-4 py-2">{exercise.reps}</td>
                          <td className="border px-4 py-2">{exercise.rest}</td>
                        </tr>
                      ))
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutRoutine;
