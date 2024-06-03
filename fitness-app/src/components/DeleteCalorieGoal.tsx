import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { deleteCaloriesByDate } from '../services/calorieServices';

const DeleteCaloriesByDate: React.FC = () => {
    const { token } = useAuth(); // Get token from useAuth hook
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            if (token) {
                const response = await deleteCaloriesByDate(token, startDate, endDate);
                alert(response.message);
            }
        } catch (error) {
            alert('Error deleting calories by date');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Delete Calories by Date Range</h2>
            <div>
                <label>Start Date:</label>
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
            </div>
            <div>
                <label>End Date:</label>
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required />
            </div>
            <button type="submit">Delete Calories</button>
        </form>
    );
};

export default DeleteCaloriesByDate;
