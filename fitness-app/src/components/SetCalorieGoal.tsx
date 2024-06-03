import React, { useState } from 'react';
import { useAuth } from './AuthContext'; // Import the useAuth hook
import calorieServices from '../services/calorieServices';
import moment from 'moment'; // Import moment for date formatting

const SetCalorieGoal: React.FC = () => {
    const { setCalorieGoal } = calorieServices;
    const { token } = useAuth(); // Get token from useAuth hook
    const [start_date, setStartDate] = useState('');
    const [end_date, setEndDate] = useState('');
    const [goal, setGoal] = useState(0);
    const [activity, setActivity] = useState('');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            if (token) { // Ensure token is not undefined
                // Format the dates to dd-mm-yyyy
                const formattedStartDate = moment(start_date).format('DD-MM-YYYY');
                const formattedEndDate = moment(end_date).format('DD-MM-YYYY');
                
                const response = await setCalorieGoal(formattedStartDate, formattedEndDate, goal, activity); // Pass token to setCalorieGoal
                alert(response.message);
            }
        } catch (error) {
            alert('Error setting calorie goal');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Set Calorie Goal</h2>
            <div>
                <label>Start Date:</label>
                <input type="date" value={start_date} onChange={e => setStartDate(e.target.value)} required />
            </div>
            <div>
                <label>End Date:</label>
                <input type="date" value={end_date} onChange={e => setEndDate(e.target.value)} required />
            </div>
            <div>
                <label>Goal:</label>
                <input type="number" value={goal} onChange={e => setGoal(Number(e.target.value))} required />
            </div>
            <div>
                <label>Activity:</label>
                <input type="text" value={activity} onChange={e => setActivity(e.target.value)} required />
            </div>
            <button type="submit">Set Goal</button>
        </form>
    );
};

export default SetCalorieGoal;
