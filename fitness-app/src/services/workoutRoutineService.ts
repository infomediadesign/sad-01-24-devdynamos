import OpenAI from "openai";

interface WorkoutInput {
  gender: string;
  age: number;
  goal: string;
  fitnessLevel: string;
  equipment: string[];
}



const openai = new OpenAI({
apiKey:" ",
dangerouslyAllowBrowser: true
});

export const generateWorkoutRoutine = async (input: WorkoutInput): Promise<string> => {
  const prompt = `You are a fitness trainer creating a detailed workout routine. Generate a consistent weekly workout routine for a ${input.age}-year-old ${input.gender} with the goal to ${input.goal}. The person's fitness level is ${input.fitnessLevel}, and they have the following equipment available: ${input.equipment.join(', ')}. Ensure each day's workout includes the following details in a structured JSON format: day, exercises (with name, sets, reps, rest time), and rest days. Always follow this structure in JSON format:\n\n{\n  \"Monday\": {\n    \"day\": \"Monday\",\n    \"exercises\": [\n      {\"name\": \"Bodyweight Squats\", \"sets\": 3, \"reps\": 12, \"rest\": \"60 seconds\"},\n      {\"name\": \"Push-ups\", \"sets\": 3, \"reps\": 10, \"rest\": \"60 seconds\"},\n      {\"name\": \"Plank\", \"sets\": 3, \"reps\": \"30 seconds\", \"rest\": \"60 seconds\"}\n    ]\n  },\n  \"Tuesday\": {\n    \"day\": \"Tuesday\",\n    \"exercises\": [\n      {\"name\": \"Jumping Jacks\", \"sets\": 3, \"reps\": 30, \"rest\": \"45 seconds\"},\n      {\"name\": \"Mountain Climbers\", \"sets\": 3, \"reps\": \"20 each side\", \"rest\": \"45 seconds\"},\n      {\"name\": \"Russian Twists\", \"sets\": 3, \"reps\": \"15 each side\", \"rest\": \"45 seconds\"}\n    ]\n  },\n  \"Wednesday\": {\n    \"day\": \"Wednesday\",\n    \"exercises\": [\n      {\"name\": \"Walking Lunges\", \"sets\": 3, \"reps\": \"12 each leg\", \"rest\": \"60 seconds\"},\n      {\"name\": \"Tricep Dips\", \"sets\": 3, \"reps\": 10, \"rest\": \"60 seconds\"},\n      {\"name\": \"Burpees\", \"sets\": 3, \"reps\": 10, \"rest\": \"60 seconds\"}\n    ]\n  },\n  \"Thursday\": {\n    \"day\": \"Thursday\",\n    \"exercises\": [\n      {\"name\": \"High Knees\", \"sets\": 3, \"reps\": \"30 seconds\", \"rest\": \"45 seconds\"},\n      {\"name\": \"Sit-ups\", \"sets\": 3, \"reps\": 15, \"rest\": \"45 seconds\"},\n      {\"name\": \"Bicycle Crunches\", \"sets\": 3, \"reps\": \"20 each side\", \"rest\": \"45 seconds\"}\n    ]\n  },\n  \"Friday\": {\n    \"day\": \"Friday\",\n    \"exercises\": [\n      {\"name\": \"Squat Jumps\", \"sets\": 3, \"reps\": 12, \"rest\": \"60 seconds\"},\n      {\"name\": \"Push-up and Rotation\", \"sets\": 3, \"reps\": \"10 each side\", \"rest\": \"60 seconds\"},\n      {\"name\": \"Plank with Shoulder Taps\", \"sets\": 3, \"reps\": \"15 each side\", \"rest\": \"60 seconds\"}\n    ]\n  },\n  \"Saturday\": {\n    \"day\": \"Saturday\",\n    \"rest\": \"Rest day\"\n  },\n  \"Sunday\": {\n    \"day\": \"Sunday\",\n    \"rest\": \"Rest day\"\n  }\n}\nGenerate the workout routine for the entire week in this exact JSON format.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages:[{role:'user',content:prompt}]
  });

  const workoutRoutine:any = response.choices[0].message.content;
  return workoutRoutine
};
