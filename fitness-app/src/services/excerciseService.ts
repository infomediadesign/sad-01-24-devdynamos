import axios, { AxiosError } from 'axios';
import  { OpenAI } from 'openai';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://127.0.0.1:5000';

export interface Exercise {
  _id: string;
  name: string;
  youtube_link: string;
  description: string;
}
const openai = new OpenAI({
  apiKey: "sk-proj-axNxl5zsSyWyIMIQ796WT3BlbkFJIEXSqMRRsf6MmrlfHdgM",
  dangerouslyAllowBrowser: true
});


export const fetchExerciseByMuscleGroup = async (muscleGroup: string): Promise<Exercise[]> => {
    try {
        const token= localStorage.getItem('token')
        const response = await axios.get(`${API_URL}/workouts/exercises/${muscleGroup}`,{
          headers:{
            Authorization:`Bearer ${token}`,
            Username: localStorage.getItem('username')
          }
        });
        console.log(response.data)
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError<{ error: string }>;
        console.error('Error fetching exercise data:', axiosError);
        throw new Error(axiosError.response?.data?.error || 'Network error');
    }
};

// export const fetchExerciseByMuscleGroup = async (muscleGroup: string): Promise<Exercise> => {
//     // Dummy data
//     const dummyData: { [key: string]: Exercise } = {
//       biceps: {
//         id: "60d21b4667d0d8992e610c85",
//         muscleName: "Biceps",
//         videoUrl: "https://www.youtube.com/watch?v=wwKb-wZCEjs&ab_channel=NEXTWorkout",
//         description: [
//             "Lie on your back and place your feet flat on the floor, knees bent.",
//             "Carefully lift your shoulders off the ground and extend your arms towards your knees.",
//             "Lower yourself slowly back to the ground and repeat 15-20 repetitions."
//         ]
//       },
      
//         abs: {
//             id: "60d21b4667d0d8992e610c86",
//             muscleName: "Abs",
//             videoUrl: "https://www.youtube.com/watch?v=QDUklXQJ_6E&ab_channel=TheMovement%7CMidas",
//             description: [
//                 "Lie flat on your back with your knees bent and feet flat on the floor, hip-width apart.",
//                 "Place your hands behind your head, gently supporting your neck, and curl your upper body towards your knees, contracting your abdominal muscles.",
//                 "Slowly lower yourself back down to the starting position and repeat for 15-20 repetitions."
//             ]
//         }
//     };
  
//     // Simulate API call delay
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         resolve(dummyData[muscleGroup] || null);
//       }, 1000);
//     });
// };

export const fetchMuscleGroupFact = async (muscleGroup: string): Promise<string> => {
  const prompt = `Provide a Fact about ${muscleGroup}`;
  
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }]
  });

  return response.choices[0].message.content!.trim();
};


export const fetchMuscleGroupTip  = async (muscleGroup: string): Promise<string> => {
  const prompt = `Provide a Tip about ${muscleGroup}. like how to keep it healthy and strengthen it or like what to eat to strengthen it or something like this .`;
  
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }]
  });

  return response.choices[0].message.content!.trim();
};

export const fetchMuscleGroupSafetyTip  = async (muscleGroup: string): Promise<string> => {
  const prompt = `Provide a Safety Tip about ${muscleGroup}. like what is dangerous or like which workouts to avoid or how to keep safe from injuries or something like this`;
  
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }]
  });

  return response.choices[0].message.content!.trim();
};