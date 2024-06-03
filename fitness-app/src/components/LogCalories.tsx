// // src/components/LogCalories.tsx
// import React, { useState } from 'react';
// import { logCalories } from '../services/calorieServices';

// const LogCalories: React.FC = () => {
//   const [formData, setFormData] = useState({
//     username: '',
//     date: '',
//     calories: ''
//   });
  
//   const [error, setError] = useState('');

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');

//     // Form validation
//     if (!formData.username || !formData.date || !formData.calories) {
//       setError('All fields are required');
//       return;
//     }
//     console.log("Submitting form data:", formData);
//     try {
//       await logCalories(formData.username, formData.date, String(parseInt(formData.calories)) );
//       alert('Calories logged successfully');
//     } catch (error) {
//       alert('Error logging calories');
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <input type="text" name="username" placeholder="Username" onChange={handleChange} />
//       <input type="date" name="date" placeholder="Date" onChange={handleChange} />
//       <input type="number" name="calories" placeholder="Calories" onChange={handleChange} />
//       <button type="submit">Log Calories</button>
//       {error && <p style={{color: 'red'}}>{error}</p>}
//     </form>
//   );
// };

// export default LogCalories;

import React, { useState } from 'react';
import { logCalorie } from '../services/calorieServices';
import { useAuth } from './AuthContext';

interface LogCalorieProps {
    // token: string; // Remove token prop
}

const LogCalorie: React.FC<LogCalorieProps> = () => {
    const { isAuthenticated } = useAuth(); // Use the useAuth hook to get authentication state
    const [date, setDate] = useState('');
    const [calories, setCalories] = useState(0);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!isAuthenticated) {
            alert('You need to login first.'); // Alert if user is not authenticated
            return;
        }
        try {
            const response = await logCalorie(date, calories); // Remove token parameter
            alert(response.message);
        } catch (error) {
            alert('Error logging calories');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Log Calorie</h2>
            <div>
                <label>Date:</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
            </div>
            <div>
                <label>Calories:</label>
                <input type="number" value={calories} onChange={e => setCalories(Number(e.target.value))} required />
            </div>
            <button type="submit">Log Calories</button>
        </form>
    );
};

export default LogCalorie;


