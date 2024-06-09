import axios, { AxiosError } from 'axios';

const API_URL = 'http://localhost:5000';

export interface Exercise {
    id: string;
    muscleName: string;
    videoUrl: string;
    description: string[];
}

export const fetchExerciseByMuscleGroup = async (muscleGroup: string): Promise<Exercise> => {
    try {
        const token= localStorage.getItem('token')
        const response = await axios.get(`${API_URL}/workouts/exercises/${muscleGroup}`,{
          headers:{
            Authorization:`Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRhbmdvMSIsImV4cCI6MTcxNzkzOTk1OCwic3ViIjoiZml0bmVzc1RyYWNraW5nU3lzdGVtIiwiaGFzUm9sZSI6ImRlZmF1bHQifQ.FsTtDo3lqsPN24YBWatOUam4NciO3lx23iVO6-sKLnU`
          }
        });
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

