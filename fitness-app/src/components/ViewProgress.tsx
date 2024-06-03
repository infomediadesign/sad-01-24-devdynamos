// // src/components/ViewProgress.tsx
// import React, { useState } from 'react';
// import { getProgress } from '../services/calorieServices';
// import moment from 'moment';

// const ViewProgress: React.FC = () => {
//   const [formData, setFormData] = useState({
//     username: '',
//     start_date: '',
//     end_date: ''
//   });

//   const [progress, setProgress] = useState<any>(null);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // Format the dates to dd-mm-yyyy
//     const formattedStartDate = moment(formData.start_date).format('DD-MM-YYYY');
//     const formattedEndDate = moment(formData.end_date).format('DD-MM-YYYY');

//     try {
//       const response = await getProgress(formData.username, formattedStartDate, formattedEndDate);
//       setProgress(response.data);
//     } catch (error) {
//       alert('Error fetching progress');
//     }
//   };

//   return (
//     <div>
//       <form onSubmit={handleSubmit}>
//         <input type="text" name="username" placeholder="Username" onChange={handleChange} />
//         <input type="date" name="start_date" placeholder="Start Date" onChange={handleChange} />
//         <input type="date" name="end_date" placeholder="End Date" onChange={handleChange} />
//         <button type="submit">View Progress</button>
//       </form>
//       {progress && (
//         <div>
//           <h3>Progress</h3>
//           <p>Goal: {progress.goal}</p>
//           <p>Calories Burned: {progress.calories_burned}</p>
//           <p>Activity: {progress.activity}</p>
//           <p>Start Date: {progress.start_date}</p>
//           <p>End Date: {progress.end_date}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ViewProgress;


// src/components/Progress.tsx
import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext'; // Import useAuth hook
import { viewProgress } from '../services/calorieServices';

const ViewProgress: React.FC = () => {
    const { token } = useAuth(); // Get token from useAuth hook
    const [progress, setProgress] = useState([]);

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                if (token) {
                    const data = await viewProgress(token); // Pass token to viewProgress
                    setProgress(data);
                }
            } catch (error) {
                alert('Error fetching progress');
            }
        };
        fetchProgress();
    }, [token]);

    return (
        <div>
            <h2>Progress</h2>
            <ul>
                {progress.map((goal: any, index: number) => (
                    <li key={index}>
                        {goal.start_date} to {goal.end_date}: {goal.calories_burned}/{goal.goal} calories burned ({goal.activity})
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ViewProgress;



