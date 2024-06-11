import OpenAI from "openai";


interface WorkoutInput {
  gender: string;
  age: number;
  goal: string;
  fitnessLevel: string;
  equipment: string[];
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export const generateWorkoutRoutine = async (input: WorkoutInput): Promise<string> => {
  const exerciseNames = [
    "Neck Flexion", "Neck Extension", "Neck Lateral Flexion", "Head Circles", "Head Tilts", "Chin Tucks",
    "Front Dumbbell Raise", "Arnold Press", "Barbell Front Raise", "Push-Up", "Incline Dumbbell Press",
    "Chest Fly", "Dumbbell Bicep Curl", "Hammer Curl", "Barbell Bicep Curl", "Tricep Dips", "Tricep Pushdown",
    "Skull Crushers", "Wrist Curl", "Reverse Wrist Curl", "Farmer's Walk", "Russian Twist", "Side Plank",
    "Bicycle Crunches", "Crunches", "Leg Raises", "Plank", "Side Leg Raises", "Clamshells", "Standing Side Leg Lifts",
    "Barbell Squat", "Leg Press", "Walking Lunges", "Quad Set", "Straight Leg Raises", "Hamstring Curls",
    "Standing Calf Raises", "Seated Calf Raises", "Calf Stretch", "Dumbbell Shrugs", "Barbell Upright Rows",
    "Face Pulls", "Rear Delt Flyes", "Reverse Pec Deck Flyes", "Bent Over Reverse Flyes", "Pull-Ups",
    "Lat Pulldowns", "Dumbbell Rows", "Superman Exercise", "Good Mornings", "Back Extensions", "Glute Bridge",
    "Lunges", "Hip Thrusts", "Romanian Deadlifts", "Lying Leg Curls", "Kettlebell Swings"
  ];
  
  const prompt = `
  Create a workout routine for a week in a tabular format for a ${input.age} year old ${input.gender} who wants to ${input.goal} and has a fitness level of ${input.fitnessLevel}. The available equipment is: ${input.equipment.join(', ')}. Only use the following exercises: ${exerciseNames.join(', ')}. Also always include rest time. Provide the response in JSON format with the following structure:
  
  {
    "Monday": {
      "day": "Monday",
      "exercises": [
        {"name": "Exercise Name", "sets": 3, "reps": 12, "rest": "60 seconds"}
      ]
    },
    "Tuesday": {
      "day": "Tuesday",
      "exercises": [
        {"name": "Exercise Name", "sets": 3, "reps": 12, "rest": "60 seconds"}
      ]
    },
    ...
    "Sunday": {
      "day": "Sunday",
      "rest": "Rest day"
    }
  }
  `;

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }]
  });

  const workoutRoutine: any = response.choices[0].message.content;
  return workoutRoutine;
};

export const getFactOfTheDay = async (): Promise<string> => {
  const prompt = "Provide a fact of the day about health or workout.";
  
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }]
  });
  
  return response.choices[0].message.content!.trim();
};

export const getWorkoutTip = async (): Promise<string> => {
  const prompt = "Provide a useful tip for workout.";
  
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }]
  });

  return response.choices[0].message.content!.trim();
};

export const getWorkoutQuote = async (): Promise<string> => {
  const prompt = "Provide a motivational quote for workout.";
  
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }]
  });

  return response.choices[0].message.content!.trim();
};
