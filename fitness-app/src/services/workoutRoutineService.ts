import OpenAI from "openai";

interface WorkoutInput {
  gender: string;
  age: number;
  goal: string;
  fitnessLevel: string;
  equipment: string[];
}



const openai = new OpenAI({
apiKey:"",
dangerouslyAllowBrowser: true
});

export const generateWorkoutRoutine = async (input: WorkoutInput): Promise<string> => {
  const prompt = `You are a fitness trainer creating a detailed workout routine. Generate a consistent weekly workout routine for a ${input.age}-year-old ${input.gender} with the goal to ${input.goal}. The person's fitness level is ${input.fitnessLevel}, and they have the following equipment available: ${input.equipment.join(', ')}. Ensure each day's workout includes the following details in a structured JSON format: day, exercises, sets, reps, rest time. Include rest days as well. The response should always follow this structure in JSON format: \n\n{\n  \"day\": \"Day of the week\",\n  \"exercises\": [\n    {\"name\": \"Exercise Name\", \"sets\": X, \"reps\": Y, \"rest\": \"Z seconds\"},\n    ...\n  ]\n}\n\nGenerate the workout routine for the entire week in JSON format.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages:[{role:'user',content:prompt}]
  });

  const workoutRoutine:any = response.choices[0].message.content;
  return workoutRoutine
};
