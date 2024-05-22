import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Adjust the URL to your backend API

export const getExercisesByBodyPart = async (bodyPart: string) => {
    try {
        const response = await axios.get(`${API_URL}/exercises/${bodyPart}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching exercises', error);
        throw error;
    }
};


export interface Exercise {
    id: string;
    muscleName: string;
    videoUrl: string;
    description: string[];
  }
  
  export const fetchExerciseByMuscleGroup = async (muscleGroup: string): Promise<Exercise> => {
    // Dummy data
    const dummyData: { [key: string]: Exercise } = {
      biceps: {
        id: "60d21b4667d0d8992e610c85",
        muscleName: "Biceps",
        videoUrl: "https://www.youtube.com/watch?v=wwKb-wZCEjs&ab_channel=NEXTWorkout",
        description: [
            "Lie on your back and place your feet flat on the floor, knees bent.",
            "Carefully lift your shoulders off the ground and extend your arms towards your knees.",
            "Lower yourself slowly back to the ground and repeat 15-20 repetitions."
        ]
      },
        abs: {
            id: "60d21b4667d0d8992e610c86",
            muscleName: "Abs",
            videoUrl: "https://www.youtube.com/watch?v=QDUklXQJ_6E&ab_channel=TheMovement%7CMidas",
            description: [
                "Lie flat on your back with your knees bent and feet flat on the floor, hip-width apart.",
                "Place your hands behind your head, gently supporting your neck, and curl your upper body towards your knees, contracting your abdominal muscles.",
                "Slowly lower yourself back down to the starting position and repeat for 15-20 repetitions."
            ]
        }
    };
  
    // Simulate API call delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(dummyData[muscleGroup] || null);
      }, 1000);
    });
  };
  
